
const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAggregateStatistics,
  createFitnessProgram,
  getFitnessPrograms,
  updateFitnessProgram,
  deleteFitnessProgram,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/roleMiddleware');

// Protect all routes below
router.use(protect);
router.use(admin);

// User Management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Aggregate Statistics
router.get('/statistics', getAggregateStatistics);

// Fitness Programs
router.post('/fitness-programs', createFitnessProgram);
router.get('/fitness-programs', getFitnessPrograms);
router.put('/fitness-programs/:id', updateFitnessProgram);
router.delete('/fitness-programs/:id', deleteFitnessProgram);

module.exports = router;
