# Blog System Documentation

## Overview

This blog system uses a **Content Provider Pattern** that allows you to switch between different content sources with a simple configuration change. Currently supported providers:

- **GitHub Markdown** - Fetch markdown files from a public GitHub repository
- **Sanity.io** - Full-featured headless CMS integration
- **Extensible** - Easy to add new providers (Cloudinary, WordPress, etc.)

## Features

- 🔄 **Pluggable Backends** - Switch between content sources by changing one config value
- 🔍 **Search & Filter** - Real-time search with debouncing and tag filtering
- 📄 **Pagination** - Configurable posts per page
- 🎨 **Neo-Modernist Design** - Consistent with site design system
- ⚡ **Performance** - Built-in caching, lazy loading, code splitting
- 📱 **Responsive** - Mobile-first design with asymmetric layouts

## Quick Start

### 1. Configuration

Edit `src/services/blogConfig.js` to set your active provider:

```javascript
export default {
  provider: 'github', // or 'sanity'
  // ... rest of config
}
```

### 2. Using GitHub Markdown Provider

**Setup:**
1. Create a public GitHub repository for your blog posts
2. Update `blogConfig.js` with your repo details:
   ```javascript
   github: {
     owner: 'your-username',
     repo: 'blog-posts',
     branch: 'main',
     path: 'posts'
   }
   ```

**Creating Posts:**

Create `.md` files in your repo with YAML frontmatter:

```markdown
---
title: "My First Blog Post"
date: "2024-01-15"
author: "Aiman Rahim"
tags: ["vue", "javascript", "design"]
excerpt: "A short description of the post"
coverImage: "https://example.com/image.jpg"
---

# Your content here

Write your post content in **Markdown**...
```

**Required Frontmatter:**
- `title` - Post title
- `date` - Publication date (YYYY-MM-DD)

**Optional Frontmatter:**
- `author` - Author name (defaults to "Aiman Rahim")
- `tags` - Array of tags
- `excerpt` - Short description (auto-generated if not provided)
- `coverImage` - URL to cover image

### 3. Using Sanity.io Provider

**Setup:**
1. Create a Sanity project at [sanity.io](https://www.sanity.io/)
2. Define your blog schema (see example below)
3. Create a `.env` file:
   ```
   VITE_SANITY_PROJECT_ID=your_project_id
   VITE_SANITY_DATASET=production
   ```
4. Update `blogConfig.js`:
   ```javascript
   provider: 'sanity'
   ```

**Sanity Schema Example:**

Create a schema for blog posts in your Sanity studio:

```javascript
export default {
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: Rule => Rule.required()
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }]
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }]
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime'
    }
  ]
}
```

## File Structure

```
src/
├── services/
│   ├── blogConfig.js              # Configuration file
│   ├── contentProvider.js         # Abstract provider interface
│   └── providers/
│       ├── githubProvider.js      # GitHub implementation
│       └── sanityProvider.js      # Sanity implementation
├── components/
│   ├── Blog.vue                   # Blog listing page
│   ├── BlogPost.vue               # Single post page
│   └── blog/
│       ├── PostCard.vue           # Post preview card
│       ├── SearchBar.vue          # Search and filter UI
│       └── Pagination.vue         # Pagination controls
```

## Normalized Post Format

All providers return posts in this format:

```javascript
{
  slug: "post-slug",
  title: "Post Title",
  excerpt: "Short description...",
  content: "<p>HTML content...</p>",
  rawContent: "Original markdown/text",
  author: "Author Name",
  date: Date object,
  tags: ["tag1", "tag2"],
  coverImage: "https://...",
  metadata: {} // Provider-specific data
}
```

## Provider Interface

To create a new provider, extend the `ContentProvider` class and implement these methods:

```javascript
class YourProvider extends ContentProvider {
  async getPosts() {
    // Return array of all posts
  }

  async getPost(slug) {
    // Return single post by slug
  }

  async searchPosts(query) {
    // Return filtered posts by search query
  }

  async getPostsByTag(tag) {
    // Return posts filtered by tag
  }

  async getTags() {
    // Return array of all unique tags
  }
}
```

## Caching

Both providers implement in-memory caching:
- Cache duration: 5 minutes (configurable in `blogConfig.js`)
- Cache invalidates automatically after duration
- Reduces API calls and improves performance

## Design System Integration

The blog components follow the Neo-Modernist design system:

- **Colors:** Warm professional palette (amber-600, stone-950)
- **Typography:** Inter font, tight tracking on headings
- **Interactions:** Physics-based hover effects, micro-breaks
- **Layouts:** Asymmetric 4/8 grids, intentional offsets
- **Components:** Reusable Card with hover-lift effects

## Customization

### Pagination

Change posts per page in `blogConfig.js`:

```javascript
postsPerPage: 6  // Show 6 posts per page
```

### Styling

Blog post content uses Tailwind's typography plugin (`@tailwindcss/typography`). Customize in `BlogPost.vue`:

```vue
<div class="prose prose-lg prose-stone ...">
  <!-- Customize prose classes here -->
</div>
```

### Grid Breaks

The 4th post card spans full width (grid-break pattern). Modify in `Blog.vue`:

```vue
:class="index === 3 ? 'md:col-span-2' : ''"
```

## Routes

- `/blog` - Blog listing page with search, filters, pagination
- `/blog/:slug` - Individual blog post page

## Troubleshooting

**GitHub Provider:**
- Ensure repository is public
- Check file paths match config
- Verify frontmatter YAML is valid
- GitHub API has rate limits (60 requests/hour unauthenticated)

**Sanity Provider:**
- Verify project ID and dataset in environment variables
- Check CORS settings in Sanity project
- Ensure schema matches expected structure
- Confirm GROQ queries are correct

## Future Enhancements

- [ ] Related posts section
- [ ] RSS feed generation
- [ ] Reading time calculation
- [ ] Share buttons
- [ ] Comments integration
- [ ] Draft/preview mode
- [ ] Cloudinary provider implementation
- [ ] WordPress API provider

## Credits

- **Markdown Parser:** [marked](https://github.com/markedjs/marked)
- **YAML Parser:** [js-yaml](https://github.com/nodeca/js-yaml)
- **Headless CMS:** [Sanity.io](https://www.sanity.io/)
- **Design System:** Neo-Modernist with warm professional palette

---

**Version:** 1.0
**Last Updated:** November 2024
**Maintained by:** Aiman Rahim
