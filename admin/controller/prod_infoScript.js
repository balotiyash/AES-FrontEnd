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



const submitForm = async () => {
    const prodName = document.getElementById('p-name').value;
    const pDesc = document.getElementById('p-desc').value;
    const pPrice = document.getElementById('p-price').value;
    const pCategory = document.getElementById('p-category').value;
    const pDelivery = document.getElementById('delivery-time').value;
    const unitSelect = document.getElementById('unit-select').value;
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

    const response = await fetch(`http://${IP}:${PORT}/product/add`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error('Failed to add new product');
    }

    const data = await response.text();
    console.log('Product added:', data);
};


document.getElementById('submit-form').addEventListener('click', (event) => {
    event.preventDefault();
    submitForm();
});
