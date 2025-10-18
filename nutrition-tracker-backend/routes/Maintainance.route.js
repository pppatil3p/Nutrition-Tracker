import express from 'express';
import { protect } from '../middlewear/protect.js';
import { createMaintenance, getMaintenance } from '../controllers/Maintenance.controller.js';

const router = express.Router();

router.post('/', protect, createMaintenance);
router.get('/', protect, getMaintenance);  // <-- added

export default router;
