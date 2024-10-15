
const mongoose = require('mongoose');

const fitnessProgramSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a program name'],
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    workouts: [
      {
        activityType: String,
        duration: Number, // in minutes
        caloriesBurned: Number,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('FitnessProgram', fitnessProgramSchema);
