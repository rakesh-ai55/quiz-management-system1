const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    questionText: {
      type: String,
      required: [true, 'Please add question text'],
    },
    options: {
      type: [String],
      required: [true, 'Please add options'],
      validate: [arrayLimit, 'Options must have exactly 4 items'],
    },
    correctAnswer: {
      type: Number,
      required: [true, 'Please specify correct answer index (0-3)'],
      min: 0,
      max: 3,
    },
    marks: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length === 4;
}

module.exports = mongoose.model('Question', questionSchema);
