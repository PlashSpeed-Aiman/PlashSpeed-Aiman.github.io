/**
 * Sanity.io Provider
 * Fetches content from Sanity CMS
 */

import { createClient } from '@sanity/client'
import { ContentProvider } from './contentProviderBase'
import blogConfig from '../blogConfig'

class SanityProvider extends ContentProvider {
  constructor(config) {
    super()
    this.client = createClient({
      projectId: config.projectId,
      dataset: config.dataset,
      apiVersion: config.apiVersion,
      useCdn: config.useCdn
    })
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
   * Convert Sanity portable text to HTML
   * This is a simplified version - for full implementation use @portabletext/to-html
   */
  portableTextToHtml(blocks) {
    if (!blocks || !Array.isArray(blocks)) return ''

    return blocks
      .map(block => {
        if (block._type === 'block') {
          const text = block.children?.map(child => child.text).join('') || ''

          switch (block.style) {
            case 'h1':
              return `<h1>${text}</h1>`
            case 'h2':
              return `<h2>${text}</h2>`
            case 'h3':
              return `<h3>${text}</h3>`
            case 'h4':
              return `<h4>${text}</h4>`
            default:
              return `<p>${text}</p>`
          }
        }

        if (block._type === 'image') {
          const imageUrl = this.getImageUrl(block)
          return `<img src="${imageUrl}" alt="${block.alt || ''}" />`
        }

        return ''
      })
      .join('\n')
  }

  /**
   * Get image URL from Sanity asset reference
   */
  getImageUrl(image) {
    if (!image || !image.asset) return null

    const ref = image.asset._ref
    const [, id, dimensions, format] = ref.match(/image-([a-f\d]+)-(\d+x\d+)-(\w+)/)
    const [width, height] = dimensions.split('x')

    return `https://cdn.sanity.io/images/${this.client.config().projectId}/${this.client.config().dataset}/${id}-${dimensions}.${format}`
  }

  /**
   * Transform Sanity post to normalized format
   */
  transformPost(sanityPost) {
    return {
      slug: sanityPost.slug?.current || '',
      title: sanityPost.title || 'Untitled',
      excerpt: sanityPost.excerpt || '',
      content: this.portableTextToHtml(sanityPost.body),
      rawContent: JSON.stringify(sanityPost.body),
      author: sanityPost.author?.name || 'Aiman Rahim',
      date: sanityPost.publishedAt ? new Date(sanityPost.publishedAt) : new Date(),
      tags: sanityPost.tags?.map(tag => tag.title || tag) || [],
      coverImage: sanityPost.coverImage ? this.getImageUrl(sanityPost.coverImage) : null,
      metadata: sanityPost
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

    try {
      const query = `*[_type == "post"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        body,
        publishedAt,
        author->{name},
        coverImage{asset->{_ref}},
        tags[]->{title}
      }`

      const sanityPosts = await this.client.fetch(query)
      const posts = sanityPosts.map(post => this.transformPost(post))

      // Update cache
      this.cache.posts = posts
      this.cache.timestamp = Date.now()

      return posts
    } catch (error) {
      console.error('Error fetching posts from Sanity:', error)
      return []
    }
  }

  /**
   * Get a single post by slug
   */
  async getPost(slug) {
    try {
      const query = `*[_type == "post" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        excerpt,
        body,
        publishedAt,
        author->{name},
        coverImage{asset->{_ref}},
        tags[]->{title}
      }`

      const sanityPost = await this.client.fetch(query, { slug })
      return sanityPost ? this.transformPost(sanityPost) : null
    } catch (error) {
      console.error(`Error fetching post ${slug} from Sanity:`, error)
      return null
    }
  }

  /**
   * Search posts by query
   */
  async searchPosts(query) {
    try {
      const groqQuery = `*[_type == "post" && (
        title match $query ||
        excerpt match $query ||
        pt::text(body) match $query
      )] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        body,
        publishedAt,
        author->{name},
        coverImage{asset->{_ref}},
        tags[]->{title}
      }`

      const sanityPosts = await this.client.fetch(groqQuery, { query: `*${query}*` })
      return sanityPosts.map(post => this.transformPost(post))
    } catch (error) {
      console.error('Error searching posts in Sanity:', error)
      return []
    }
  }

  /**
   * Get posts by tag
   */
  async getPostsByTag(tag) {
    try {
      const query = `*[_type == "post" && $tag in tags[]->title] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        body,
        publishedAt,
        author->{name},
        coverImage{asset->{_ref}},
        tags[]->{title}
      }`

      const sanityPosts = await this.client.fetch(query, { tag })
      return sanityPosts.map(post => this.transformPost(post))
    } catch (error) {
      console.error(`Error fetching posts by tag ${tag} from Sanity:`, error)
      return []
    }
  }

  /**
   * Get all unique tags
   */
  async getTags() {
    try {
      const query = `*[_type == "tag"] | order(title asc) {
        title
      }`

      const tags = await this.client.fetch(query)
      return tags.map(tag => tag.title)
    } catch (error) {
      console.error('Error fetching tags from Sanity:', error)
      return []
    }
  }
}

export default SanityProvider
