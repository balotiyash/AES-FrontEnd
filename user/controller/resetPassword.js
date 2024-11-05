/** 
 * File: user/controller/resetPassword.js
 * Author: Yash Balotiya
 * Description: This page contains all the js code for the Reset Password page. It contains a function to reset password.
 * Created on: 28/10/2024
 * Last Modified: 05/11/2024
*/

import { IP, PORT } from '../../config.js';

const emailId = window.localStorage.getItem("email");
document.getElementById("emailTxt").value = emailId; // Fill email field with the stored email ID

// Create and display the loading indicator
function showLoadingIndicator() {
    const image = document.createElement("img");
    image.src = "../../assets/gifs/Loading.gif"; // Replace with the actual path to your image
    image.classList.add("loading-image");
    document.getElementById("signinBtn").innerHTML = ""; // Clear existing content
    document.getElementById("signinBtn").appendChild(image);
    document.getElementById("signinBtn").disabled = true;
    return image;
}

// Hide the loading indicator and reset button text
function hideLoadingIndicator(image, success = false) {
    document.getElementById("signinBtn").removeChild(image);
    document.getElementById("signinBtn").textContent = success ? "Reset Password" : "Resend";
    document.getElementById("signinBtn").disabled = false;
}

// Validate password fields
function validatePasswords(pass1, pass2) {
    // Password match validation
    if (pass1 !== pass2) {
        alert("Confirm Password does not match the New Password.");
        return false;
    }

    // Password strength check using regex (at least 8 characters, one uppercase, one lowercase, one digit, one special character)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

    if (!passwordRegex.test(pass1)) {
        alert("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
        return false;
    }

    return true;
}

// Handle password reset logic
document.getElementById("signinBtn").addEventListener("click", async () => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const token = url.searchParams.get('token'); // Get token from URL

    // Check if token exists in the URL
    if (!token) {
        alert("Invalid or expired token.");
        window.location.href = "../../shared/view/loginPage.html"; // Redirect if token is missing
        return;
    }

    const pass1 = document.getElementById("password").value;
    const pass2 = document.getElementById("password2").value;

    // Validate passwords
    if (!validatePasswords(pass1, pass2)) return;

    // Show loading indicator
    const image = showLoadingIndicator();

    try {
        // Send password reset request
        const response = await fetch(`http://${IP}:${PORT}/user/password-reset`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${token}`
            },
            body: new URLSearchParams({ password: pass1 })
        });

        // Handle server response
        if (!response.ok) {
            throw new Error('Failed to Reset Password');
        }

        // Hide loading and show success message
        hideLoadingIndicator(image, true);
        alert("Password Changed Successfully.");
        // After password reset success
        window.localStorage.setItem('passwordResetComplete', 'true');

        // Redirect to the login page after success
        window.location.href = "../../shared/view/loginPage.html";
    } catch (error) {
        // Handle error during password reset
        console.error('Error during Resetting Password:', error);
        hideLoadingIndicator(image, false);
        alert("An error occurred while resetting your password. Please try again.");
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

// Check if password has already been reset
if (window.localStorage.getItem('passwordResetComplete') === 'true') {
    // If password has already been reset, redirect to login page or dashboard
    alert("Your password has already been reset. Please login.");
    
    // Clear flag after successful reset
    window.localStorage.removeItem('passwordResetComplete');

    window.location.href = "../../shared/view/loginPage.html";  // Redirect to the login page or another page
}

window.onload = () => {
    // Password show / hide
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("passwordCbk");

    togglePassword.checked = false

    togglePassword.addEventListener("click", () => {
        // Toggle the type attribute
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
    });
}