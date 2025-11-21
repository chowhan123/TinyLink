// State
let allLinks = [];
let filteredLinks = [];
let sortColumn = 'createdAt';
let sortDirection = 'desc';

// DOM Elements
const createForm = document.getElementById('createForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
const shortUrlInput = document.getElementById('shortUrlInput');
const copyBtn = document.getElementById('copyBtn');
const searchInput = document.getElementById('searchInput');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const errorState = document.getElementById('errorState');
const tableContainer = document.getElementById('tableContainer');
const linksTableBody = document.getElementById('linksTableBody');
const targetUrlInput = document.getElementById('targetUrl');
const customCodeInput = document.getElementById('customCode');
const urlError = document.getElementById('urlError');
const codeError = document.getElementById('codeError');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  fetchLinks();
  setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
  createForm.addEventListener('submit', handleCreateLink);
  copyBtn.addEventListener('click', handleCopy);
  searchInput.addEventListener('input', handleSearch);
  
  // Inline validation
  targetUrlInput.addEventListener('blur', validateTargetUrl);
  customCodeInput.addEventListener('blur', validateCustomCode);
  
  // Sort functionality
  document.querySelectorAll('.sortable').forEach(header => {
    header.addEventListener('click', () => handleSort(header.dataset.sort));
  });
}

// Validation
function validateTargetUrl() {
  const url = targetUrlInput.value.trim();
  if (!url) return true;
  
  try {
    new URL(url);
    urlError.textContent = '';
    urlError.classList.remove('show');
    targetUrlInput.classList.remove('error');
    return true;
  } catch {
    urlError.textContent = 'Please enter a valid URL (e.g., https://example.com)';
    urlError.classList.add('show');
    targetUrlInput.classList.add('error');
    return false;
  }
}

function validateCustomCode() {
  const code = customCodeInput.value.trim();
  if (!code) {
    codeError.textContent = '';
    codeError.classList.remove('show');
    customCodeInput.classList.remove('error');
    return true;
  }
  
  const codeRegex = /^[A-Za-z0-9]{6,8}$/;
  if (!codeRegex.test(code)) {
    codeError.textContent = 'Code must be 6-8 alphanumeric characters';
    codeError.classList.add('show');
    customCodeInput.classList.add('error');
    return false;
  }
  
  codeError.textContent = '';
  codeError.classList.remove('show');
  customCodeInput.classList.remove('error');
  return true;
}

// Create Link
async function handleCreateLink(e) {
  e.preventDefault();
  
  if (!validateTargetUrl() || !validateCustomCode()) {
    return;
  }
  
  const targetUrl = targetUrlInput.value.trim();
  const customCode = customCodeInput.value.trim();
  
  submitBtn.disabled = true;
  submitBtn.textContent = 'Creating...';
  
  try {
    const response = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        targetUrl, 
        customCode: customCode || undefined 
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 409) {
        codeError.textContent = 'This code already exists. Please choose another.';
        codeError.classList.add('show');
        customCodeInput.classList.add('error');
      } else {
        alert(data.error || 'Failed to create link');
      }
      return;
    }
    
    // Show success
    shortUrlInput.value = data.shortUrl;
    successMessage.classList.remove('hidden');
    createForm.reset();
    
    // Refresh links
    fetchLinks();
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      successMessage.classList.add('hidden');
    }, 5000);
    
  } catch (error) {
    console.error('Error creating link:', error);
    alert('Failed to create link. Please try again.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Create Short Link';
  }
}

// Copy to clipboard
function handleCopy() {
  shortUrlInput.select();
  document.execCommand('copy');
  
  const originalText = copyBtn.textContent;
  copyBtn.textContent = 'Copied!';
  setTimeout(() => {
    copyBtn.textContent = originalText;
  }, 2000);
}

// Fetch Links
async function fetchLinks() {
  loadingState.classList.remove('hidden');
  emptyState.classList.add('hidden');
  errorState.classList.add('hidden');
  tableContainer.classList.add('hidden');
  
  try {
    const response = await fetch('/api/links');
    
    if (!response.ok) {
      throw new Error('Failed to fetch links');
    }
    
    allLinks = await response.json();
    filteredLinks = [...allLinks];
    
    loadingState.classList.add('hidden');
    
    if (allLinks.length === 0) {
      emptyState.classList.remove('hidden');
    } else {
      renderLinks();
      tableContainer.classList.remove('hidden');
    }
    
  } catch (error) {
    console.error('Error fetching links:', error);
    loadingState.classList.add('hidden');
    errorState.classList.remove('hidden');
  }
}

// Search
function handleSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  
  if (!query) {
    filteredLinks = [...allLinks];
  } else {
    filteredLinks = allLinks.filter(link => 
      link.code.toLowerCase().includes(query) ||
      link.targetUrl.toLowerCase().includes(query)
    );
  }
  
  renderLinks();
}

// Sort
function handleSort(column) {
  if (sortColumn === column) {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn = column;
    sortDirection = 'asc';
  }
  
  filteredLinks.sort((a, b) => {
    let aVal = a[column];
    let bVal = b[column];
    
    // Handle null values
    if (!aVal) return 1;
    if (!bVal) return -1;
    
    // Convert to comparable values
    if (column === 'totalClicks') {
      aVal = parseInt(aVal);
      bVal = parseInt(bVal);
    } else if (column === 'lastClicked' || column === 'createdAt') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    } else {
      aVal = aVal.toString().toLowerCase();
      bVal = bVal.toString().toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
  
  // Update sort indicators
  document.querySelectorAll('.sortable').forEach(header => {
    header.classList.remove('sort-asc', 'sort-desc');
    if (header.dataset.sort === column) {
      header.classList.add(`sort-${sortDirection}`);
    }
  });
  
  renderLinks();
}

// Render Links
function renderLinks() {
  linksTableBody.innerHTML = '';
  
  if (filteredLinks.length === 0) {
    linksTableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 2rem; color: var(--gray-600);">
          No links found
        </td>
      </tr>
    `;
    return;
  }
  
  filteredLinks.forEach(link => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="code-cell">${escapeHtml(link.code)}</td>
      <td class="url-cell" title="${escapeHtml(link.targetUrl)}">
        ${escapeHtml(link.targetUrl)}
      </td>
      <td class="clicks-cell">${link.totalClicks}</td>
      <td class="date-cell">${formatDate(link.lastClicked)}</td>
      <td class="actions-cell">
        <button class="action-btn view" onclick="viewStats('${link.code}')">
          View Stats
        </button>
        <button class="action-btn delete" onclick="deleteLink('${link.code}')">
          Delete
        </button>
      </td>
    `;
    linksTableBody.appendChild(row);
  });
}

// View Stats
function viewStats(code) {
  window.location.href = `/code/${code}`;
}

// Delete Link
async function deleteLink(code) {
  if (!confirm(`Are you sure you want to delete the link "${code}"? This action cannot be undone.`)) {
    return;
  }
  
  try {
    const response = await fetch(`/api/links/${code}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete link');
    }
    
    // Refresh links
    fetchLinks();
    
  } catch (error) {
    console.error('Error deleting link:', error);
    alert('Failed to delete link. Please try again.');
  }
}

// Utilities
function formatDate(dateString) {
  if (!dateString) return 'Never';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}