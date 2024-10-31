/** 
 * File: shared/controller/sharedScript.js
 * Author: Yash Balotiya
 * Description: This page contains all the js code which is shared between all pages for login & logout button functionalities
 * Created on: 11/10/2024
 * Last Modified: 28/10/2024
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

// PAN India Support
document.getElementById("language-select").addEventListener("change", async () => {
    const language = document.getElementById("language-select").value;
    const elementsToTranslate = document.querySelectorAll("h2, h3, h4, h5, h6, p");
  
    // Collect all text in a single array
    let textArray = [];
    elementsToTranslate.forEach(element => textArray.push(element.innerText));
  
    // Join text array into a single string separated by "\n" for batch translation
    const textToTranslate = textArray.join("\n");
  
    try {
      // Fetch the translated data using template literals correctly
      const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${language}&dt=t&q=${encodeURIComponent(textToTranslate)}`);
      const data = await response.json();
  
      // Extract the translations and trim any extra newlines or whitespace
      const translatedTextArray = data[0].map(item => item[0].trim());
  
      // Map each translated text back to its respective element
      elementsToTranslate.forEach((element, index) => {
        element.innerText = translatedTextArray[index] || element.innerText;
      });
    } catch (error) {
      console.error("Translation error:", error);
    }
});
