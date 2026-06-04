const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a quiz title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    totalMarks: {
      type: Number,
      required: [true, 'Please add total marks'],
      default: 0,
    },
    timeLimit: {
      type: Number,
      default: 10,
      description: 'Time limit in minutes',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
