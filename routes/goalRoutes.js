
const express = require('express');
const router = express.Router();
const {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  getGoalStatistics,
} = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes below
router.use(protect);

// Create goal
router.post('/creategoal', createGoal);

// Get all goals
router.get('/getgoal', getGoals);

// Get goal statistics
router.get('/statistics', getGoalStatistics);

// Get single goal
router.get('/:id', getGoalById);

// Update goal
router.put('/:id', updateGoal);

// Delete goal
router.delete('/:id', deleteGoal);

module.exports = router;
