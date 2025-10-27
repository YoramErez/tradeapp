import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import listingsService from '../services/listings.service';
import logger from '../utils/logger';

const createListingSchema = z.object({
  title: z.string().min(3).max(80),
  description: z.string().min(10).max(500),
  category: z.string(),
  condition: z.string(),
  photoURLs: z.array(z.string()),
  city: z.string().optional(),
  country: z.string().optional(),
});

export class ListingsController {
  async createListing(req: any, res: Response, next: NextFunction) {
    try {
      const validData = createListingSchema.parse(req.body);
      const listing = await listingsService.createListing(req.userId, validData);

      logger.info(`Listing created: ${listing.id}`);
      res.status(201).json({
        success: true,
        data: listing,
      });
    } catch (error) {
      next(error);
    }
  }

  async getListings(req: Request, res: Response, next: NextFunction) {
    try {
      const listings = await listingsService.getListings(req.query);
      res.json({
        success: true,
        data: listings,
      });
    } catch (error) {
      next(error);
    }
  }

  async getListing(req: Request, res: Response, next: NextFunction) {
    try {
      const listing = await listingsService.getListingById(req.params.id);
      res.json({
        success: true,
        data: listing,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateListing(req: any, res: Response, next: NextFunction) {
    try {
      const listing = await listingsService.updateListing(
        req.params.id,
        req.userId,
        req.body
      );

      logger.info(`Listing updated: ${listing.id}`);
      res.json({
        success: true,
        data: listing,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteListing(req: any, res: Response, next: NextFunction) {
    try {
      await listingsService.deleteListing(req.params.id, req.userId);
      logger.info(`Listing deleted: ${req.params.id}`);
      res.json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyListings(req: any, res: Response, next: NextFunction) {
    try {
      const listings = await listingsService.getMyListings(req.userId);
      res.json({
        success: true,
        data: listings,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAvailableListings(req: any, res: Response, next: NextFunction) {
    try {
      const listings = await listingsService.getAvailableListings(req.userId);
      res.json({
        success: true,
        data: listings,
      });
    } catch (error) {
      next(error);
    }
  }

  async likeListing(req: any, res: Response, next: NextFunction) {
    try {
      const like = await listingsService.likeListing(req.params.id, req.userId);
      logger.info(`Listing liked: ${req.params.id} by user ${req.userId}`);
      res.json({
        success: true,
        data: like,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ListingsController();

