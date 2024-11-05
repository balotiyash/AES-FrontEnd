/** 
 * File: user/controller/invoiceScript.js
 * Author: Yash Balotiya
 * Description: This page contains all the js code for generating invoice
 * Created on: 30/10/2024
 * Last Modified: 30/10/2024
*/


import { IP, PORT } from '../../config.js';

const token = window.localStorage.getItem("token");

// Product ID from URL
const currentUrl = window.location.href;
const url = new URL(currentUrl);
const saleId = url.searchParams.get('saleId');

async function fetchInvoiceDetails() {
    try {
        const response = await fetch(`http://${IP}:${PORT}/public/generate-invoice`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ saleID: saleId })
        });

        if (!response.ok) throw new Error('Failed to Fetch Invoice Data');

        const invoiceData = await response.json();
        generateInvoice(invoiceData);
    } catch (error) {
        console.error('Error during Fetching Invoice Details:', error);
    }
}

window.onload = fetchInvoiceDetails();

function generateInvoice(invoiceData) {
    // Set date and invoice ID
    const orderDate = new Date(invoiceData.order_date).toLocaleDateString();
    document.getElementById("createdDate").innerText = orderDate;
    document.getElementById("invoiceIdDisplay").innerText = invoiceData.sale_id;

    // Set company details dynamically
    // document.getElementById("companyDetails").innerHTML = `
    //     <b>MANUFACTURED & SUPPLIED BY</b><br>
    //     <i>${invoiceData.company_name}</i><br>
    //     ${invoiceData.company_address}<br>
    //     ${invoiceData.company_email}<br>
    //     ${invoiceData.company_phone}
    // `;

    // Set customer details dynamically
    document.getElementById("customerDetails").innerHTML = `
        <strong>BILLED TO</strong><br>
        <i>${invoiceData.customer_name}</i><br>
        ${invoiceData.shipping_address}<br>
        ${invoiceData.customer_email}<br>
        ${invoiceData.customer_phone}
    `;

    // Populate product table and calculate subtotal
    let subtotal = 0;
    const productTable = document.getElementById("productTable");
    productTable.innerHTML = ''; // Clear any existing rows

    invoiceData.products.forEach((product, index) => {
        const total = product.product_price * product.quantity;
        subtotal += total;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${product.product_name}</td>
            <td>Rs ${product.product_price.toFixed(2)}</td>
            <td>${product.quantity}</td>
            <td>Rs ${total.toFixed(2)}</td>
        `;
        productTable.appendChild(row);
    });

    // Calculate GST, shipping, and total amounts
    const gstAmount = invoiceData.gst_cost;
    const shippingAmount = invoiceData.shipping_cost;
    const totalAmount = subtotal + gstAmount + shippingAmount;

    // Set amounts in the invoice
    document.getElementById("subtotalAmount").innerText = subtotal.toFixed(2);
    document.getElementById("gstAmount").innerText = gstAmount.toFixed(2);
    document.getElementById("shippingAmount").innerText = shippingAmount.toFixed(2);
    document.getElementById("totalAmount").innerText = totalAmount.toFixed(2);

    // Show and generate the PDF
    const invoiceElement = document.getElementById("invoice");
    invoiceElement.style.display = 'block';

    const options = {
        margin: 1,
        filename: `INVOICE_${invoiceData.sale_id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(options).from(invoiceElement).save().then(() => {
        invoiceElement.style.display = 'none';
    });
}