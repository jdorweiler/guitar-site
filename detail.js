// Image gallery functionality
const thumbnails = document.querySelectorAll('.thumbnail');
const mainImage = document.querySelector('.main-image');

thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
        // Remove active class from all thumbnails
        thumbnails.forEach(t => t.classList.remove('active'));

        // Add active class to clicked thumbnail
        thumbnail.classList.add('active');

        // Update main image (when real images are added)
        // const imgSrc = thumbnail.querySelector('img').src;
        // mainImage.querySelector('img').src = imgSrc;
    });
});

// Keyboard navigation for gallery
document.addEventListener('keydown', (e) => {
    const activeThumbnail = document.querySelector('.thumbnail.active');
    const currentIndex = Array.from(thumbnails).indexOf(activeThumbnail);

    if (e.key === 'ArrowRight' && currentIndex < thumbnails.length - 1) {
        thumbnails[currentIndex + 1].click();
    } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        thumbnails[currentIndex - 1].click();
    }
});
