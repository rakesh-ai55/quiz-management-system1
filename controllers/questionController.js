const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

const getQuestionsByQuiz = async (req, res) => {
  try {
    const questions = await Question.find({ quizId: req.params.quizId });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (question) {
      res.json(question);
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createQuestion = async (req, res) => {
  try {
    const { quizId, questionText, options, correctAnswer, marks } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const question = await Question.create({
      quizId,
      questionText,
      options,
      correctAnswer,
      marks: marks || 1,
    });

    quiz.totalMarks = (await Question.find({ quizId })).reduce(
      (acc, q) => acc + q.marks,
      0
    );
    await quiz.save();

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    const { questionText, options, correctAnswer, marks } = req.body;
    question.questionText = questionText || question.questionText;
    question.options = options || question.options;
    question.correctAnswer = correctAnswer !== undefined ? correctAnswer : question.correctAnswer;
    question.marks = marks || question.marks;

    const updatedQuestion = await question.save();

    const quiz = await Quiz.findById(question.quizId);
    quiz.totalMarks = (await Question.find({ quizId: question.quizId })).reduce(
      (acc, q) => acc + q.marks,
      0
    );
    await quiz.save();

    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    const quizId = question.quizId;
    await question.deleteOne();

    const quiz = await Quiz.findById(quizId);
    quiz.totalMarks = (await Question.find({ quizId })).reduce(
      (acc, q) => acc + q.marks,
      0
    );
    await quiz.save();

    res.json({ message: 'Question removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getQuestionsByQuiz,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
