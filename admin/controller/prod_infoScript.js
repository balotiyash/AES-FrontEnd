import {IP, PORT} from '../../config.js';
const token = window.localStorage.getItem("token");

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
    }
};

// Event listener for file input change
document.getElementById('imageUpload').addEventListener('change', addImage);




const setInputValue = (element) => {
    document.getElementById('p-category').value = element.textContent;
}
document.getElementById('dropdown-item1').addEventListener('click', (event) => {
    setInputValue(event.target);
});
document.getElementById('dropdown-item2').addEventListener('click', (event) => {
    setInputValue(event.target);
});


document.getElementById("days").addEventListener("click", function() {
    document.getElementById("dropdownMenuButton").textContent = "Days";
    document.getElementById("dropdownMenuButton").value = "days";
});

document.getElementById("weeks").addEventListener("click", function() {
    document.getElementById("dropdownMenuButton").value = "weeks";
    document.getElementById("dropdownMenuButton").textContent = "Weeks";
});

document.getElementById("months").addEventListener("click", function() {
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
    const deliveryTime = document.getElementById('delivery-time').value;
    const imageUpload = document.getElementById('imageUpload').files;

    // Clear all previous error messages
    document.getElementById('name-error').textContent = '';
    document.getElementById('desc-error').textContent = '';
    document.getElementById('price-error').textContent = '';
    document.getElementById('profit-error').textContent = '';
    document.getElementById('category-error').textContent = '';
    document.getElementById('delivery-error').textContent = '';
    document.getElementById('image-error').textContent = '';

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

    // Validate delivery time
    if (deliveryTime.length === 0) {
        document.getElementById('delivery-error').textContent = 'Delivery time is required.';
        isValid = false;
    }

    if (imageUpload.length === 0) {
        document.getElementById('image-error').textContent = 'Please upload an image.';
        isValid = false;
    }

    // Submit if valid
    if (isValid) {
        alert('Form submitted successfully!');
        window.location.href = 'prod_manage.html';
        // Add form submission code here
    }
}



const submitForm = async () => {
    const prodName = document.getElementById('p-name').value;
    const pDesc = document.getElementById('p-desc').value;
    const pPrice = document.getElementById('p-price').value;
    const pCategory = document.getElementById('p-category').value;
    const pDelivery = document.getElementById('delivery-time').value;
    const unitSelect = document.getElementById('dropdownMenuButton').value;
    const imageUpload = document.getElementById('imageUpload');

    let deliveryTime = 0;
    if(unitSelect === 'days'){
        deliveryTime = pDelivery;
    }else if(unitSelect === 'weeks'){
        deliveryTime = pDelivery * 7;
    }else if(unitSelect === 'months'){
        deliveryTime = pDelivery * 30;
    }


    const formData = new FormData();
    formData.append('product_name', prodName);
    formData.append('product_desc', pDesc);
    formData.append('product_price', pPrice);
    formData.append('product_category', pCategory);
    formData.append('estimated_delivery_time', deliveryTime);
    const imageFiles = imageUpload.files[0];
    formData.append(`productImages`, imageFiles);

    // const response = await fetch(`http://${IP}:${PORT}/product/add`, {
    //     method: 'POST',
    //     headers: {
    //         'Authorization': `Bearer ${token}`
    //     },
    //     body: formData
    // });

    // if (!response.ok) {
    //     throw new Error('Failed to add new product');
    // }

    // const data = await response.text();
    // console.log('Product added:', data);
};


document.getElementById('submit-form').addEventListener('click', (event) => {
    event.preventDefault();
    submitForm();
    validateForm();
    
});
