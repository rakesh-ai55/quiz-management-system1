const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('createdBy', 'name');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'name');
    if (quiz) {
      res.json(quiz);
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createQuiz = async (req, res) => {
  try {
    const { title, description, totalMarks, timeLimit } = req.body;
    const quiz = await Quiz.create({
      title,
      description,
      totalMarks,
      timeLimit,
      createdBy: req.user._id,
    });
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const { title, description, totalMarks, timeLimit } = req.body;
    quiz.title = title || quiz.title;
    quiz.description = description || quiz.description;
    quiz.totalMarks = totalMarks || quiz.totalMarks;
    quiz.timeLimit = timeLimit || quiz.timeLimit;

    const updatedQuiz = await quiz.save();
    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    await Question.deleteMany({ quizId: quiz._id });
    await quiz.deleteOne();
    res.json({ message: 'Quiz removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz };
