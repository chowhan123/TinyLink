// Get code from URL
const pathParts = window.location.pathname.split('/');
const code = pathParts[pathParts.length - 1];

// DOM Elements
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const statsContainer = document.getElementById('statsContainer');
const codeBadge = document.getElementById('codeBadge');
const shortUrlInput = document.getElementById('shortUrlInput');
const targetUrlInput = document.getElementById('targetUrlInput');
const copyShortBtn = document.getElementById('copyShortBtn');
const copyTargetBtn = document.getElementById('copyTargetBtn');
const visitLink = document.getElementById('visitLink');
const totalClicks = document.getElementById('totalClicks');
const lastClicked = document.getElementById('lastClicked');
const createdAt = document.getElementById('createdAt');
const deleteBtn = document.getElementById('deleteBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  fetchStats();
  setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
  copyShortBtn.addEventListener('click', () => copyToClipboard(shortUrlInput));
  copyTargetBtn.addEventListener('click', () => copyToClipboard(targetUrlInput));
  deleteBtn.addEventListener('click', handleDelete);
}

// Fetch Stats
async function fetchStats() {
  try {
    const response = await fetch(`/api/links/${code}`);
    
    if (!response.ok) {
      throw new Error('Link not found');
    }
    
    const link = await response.json();
    
    // Hide loading, show stats
    loadingState.classList.add('hidden');
    statsContainer.classList.remove('hidden');
    
    // Populate data
    codeBadge.textContent = link.code;
    shortUrlInput.value = link.shortUrl;
    targetUrlInput.value = link.targetUrl;
    visitLink.href = link.shortUrl;
    totalClicks.textContent = link.totalClicks.toLocaleString();
    lastClicked.textContent = formatDate(link.lastClicked);
    createdAt.textContent = formatDate(link.createdAt);
    
  } catch (error) {
    console.error('Error fetching stats:', error);
    loadingState.classList.add('hidden');
    errorState.classList.remove('hidden');
  }
}

// Copy to Clipboard
function copyToClipboard(input) {
  input.select();
  document.execCommand('copy');
  
  // Visual feedback
  const button = event.target;
  const originalText = button.textContent;
  button.textContent = '✓';
  button.style.background = 'var(--success)';
  button.style.color = 'white';
  
  setTimeout(() => {
    button.textContent = originalText;
    button.style.background = '';
    button.style.color = '';
  }, 2000);
}

// Delete Link
async function handleDelete() {
  if (!confirm(`Are you sure you want to delete the link "${code}"? This action cannot be undone.`)) {
    return;
  }
  
  deleteBtn.disabled = true;
  deleteBtn.textContent = 'Deleting...';
  
  try {
    const response = await fetch(`/api/links/${code}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete link');
    }
    
    // Redirect to dashboard
    alert('Link deleted successfully');
    window.location.href = '/';
    
  } catch (error) {
    console.error('Error deleting link:', error);
    alert('Failed to delete link. Please try again.');
    deleteBtn.disabled = false;
    deleteBtn.textContent = 'Delete Link';
  }
}

// Format Date
function formatDate(dateString) {
  if (!dateString) return 'Never';
  
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}