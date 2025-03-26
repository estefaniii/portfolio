// This file is imported in the footer to ensure the language toggle works correctly
// It's separated from main.js to avoid circular redirects

// Get the language toggle element
const languageToggle = document.getElementById('language-toggle');

// Check the current page
const isEnglishPage = window.location.pathname.includes('english.html');

// Set the toggle state based on the current page
languageToggle.checked = isEnglishPage;

// Update the localStorage to match the current page
localStorage.setItem('selected-language', isEnglishPage ? 'en' : 'es');
