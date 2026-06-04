const express = require('express');
const router = express.Router();
const {
  submitQuiz,
  getMyResults,
  getResultById,
  getLeaderboard,
  getAllResults,
} = require('../controllers/resultController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/submit', protect, submitQuiz);
router.get('/myresults', protect, getMyResults);
router.get('/leaderboard/:quizId', protect, getLeaderboard);
router.get('/all', protect, adminOnly, getAllResults);
router.get('/:id', protect, getResultById);

module.exports = router;
