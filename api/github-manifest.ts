import {
  getGitHubManifest,
  POPULAR_KEYWORDS,
  CATEGORY_MAP,
} from '../server/githubService';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  try {
    const manifest = await getGitHubManifest();
    return res.status(200).json({
      manifest,
      categoryMap: CATEGORY_MAP,
      popularKeywords: POPULAR_KEYWORDS,
    });
  } catch (error: any) {
    console.error('Error fetching manifest:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch manifest' });
  }
}
