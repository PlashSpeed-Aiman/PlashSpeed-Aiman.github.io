/**
 * GitHub Markdown Provider
 * Fetches markdown files from a public GitHub repository
 */

import { marked } from 'marked'
import yaml from 'js-yaml'
import { ContentProvider } from './contentProviderBase'
import blogConfig from '../blogConfig'

class GithubProvider extends ContentProvider {
  constructor(config) {
    super()
    this.owner = config.owner
    this.repo = config.repo
    this.branch = config.branch
    this.path = config.path
    this.baseUrl = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.path}`
    this.cache = {
      posts: null,
      timestamp: null
    }
  }

  /**
   * Check if cache is valid
   */
  isCacheValid() {
    if (!this.cache.posts || !this.cache.timestamp) return false
    return Date.now() - this.cache.timestamp < blogConfig.cacheDuration
  }

  /**
   * Fetch file list from GitHub
   */
  async fetchFileList() {
    try {
      const response = await fetch(`${this.baseUrl}?ref=${this.branch}`)
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }
      const files = await response.json()
      return files.filter(file => file.name.endsWith('.md'))
    } catch (error) {
      console.error('Error fetching file list from GitHub:', error)
      return []
    }
  }

  /**
   * Fetch and parse a single markdown file
   */
  async fetchPost(file) {
    try {
      const response = await fetch(file.download_url)
      if (!response.ok) {
        throw new Error(`Failed to fetch ${file.name}`)
      }
      const content = await response.text()
      return this.parseMarkdown(content, file.name)
    } catch (error) {
      console.error(`Error fetching post ${file.name}:`, error)
      return null
    }
  }

  /**
   * Parse markdown with frontmatter
   */
  parseMarkdown(content, filename) {
    // Extract frontmatter
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
    const match = content.match(frontmatterRegex)

    if (!match) {
      console.warn(`No frontmatter found in ${filename}`)
      return null
    }

    const [, frontmatterRaw, markdownContent] = match
    let frontmatter = {}

    try {
      frontmatter = yaml.load(frontmatterRaw)
    } catch (error) {
      console.error(`Error parsing frontmatter in ${filename}:`, error)
      return null
    }

    // Generate slug from filename
    const slug = filename.replace(/\.md$/, '')

    // Convert markdown to HTML
    const htmlContent = marked.parse(markdownContent)

    // Generate excerpt if not provided
    let excerpt = frontmatter.excerpt || ''
    if (!excerpt) {
      // Get first paragraph from markdown
      const firstParagraph = markdownContent.split('\n\n')[0]
      excerpt = firstParagraph.replace(/[#*`]/g, '').substring(0, 200) + '...'
    }

    return {
      slug,
      title: frontmatter.title || 'Untitled',
      excerpt,
      content: htmlContent,
      rawContent: markdownContent,
      author: frontmatter.author || 'Aiman Rahim',
      date: frontmatter.date ? new Date(frontmatter.date) : new Date(),
      tags: frontmatter.tags || [],
      coverImage: frontmatter.coverImage || null,
      metadata: frontmatter
    }
  }

  /**
   * Get all posts
   */
  async getPosts() {
    // Return cached posts if valid
    if (this.isCacheValid()) {
      return this.cache.posts
    }

    const files = await this.fetchFileList()
    const posts = await Promise.all(
      files.map(file => this.fetchPost(file))
    )

    // Filter out null values and sort by date (newest first)
    const validPosts = posts
      .filter(post => post !== null)
      .sort((a, b) => b.date - a.date)

    // Update cache
    this.cache.posts = validPosts
    this.cache.timestamp = Date.now()

    return validPosts
  }

  /**
   * Get a single post by slug
   */
  async getPost(slug) {
    const posts = await this.getPosts()
    return posts.find(post => post.slug === slug) || null
  }

  /**
   * Search posts by query
   */
  async searchPosts(query) {
    const posts = await this.getPosts()
    const lowerQuery = query.toLowerCase()

    return posts.filter(post =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.rawContent.toLowerCase().includes(lowerQuery)
    )
  }

  /**
   * Get posts by tag
   */
  async getPostsByTag(tag) {
    const posts = await this.getPosts()
    return posts.filter(post => post.tags.includes(tag))
  }

  /**
   * Get all unique tags
   */
  async getTags() {
    const posts = await this.getPosts()
    const tagsSet = new Set()

    posts.forEach(post => {
      post.tags.forEach(tag => tagsSet.add(tag))
    })

    return Array.from(tagsSet).sort()
  }
}

export default GithubProvider
