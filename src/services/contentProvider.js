/**
 * Content Provider Abstraction Layer
 * Provides a unified interface for different content sources
 */

import blogConfig from './blogConfig'
import GithubProvider from './providers/githubProvider'
import SanityProvider from './providers/sanityProvider'
import { ContentProvider } from './providers/contentProviderBase'

/**
 * Factory function to get the configured provider
 * @returns {ContentProvider} Active content provider instance
 */
function getProvider() {
  const providerType = blogConfig.provider

  switch (providerType) {
    case 'github':
      return new GithubProvider(blogConfig.github)
    case 'sanity':
      return new SanityProvider(blogConfig.sanity)
    default:
      throw new Error(`Unknown provider: ${providerType}`)
  }
}

// Export singleton instance
export default getProvider()

// Export base class for provider implementations
export { ContentProvider }
