/** 
 * File: user/controller/forgotPassword.js
 * Author: Yash Balotiya
 * Description: This page contains all the js code for the Forgot Password page. It contains function to send reset link in mail
 * Created on: 28/10/2024
 * Last Modified: 05/11/2024
*/

import { IP, PORT } from '../../config.js';

// Send email to reset password
document.getElementById("signinBtn").addEventListener("click", async () => {
    const emailId = document.getElementById("emailTxt").value.toLowerCase().trim();

    // Validate email input
    if (!emailId) {
        alert("Please enter a valid E-mail ID.");
        return;
    }

    window.localStorage.setItem("email", emailId);

    const formData = new FormData();
    formData.append('email', emailId);

    // Create and display the loading image
    const image = document.createElement("img");
    image.src = "../../assets/gifs/Loading.gif"; // Replace with the actual path to your image
    image.classList.add("loading-image"); // Add a CSS class for styling
    document.getElementById("signinBtn").innerHTML = ""; // Clear existing content
    document.getElementById("signinBtn").appendChild(image);
    document.getElementById("signinBtn").disabled = true;
    
    try {
        // Send request to the server
        const response = await fetch(`http://${IP}:${PORT}/public/password-reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ 'email': emailId })
        });

        // Check if the response is successful
        if (response.ok) {
            document.getElementById("signinBtn").removeChild(image);
            document.getElementById("signinBtn").textContent = "Sent";
            alert("Email sent successfully! Please check your inbox to reset your password.");

            // Reset button text after a short delay
            setTimeout(() => {
                document.getElementById("signinBtn").textContent = "Resend";
                document.getElementById("signinBtn").disabled = false;
            }, 2000);
        } else {
            throw new Error('Email Not Sent');
        }
    } catch (error) {
        // Handle errors
        alert("An error occurred. Please check if the email is registered.");
        document.getElementById("signinBtn").removeChild(image);
        document.getElementById("signinBtn").textContent = "Resend";
        document.getElementById("signinBtn").disabled = false;
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
