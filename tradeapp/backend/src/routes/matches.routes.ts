import express from 'express';
import matchesController from '../controllers/matches.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authMiddleware, (req, res, next) => matchesController.getMyMatches(req, res, next));
router.get('/:id', authMiddleware, (req, res, next) => matchesController.getMatch(req, res, next));
router.post('/:id/accept', authMiddleware, (req, res, next) => matchesController.acceptMatch(req, res, next));
router.post('/:id/decline', authMiddleware, (req, res, next) => matchesController.declineMatch(req, res, next));

export default router;

