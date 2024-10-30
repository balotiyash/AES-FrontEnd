/** 
 * File: user/controller/profileScript.js
 * Author: Yash Balotiya
 * Description: This file contains JS code for the saved address page.
 * Created on: 28/10/2024
 * Last Modified: 30/10/2024
*/

import { IP, PORT } from '../../config.js';

const token = window.localStorage.getItem('token');

// For stats
async function fetchStatsData() {
    try {
        const response = await fetch(`http://${IP}:${PORT}/analysis/quick-stats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to Fetch Stats Data');
        }

        const analysis = await response.json();
        document.getElementById("p1-title1").innerHTML = analysis.pageReach;
        document.getElementById("p1-title2").innerHTML = analysis.repeatingCustomers;
        document.getElementById("p1-title3").innerHTML = `${analysis.conversionRate}%`;
    } catch (error) {
        console.error('Error during Fetching Stats Data:', error);
    }
}

// For chart 1
async function fetchChart1Data() {
    try {
        const response = await fetch(`http://${IP}:${PORT}/analysis/monthly-sales`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to Fetch Chart1 Data');
        }

        const analysis = await response.json();
        let revenurArray = [];
        let profitArray = [];

        analysis.forEach((element) => {
            revenurArray.push({ x: new Date(element.date), y: element.revenue });
            profitArray.push({ x: new Date(element.date), y: element.profit });
        });

        return { revenurArray, profitArray };   
    } catch (error) {
        console.error('Error during Fetching Chart1 Data:', error);
    }
}

// For chart 2
async function fetchChart2Data() {
    try {
        const response = await fetch(`http://${IP}:${PORT}/analysis/top-sellers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to Fetch Chart2 Data');
        }

        const analysis = await response.json();
        let topSellers = [];

        analysis.forEach((element) => {
            topSellers.push({ y: element.quantity, label: element.product_name });
        });

        return topSellers;   
    } catch (error) {
        console.error('Error during Fetching Chart2 Data:', error);
    }
}

// For chart 3
async function fetchChart3Data() {
    try {
        const response = await fetch(`http://${IP}:${PORT}/analysis/pending-complete-order-count`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to Fetch Chart3 Data');
        }

        const analysis = await response.json();
        const pendingOrderCount = analysis.pending;
        const completeOrderCount = analysis.completed;

        return { pendingOrderCount, completeOrderCount };
    } catch (error) {
        console.error('Error during Fetching Chart3 Data:', error);
    }
}

// For chart 4
async function fetchChart4Data() {
    try {
        const response = await fetch(`http://${IP}:${PORT}/analysis/online-offline-sales`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to Fetch Revenue Chart4 Data');
        }

        const data = await response.json();
        let offlineRevenueArray = [];
        let offlineProfitArray = [];
        let onlineRevenueArray = [];
        let onlineProfitArray = [];

        // Process offline revenue and profit data
        data.offlineRevenueProfit.forEach((element) => {
            offlineRevenueArray.push({ x: new Date(element.date), y: element.revenue });
            offlineProfitArray.push({ x: new Date(element.date), y: element.profit });
        });

        // Process online revenue and profit data
        data.onlineRevenueProfit.forEach((element) => {
            onlineRevenueArray.push({ x: new Date(element.date), y: element.revenue });
            onlineProfitArray.push({ x: new Date(element.date), y: element.profit });
        });

        return { 
            offlineRevenueArray, 
            offlineProfitArray, 
            onlineRevenueArray, 
            onlineProfitArray 
        };   
    } catch (error) {
        console.error('Error during Fetching Revenue Chart4 Data:', error);
    }
}

window.onload = async function () {
    // For Stats
    fetchStatsData();

    // For Chart 1
    // sort both these array based on dates in ascending order
    const { revenurArray, profitArray } = await fetchChart1Data();
    revenurArray.sort((a, b) => a.x - b.x);
    profitArray.sort((a, b) => a.x - b.x);

    // For Chart 2
    const topSellers = await fetchChart2Data();
    topSellers.sort((a, b) => a.y - b.y);

    // For Chart 3
    const { pendingOrderCount, completeOrderCount } = await fetchChart3Data();

    // For Chart 4
    const { offlineRevenueArray, offlineProfitArray, onlineRevenueArray, onlineProfitArray } = await fetchChart4Data();
    offlineRevenueArray.sort((a, b) => a.x - b.x);
    offlineProfitArray.sort((a, b) => a.x - b.x);
    onlineRevenueArray.sort((a, b) => a.x - b.x);
    onlineProfitArray.sort((a, b) => a.x - b.x);

    // Chart 1
    var chart1 = new CanvasJS.Chart("chartContainer1", {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "Revenue & Profit"
        },
        axisX: {
            valueFormatString: "DD MMM",
            crosshair: {
                enabled: true,
                snapToDataPoint: true
            }
        },
        axisY: {
            title: "Amount in Rs.",
            includeZero: true,
            crosshair: {
                enabled: true
            }
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "bottom",
            horizontalAlign: "left",
            dockInsidePlotArea: true,
            itemclick: toggleDataSeries
        },
        data: [{
            type: "line",
            showInLegend: true,
            name: "Revenue",
            markerType: "square",
            xValueFormatString: "DD MMM, YYYY",
            color: "#F08080",
            dataPoints: revenurArray
        },
        {
            type: "line",
            showInLegend: true,
            name: "Profit",
            lineDashType: "dash",
            dataPoints: profitArray
        }]
    });
    chart1.render();

    // Chart 2
    var chart2 = new CanvasJS.Chart("chartContainer2", {
        animationEnabled: true,
        title: {
            text: "Top Selling Products"
        },
        axisX: {
            interval: 1
        },
        axisY2: {
            interlacedColor: "rgba(1,77,101,.2)",
            gridColor: "rgba(1,77,101,.1)",
            title: "Number of Units Sold"
        },
        data: [{
            type: "bar",
            name: "companies",
            color: "#014D65",
            axisYType: "secondary",
            dataPoints: topSellers
        }]
    });
    chart2.render();

    // Chart 3
    var chart3 = new CanvasJS.Chart("chartContainer3", {
        animationEnabled: true,
        title: {
            text: "Order Status"
        },
        data: [{
            type: "pie",
            startAngle: -25,
            // yValueFormatString: "##0.00\"%\"",
            indexLabel: "{label} {y}",
            dataPoints: [
                { y: pendingOrderCount, label: "Pending Orders" },
                { y: completeOrderCount, label: "Completed Orders" }
                // { y: 7.06, label: "Baidu" },
                // { y: 4.91, label: "Yahoo" },
                // { y: 1.26, label: "Others" }
            ]
        }]
    });
    chart3.render();

    // Chart 4
    var chart4 = new CanvasJS.Chart("chartContainer4", {
        exportEnabled: true,
        animationEnabled: true,
        title: {
            text: "Online and Offline Revenue and Profit"
        },
        subtitles: [{
            text: ""
        }],
        axisX: {
            title: "States"
        },
        axisY: {
            title: "Revenue (Rs)",
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            labelFontColor: "#4F81BC",
            tickColor: "#4F81BC",
            includeZero: true
        },
        axisY2: {
            title: "Profit (Rs)",
            titleFontColor: "#C0504E",
            lineColor: "#C0504E",
            labelFontColor: "#C0504E",
            tickColor: "#C0504E",
            includeZero: true
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        data: [{
            type: "column",
            name: "Offline Revenue",
            showInLegend: true,
            yValueFormatString: "#,##0.# Rs",
            dataPoints: offlineRevenueArray
        },
        {
            type: "column",
            name: "Online Revenue",
            showInLegend: true,
            yValueFormatString: "#,##0.# Rs",
            dataPoints: onlineRevenueArray
        },
        {
            type: "column",
            name: "Offline Profit",
            showInLegend: true,
            yValueFormatString: "#,##0.# Rs",
            dataPoints: offlineProfitArray
        },
        {
            type: "column",
            name: "Online Profit",
            axisYType: "secondary",
            showInLegend: true,
            yValueFormatString: "#,##0.# Rs",
            dataPoints: onlineProfitArray
        }]
    });
    chart4.render();

    // Unified toggleDataSeries function
    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render(); // Render the chart that triggered the event
    }
}

document.getElementById("prodMangementBtn").addEventListener("click", () => {
    location.href = "./prod_manage.html";
});
