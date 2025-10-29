import { Response, NextFunction } from 'express';
import matchesService from '../services/matches.service';
import { logger } from '../utils/logger';

export class MatchesController {
  async getMyMatches(req: any, res: Response, next: NextFunction) {
    try {
      const matches = await matchesService.getMyMatches(req.userId);
      logger.info(`Fetched matches for user ${req.userId}`);
      res.json({
        success: true,
        data: matches,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMatch(req: any, res: Response, next: NextFunction) {
    try {
      const match = await matchesService.getMatchById(req.params.id, req.userId);
      logger.info(`Fetched match ${req.params.id} for user ${req.userId}`);
      res.json({
        success: true,
        data: match,
      });
    } catch (error) {
      next(error);
    }
  }

  async acceptMatch(req: any, res: Response, next: NextFunction) {
    try {
      const match = await matchesService.acceptMatch(req.params.id, req.userId);
      logger.info(`Match ${req.params.id} accepted by user ${req.userId}`);
      res.json({
        success: true,
        data: match,
        message: 'Match accepted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async declineMatch(req: any, res: Response, next: NextFunction) {
    try {
      const match = await matchesService.declineMatch(req.params.id, req.userId);
      logger.info(`Match ${req.params.id} declined by user ${req.userId}`);
      res.json({
        success: true,
        data: match,
        message: 'Match declined',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new MatchesController();

