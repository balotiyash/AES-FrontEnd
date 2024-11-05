/** 
 * File: user/controller/contactUsScript.js
 * Author: Yash Balotiya
 * Description: This file contains JS code for the contact us page. It consist of simple code to take data from form and to send it to the server to send mail.
 * Created on: 14/10/2024
 * Last Modified: 05/11/2024
*/

import { IP, PORT } from '../../config.js';

// Function to send mail data to server
async function sendMail() {
    const subjectTxt = document.getElementById("subjectTxt").value;
    const messageTxt = document.getElementById("messageTxt").value;

    if (!subjectTxt || !messageTxt) {
        return;
    }
    
    const mainData = JSON.stringify({
        subject: subjectTxt,
        body: messageTxt
    });

    try {
        const response = await fetch(`http://${IP}:${PORT}/public/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: mainData
        });

        if (!response.ok) {
            throw new Error('HTTP response was not OK');
        }

        const data = await response.text();

        if (data) {
            window.open(data, "_blank");
        }
    } catch (error) {
        console.error('Error during authentication:', error);
        throw error;
    }
}

document.getElementById("sendEmailBtn").addEventListener("click", sendMail);