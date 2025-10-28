// Episodes Page JavaScript
let allEpisodes = [];
let filteredEpisodes = [];
let currentTag = 'all';

// Load episodes data
async function loadEpisodes() {
    try {
        const response = await fetch('scripts/episodes_batch.json');
        allEpisodes = await response.json();
        filteredEpisodes = allEpisodes;

        updateResultsCount();
        renderEpisodes();

    } catch (error) {
        console.error('Error loading episodes:', error);
        document.getElementById('episodes-grid').innerHTML = `
            <div class="no-results">
                <h3>Error loading episodes</h3>
                <p>Please make sure episodes_batch.json exists in the scripts folder.</p>
            </div>
        `;
    }
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
    const episodeNum = episode['Episode #'] || 'N/A';
    const title = episode['Episode Title'] || 'Untitled Episode';
    const guest = episode['Guest Name'] || 'Unknown Guest';
    const summary = episode['Episode Summary'] || 'No summary available';
    const date = episode['Episode Date'] || '';

    // Use default thumbnail (cover.png) if none exists
    const thumbnail = episode['thumbnail_path']
        ? episode['thumbnail_path'].replace('../', '')
        : 'resources/episodes/thumbnails/default.jpg';

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

    // Get episode data
    const episodeNum = episode['Episode #'] || 'N/A';
    const title = episode['Episode Title'] || 'Untitled Episode';
    const guest = episode['Guest Name'] || 'Unknown Guest';
    const business = episode['Business Name'] || 'N/A';
    const industry = episode['Industry'] || 'N/A';
    const revenue = episode['Revenue'] || 'N/A';
    const date = episode['Episode Date'] || '';
    const tags = episode['Tags'] ? episode['Tags'].split(',').map(t => t.trim()) : [];
    const takeaways = episode['Key Takeaways'] || 'No takeaways available';
    const youtubeUrl = episode['youtube_url'] || '';
    const spotifyUrl = episode['spotify_url'] || '';
    const appleUrl = episode['apple_url'] || '';

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
    const searchTerm = query.toLowerCase();

    filteredEpisodes = allEpisodes.filter(episode => {
        const searchableText = [
            episode['Episode Title'],
            episode['Guest Name'],
            episode['Business Name'],
            episode['Topics'],
            episode['Tags'],
            episode['Industry'],
            episode['Episode Summary']
        ].join(' ').toLowerCase();

        return searchableText.includes(searchTerm);
    });

    // Apply tag filter if active
    if (currentTag !== 'all') {
        filteredEpisodes = filteredEpisodes.filter(episode => {
            const tags = episode['Tags'] ? episode['Tags'].toLowerCase() : '';
            return tags.includes(currentTag);
        });
    }

    updateResultsCount();
    renderEpisodes();
}

// Filter by tag
function filterByTag(tag) {
    currentTag = tag.toLowerCase();

    if (tag === 'all') {
        filteredEpisodes = allEpisodes;
    } else {
        filteredEpisodes = allEpisodes.filter(episode => {
            const tags = episode['Tags'] ? episode['Tags'].toLowerCase() : '';
            return tags.includes(currentTag);
        });
    }

    // Reapply search if active
    const searchInput = document.getElementById('search-input');
    if (searchInput.value.trim()) {
        searchEpisodes(searchInput.value);
    } else {
        updateResultsCount();
        renderEpisodes();
    }
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

    // Filter tags
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.addEventListener('click', (e) => {
            // Update active state
            document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');

            // Filter episodes
            const tagValue = e.target.dataset.tag;
            filterByTag(tagValue);
        });
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
