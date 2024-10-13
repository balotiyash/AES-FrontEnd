/** 
 * File: main.js
 * Author: Yash Balotiya
 * Description: // TODO
 * Created on: 13/10/2024
 * Last Modified: 13/10/2024
*/
import { IP, PORT } from './config.js';
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


window.onload = async () => {
    const session = window.localStorage.getItem("token");
    if (session) {
        try {
            // Await the result of fetchUserData
            let data = await fetchUserData(session);
            console.log('Data:', data);

            if (!data) {
                console.log('User not authenticated');
                document.getElementById("loginBtn").style.display = "inline";
                document.getElementById("dropDownBtn").style.display = "none";
            } else {
                document.getElementById("loginBtn").style.display = "none";
                document.getElementById("dropDownBtn").style.display = "inline";
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            console.log('User not authenticated due to an error');
            document.getElementById("loginBtn").style.display = "inline";
            document.getElementById("dropDownBtn").style.display = "none";
        }
    } else {
        document.getElementById("loginBtn").style.display = "inline";
        document.getElementById("dropDownBtn").style.display = "none";
        console.log('No token found');
    }
};


async function fetchUserData(token) {
    try {
        const response = await fetch(`http://${IP}:${PORT}/public/authenticate`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Authentication failed');
        }

        const data = await response.json();
        console.log('User data:', data);
        return data.status;
    } catch (error) {
        console.error('Error during authentication:', error);
        throw error;
    }
}


document.getElementById("loginBtn").addEventListener("click", () => {
    window.location.href = '/shared/view/loginPage.html';
});

document.getElementById("logoutBtn").addEventListener("click", () => {
    console.log('Logging out...');
    window.localStorage.removeItem("token");
    window.location.reload();
});