import { Quiz } from "../models/quiz.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

async function generateUniqueRoomId() {
  let roomId;
  let isUnique = false;

  while (!isUnique) {
    roomId = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit number

    // Check if roomId exists in the database
    const existingQuiz = await Quiz.findOne({ roomId });
    if (!existingQuiz) {
      isUnique = true; // ID is unique
    }
  }

  return roomId;
}

export const createQuiz = asyncHandler(async (req, res) => {
  try {
    const { creator, questions } = req.body;

    // Validate that there are questions and the creator is provided
    if (!creator || !questions || questions.length === 0) {
      return res.status(400).json({
        message: "Quiz must have a creator and at least one question.",
      });
    }
    const roomId = await generateUniqueRoomId();

    // Create a new quiz
    const quiz = new Quiz({
      creator,
      questions,
      roomId,
    });

    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Could not create quiz." });
  }
});
