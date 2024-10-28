/** 
 * File: user/controller/signupScript.js
 * Author: Atharv Mirgal
 * Description: This page contains all the js code for the sign up page
 * Created on: 12/10/2024
 * Last Modified: 28/10/2024
*/

import { IP, PORT } from '../../config.js';

// document.getElementById("sign-up-form").addEventListener("submit", () => {
document.getElementById("signupBtn").addEventListener("click", () => {
    const name = document.getElementById('firstname').value + " " + document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value;
    const username = document.getElementById('username').value;

    const formData = {
        name: name.toLowerCase(),
        email: email.toLowerCase(),
        password: password,
        phone: phone,
        username: username.toLowerCase(),
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
            // else if (response.status === 401) {
            //     alert("Email Not Verified. Please verify it before Signing Up.");
            // }
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
            alert("Email Not Verified. Please verify Email before Signing Up.");
        });
});

// Send email
document.getElementById("verify-btn").addEventListener("click", async () => {
    const emailId = document.getElementById("email").value;
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
            throw new Error('Email Not Sent');
        }

        // setTimeout(() => {
            document.getElementById("verify-btn").removeChild(image);
            document.getElementById("verify-btn").style.backgroundColor = "#d3d3d3";
            document.getElementById("verify-btn").textContent = "Resend";
            document.getElementById("verify-btn").disabled = false;
        // }, 1000 * 30);

    } catch (error) {
        console.error('Error during sending email:', error);
        // Optionally handle the error state
    }
});

// CSS to style the loading image
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
