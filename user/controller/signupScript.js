/** 
 * File: user/controller/signupScript.js
 * Author: Atharv Mirgal
 * Description: This page contains all the js code for the sign up page. It consists of functions to perform validation on user data and then send values to the backend for reginstration along with email verification.
 * Created on: 12/10/2024
 * Last Modified: 05/11/2024
*/

import { IP, PORT } from '../../config.js';

// Function to capatlize 1 character of string
function capitalizeFirstLetter(str) {
    return str
        .split(' ') // Split the string into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
        .join(' '); // Join the words back together with spaces
}

// Function to send form data for registration to the backend
document.getElementById("signupBtn").addEventListener("click", () => {

    const name = document.getElementById('firstname').value + " " + document.getElementById('lastname').value;
    const fullName = capitalizeFirstLetter(name).trim();  // Assuming this function exists to capitalize first letter of each word
    const email = document.getElementById('email').value.toLowerCase().trim();
    const phone = document.getElementById('phone').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    // Validate Name
    if (!fullName || !/^[a-zA-Z\s]+$/.test(fullName)) {
        alert("Please enter a valid name. It should only contain letters and spaces.");
        return false;
    }

    // Validate Email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }

    // Validate Phone (Indian format)
    const phoneRegex = /^[7-9]{1}[0-9]{9}$/; // Indian phone numbers should start with 7, 8, or 9 and be 10 digits long
    if (!phone || !phoneRegex.test(phone)) {
        alert("Please enter a valid 10-digit Indian phone number starting with 7, 8, or 9.");
        return false;
    }

    // Validate Username
    if (!username || username.length < 4 || username.length > 15 || /[^a-zA-Z0-9_]/.test(username)) {
        alert("Username must be between 4-15 characters long and can only contain letters, numbers, and underscores.");
        return false;
    }
    
    // Validate Password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password || !passwordRegex.test(password)) {
        alert("Password must be at least 8 characters long and contain one uppercase letter, one number, and one special character.");
        return false;
    }

    // Validate Confirm Password
    if (password !== confirmPassword) {
        alert("Password and Confirm Password must match.");
        return false;
    }

    // If all validations pass, create the form data object
    const formData = {
        name: fullName, // Capitalized name
        email: email,
        password: password,
        phone: phone,
        username: username.toLowerCase(), // Convert username to lowercase
        roles: ['USER']
    };

    fetch(`http://${IP}:${PORT}/public/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            if (data) {
                alert('Signup successful! Please login to continue.');
                window.location.href = '../../shared/view/loginPage.html';
            } else {
                alert('Signup failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Email not verified. Please check your inbox to verify your email, or it may already be in use.");
        });
});

// Function to send verification email
document.getElementById("verify-btn").addEventListener("click", async () => {
    const emailId = document.getElementById("email").value.toLowerCase().trim();

    if (!emailId) {
        alert("Please enter a valid E-mail ID!");
        return;
    }

    window.localStorage.setItem("email", emailId);

    const formData = new FormData();
    formData.append('email', emailId);

    // Create and display the loading image
    const image = document.createElement("img");
    image.src = "../../assets/gifs/Loading.gif"; // Replace with the actual path to your image
    image.classList.add("loading-image"); // Add a CSS class for styling
    document.getElementById("verify-btn").innerHTML = ""; // Clear existing content
    document.getElementById("verify-btn").appendChild(image);
    document.getElementById("verify-btn").disabled = true;

    try {
        const response = await fetch(`http://${IP}:${PORT}/public/verification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ email: emailId })
        });

        if (!response.ok) {
            throw new Error('HTTP response was not OK');
        }

        document.getElementById("verify-btn").removeChild(image);
        document.getElementById("verify-btn").style.backgroundColor = "#d3d3d3";
        document.getElementById("verify-btn").textContent = "Sent";
        
        setTimeout(() => {
            document.getElementById("verify-btn").textContent = "Resend";
            document.getElementById("verify-btn").disabled = false;
        }, 2000);
    } catch (error) {
        console.error('Error during sending email:', error);
    }
});

// CSS to style the loading image gif animation
const style = document.createElement('style');
style.textContent = `
    .loading-image {
        width: 24px; /* Adjust size as needed */
        height: 24px; /* Adjust size as needed */
        display: block;
        margin: auto; /* Center the image */
    }
`;
document.head.appendChild(style);