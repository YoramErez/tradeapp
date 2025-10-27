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

    // Create like
    const like = await prisma.like.create({
      data: {
        listingId,
        fromUserId: userId,
        toUserId: listing.userId, // Who is receiving the like
      },
      include: {
        listing: {
          include: {
            owner: true,
          },
        },
      },
    });

    return like;
  }
}

export default new ListingsService();

