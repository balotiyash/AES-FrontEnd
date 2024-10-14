/** 
 * File: main.js
 * Author: Yash Balotiya
 * Description: This file contains JS code for the home page (index).
 * Created on: 13/10/2024
 * Last Modified: 14/10/2024
*/

// Image Auto Slider
const images = document.querySelectorAll('.image-slider img');
let currentIndex = 0;

function showNextImage() {
    // Remove active class from the current image
    images[currentIndex].classList.remove('active');

    // Update the index to the next image
    currentIndex = (currentIndex + 1) % images.length;

    // Add active class to the new image
    images[currentIndex].classList.add('active');
}

// Initialize the first image as active
images[currentIndex].classList.add('active');

// Change image every 3 seconds (3000 milliseconds)
setInterval(showNextImage, 3000);


// Function to move review slides
currentIndex = 0;

function moveSlide(direction) {
    const testimonials = document.querySelectorAll('.review-div');
    const totalTestimonials = testimonials.length;

    // Update index based on direction
    currentIndex += direction;

    // Wrap around if at the ends
    if (currentIndex < 0) {
        currentIndex = totalTestimonials - 1; // Loop back to the last item
    } else if (currentIndex >= totalTestimonials) {
        currentIndex = 0; // Loop back to the first item
    }

    // Calculate translation
    const offset = currentIndex * -35; // 35% is the width of each review-div
    document.querySelector('.testimonials-div').style.transform = `translateX(${offset}%)`;
}

// Login btn navigation
document.getElementById("loginBtn").addEventListener("click", () => {
    window.location.href = './shared/view/loginPage.html';
});

document.getElementById("logoutBtn").addEventListener("click", () => {
    console.log('Logging out...');
    window.localStorage.removeItem("token");
    window.location.reload();
});