/** 
 * File: shared/controller/loginScript.js
 * Author: Yash Balotiya
 * Description: This page contains all the js code for the login page to send data from form to server and to authinticate user.
 * Created on: 11/10/2024
 * Last Modified: 06/11/2024
*/

import { IP, PORT } from '../../config.js';

// Function to validate user to login
document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the default form submission

    const form = document.getElementById('loginForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    fetch(`http://${IP}:${PORT}/public/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                alert("Invalid Login ID or Password Entered!!");
                throw new Error('Network response was not ok');
            }
            return response.json(); // Correctly parse the response as JSON
        })
        .then(myData => {
            if (myData && myData.user) { // Check if myData and myData.user exist
                // To automatically logout after session expires
                window.localStorage.setItem("token", myData.token); // Assuming the token is in myData.token
                window.localStorage.setItem("timer", 60 * 60); // Assuming the token is in myData.token
                window.localStorage.setItem("isLoggedin", true);

                if (myData.user.roles[0] === "ADMIN") {
                    // Redirect to home page with window.location.replace to remove login page from history
                    window.location.replace('../../admin/view/dashboard.html'); // Replace with actual home page URL
                } else {
                    // Redirect to home page with window.location.replace to remove login page from history
                    window.location.replace('../../'); // Replace with actual home page URL
                }
            } else {
                alert('Login failed. Please contact your admin.');
                console.error("Token not received. Login Failed.");
            }
        })
        .catch(error => console.error('Error:', error));
});


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