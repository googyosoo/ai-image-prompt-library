import { searchIndexedPrompts } from '../server/githubService';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  try {
    const categorySlug = (req.query?.category as string) || 'profile-avatar';
    const q = ((req.query?.q as string) || '').trim();
    const styleFilter = (req.query?.style as string) || 'All';
    const sortBy = (req.query?.sortBy as 'popular' | 'trending' | 'newest') || 'popular';
    const page = Math.max(1, parseInt(req.query?.page as string, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query?.limit as string, 10) || 24));

    const result = await searchIndexedPrompts({
      categorySlug,
      query: q,
      style: styleFilter,
      page,
      limit,
      sortBy,
    });

    return res.status(200).json({
      items: result.items,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        hasMore: result.hasMore,
      },
    });
  } catch (error: any) {
    console.error('Error in github-prompts handler:', error);
    return res.status(200).json({
      items: [],
      pagination: {
        page: 1,
        limit: 24,
        total: 0,
        totalPages: 1,
        hasMore: false,
      },
      warning: error.message || 'Failed to fetch prompts',
    });
  }
}
