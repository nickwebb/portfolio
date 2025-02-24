// Function to generate random color
function randomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

// Function to generate a neon-like color (bright and saturated)
function randomNeonColor() {
    const hue = Math.random() * 360;
    return `hsl(${hue}, 100%, 65%)`;
}

// Function to set random color scheme
function setRandomColorScheme() {
    const root = document.documentElement;
    
    // Generate main colors
    const primary = randomNeonColor();
    const secondary = randomNeonColor();
    const neonPink = randomNeonColor();
    const neonBlue = randomNeonColor();
    
    // Set the CSS variables
    root.style.setProperty('--primary', primary);
    root.style.setProperty('--secondary', secondary);
    root.style.setProperty('--neon-pink', neonPink);
    root.style.setProperty('--neon-blue', neonBlue);
}

// Set random colors when page loads
window.addEventListener('load', setRandomColorScheme);

// Visitor counter
let visitorCount = Math.floor(Math.random() * 100000) + 50000;
window.onload = function() {
    document.getElementById('visitor-count').textContent = visitorCount.toString().padStart(8, '0');
} 