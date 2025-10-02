// This file contains JavaScript code for interactive features of the website.

document.addEventListener('DOMContentLoaded', function() {
    const clickyImage = document.getElementById('clicky-image');

    if (clickyImage) {
        clickyImage.addEventListener('click', function() {
            alert('Image clicked!');
        });
    }
});