import express from 'express';
import { protect } from '../middlewear/protect.js';
import {
  analyzeAndSaveMeals,
  getAllMealLogs,
  editMealLog,
  deleteMealLog
} from '../controllers/meal.controller.js';

const router = express.Router();

router.post('/analyze', protect, analyzeAndSaveMeals);
router.get('/all', protect, getAllMealLogs);
router.put('/:id', protect, editMealLog);
router.delete('/:id', protect, deleteMealLog);

export default router;
