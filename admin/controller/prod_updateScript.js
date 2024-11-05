import { IP, PORT } from '../../config.js';
const token = window.localStorage.getItem("token");

let isImageChanged = false;

const fetchProductDetails = async () => {
    try {
        // Product ID from URL
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const product_id = url.searchParams.get('product_id');
        const response = await fetch(`http://${IP}:${PORT}/public/getProduct/${product_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch product details');
        }

        const product = await response.json();
        console.log('Fetched product:', product);

        fillForm(product);
    } catch (error) {
        console.error('Error fetching product details:', error);
        throw error;
    }
};

const fillForm = (product) => {
    document.getElementById('p-name').value = product.product_name;
    document.getElementById('p-desc').value = product.product_desc;
    document.getElementById('p-price').value = product.product_price;
    document.getElementById('p-profit').value = product.product_profit;
    document.getElementById('p-category').value = product.product_category;
    document.getElementById('p-avail').value = product.product_status ? 'AVAILABLE' : 'UN-AVAILABLE';
    // document.getElementById('image-error').textContent = 'Re-upload image to change';

    const deliveryTime = product.estimated_delivery_time;
    let unitSelect = '';
    let time = 0;
    if (deliveryTime % 30 === 0) {
        unitSelect = 'months';
        time = deliveryTime / 30;
    }
    else if (deliveryTime % 7 === 0) {
        unitSelect = 'weeks';
        time = deliveryTime / 7;
    }
    else {
        unitSelect = 'days';
        time = deliveryTime;
    }
    document.getElementById('dropdownMenuButton').value = unitSelect;
    document.getElementById('delivery-time').value = time;
    document.getElementById('dropdownMenuButton').textContent = unitSelect;

    const imageDiv = document.getElementById('image-box');
    const image = document.createElement('img');
    image.classList.add('img');
    image.src = product.product_images[0];
    image.alt = product.product_name;
    imageDiv.appendChild(image);
    imageDiv.style.backgroundImage = `url('${product.product_images[0]}')`;
    imageDiv.style.backgroundSize = 'cover';
    imageDiv.style.backgroundPosition = 'center';
    imageDiv.innerHTML = '';

    // Mark that an image has been uploaded
    imageUploaded = true;
};

window.onload = async () => {
    await fetchProductDetails();
};

// Track if an image has been uploaded
let imageUploaded = false;

document.getElementById('image-box').addEventListener('click', () => {
    document.getElementById('imageUpload').click();
});

const addImage = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
        const file = files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            // Get the image box and set its background to the uploaded image
            const imageBox = document.getElementById('image-box');
            imageBox.style.backgroundImage = `url('${e.target.result}')`;
            imageBox.style.backgroundSize = 'cover';
            imageBox.style.backgroundPosition = 'center';
            imageBox.innerHTML = ''; // Clear the "+" icon

            // Mark that an image has been uploaded
            imageUploaded = true;
        };
        reader.readAsDataURL(file);
        isImageChanged = true;
    }
};

// Event listener for file input change
document.getElementById('imageUpload').addEventListener('change', addImage);




const setCategoryInputValue = (element) => {
    document.getElementById('p-category').value = element.textContent;
}
document.getElementById('dropdown-item1').addEventListener('click', (event) => {
    setCategoryInputValue(event.target);
});
document.getElementById('dropdown-item2').addEventListener('click', (event) => {
    setCategoryInputValue(event.target);
});


const setAvailInputValue = (element) => {
    document.getElementById('p-avail').value = element.textContent;
}
document.getElementById('dropdown-item3').addEventListener('click', (event) => {
    event.preventDefault();
    setAvailInputValue(event.target);
});
document.getElementById('dropdown-item4').addEventListener('click', (event) => {
    event.preventDefault();
    setAvailInputValue(event.target);
});


document.getElementById("days").addEventListener("click", function () {
    document.getElementById("dropdownMenuButton").textContent = "Days";
    document.getElementById("dropdownMenuButton").value = "days";
});

document.getElementById("weeks").addEventListener("click", function () {
    document.getElementById("dropdownMenuButton").value = "weeks";
    document.getElementById("dropdownMenuButton").textContent = "Weeks";
});

document.getElementById("months").addEventListener("click", function () {
    document.getElementById("dropdownMenuButton").textContent = "Months";
    document.getElementById("dropdownMenuButton").value = "months";
});




function validateForm() {
    let isValid = true;

    // Fetch input values
    const name = document.getElementById('p-name').value;
    const description = document.getElementById('p-desc').value;
    const price = parseFloat(document.getElementById('p-price').value);
    const profit = parseFloat(document.getElementById('p-profit').value);
    const category = document.getElementById('p-category').value;
    const availability = document.getElementById('p-avail').value;
    const deliveryTime = document.getElementById('delivery-time').value;
    const imageUpload = document.getElementById('imageUpload').files;

    // Clear all previous error messages
    document.getElementById('name-error').textContent = '';
    document.getElementById('desc-error').textContent = '';
    document.getElementById('price-error').textContent = '';
    document.getElementById('profit-error').textContent = '';
    document.getElementById('category-error').textContent = '';
    document.getElementById('avail-error').textContent = '';
    document.getElementById('delivery-error').textContent = '';
    // document.getElementById('image-error').textContent = '';

    // Validate name
    if (name.length === 0 || name.length > 200) {
        document.getElementById('name-error').textContent = 'Name is required and must be less than 200 characters.';
        isValid = false;
    }

    // Validate description
    if (description.length === 0 || description.length > 1500) {
        document.getElementById('desc-error').textContent = 'Description is required and must be less than 1500 characters.';
        isValid = false;
    }

    // Validate price and profit
    if (isNaN(price) || price <= 0) {
        document.getElementById('price-error').textContent = 'Price must be a positive number.';
        isValid = false;
    }

    if (isNaN(profit) || profit < 0 || profit > price) {
        document.getElementById('profit-error').textContent = 'Profit must be a positive number and less than or equal to the price.';
        isValid = false;
    }

    // Validate category
    if (category.length === 0) {
        document.getElementById('category-error').textContent = 'Category is required.';
        isValid = false;
    }

    // Validate availability
    if (availability.length === 0) {
        document.getElementById('avail-error').textContent = 'Availability is required.';
        isValid = false;
    }

    // Validate delivery time
    if (deliveryTime.length === 0) {
        document.getElementById('delivery-error').textContent = 'Delivery time is required.';
        isValid = false;
    }

    // if (imageUpload.length === 0) {
    //     document.getElementById('image-error').textContent = 'Please upload an image.';
    //     isValid = false;
    // }
}



const submitForm = async () => {
    // Get values from input elements
    const prodName = document.getElementById('p-name').value;
    const pDesc = document.getElementById('p-desc').value;
    const pPrice = document.getElementById('p-price').value;
    const pCategory = document.getElementById('p-category').value;
    const pAvail = document.getElementById('p-avail').value;
    const pDelivery = document.getElementById('delivery-time').value;
    const unitSelect = document.getElementById('dropdownMenuButton').value;
    const imageUpload = document.getElementById('imageUpload');
    const pProfit = document.getElementById('p-profit').value;

    // Convert delivery time based on unit selection
    let deliveryTime = 0;
    if (unitSelect === 'days') {
        deliveryTime = pDelivery;
    } else if (unitSelect === 'weeks') {
        deliveryTime = pDelivery * 7;
    } else if (unitSelect === 'months') {
        deliveryTime = pDelivery * 30;
    }

    // Create a FormData object and append form data
    const formData = new FormData();
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const product_id = url.searchParams.get('product_id');
    formData.append('product_id', product_id);
    formData.append('product_name', prodName);
    formData.append('product_desc', pDesc);
    formData.append('product_price', pPrice);
    formData.append('product_category', pCategory);
    formData.append('estimated_delivery_time', deliveryTime);
    formData.append('product_profit', pProfit);
    formData.append('product_status', pAvail === 'AVAILABLE' ? true : false);

    // Append image files
    const imageFiles = imageUpload.files;
    for (let i = 0; i < imageFiles.length; i++) {
        formData.append('productImages', imageFiles[i]); // Append each file
    }

    // Send the form data to the server
    try {
        const response = await fetch(`http://${IP}:${PORT}/product/update`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}` // Do not set 'Content-Type', let fetch handle it
            },
            body: formData
        });

        // Handle response
        if (!response.ok) {
            throw new Error('Failed to update product');
        }

        alert('Product updated successfully!');
        window.location.href = 'prod_manage.html';

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating the product');
    }
};



document.getElementById('submit-form').addEventListener('click', (event) => {
    event.preventDefault();
    validateForm();
    submitForm();
});
