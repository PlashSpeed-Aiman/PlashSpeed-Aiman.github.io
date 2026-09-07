/**
 * Content Provider Abstraction Layer
 * Base interface that all providers must implement
 */

class ContentProvider {
  /**
   * Get all posts
   * @returns {Promise<Array>} Array of post objects
   */
  async getPosts() {
    throw new Error('getPosts() must be implemented')
  }

  /**
   * Get a single post by slug
   * @param {string} slug - Post identifier
   * @returns {Promise<Object|null>} Post object or null
   */
  async getPost(slug) {
    throw new Error('getPost() must be implemented')
  }

  /**
   * Search posts by query
   * @param {string} query - Search query
   * @returns {Promise<Array>} Filtered array of posts
   */
  async searchPosts(query) {
    throw new Error('searchPosts() must be implemented')
  }

  /**
   * Get posts by tag
   * @param {string} tag - Tag to filter by
   * @returns {Promise<Array>} Filtered array of posts
   */
  async getPostsByTag(tag) {
    throw new Error('getPostsByTag() must be implemented')
  }

  /**
   * Get all unique tags
   * @returns {Promise<Array>} Array of tag strings
   */
  async getTags() {
    throw new Error('getTags() must be implemented')
  }
}

export { ContentProvider }
