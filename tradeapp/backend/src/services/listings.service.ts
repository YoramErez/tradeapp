import prisma from '../config/database';
import { NotFoundError } from '../utils/errors';

export class ListingsService {
  async createListing(userId: string, data: any) {
    const listing = await prisma.listing.create({
      data: {
        ...data,
        userId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatarURL: true,
            city: true,
            country: true,
            reputation: true,
          },
        },
      },
    });

    return listing;
  }

  async getListings(filters: any = {}) {
    const { category, city, status = 'active', userId } = filters;

    const where: any = {
      status,
    };

    if (category) where.category = category;
    if (city) where.city = city;
    if (userId) where.userId = userId;

    const listings = await prisma.listing.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatarURL: true,
            city: true,
            country: true,
            reputation: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return listings;
  }

  async getListingById(id: string) {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        owner: {
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
      },
    });

    if (!listing) {
      throw new NotFoundError('Listing not found');
    }

    return listing;
  }

  async updateListing(id: string, userId: string, data: any) {
    // Check ownership
    const listing = await this.getListingById(id);
    if (listing.userId !== userId) {
      throw new Error('Not authorized to update this listing');
    }

    const updated = await prisma.listing.update({
      where: { id },
      data,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatarURL: true,
            city: true,
            country: true,
            reputation: true,
          },
        },
      },
    });

    return updated;
  }

  async deleteListing(id: string, userId: string) {
    // Check ownership
    const listing = await this.getListingById(id);
    if (listing.userId !== userId) {
      throw new Error('Not authorized to delete this listing');
    }

    await prisma.listing.delete({
      where: { id },
    });

    return { success: true };
  }

  async getMyListings(userId: string) {
    return this.getListings({ userId });
  }

  async getAvailableListings(userId: string) {
    const listings = await prisma.listing.findMany({
      where: {
        status: 'active',
        userId: { not: userId },
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatarURL: true,
            city: true,
            country: true,
            reputation: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return listings;
  }

  async likeListing(listingId: string, userId: string) {
    // Get the listing to know who owns it
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { owner: true },
    });

    if (!listing) {
      throw new NotFoundError('Listing not found');
    }

    const listingOwnerId = listing.userId;

    // Can't like your own listing
    if (listingOwnerId === userId) {
      throw new Error('You cannot like your own listing');
    }

    // Check if already liked
    const existing = await prisma.like.findFirst({
      where: {
        listingId,
        fromUserId: userId,
      },
    });

    if (existing) {
      return { alreadyLiked: true };
    }

    // Create like (fromUserId = person who liked, toUserId = owner of listing)
    const like = await prisma.like.create({
      data: {
        listingId,
        fromUserId: userId,
        toUserId: listingOwnerId,
      },
      include: {
        listing: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                avatarURL: true,
                city: true,
                country: true,
                reputation: true,
              },
            },
          },
        },
        fromUser: {
          select: {
            id: true,
            name: true,
            avatarURL: true,
          },
        },
      },
    });

    // Check for mutual likes to create a match
    // A match happens when:
    // - User A (current user) likes User B's listing (listingOwnerId)
    // - User B (listing owner) also likes one of User A's listings
    
    // Find if the listing owner has liked any of the current user's listings
    const userListings = await prisma.listing.findMany({
      where: {
        userId: userId,
        status: 'active',
      },
      select: { id: true },
    });

    const userListingIds = userListings.map(l => l.id);

    let match = null;
    if (userListingIds.length > 0) {
      const mutualLike = await prisma.like.findFirst({
        where: {
          fromUserId: listingOwnerId, // Owner of this listing
          toUserId: userId, // Person who just liked (owner of the other listing)
          listingId: {
            in: userListingIds, // One of the current user's listings
          },
        },
        include: {
          listing: true,
        },
      });

      if (mutualLike) {
        // Check if match already exists
        const existingMatch = await prisma.match.findFirst({
          where: {
            OR: [
              {
                userAId: userId,
                userBId: listingOwnerId,
              },
              {
                userAId: listingOwnerId,
                userBId: userId,
              },
            ],
          },
        });

        if (!existingMatch) {
          // Create a new match
          match = await prisma.match.create({
            data: {
              userAId: userId,
              userBId: listingOwnerId,
              listingAId: listingId,
              listingBId: mutualLike.listingId,
              status: 'pending',
            },
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
        }
      }
    }

    return { like, match };
  }
}

export default new ListingsService();

