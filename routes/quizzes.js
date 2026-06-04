const express = require('express');
const router = express.Router();
const {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} = require('../controllers/quizController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getQuizzes);
router.get('/:id', protect, getQuizById);
router.post('/', protect, adminOnly, createQuiz);
router.put('/:id', protect, adminOnly, updateQuiz);
router.delete('/:id', protect, adminOnly, deleteQuiz);

module.exports = router;
