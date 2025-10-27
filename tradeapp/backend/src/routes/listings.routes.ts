import express from 'express';
import listingsController from '../controllers/listings.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', (req, res, next) => listingsController.getListings(req, res, next));
router.post('/', authMiddleware, (req, res, next) => listingsController.createListing(req, res, next));
router.get('/my-listings', authMiddleware, (req, res, next) => listingsController.getMyListings(req, res, next));
router.get('/available', authMiddleware, (req, res, next) => listingsController.getAvailableListings(req, res, next));
router.get('/:id', (req, res, next) => listingsController.getListing(req, res, next));
router.put('/:id', authMiddleware, (req, res, next) => listingsController.updateListing(req, res, next));
router.delete('/:id', authMiddleware, (req, res, next) => listingsController.deleteListing(req, res, next));
router.post('/:id/like', authMiddleware, (req, res, next) => listingsController.likeListing(req, res, next));

export default router;

