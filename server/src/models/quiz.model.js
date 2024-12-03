import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function (v) {
        return v.length === 4; // Ensure there are exactly 4 options
      },
      message: "There must be exactly 4 options.",
    },
  },
  answer: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (v) {
        return this.options.includes(v); // Ensure the answer is one of the provided options
      },
      message: "Answer must be one of the provided options.",
    },
  },
  time: {
    type: Number,
    required: true,
    default: 30, // Default to 30 seconds
    min: [1, "Time must be at least 1 second."],
  },
});

const quizSchema = new mongoose.Schema(
  {
    creator: {
      type: String,
    },
    questions: {
      type: [questionSchema],
      validate: {
        validator: function (v) {
          return v.length > 0 && v.length <= 15; // Ensure between 1 and 15 questions
        },
        message: "A quiz must have between 1 and 15 questions.",
      },
    },
    leaderboard: {
      type: [
        {
          username: {
            type: String,
            required: true,
          },
          score: {
            type: Number,
            required: true,
          },
        },
      ],
      default: [], // Default to an empty array
      // This field could be sorted by score, but MongoDB does not maintain ordering in arrays.
      // So, ensure that sorting happens when you retrieve the leaderboard.
    },
    status: {
      type: String,
      enum: ["open", "live", "closed"], // Valid statuses
      default: "open", // Default to "open"
    },
    roomId: {
      type: Number,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export const Quiz = mongoose.model("Quiz", quizSchema);
