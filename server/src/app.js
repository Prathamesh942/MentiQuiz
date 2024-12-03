import express from "express";
import bodyParser from "body-parser";
import userRouter from "./routes/user.routes.js";
import quizRouter from "./routes/quiz.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { Quiz } from "./models/quiz.model.js";
import { stat } from "fs";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const corsOptions = {
  origin: process.env.CLIENT_URL, // Change to your frontend URL in production
  credentials: true,
  exposedHeaders: ["Set-Cookie"], // Correct case for 'Set-Cookie'
};
app.use(
  cors({
    origin: "https://quizy-weld.vercel.app",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/quiz", quizRouter);

app.get("/api/quiz/:quizId", async (req, res) => {
  const { quizId } = req.params;
  try {
    const quiz = await Quiz.findOne({ roomId: quizId });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz" });
  }
});

app.get("/api/generate-quiz", async (req, res) => {
  const { prompt, numQuestions, time } = req.query;
  console.log(prompt, numQuestions, time);

  try {
    const resai = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Generate a JSON object for a quiz application with the following structure:

{
  "question": "<Question text>",
  "options": ["<Option 1>", "<Option 2>", "<Option 3>", "<Option 4>"],
  "answer": "<Correct answer>",
  "time": <Time in seconds>
}

The theme of the quiz should be: ${prompt}.
The number of questions should be: ${numQuestions}.
Each question should have a time limit of: ${time} seconds.
Ensure that the questions are varied, interesting, and relevant to the theme.
Provide only the JSON object without any additional explanation or text.
`,
        },
      ],
      model: "llama3-8b-8192",
    });
    const jsonString = resai.choices[0].message.content;
    const jsonStringWithoutExtraText = await jsonString.replace(/^.*\{/, "{");
    console.log(jsonStringWithoutExtraText);
    const quizData = await JSON.parse(jsonStringWithoutExtraText);

    res.json(quizData); // Send the AI response as JSON
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error generating quiz", error });
  }
});

let stats = [{}, {}, {}, {}];

app.post("/api/quiz/:quizId/start", async (req, res) => {
  const { quizId } = req.params;
  try {
    let quiz = await Quiz.findOne({ roomId: quizId });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (quiz.status !== "open") {
      return res
        .status(400)
        .json({ message: "Quiz already started or closed" });
    }

    quiz.status = "live";
    await quiz.save();

    // Emit event to all clients that quiz has started
    io.to(quizId).emit("quizStarted", quizId);

    // Start the first question (index 0)
    let currentQuestionIndex = 0;

    // Function to handle each question flow
    const handleQuestion = async () => {
      const currentQuestion = quiz.questions[currentQuestionIndex];

      // Send the question to all clients
      io.to(quizId).emit("question", currentQuestion, currentQuestionIndex);
      for (let i = 0; i < 4; i++) {
        stats[i].answer = currentQuestion.options[i];
        stats[i].count = 0;
      }

      // Start the timer for the current question
      let timeRemaining = currentQuestion.time;

      const countdown = setInterval(async () => {
        timeRemaining--;
        io.to(quizId).emit("timeRemaining", timeRemaining); // Notify clients of the time remaining

        if (timeRemaining <= 0) {
          clearInterval(countdown);

          // Update the leaderboard
          quiz = await Quiz.findOne({ roomId: quizId });
          io.to(quizId).emit("leaderboard", quiz.leaderboard, stats);

          // Wait a few seconds before moving to the next question
          setTimeout(async () => {
            currentQuestionIndex++;
            if (currentQuestionIndex < quiz.questions.length) {
              handleQuestion(); // Move to the next question
            } else {
              // If all questions are finished, close the quiz and send the final leaderboard
              quiz.status = "closed";
              await quiz.save();
              io.to(quizId).emit("quizClosed", quiz.leaderboard);
            }
          }, 5000); // 3-second delay before the next question
        }
      }, 1000); // 1-second intervals for countdown
    };

    // Start with the first question
    handleQuestion();

    res.json({ message: "Quiz started", quiz });
  } catch (error) {
    res.status(500).json({ message: "Error starting quiz" });
  }
});
let quizRooms = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinQuiz", (quizId, localuser) => {
    console.log(localuser);

    socket.join(quizId);
    if (!quizRooms[quizId]) {
      quizRooms[quizId] = {
        users: [],
        userCount: 0,
      };
    }
    const userExists = quizRooms[quizId].users.some(
      (user) => user === localuser
    );
    if (!userExists) {
      quizRooms[quizId].users.push(localuser);
      quizRooms[quizId].userCount++;
      io.to(quizId).emit("ucount", quizRooms[quizId].userCount);
    }
    console.log(quizRooms[quizId]);

    console.log(`User ${socket.id} joined quiz room ${quizId}`);
  });
  socket.on("leaveQuiz", (quizId, localuser) => {
    if (quizRooms[quizId]) {
      quizRooms[quizId].userCount -= 1;
      quizRooms[quizId].users = quizRooms[quizId].users.filter(
        (user) => user !== localuser
      );
      io.to(quizId).emit("ucount", quizRooms[quizId].userCount); // Broadcast user count update to room
      console.log(`User disconnected from quiz ${quizId}`);

      // Optionally remove the quiz room if no users are left
      if (quizRooms[quizId].userCount <= 0) {
        delete quizRooms[quizId];
        console.log(`Quiz ${quizId} is now empty and removed`);
      }
    }
    console.log(quizRooms[quizId]);
  });

  socket.on(
    "submitAnswer",
    async (quizId, username, questionIndex, answer, score) => {
      const quiz = await Quiz.findOne({ roomId: quizId });
      if (!quiz || quiz.status !== "live") {
        return;
      }
      console.log(quiz);

      const currentQuestion = quiz.questions[questionIndex];
      const correctAnswer = currentQuestion.answer;

      // Update the leaderboard based on the answer
      let user = quiz.leaderboard.find(
        (player) => player.username === username
      );

      if (!user) {
        user = { username, score };
        quiz.leaderboard.push(user);
      }

      if (answer === correctAnswer) {
        user.score += score; // Add 1 point for the correct answer
      }
      for (let i = 0; i < 4; i++) {
        if (answer == currentQuestion.options[i]) stats[i].count++;
      }

      await quiz.save();

      // Emit the updated leaderboard to all clients
      console.log(quiz.leaderboard);
    }
  );

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

export { server };
