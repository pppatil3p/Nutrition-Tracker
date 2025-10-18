import Maintenance from '../models/Maintenance.js';

// ✅ CREATE or UPDATE maintenance entry
export const createMaintenance = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const {
      goalType,
      durationMonths,
      targetKg,
      age,
      sex,
      height,
      weight,
      activity,
      maintenanceCalories,
      goalCalories,
      recommendedProtein
    } = req.body;

    if (!age || !weight || !height) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let entry = await Maintenance.findOne({ user: req.user._id });

    if (entry) {
      // Update existing entry
      entry.goalType = goalType;
      entry.durationMonths = durationMonths;
      entry.targetKg = targetKg;
      entry.age = age;
      entry.sex = sex;
      entry.height = height;
      entry.weight = weight;
      entry.activity = activity;
      entry.maintenanceCalories = maintenanceCalories;
      entry.goalCalories = goalCalories;
      entry.recommendedProtein = recommendedProtein;

      await entry.save();
    } else {
      // Create new entry
      entry = new Maintenance({
        user: req.user._id,
        goalType,
        durationMonths,
        targetKg,
        age,
        sex,
        height,
        weight,
        activity,
        maintenanceCalories,
        goalCalories,
        recommendedProtein
      });
      await entry.save();
    }

    res.status(201).json({
      message: 'Maintenance entry saved',
      maintenance: {
        maintenanceCalories: entry.maintenanceCalories,
        goalCalories: entry.goalCalories,
        recommendedProtein: entry.recommendedProtein
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to save entry' });
  }
};

// ✅ GET the maintenance entry for the logged-in user
export const getMaintenance = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const entry = await Maintenance.findOne({ user: req.user._id });

    if (!entry) {
      return res.status(404).json({ message: 'Maintenance data not found' });
    }

    res.json({
      maintenance: {
        maintenanceCalories: entry.maintenanceCalories,
        goalCalories: entry.goalCalories,
        recommendedProtein: entry.recommendedProtein
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get maintenance data' });
  }
};
