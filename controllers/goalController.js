
const asyncHandler = require('express-async-handler');
const Goal = require('../models/Goal');

// @desc    Create a new goal

const createGoal = asyncHandler(async (req, res) => {
  const { type, target } = req.body;

  const goal = await Goal.create({
    user: req.user._id,
    type,
    target,
  });

  res.status(201).json(goal);
});

// @desc    Get all goals for the logged-in user

const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user._id }).sort({ startDate: -1 });
  res.json(goals);
});

// @desc    Get a single goal

const getGoalById = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(404);
    throw new Error('Goal not found');
  }

  // Ensure user owns the goal
  if (goal.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.json(goal);
});

// @desc    Update a goal

const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(404);
    throw new Error('Goal not found');
  }

  // Ensure user owns the goal
  if (goal.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const { type, target, achieved } = req.body;

  goal.type = type || goal.type;
  goal.target = target || goal.target;
  goal.achieved = achieved !== undefined ? achieved : goal.achieved;

  const updatedGoal = await goal.save();

  res.json(updatedGoal);
});

// @desc    Delete a goal

const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(404);
    throw new Error('Goal not found');
  }

  // Ensure user owns the goal
  if (goal.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await goal.remove();

  res.json({ message: 'Goal removed' });
});

// @desc    Get goal statistics

const getGoalStatistics = asyncHandler(async (req, res) => {
  const { type, achieved } = req.query;

  const match = { user: req.user._id };

  if (type) {
    match.type = type;
  }

  if (achieved !== undefined) {
    match.achieved = achieved === 'true';
  }

  const stats = await Goal.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$type',
        totalGoals: { $sum: 1 },
        achievedGoals: {
          $sum: { $cond: ['$achieved', 1, 0] },
        },
      },
    },
    {
      $project: {
        type: '$_id',
        totalGoals: 1,
        achievedGoals: 1,
        achievementRate: {
          $multiply: [
            { $divide: ['$achievedGoals', '$totalGoals'] },
            100,
          ],
        },
        _id: 0,
      },
    },
  ]);

  res.json(stats);
});

module.exports = {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  getGoalStatistics,
};
