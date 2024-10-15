
const asyncHandler = require('express-async-handler');
const WorkoutLog = require('../models/WorkoutLog');

// @desc    Create a new workout log

const createWorkout = asyncHandler(async (req, res) => {
  const { activityType, duration, caloriesBurned, date } = req.body;

  const workout = await WorkoutLog.create({
    user: req.user._id,
    activityType,
    duration,
    caloriesBurned,
    date,
  });

  res.status(201).json(workout);
});

// @desc    Get all workout logs for the logged-in user

const getWorkouts = asyncHandler(async (req, res) => {
  const workouts = await WorkoutLog.find({ user: req.user._id }).sort({
    date: -1,
  });
  res.json(workouts);
});

// @desc    Get a single workout log

const getWorkoutById = asyncHandler(async (req, res) => {
  const workout = await WorkoutLog.findById(req.params.id);

  if (!workout) {
    res.status(404);
    throw new Error('Workout not found');
  }

  // Ensure user owns the workout
  if (workout.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.json(workout);
});

// @desc    Update a workout log

const updateWorkout = asyncHandler(async (req, res) => {
  const workout = await WorkoutLog.findById(req.params.id);

  if (!workout) {
    res.status(404);
    throw new Error('Workout not found');
  }

  // Ensure user owns the workout
  if (workout.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const { activityType, duration, caloriesBurned, date } = req.body;

  workout.activityType = activityType || workout.activityType;
  workout.duration = duration || workout.duration;
  workout.caloriesBurned = caloriesBurned || workout.caloriesBurned;
  workout.date = date || workout.date;

  const updatedWorkout = await workout.save();

  res.json(updatedWorkout);
});

// @desc    Delete a workout log

const deleteWorkout = asyncHandler(async (req, res) => {
  const workout = await WorkoutLog.findById(req.params.id);

  if (!workout) {
    res.status(404);
    throw new Error('Workout not found');
  }

  // Ensure user owns the workout
  if (workout.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await workout.deleteOne(); 

  res.json({ message: 'Workout removed' });
});

// @desc    Get workout statistics

const getWorkoutStatistics = asyncHandler(async (req, res) => {
  const { startDate, endDate, activityType } = req.query;

  const match = { user: req.user._id };

  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }

  if (activityType) {
    match.activityType = activityType;
  }

  const stats = await WorkoutLog.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$activityType',
        totalDuration: { $sum: '$duration' },
        totalCalories: { $sum: '$caloriesBurned' },
        count: { $sum: 1 },
      },
    },
    { $sort: { totalCalories: -1 } },
  ]);

  res.json(stats);
});

module.exports = {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  getWorkoutStatistics,
};
