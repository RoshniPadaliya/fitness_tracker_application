
const express = require('express');
const router = express.Router();
const {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  getWorkoutStatistics,
} = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes below
router.use(protect);

// Create workout
router.post('/create', createWorkout);

// Get all workouts
router.get('/getall', getWorkouts);

// Get workout statistics
router.get('/statistics', getWorkoutStatistics);

// Get single workout
router.get('/:id', getWorkoutById);

// Update workout
router.put('/:id', updateWorkout);

// Delete workout
router.delete('/:id', deleteWorkout);

module.exports = router;
