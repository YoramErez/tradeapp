import prisma from '../config/database';
import { NotFoundError } from '../utils/errors';

export class MatchesService {
  async getMyMatches(userId: string) {
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { userAId: userId },
          { userBId: userId },
        ],
      },
      include: {
        userA: {
          select: {
            id: true,
            name: true,
            avatarURL: true,
            city: true,
            country: true,
            reputation: true,
            trustScore: true,
            isVerified: true,
          },
        },
        userB: {
          select: {
            id: true,
            name: true,
            avatarURL: true,
            city: true,
            country: true,
            reputation: true,
            trustScore: true,
            isVerified: true,
          },
        },
        listingA: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                avatarURL: true,
              },
            },
          },
        },
        listingB: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                avatarURL: true,
              },
            },
          },
        },
        swap: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return matches;
  }

  async getMatchById(matchId: string, userId: string) {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        userA: {
          select: {
            id: true,
            name: true,
            avatarURL: true,
            city: true,
            country: true,
            reputation: true,
            trustScore: true,
            isVerified: true,
          },
        },
        userB: {
          select: {
            id: true,
            name: true,
            avatarURL: true,
            city: true,
            country: true,
            reputation: true,
            trustScore: true,
            isVerified: true,
          },
        },
        listingA: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                avatarURL: true,
              },
            },
          },
        },
        listingB: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                avatarURL: true,
              },
            },
          },
        },
        swap: true,
      },
    });

    if (!match) {
      throw new NotFoundError('Match not found');
    }

    // Check if user is part of this match
    if (match.userAId !== userId && match.userBId !== userId) {
      throw new Error('Not authorized to view this match');
    }

    return match;
  }

  async acceptMatch(matchId: string, userId: string) {
    const match = await this.getMatchById(matchId, userId);

    // Check if user is part of this match
    if (match.userAId !== userId && match.userBId !== userId) {
      throw new Error('Not authorized to accept this match');
    }

    if (match.status !== 'pending') {
      throw new Error('Match is not in pending status');
    }

    const updated = await prisma.match.update({
      where: { id: matchId },
      data: { status: 'accepted' },
      include: {
        userA: {
          select: {
            id: true,
            name: true,
            avatarURL: true,
            city: true,
            country: true,
          },
        },
        userB: {
          select: {
            id: true,
            name: true,
            avatarURL: true,
            city: true,
            country: true,
          },
        },
        listingA: true,
        listingB: true,
      },
    });

    return updated;
  }

  async declineMatch(matchId: string, userId: string) {
    const match = await this.getMatchById(matchId, userId);

    // Check if user is part of this match
    if (match.userAId !== userId && match.userBId !== userId) {
      throw new Error('Not authorized to decline this match');
    }

    if (match.status !== 'pending') {
      throw new Error('Match is not in pending status');
    }

    const updated = await prisma.match.update({
      where: { id: matchId },
      data: { status: 'declined' },
      include: {
        userA: {
          select: {
            id: true,
            name: true,
            avatarURL: true,
          },
        },
        userB: {
          select: {
            id: true,
            name: true,
            avatarURL: true,
          },
        },
        listingA: true,
        listingB: true,
      },
    });

    return updated;
  }
}

export default new MatchesService();

