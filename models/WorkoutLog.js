
const mongoose = require('mongoose');

const workoutLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    activityType: {
      type: String,
      required: [true, 'Please add an activity type'],
    },
    duration: {
      type: Number, // Duration in minutes
      required: [true, 'Please add duration'],
    },
    caloriesBurned: {
      type: Number,
      required: [true, 'Please add calories burned'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WorkoutLog', workoutLogSchema);
