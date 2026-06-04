const Result = require('../models/Result');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers, timeTaken } = req.body;
    const userId = req.user._id;

    const questions = await Question.find({ quizId });
    if (!questions.length) {
      return res.status(400).json({ message: 'No questions found for this quiz' });
    }

    let score = 0;
    const evaluatedAnswers = [];

    answers.forEach((ans) => {
      const question = questions.find((q) => q._id.toString() === ans.questionId);
      if (question) {
        const isCorrect = question.correctAnswer === ans.selectedOption;
        if (isCorrect) score += question.marks;
        evaluatedAnswers.push({
          questionId: question._id,
          selectedOption: ans.selectedOption,
          isCorrect,
        });
      }
    });

    const quiz = await Quiz.findById(quizId);
    const result = await Result.create({
      userId,
      quizId,
      score,
      totalMarks: quiz ? quiz.totalMarks : questions.length,
      answers: evaluatedAnswers,
      timeTaken: timeTaken || 0,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user._id })
      .populate('quizId', 'title')
      .sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('quizId', 'title totalMarks')
      .populate('answers.questionId', 'questionText options correctAnswer marks');
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: 'Result not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const { quizId } = req.params;
    const results = await Result.find({ quizId })
      .populate('userId', 'name')
      .sort({ score: -1, timeTaken: 1 })
      .limit(50);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate('userId', 'name email')
      .populate('quizId', 'title')
      .sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitQuiz,
  getMyResults,
  getResultById,
  getLeaderboard,
  getAllResults,
};
