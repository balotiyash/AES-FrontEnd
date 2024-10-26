/** 
 * File: user/controller/prodDescScript.js
 * Author: Yash Balotiya
 * Description: This file contains JS code for the product description page.
 * Created on: 14/10/2024
 * Last Modified: 24/10/2024
*/

import { IP, PORT } from '../../config.js';

// Product ID from URL
const currentUrl = window.location.href;
const url = new URL(currentUrl);
const my_product_id = url.searchParams.get('product_id');

// Token
let token = window.localStorage.getItem("token");

// Fetch and display products grouped by category
async function fetchAndDisplayProducts() {
    try {
        const response = await fetch(`http://${IP}:${PORT}/public/allProducts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        const products = await response.json();
        console.log('Fetched products:', products);

        const sideMenu = document.getElementById('side-menu');
        const categoryMap = {};

        products.forEach(product => {
            const { product_category, product_name, product_id } = product; // Assuming product_id exists
            if (!categoryMap[product_category]) {
                categoryMap[product_category] = [];
            }
            categoryMap[product_category].push({ name: product_name, id: product_id });
        });

        for (const [category, items] of Object.entries(categoryMap)) {
            const categoryHeader = document.createElement('b');
            categoryHeader.textContent = category;
            sideMenu.appendChild(categoryHeader);

            const ul = document.createElement('ul');
            items.forEach(item => {
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.href = `./product-description.html?product_id=${item.id}`; // Update with actual links if available
                link.textContent = item.name;
                li.appendChild(link);
                ul.appendChild(li);
            });

            sideMenu.appendChild(ul);
            sideMenu.appendChild(document.createElement('br')); // Add spacing between categories
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Fetch and display product details based on product_id from URL
async function fetchProductDetails() {
    try {
        const response = await fetch(`http://${IP}:${PORT}/public/getProduct/${my_product_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch product details');
        }

        const product = await response.json();
        console.log('Fetched product details:', product);

        if (product) {
            document.getElementById("productImg").src = product.product_images[0];
            document.getElementById("productTitle").innerHTML = product.product_name;
            document.getElementById("tabTitle").innerHTML = `${product.product_name} - AES`;
            document.getElementById("productDesc").innerHTML = product.product_desc;
            // document.getElementById("productPrice").innerHTML = `Rs. ${product.product_price}`;
            document.getElementById("productPrice").innerHTML = `Rs. ${product.product_price.toLocaleString()}/-`;

        }
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

// Product Quantity & item id
let my_item_id = "";
let my_quantity = 0;
let count = 0;

// Fetch and display product add to cart or inc dec
async function fetchCartDetails() {
    try {
        const response = await fetch(`http://${IP}:${PORT}/cart/items`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch product details');
        }

        const products = await response.json();
        console.log('Fetched cart details:', products);

        for (let i = 0; i < products.length; i++) {
            if (products[i].product_id == my_product_id) {
                count = products[i].quantity;
                my_item_id = products[i].item_id;
                my_quantity = count; // Update my_quantity here

                document.getElementById("add-to-cart-btn").style.display = "none";
                document.getElementById("tally-div").style.display = "flex";
                break; // Exit the loop once the product is found
            } else {
                console.log("Not Found");
            }
        }

        // To dynamically show quantity value
        const cartQnty = document.getElementById("cartQnty");
        cartQnty.innerHTML = count;

        // Remove event listeners from here
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

// Add event listeners outside of fetchCartDetails
document.getElementById("incBtn").addEventListener("click", () => {
    count++;
    my_quantity = count;
    updateCart();
    const cartQnty = document.getElementById("cartQnty");
    cartQnty.innerHTML = my_quantity;
});

document.getElementById("decBtn").addEventListener("click", () => {
    count--;
    if (count <= 0) {
        document.getElementById("add-to-cart-btn").style.display = "block";
        document.getElementById("tally-div").style.display = "none";
    }

    my_quantity = count;
    updateCart();
    const cartQnty = document.getElementById("cartQnty");
    cartQnty.innerHTML = my_quantity;
});

// Function to add new item to the cart
async function addToCart() {
    token = window.localStorage.getItem("token");
    if (token == "null" || !token) {
        window.location.href = "http://localhost:5501/shared/view/loginPage.html";
        return;
    }

    const formdata = {
        product_id: my_product_id,
    }

    try {
        const response = await fetch(`http://${IP}:${PORT}/cart/add-to-cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formdata)
        });

        if (!response.ok) {
            throw new Error('Failed to fetch product details');
        }

        const data = await response.text();
        console.log('Add to cart:', data);

        // To dunamically update item quantity and respective things
        fetchCartDetails();
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

// Function to Update Quantity
async function updateCart() {
    const formdata = {
        product_id: my_product_id,
        item_id: my_item_id,
        quantity: my_quantity
    }
    console.log("Form Data: ");
    console.log(formdata)

    try {
        const response = await fetch(`http://${IP}:${PORT}/cart/update-quantity`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formdata)
        });

        if (!response.ok) {
            throw new Error('Failed to fetch product details');
        }

        const data = await response.text();
        console.log('Update Cart:', data);
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

// Calling function after load one by one to execute
fetchAndDisplayProducts();
fetchProductDetails();
fetchCartDetails();

// Event handling to handle click event of add to cart button
document.getElementById("add-to-cart-btn").addEventListener("click", addToCart);