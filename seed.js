const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Quiz = require('./models/Quiz');
const Question = require('./models/Question');
const Result = require('./models/Result');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/quiz_management';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected for seeding');

    await User.deleteMany();
    await Quiz.deleteMany();
    await Question.deleteMany();
    await Result.deleteMany();

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@quiz.com',
      password: 'admin123',
      role: 'admin',
    });

    const user1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'user123',
      role: 'user',
    });

    const user2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'user123',
      role: 'user',
    });

    console.log('Users created');

    const quiz1 = await Quiz.create({
      title: 'General Knowledge',
      description: 'Test your general knowledge with this fun quiz!',
      totalMarks: 5,
      timeLimit: 5,
      createdBy: admin._id,
    });

    const quiz2 = await Quiz.create({
      title: 'Science Basics',
      description: 'Basic science questions for beginners.',
      totalMarks: 4,
      timeLimit: 5,
      createdBy: admin._id,
    });

    console.log('Quizzes created');

    const q1 = await Question.create({
      quizId: quiz1._id,
      questionText: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correctAnswer: 2,
      marks: 1,
    });

    const q2 = await Question.create({
      quizId: quiz1._id,
      questionText: 'Which planet is known as the Red Planet?',
      options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
      correctAnswer: 1,
      marks: 1,
    });

    const q3 = await Question.create({
      quizId: quiz1._id,
      questionText: 'What is the largest ocean on Earth?',
      options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
      correctAnswer: 3,
      marks: 1,
    });

    const q4 = await Question.create({
      quizId: quiz1._id,
      questionText: 'Who wrote "Hamlet"?',
      options: ['Charles Dickens', 'William Shakespeare', 'Leo Tolstoy', 'Mark Twain'],
      correctAnswer: 1,
      marks: 1,
    });

    const q5 = await Question.create({
      quizId: quiz1._id,
      questionText: 'What is the chemical symbol for water?',
      options: ['O2', 'CO2', 'H2O', 'NaCl'],
      correctAnswer: 2,
      marks: 1,
    });

    const q6 = await Question.create({
      quizId: quiz2._id,
      questionText: 'What gas do plants absorb from the atmosphere?',
      options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
      correctAnswer: 1,
      marks: 1,
    });

    const q7 = await Question.create({
      quizId: quiz2._id,
      questionText: 'What is the speed of light approximately?',
      options: ['300,000 km/s', '150,000 km/s', '1,000 km/s', '30,000 km/s'],
      correctAnswer: 0,
      marks: 1,
    });

    const q8 = await Question.create({
      quizId: quiz2._id,
      questionText: 'Which organ is responsible for pumping blood?',
      options: ['Liver', 'Brain', 'Heart', 'Lungs'],
      correctAnswer: 2,
      marks: 1,
    });

    const q9 = await Question.create({
      quizId: quiz2._id,
      questionText: 'What is the hardest natural substance?',
      options: ['Gold', 'Iron', 'Diamond', 'Quartz'],
      correctAnswer: 2,
      marks: 1,
    });

    console.log('Questions created');

    await Result.create({
      userId: user1._id,
      quizId: quiz1._id,
      score: 4,
      totalMarks: 5,
      answers: [
        { questionId: q1._id, selectedOption: 2, isCorrect: true },
        { questionId: q2._id, selectedOption: 1, isCorrect: true },
        { questionId: q3._id, selectedOption: 0, isCorrect: false },
        { questionId: q4._id, selectedOption: 1, isCorrect: true },
        { questionId: q5._id, selectedOption: 2, isCorrect: true },
      ],
      timeTaken: 180,
    });

    await Result.create({
      userId: user2._id,
      quizId: quiz1._id,
      score: 3,
      totalMarks: 5,
      answers: [
        { questionId: q1._id, selectedOption: 2, isCorrect: true },
        { questionId: q2._id, selectedOption: 1, isCorrect: true },
        { questionId: q3._id, selectedOption: 2, isCorrect: false },
        { questionId: q4._id, selectedOption: 0, isCorrect: false },
        { questionId: q5._id, selectedOption: 2, isCorrect: true },
      ],
      timeTaken: 240,
    });

    console.log('Results created');
    console.log('Seeding completed successfully!');
    console.log('Sample login credentials:');
    console.log('Admin -> email: admin@quiz.com | password: admin123');
    console.log('User  -> email: john@example.com | password: user123');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
