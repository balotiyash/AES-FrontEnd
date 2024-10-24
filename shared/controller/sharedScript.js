/** 
 * File: shared/controller/sharedScript.js
 * Author: Yash Balotiya
 * Description: This page contains all the js code which is shared between all pages for login & logout button functionalities
 * Created on: 11/10/2024
 * Last Modified: 24/10/2024
*/

// Login button handling
document.getElementById("loginBtn").addEventListener("click", () => {
    window.location.href = 'http://localhost:5501/shared/view/loginPage.html';
});

// Logout button handling
document.getElementById("logoutBtn").addEventListener("click", () => {
    console.log('Logging out...');
    window.localStorage.removeItem("token");
    window.location.href = "http://localhost:5501/shared/view/loginPage.html";
});

// Session Handling
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

function handleTimeout() {
    const URL = window.location.href;

    // Regular expression to match the specific product description URL
    const regex = /^http:\/\/localhost:5501\/user\/view\/product-description\.html/;

    if (regex.test(URL)) {
        setLoginButtonVisibility(true);
        window.localStorage.setItem("token", null);
    }

    const restrictedURLs = [
        "http://localhost:5501/user/view/cart.html",
        "http://localhost:5501/user/view/my-orders.html",
        "http://localhost:5501/user/view/saved-details.html"
    ];

    if (restrictedURLs.includes(URL)) {
        window.location.href = "http://localhost:5501/shared/view/loginPage.html";
    } else if ([
        "http://localhost:5501/",
        "http://localhost:5501/user/view/products-page.html",
        "http://localhost:5501/user/view/contact-us.html"
    ].includes(URL)) {
        setLoginButtonVisibility(true);
    }
}

function setLoginButtonVisibility(isVisible) {
    document.getElementById("loginBtn").style.display = isVisible ? "inline" : "none";
    document.getElementById("dropDownBtn").style.display = isVisible ? "none" : "inline";
}