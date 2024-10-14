/** 
 * File: loginScript.js
 * Author: Yash Balotiya
 * Description: This page contains all the js code for the login page
 * Created on: 11/10/2024
 * Last Modified: 14/10/2024
*/

import { IP, PORT } from '../../config.js';

document.getElementById("loginForm").addEventListener("submit", () => {
    // event.preventDefault(); // Prevent form from reloading the page
    console.log('Submitting form...');

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
            console.log('Response received:', response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            console.log('Data:', data);
            if (data) {
                window.localStorage.setItem("token", data);
                window.location.href = '../../';

            } else {
                alert('Login failed. Token not received.');
            }
        })
        .catch(error => console.error('Error:', error));
});

