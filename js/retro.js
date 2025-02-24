// Function to toggle 90s mode
function toggle90sMode() {
    const body = document.body;
    body.classList.toggle('nineties-mode');
    
    // Remove any pre-existing retro gifs and containers
    document.querySelectorAll('.nineties-gif, .nineties-gif-container').forEach(el => el.remove());
    
    // Toggle the "90s mode ACTIVATED" matrix banner in the header
    const matrixBanner = document.getElementById('matrix-banner');
    if (body.classList.contains('nineties-mode')) {
        matrixBanner.style.display = 'block';
    } else {
        matrixBanner.style.display = 'none';
    }
}

// Function to update visibility of the retro section based on 90s mode
(function(){
    function updateRetroVisibility() {
        var retroSection = document.querySelector('.retro-section');
        if (document.body.classList.contains('nineties-mode')) {
            retroSection.style.display = 'block';
        } else {
            retroSection.style.display = 'none';
        }
    }
    
    // Initial check on page load
    updateRetroVisibility();
    
    // Observe changes to the body's class attributes to handle toggling
    var observer = new MutationObserver(updateRetroVisibility);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
})(); 