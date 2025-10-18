import mongoose from 'mongoose';

const MealLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  day: {
    type: Number,
    required: true,
  },
  meals: {
    type: Object,
    required: true,
  },
  aiResponse: {
    type: Object,
    required: true,
  },
  calories: {
    type: Number,
    default: 0,
  },
  protein: {
    type: Number,
    default: 0,
  },
  carbs: {
    type: Number,
    default: 0,
  },
  fat: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.model('MealLog', MealLogSchema);
