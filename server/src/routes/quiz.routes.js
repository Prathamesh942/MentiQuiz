import { Router } from "express";
import { createQuiz } from "../controllers/quiz.controller.js";

const router = Router();

router.route("/").post(createQuiz);

export default router;
