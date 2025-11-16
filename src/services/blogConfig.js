/**
 * Blog Configuration
 * Change the 'provider' value to switch between content sources
 */

export default {
  // Active provider: 'github' or 'sanity'
  provider: 'sanity',

  // GitHub configuration for markdown posts
  github: {
    owner: 'plashspeed-aiman',
    repo: 'blog-posts',
    branch: 'main',
    path: 'posts'
  },

  // Sanity.io configuration
  sanity: {
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID || '',
    dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false
  },

  // Pagination settings
  postsPerPage: 6,

  // Cache duration in milliseconds (5 minutes)
  cacheDuration: 5 * 60 * 1000
}
