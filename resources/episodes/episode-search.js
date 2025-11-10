/**
 * Episode Search Library
 * Fast client-side search for Nikonomics podcast episodes
 */

class EpisodeSearch {
    constructor() {
        this.searchIndex = null;
        this.episodes = [];
        this.index = {};
        this.filters = {};
        this.loading = false;
    }

    /**
     * Load search index from JSON file
     */
    async loadIndex(indexPath = 'search-index.json') {
        if (this.loading) return;
        if (this.searchIndex) return; // Already loaded

        this.loading = true;

        try {
            const response = await fetch(indexPath);
            this.searchIndex = await response.json();
            this.episodes = this.searchIndex.episodes;
            this.index = this.searchIndex.index;
            this.filters = this.searchIndex.filters;
            this.loading = false;
            console.log(`✓ Loaded ${this.episodes.length} episodes`);
            return true;
        } catch (error) {
            console.error('Failed to load search index:', error);
            this.loading = false;
            return false;
        }
    }

    /**
     * Tokenize search query (same logic as Python indexer)
     */
    tokenize(text) {
        if (!text) return [];
        text = text.toLowerCase();
        const tokens = text.match(/\b[\w-]+\b/g) || [];
        return tokens.filter(t => t.length > 2);
    }

    /**
     * Search episodes by query and optional filters
     *
     * @param {string} query - Search query
     * @param {Object} options - Search options
     * @param {string} options.industry - Filter by industry category
     * @param {string} options.subcategory - Filter by industry subcategory
     * @param {number} options.limit - Max results to return (default: 50)
     * @returns {Array} Array of matching episodes with scores
     */
    search(query, options = {}) {
        if (!this.searchIndex) {
            console.warn('Search index not loaded');
            return [];
        }

        const {
            industry = null,
            subcategory = null,
            limit = 50
        } = options;

        // If no query and no filters, return all episodes
        if (!query && !industry && !subcategory) {
            return this.episodes.slice(0, limit);
        }

        // Tokenize query
        const queryTokens = this.tokenize(query);

        // Find matching episode IDs for each token
        const matchingEpisodeIds = new Map(); // episode_id -> match_count

        for (const token of queryTokens) {
            const episodeIds = this.index[token] || [];
            for (const epId of episodeIds) {
                matchingEpisodeIds.set(epId, (matchingEpisodeIds.get(epId) || 0) + 1);
            }
        }

        // Get full episode objects and calculate scores
        let results = [];

        for (const [epId, matchCount] of matchingEpisodeIds) {
            const episode = this.episodes.find(ep => ep.id === epId);
            if (!episode) continue;

            // Apply filters
            if (industry && !this.matchesIndustry(episode, industry)) continue;
            if (subcategory && !this.matchesSubcategory(episode, subcategory)) continue;

            // Calculate relevance score
            const score = this.calculateScore(episode, queryTokens, matchCount);

            results.push({
                ...episode,
                score: score,
                matchCount: matchCount
            });
        }

        // If filters but no query, include all episodes matching filters
        if (queryTokens.length === 0 && (industry || subcategory)) {
            for (const episode of this.episodes) {
                if (industry && !this.matchesIndustry(episode, industry)) continue;
                if (subcategory && !this.matchesSubcategory(episode, subcategory)) continue;

                if (!results.find(r => r.id === episode.id)) {
                    results.push({
                        ...episode,
                        score: 1,
                        matchCount: 0
                    });
                }
            }
        }

        // Sort by score (descending)
        results.sort((a, b) => b.score - a.score);

        // Limit results
        return results.slice(0, limit);
    }

    /**
     * Calculate relevance score for an episode
     */
    calculateScore(episode, queryTokens, matchCount) {
        let score = matchCount * 10; // Base score from token matches

        // Boost for title matches
        const titleLower = episode.title.toLowerCase();
        for (const token of queryTokens) {
            if (titleLower.includes(token)) {
                score += 20;
            }
        }

        // Boost for guest name matches
        const guestLower = (episode.guest || '').toLowerCase();
        for (const token of queryTokens) {
            if (guestLower.includes(token)) {
                score += 15;
            }
        }

        // Boost for tag matches
        const tagsLower = episode.tags.map(t => t.toLowerCase());
        for (const token of queryTokens) {
            if (tagsLower.some(tag => tag.includes(token))) {
                score += 10;
            }
        }

        return score;
    }

    /**
     * Check if episode matches industry filter
     */
    matchesIndustry(episode, industry) {
        if (!industry || !episode.industry_category) return true;
        const categories = episode.industry_category.split(',').map(c => c.trim().toLowerCase());
        return categories.includes(industry.toLowerCase());
    }

    /**
     * Check if episode matches subcategory filter
     */
    matchesSubcategory(episode, subcategory) {
        if (!subcategory || !episode.industry_subcategory) return true;
        const subcategories = episode.industry_subcategory.split(',').map(s => s.trim().toLowerCase());
        return subcategories.includes(subcategory.toLowerCase());
    }

    /**
     * Get all available industry categories
     */
    getIndustries() {
        return this.filters.industries || [];
    }

    /**
     * Get all available industry subcategories
     */
    getSubcategories() {
        return this.filters.subcategories || [];
    }

    /**
     * Get episode by ID
     */
    getEpisodeById(id) {
        return this.episodes.find(ep => ep.id === id);
    }

    /**
     * Get search statistics
     */
    getStats() {
        if (!this.searchIndex) return null;
        return {
            totalEpisodes: this.episodes.length,
            totalTokens: Object.keys(this.index).length,
            industries: this.filters.industries.length,
            subcategories: this.filters.subcategories.length
        };
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EpisodeSearch;
}
