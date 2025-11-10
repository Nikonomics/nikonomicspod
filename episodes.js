// Episodes Page JavaScript
let allEpisodes = [];
let filteredEpisodes = [];
let currentIndustry = '';
let currentSubcategory = '';
let currentGuest = '';
let currentDateFrom = '';
let currentDateTo = '';
let currentMaxDuration = 150; // minutes
let currentHasVideo = false;
let searchEngine = null;

// Load episodes data and initialize search
async function loadEpisodes() {
    try {
        // Initialize search engine
        searchEngine = new EpisodeSearch();
        await searchEngine.loadIndex('resources/episodes/search-index.json');

        // Get all episodes from search index
        allEpisodes = searchEngine.episodes;
        filteredEpisodes = allEpisodes;

        console.log(`✓ Loaded ${allEpisodes.length} episodes with search`);

        populateFilters();
        updateResultsCount();
        renderEpisodes();

    } catch (error) {
        console.error('Error loading episodes:', error);
        document.getElementById('episodes-grid').innerHTML = `
            <div class="no-results">
                <h3>Error loading episodes</h3>
                <p>Please make sure search index is available.</p>
            </div>
        `;
    }
}

// Populate industry, subcategory, and guest filters with counts
function populateFilters() {
    if (!searchEngine) return;

    const industries = searchEngine.getIndustries();
    const subcategories = searchEngine.getSubcategories();

    // Count episodes per industry
    const industryCounts = {};
    allEpisodes.forEach(ep => {
        const industry = ep.industry_category || ep['Industry Category'] || '';
        if (industry && industry !== 'N/A') {
            // Handle comma-separated industries
            industry.split(',').forEach(ind => {
                const trimmed = ind.trim();
                industryCounts[trimmed] = (industryCounts[trimmed] || 0) + 1;
            });
        }
    });

    // Populate industry dropdown with counts
    const industrySelect = document.getElementById('industry-filter');
    industries.forEach(industry => {
        const count = industryCounts[industry] || 0;
        const option = document.createElement('option');
        option.value = industry;
        option.textContent = `${industry} (${count})`;
        industrySelect.appendChild(option);
    });

    // Count episodes per subcategory
    const subcategoryCounts = {};
    allEpisodes.forEach(ep => {
        const subcategory = ep.industry_subcategory || ep['Industry Subcategory'] || '';
        if (subcategory && subcategory !== 'N/A') {
            // Handle comma-separated subcategories
            subcategory.split(',').forEach(sub => {
                const trimmed = sub.trim();
                subcategoryCounts[trimmed] = (subcategoryCounts[trimmed] || 0) + 1;
            });
        }
    });

    // Populate subcategory dropdown with counts
    const subcategorySelect = document.getElementById('subcategory-filter');
    subcategories.forEach(subcategory => {
        const count = subcategoryCounts[subcategory] || 0;
        const option = document.createElement('option');
        option.value = subcategory;
        option.textContent = `${subcategory} (${count})`;
        subcategorySelect.appendChild(option);
    });

    // Count episodes per guest
    const guestCounts = {};
    allEpisodes.forEach(ep => {
        const guest = ep.guest || ep['Guest Name'];
        if (guest && guest !== 'N/A' && guest !== 'Unknown Guest') {
            guestCounts[guest] = (guestCounts[guest] || 0) + 1;
        }
    });

    // Populate guest dropdown with counts
    const guestSelect = document.getElementById('guest-filter');
    const sortedGuests = Object.keys(guestCounts).sort();
    sortedGuests.forEach(guest => {
        const count = guestCounts[guest];
        const option = document.createElement('option');
        option.value = guest;
        option.textContent = `${guest} (${count})`;
        guestSelect.appendChild(option);
    });
}

// Render episode cards
function renderEpisodes() {
    const grid = document.getElementById('episodes-grid');

    if (filteredEpisodes.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <h3>No episodes found</h3>
                <p>Try adjusting your search or filters.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredEpisodes.map(episode => createEpisodeCard(episode)).join('');

    // Add click listeners to cards
    document.querySelectorAll('.episode-card').forEach((card, index) => {
        card.addEventListener('click', () => openModal(filteredEpisodes[index]));
    });
}

// Create episode card HTML
function createEpisodeCard(episode) {
    // Handle both old and new data formats
    const episodeNum = episode.id || episode['Episode #'] || 'N/A';
    const title = episode.title || episode['Episode Title'] || 'Untitled Episode';
    const guest = episode.guest || episode['Guest Name'] || 'Unknown Guest';
    const summary = episode.summary || episode['Episode Summary'] || 'No summary available';
    const date = episode.date || episode['Episode Date'] || '';

    // Build thumbnail path - use episode number for filename (format: 07.jpg, 100.jpg, etc.)
    const thumbnailFilename = `${episodeNum}.jpg`;
    const thumbnail = `resources/episodes/thumbnails/${thumbnailFilename}`;

    return `
        <div class="episode-card" data-episode="${episodeNum}">
            <img src="${thumbnail}" alt="${title}" class="episode-thumbnail" onerror="this.src='resources/episodes/thumbnails/default.jpg'">
            <div class="episode-content">
                <div class="episode-header">
                    <span class="episode-number">Episode ${episodeNum}</span>
                    <p class="episode-guest">${guest}</p>
                </div>
                <h3 class="episode-title">${title}</h3>
                <p class="episode-summary">${summary}</p>
                <div class="episode-meta">
                    <span class="episode-date">${formatDate(date)}</span>
                    <span class="episode-arrow">→</span>
                </div>
            </div>
        </div>
    `;
}

// Open episode detail modal
function openModal(episode) {
    const modal = document.getElementById('episode-modal');
    const modalBody = document.getElementById('modal-body');

    // Get episode data - handle both formats
    const episodeNum = episode.id || episode['Episode #'] || 'N/A';
    const title = episode.title || episode['Episode Title'] || 'Untitled Episode';
    const guest = episode.guest || episode['Guest Name'] || 'Unknown Guest';
    const summary = episode.summary || episode['Episode Summary'] || '';
    const business = episode.business_name || episode['Business Name'] || 'N/A';
    const industry = episode.industry_category || episode['Industry'] || 'N/A';
    const revenue = episode['Revenue'] || 'N/A';
    const date = episode.date || episode['Episode Date'] || '';
    const tags = episode.tags || (episode['Tags'] ? episode['Tags'].split(',').map(t => t.trim()) : []);
    const takeaways = episode['Key Takeaways'] || 'No takeaways available';
    const youtubeUrl = episode.youtube || episode['youtube_url'] || '';
    const spotifyUrl = episode.spotify || episode['spotify_url'] || '';
    const appleUrl = episode.apple || episode['apple_url'] || '';

    // Parse takeaways into list - handle multiple formats
    let takeawaysList = [];

    // Try splitting by numbered format first (1., 2., 3.)
    if (takeaways.match(/\d+\./)) {
        takeawaysList = takeaways
            .split(/\d+\./)
            .filter(t => t.trim().length > 10)
            .map(t => t.trim().replace(/^[-•,]\s*/, ''))
            .slice(0, 3);
    } else {
        // Fallback to bullet points or dashes
        takeawaysList = takeaways
            .split(/[-•]/)
            .filter(t => t.trim().length > 10)
            .map(t => t.trim().replace(/^,\s*/, ''))
            .slice(0, 3);
    }

    // If we still don't have good takeaways, try splitting by commas at sentence boundaries
    if (takeawaysList.length < 3) {
        takeawaysList = takeaways
            .split(/,\s*(?=[A-Z])/)
            .filter(t => t.trim().length > 10)
            .map(t => t.trim())
            .slice(0, 3);
    }

    modalBody.innerHTML = `
        <div class="modal-header">
            <span class="modal-episode-number">Episode ${episodeNum}</span>
            <h2 class="modal-title">${title}</h2>
            <p class="modal-guest">${guest}</p>
            ${summary ? `<p class="modal-summary">${summary}</p>` : ''}

            <div class="modal-meta">
                ${business !== 'N/A' ? `
                    <div class="meta-item">
                        <span class="meta-label">Business</span>
                        <span class="meta-value">${business}</span>
                    </div>
                ` : ''}
                ${industry !== 'N/A' ? `
                    <div class="meta-item">
                        <span class="meta-label">Industry</span>
                        <span class="meta-value">${industry}</span>
                    </div>
                ` : ''}
                ${revenue !== 'N/A' ? `
                    <div class="meta-item">
                        <span class="meta-label">Revenue</span>
                        <span class="meta-value">${revenue}</span>
                    </div>
                ` : ''}
                <div class="meta-item">
                    <span class="meta-label">Date</span>
                    <span class="meta-value">${formatDate(date)}</span>
                </div>
            </div>
        </div>

        ${tags.length > 0 ? `
            <div class="modal-section">
                <h3 class="modal-section-title">Topics</h3>
                <div class="modal-tags">
                    ${tags.map(tag => `<span class="modal-tag">${tag}</span>`).join('')}
                </div>
            </div>
        ` : ''}

        ${takeawaysList.length > 0 ? `
            <div class="modal-section">
                <h3 class="modal-section-title">Top 3 Takeaways</h3>
                <ul class="modal-takeaways">
                    ${takeawaysList.map(takeaway => `<li>${takeaway.trim()}</li>`).join('')}
                </ul>
            </div>
        ` : ''}

        <div class="modal-section">
            <h3 class="modal-section-title">Listen Now</h3>
            <div class="modal-links">
                ${youtubeUrl ? `<a href="${youtubeUrl}" target="_blank" class="platform-link youtube">🎥 Watch on YouTube</a>` : ''}
                ${spotifyUrl ? `<a href="${spotifyUrl}" target="_blank" class="platform-link spotify">🎵 Listen on Spotify</a>` : ''}
                ${appleUrl ? `<a href="${appleUrl}" target="_blank" class="platform-link apple">🎧 Listen on Apple</a>` : ''}
                ${!youtubeUrl && !spotifyUrl && !appleUrl ? '<p style="color: #999;">Episode links coming soon...</p>' : ''}
            </div>
        </div>
    `;

    modal.classList.add('active');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('episode-modal');
    modal.classList.remove('active');
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'Date TBD';

    const date = new Date(dateString);
    if (isNaN(date)) return dateString;

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Search episodes
function searchEpisodes(query) {
    if (!searchEngine) {
        console.warn('Search engine not initialized');
        return;
    }

    const searchTerm = query.trim();

    // Build search options with filters
    const searchOptions = {
        limit: 1000
    };

    if (currentIndustry) {
        searchOptions.industry = currentIndustry;
    }

    if (currentSubcategory) {
        searchOptions.subcategory = currentSubcategory;
    }

    // Use search engine with filters
    if (searchTerm) {
        filteredEpisodes = searchEngine.search(searchTerm, searchOptions);
    } else if (currentIndustry || currentSubcategory) {
        // Apply filters even without search query
        filteredEpisodes = searchEngine.search('', searchOptions);
    } else {
        // No query or filters - show all
        filteredEpisodes = allEpisodes;
    }

    // Apply guest filter
    if (currentGuest) {
        filteredEpisodes = filteredEpisodes.filter(episode => {
            const guest = episode.guest || episode['Guest Name'] || '';
            return guest === currentGuest;
        });
    }

    // Apply date range filter
    if (currentDateFrom || currentDateTo) {
        filteredEpisodes = filteredEpisodes.filter(episode => {
            const episodeDate = episode.date || episode['Episode Date'];
            if (!episodeDate) return false;

            const epDate = new Date(episodeDate);
            if (isNaN(epDate)) return false;

            if (currentDateFrom) {
                const fromDate = new Date(currentDateFrom);
                if (epDate < fromDate) return false;
            }

            if (currentDateTo) {
                const toDate = new Date(currentDateTo);
                if (epDate > toDate) return false;
            }

            return true;
        });
    }

    // Apply duration filter (only if not at max)
    if (currentMaxDuration < 150) {
        filteredEpisodes = filteredEpisodes.filter(episode => {
            const duration = episode.duration || episode['Episode Duration'];
            if (!duration) return true; // Include episodes without duration data

            // Parse duration (format: "XX mins" or "XX minutes")
            const match = duration.match(/(\d+)/);
            if (match) {
                const mins = parseInt(match[1]);
                return mins <= currentMaxDuration;
            }

            return true;
        });
    }

    // Apply video filter
    if (currentHasVideo) {
        filteredEpisodes = filteredEpisodes.filter(episode => {
            const youtubeUrl = episode.youtube || episode['youtube_url'];
            return youtubeUrl && youtubeUrl.trim() !== '';
        });
    }

    updateResultsCount();
    renderEpisodes();
}

// Update results count
function updateResultsCount() {
    const count = filteredEpisodes.length;
    const total = allEpisodes.length;
    const countElement = document.getElementById('results-count');
    const totalElement = document.getElementById('total-episodes');

    if (totalElement) {
        totalElement.textContent = total;
    }

    if (count === total) {
        countElement.textContent = `Showing all ${total} episodes`;
    } else {
        countElement.textContent = `Showing ${count} of ${total} episodes`;
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load episodes
    loadEpisodes();

    // Search input
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        searchEpisodes(e.target.value);
    });

    // Industry filter
    const industryFilter = document.getElementById('industry-filter');
    industryFilter.addEventListener('change', (e) => {
        currentIndustry = e.target.value;
        searchEpisodes(searchInput.value);
    });

    // Subcategory filter
    const subcategoryFilter = document.getElementById('subcategory-filter');
    subcategoryFilter.addEventListener('change', (e) => {
        currentSubcategory = e.target.value;
        searchEpisodes(searchInput.value);
    });

    // Guest filter
    const guestFilter = document.getElementById('guest-filter');
    guestFilter.addEventListener('change', (e) => {
        currentGuest = e.target.value;
        searchEpisodes(searchInput.value);
    });

    // Date from filter
    const dateFromFilter = document.getElementById('date-from-filter');
    dateFromFilter.addEventListener('change', (e) => {
        currentDateFrom = e.target.value;
        searchEpisodes(searchInput.value);
    });

    // Date to filter
    const dateToFilter = document.getElementById('date-to-filter');
    dateToFilter.addEventListener('change', (e) => {
        currentDateTo = e.target.value;
        searchEpisodes(searchInput.value);
    });

    // Duration filter
    const durationFilter = document.getElementById('duration-filter');
    const durationDisplay = document.getElementById('duration-display');
    durationFilter.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        currentMaxDuration = value;

        // Update display text
        if (value >= 150) {
            durationDisplay.textContent = 'Any';
        } else {
            durationDisplay.textContent = `${value} mins`;
        }

        // Update slider gradient to show selected portion
        const percentage = (value / 150) * 100;
        durationFilter.style.background = `linear-gradient(to right, #0098EE ${percentage}%, #E5E7EB ${percentage}%)`;

        searchEpisodes(searchInput.value);
    });

    // Video filter
    const videoFilter = document.getElementById('video-filter');
    videoFilter.addEventListener('change', (e) => {
        currentHasVideo = e.target.checked;
        searchEpisodes(searchInput.value);
    });

    // Reset filters button
    const resetBtn = document.getElementById('reset-filters');
    resetBtn.addEventListener('click', () => {
        // Reset all filter values
        currentIndustry = '';
        currentSubcategory = '';
        currentGuest = '';
        currentDateFrom = '';
        currentDateTo = '';
        currentMaxDuration = 150;
        currentHasVideo = false;

        // Reset all UI elements
        document.getElementById('search-input').value = '';
        document.getElementById('industry-filter').value = '';
        document.getElementById('subcategory-filter').value = '';
        document.getElementById('guest-filter').value = '';
        document.getElementById('date-from-filter').value = '';
        document.getElementById('date-to-filter').value = '';
        document.getElementById('duration-filter').value = 150;
        document.getElementById('duration-display').textContent = 'Any';
        document.getElementById('video-filter').checked = false;

        // Reset slider gradient
        const durationFilter = document.getElementById('duration-filter');
        durationFilter.style.background = 'linear-gradient(to right, #0098EE 100%, #E5E7EB 100%)';

        // Show all episodes
        filteredEpisodes = allEpisodes;
        updateResultsCount();
        renderEpisodes();
    });

    // Modal close
    const modal = document.getElementById('episode-modal');
    const closeBtn = document.querySelector('.modal-close');

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});
