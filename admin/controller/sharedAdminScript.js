/** 
 * File: shared/controller/sharedScript.js
 * Author: Yash Balotiya
 * Description: This page contains all the js code which is shared between all pages for login & logout button functionalities, Session Management and PAN India support
 * Created on: 11/10/2024
 * Last Modified: 06/11/2024
*/

// Session Handling for a particular time period
const timer = setInterval(() => {
    let time = parseInt(window.localStorage.getItem("timer")); // Default to 60 seconds if not set

    if (time <= 0) {
        clearInterval(timer);
        handleTimeout();
    } else {
        time--;
        window.localStorage.setItem("timer", time);
    }
}, 1000);