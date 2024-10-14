/** 
 * File: signupScript.js
 * Author: Atharv Mirgal
 * Description: This page contains all the js code for the sign up page
 * Created on: 12/10/2024
 * Last Modified: 12/10/2024
*/

import { IP, PORT } from '../../config.js';

document.getElementById("sign-up-form").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent form from reloading the page
    console.log('Submitting form...');

    const name = document.getElementById('firstname').value + " " + document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value;
    const username = document.getElementById('username').value;
    const formData = {
        name: name,
        email: email,
        password: password,
        phone: phone,
        username: username,
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
            console.log('Response received:', response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            console.log('Data:', data);
            if (data) {
                alert('Signup successful! Please login to continue.');
                window.location.href = '/shared/view/loginPage.html';
            } else {
                alert('Signup failed. Please try again.');
            }
        })
        .catch(error => console.error('Error:', error));
});
