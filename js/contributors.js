// GitHub Repository Configuration
const REPO_OWNER = 'sayeeg-11';
const REPO_NAME = 'Pixel_Phantoms';
const API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

// State for Pagination
let allContributors = [];
let currentPage = 1;
const itemsPerPage = 8;

document.addEventListener('DOMContentLoaded', () => {
    fetchRepoStats();
    fetchContributors();
    fetchRecentActivity();
});

// 1. Fetch Basic Repo Stats
async function fetchRepoStats() {
    try {
        const response = await fetch(API_BASE);
        const data = await response.json();

        document.getElementById('total-stars').textContent = data.stargazers_count;
        document.getElementById('total-forks').textContent = data.forks_count;
    } catch (error) {
        console.error('Error fetching repo stats:', error);
    }
}

// 2. Fetch Contributors & Identify Lead
async function fetchContributors() {
    try {
        const response = await fetch(`${API_BASE}/contributors?per_page=100`);
        const data = await response.json();
        
        const leadAvatar = document.getElementById('lead-avatar');
        
        // Update Total Contributors Count
        document.getElementById('total-contributors').textContent = data.length;

        // Calculate Stats & Find Lead
        let totalCommits = 0;
        data.forEach(contributor => {
            totalCommits += contributor.contributions;
            
            if(contributor.login.toLowerCase() === REPO_OWNER.toLowerCase()) {
                if(leadAvatar) leadAvatar.src = contributor.avatar_url;
            }
        });

        document.getElementById('total-commits').textContent = totalCommits;

        // Filter out Lead for Grid
        allContributors = data.filter(contributor => 
            contributor.login.toLowerCase() !== REPO_OWNER.toLowerCase()
        );

        // Initialize Grid
        renderContributors(1);

    } catch (error) {
        console.error('Error fetching contributors:', error);
        document.getElementById('contributors-grid').innerHTML = '<p>Failed to load contributors.</p>';
    }
}

// Helper: Get Badge AND Card Tier
function getBadge(commits) {
    if (commits >= 50) {
        return { text: 'Gold 🏆', class: 'badge-gold', tier: 'tier-gold', label: 'Gold League' };
    } else if (commits >= 21) {
        return { text: 'Silver 🥈', class: 'badge-silver', tier: 'tier-silver', label: 'Silver League' };
    } else if (commits >= 10) {
        return { text: 'Bronze 🥉', class: 'badge-bronze', tier: 'tier-bronze', label: 'Bronze League' };
    } else {
        return { text: 'Contributor 🚀', class: 'badge-contributor', tier: 'tier-contributor', label: 'Contributor' };
    }
}

// 3. Render Grid with Click Event
function renderContributors(page) {
    const grid = document.getElementById('contributors-grid');
    grid.innerHTML = '';

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = allContributors.slice(start, end);

    if (paginatedItems.length === 0) {
        grid.innerHTML = '<p>No contributors found.</p>';
        return;
    }

    paginatedItems.forEach(contributor => {
        const badgeData = getBadge(contributor.contributions);

        const card = document.createElement('div');
        card.className = `contributor-card ${badgeData.tier}`;
        
        // Attach Click Event to Open Modal
        card.onclick = () => openModal(contributor, badgeData);

        card.innerHTML = `
            <img src="${contributor.avatar_url}" alt="${contributor.login}">
            <span class="cont-name">${contributor.login}</span>
            <span class="cont-commits-badge ${badgeData.class}">
                ${badgeData.text} (${contributor.contributions})
            </span>
        `;
        grid.appendChild(card);
    });

    renderPaginationControls(page);
}

function renderPaginationControls(page) {
    const container = document.getElementById('pagination-controls');
    const totalPages = Math.ceil(allContributors.length / itemsPerPage);

    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = `
        <button class="pagination-btn" ${page === 1 ? 'disabled' : ''} onclick="changePage(${page - 1})">
            <i class="fas fa-chevron-left"></i> Prev
        </button>
        <span class="page-info">Page ${page} of ${totalPages}</span>
        <button class="pagination-btn" ${page === totalPages ? 'disabled' : ''} onclick="changePage(${page + 1})">
            Next <i class="fas fa-chevron-right"></i>
        </button>
    `;
}

window.changePage = function(newPage) {
    currentPage = newPage;
    renderContributors(newPage);
};

// 4. MODAL LOGIC
function openModal(contributor, badgeData) {
    const modal = document.getElementById('contributor-modal');
    
    // Populate Data
    document.getElementById('modal-avatar').src = contributor.avatar_url;
    document.getElementById('modal-name').textContent = contributor.login;
    document.getElementById('modal-tier-text').textContent = badgeData.label;
    document.getElementById('modal-score').textContent = contributor.contributions;
    document.getElementById('modal-league').textContent = badgeData.text.split(' ')[0]; // e.g. "Gold"
    
    // Construct Links
    const prLink = `https://github.com/${REPO_OWNER}/${REPO_NAME}/pulls?q=is%3Apr+author%3A${contributor.login}`;
    document.getElementById('modal-pr-link').href = prLink;
    document.getElementById('modal-profile-link').href = contributor.html_url;

    // Show Modal
    modal.classList.add('active');
}

window.closeModal = function() {
    document.getElementById('contributor-modal').classList.remove('active');
}

// Close on outside click
document.getElementById('contributor-modal').addEventListener('click', (e) => {
    if(e.target.id === 'contributor-modal') closeModal();
});

// 5. Recent Activity
async function fetchRecentActivity() {
    try {
        const response = await fetch(`${API_BASE}/commits?per_page=10`);
        const commits = await response.json();
        
        const activityList = document.getElementById('activity-list');
        activityList.innerHTML = '';

        commits.forEach(item => {
            const date = new Date(item.commit.author.date).toLocaleDateString();
            const message = item.commit.message;
            const author = item.commit.author.name;

            const row = document.createElement('div');
            row.className = 'activity-item';
            row.innerHTML = `
                <div class="activity-marker"></div>
                <div class="commit-msg">
                    <span style="color: var(--accent-color)">${author}</span>: ${message}
                </div>
                <div class="commit-date">${date}</div>
            `;
            activityList.appendChild(row);
        });

    } catch (error) {
        console.error('Error fetching activity:', error);
    }
}