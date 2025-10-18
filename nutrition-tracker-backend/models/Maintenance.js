import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goalType: {
    type: String,
    enum: ['maintain', 'lose', 'gain'],
    required: true
  },
  durationMonths: {
    type: Number,
    required: true
  },
  targetKg: {
    type: Number
  },
  age: {
    type: Number,
    required: true
  },
  sex: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  activity: {
    type: Number,
    required: true
  },
  maintenanceCalories: {
    type: Number,
    required: true
  },
  goalCalories: {
    type: Number
  },
  recommendedProtein: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

export default Maintenance;
