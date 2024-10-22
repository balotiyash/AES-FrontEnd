/** 
 * File: shared/controller/loginScript.js
 * Author: Yash Balotiya
 * Description: This page contains all the js code for the login page
 * Created on: 11/10/2024
 * Last Modified: 22/10/2024
*/

import { IP, PORT } from '../../config.js';

document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the default form submission

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
                alert("Invalid Login ID or Password Entered!!");
                throw new Error('Network response was not ok');
            }
            return response.json(); // Correctly parse the response as JSON
        })
        .then(myData => {
            console.log('Data:', myData);

            if (myData && myData.user) { // Check if myData and myData.user exist
                window.localStorage.setItem("token", myData.token); // Assuming the token is in myData.token

                if (myData.user.roles[0] === "ADMIN") {
                    window.location.href = '../../admin/view/dashboard.html';
                } else {
                    window.location.href = '../../';
                }
            } else {
                alert('Login failed. Token not received.');
            }
        })
        .catch(error => console.error('Error:', error));
});
