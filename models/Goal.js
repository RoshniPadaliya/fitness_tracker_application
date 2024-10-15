
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
        type: String,
        enum: ['Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility'], // Example enum values
        required: true,
    },
    target: {
      type: Number, // e.g., target calories or workouts
      required: [true, 'Please add a target'],
    },
    achieved: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Set endDate based on type
goalSchema.pre('save', function (next) {
  if (this.type === 'Weekly') {
    this.endDate = new Date(this.startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  } else if (this.type === 'Monthly') {
    this.endDate = new Date(
      this.startDate.getFullYear(),
      this.startDate.getMonth() + 1,
      this.startDate.getDate()
    );
  }
  next();
});

module.exports = mongoose.model('Goal', goalSchema);
