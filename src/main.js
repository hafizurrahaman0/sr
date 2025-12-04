import './style.css';
import { projects } from './data.js';

// --- STATE MANAGEMENT ---
const state = {
    currentView: 'home',
    filter: 'All',
    sort: 'newest',
    visibleCount: 10,
    filteredProjects: []
};

// --- ROUTING ---
window.navigateTo = function (viewId) {
    // Update State
    state.currentView = viewId;

    // Update UI Views
    document.querySelectorAll('.view-section').forEach(el => {
        el.classList.remove('active');
        if (el.id === viewId) el.classList.add('active');
    });

    // Update Nav Active State (Desktop)
    document.querySelectorAll('.nav-link').forEach(el => {
        el.classList.remove('text-accent');
        el.classList.add('text-gray-600');
        if (el.getAttribute('href') === '#' + viewId) {
            el.classList.remove('text-gray-600');
            el.classList.add('text-accent');
        }
    });

    // Scroll to top
    window.scrollTo(0, 0);
}

// --- MOBILE MENU ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

window.toggleMobileMenu = function () {
    mobileMenu.classList.toggle('hidden');
}

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', window.toggleMobileMenu);
}

// --- GALLERY LOGIC ---
const galleryGrid = document.getElementById('gallery-grid');
const loadMoreBtn = document.getElementById('load-more-btn');
const filterContainer = document.getElementById('filter-container');

function initGallery() {
    if (!galleryGrid) return;
    processGalleryData();
    renderGallery();
}

function processGalleryData() {
    // 1. Filter
    let result = projects;
    if (state.filter !== 'All') {
        result = result.filter(p => p.type === state.filter);
    }

    // 2. Sort
    result.sort((a, b) => {
        if (state.sort === 'newest') return new Date(b.date) - new Date(a.date);
        return new Date(a.date) - new Date(b.date);
    });

    state.filteredProjects = result;
}

function renderGallery() {
    const displayItems = state.filteredProjects.slice(0, state.visibleCount);

    galleryGrid.innerHTML = displayItems.map(item => `
        <div class="group relative overflow-hidden shadow-lg bg-white fade-in">
            <div class="aspect-w-3 aspect-h-2 overflow-hidden">
                <img src="${item.imageUrl}" alt="${item.title}" class="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700">
            </div>
            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-4">
                <span class="text-accent text-xs font-bold uppercase tracking-wider mb-2">${item.type}</span>
                <h3 class="text-white font-serif text-xl font-bold">${item.title}</h3>
                <p class="text-gray-300 text-sm mt-2">${item.date}</p>
            </div>
        </div>
    `).join('');

    // Handle Load More Button Visibility
    if (state.visibleCount >= state.filteredProjects.length) {
        loadMoreBtn.classList.add('hidden');
    } else {
        loadMoreBtn.classList.remove('hidden');
    }
}

window.filterGallery = function (type) {
    state.filter = type;
    state.visibleCount = 10; // Reset pagination

    // Update Button Styles
    const buttons = filterContainer.querySelectorAll('button');
    buttons.forEach(btn => {
        if (btn.dataset.type === type) {
            btn.classList.remove('bg-white', 'text-gray-600', 'hover:bg-gray-100');
            btn.classList.add('bg-primary', 'text-white', 'shadow-md');
        } else {
            btn.classList.add('bg-white', 'text-gray-600', 'hover:bg-gray-100');
            btn.classList.remove('bg-primary', 'text-white', 'shadow-md');
        }
    });

    processGalleryData();
    renderGallery();
}

window.sortGallery = function (sortValue) {
    state.sort = sortValue;
    processGalleryData();
    renderGallery();
}

window.loadMore = function () {
    state.visibleCount += 10;
    renderGallery();
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Handle initial hash or default to home
    const hash = window.location.hash.substring(1);
    if (['home', 'about', 'gallery', 'contact'].includes(hash)) {
        window.navigateTo(hash);
    } else {
        window.navigateTo('home');
    }

    initGallery();
});
