
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const WorkoutLog = require('../models/WorkoutLog');
const Goal = require('../models/Goal');
const FitnessProgram = require('../models/FitnessProgram');

// @desc    Get all users

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// @desc    Get a single user

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user);
});

// @desc    Update a user

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { name, email, role } = req.body;

  user.name = name || user.name;
  user.email = email || user.email;
  if (role) user.role = role;

  const updatedUser = await user.save();

  res.json(updatedUser);
});

// @desc    Delete a user

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Remove user
  await user.remove();

  // Optionally, remove user's workouts and goals
  await WorkoutLog.deleteMany({ user: req.params.id });
  await Goal.deleteMany({ user: req.params.id });

  res.json({ message: 'User and associated data removed' });
});

// @desc    Get aggregate statistics

const getAggregateStatistics = asyncHandler(async (req, res) => {
  const userCount = await User.countDocuments();
  const workoutCount = await WorkoutLog.countDocuments();
  const goalCount = await Goal.countDocuments();
  const fitnessProgramCount = await FitnessProgram.countDocuments();

  res.json({
    userCount,
    workoutCount,
    goalCount,
    fitnessProgramCount,
  });
});

// @desc    Create a fitness program

const createFitnessProgram = asyncHandler(async (req, res) => {
  const { name, description, workouts } = req.body;

  const programExists = await FitnessProgram.findOne({ name });

  if (programExists) {
    res.status(400);
    throw new Error('Fitness program already exists');
  }

  const program = await FitnessProgram.create({
    name,
    description,
    workouts,
    createdBy: req.user._id,
  });

  res.status(201).json(program);
});

// @desc    Get all fitness programs

const getFitnessPrograms = asyncHandler(async (req, res) => {
  const programs = await FitnessProgram.find().populate('createdBy', 'name email');
  res.json(programs);
});

// @desc    Update a fitness program

const updateFitnessProgram = asyncHandler(async (req, res) => {
  const program = await FitnessProgram.findById(req.params.id);

  if (!program) {
    res.status(404);
    throw new Error('Fitness program not found');
  }

  const { name, description, workouts } = req.body;

  program.name = name || program.name;
  program.description = description || program.description;
  program.workouts = workouts || program.workouts;

  const updatedProgram = await program.save();

  res.json(updatedProgram);
});

// @desc    Delete a fitness program

const deleteFitnessProgram = asyncHandler(async (req, res) => {
  const program = await FitnessProgram.findById(req.params.id);

  if (!program) {
    res.status(404);
    throw new Error('Fitness program not found');
  }

  await program.remove();

  res.json({ message: 'Fitness program removed' });
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAggregateStatistics,
  createFitnessProgram,
  getFitnessPrograms,
  updateFitnessProgram,
  deleteFitnessProgram,
};
