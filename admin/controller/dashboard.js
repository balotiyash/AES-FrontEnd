/** 
 * File: user/controller/profileScript.js
 * Author: Yash Balotiya
 * Description: This file contains JS code for the saved address page.
 * Created on: 28/10/2024
 * Last Modified: 30/10/2024
*/

import { IP, PORT } from '../../config.js';

// For chart 1
async function fetchChart1Data() {
    try {
        const response = await fetch(`http://${IP}:${PORT}/analysis/monthly-sales`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to Fetch User Data');
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
        console.error('Error during Fetching User Profile:', error);
    }
}

// For chart 3
async function fetchChart3Data() {
    try {
        const response = await fetch(`http://${IP}:${PORT}/analysis/pending-complete-order-count`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to Fetch User Data');
        }

        const analysis = await response.json();
        const pendingOrderCount = analysis.pending;
        const completeOrderCount = analysis.completed;

        return { pendingOrderCount, completeOrderCount };
    } catch (error) {
        console.error('Error during Fetching User Profile:', error);
    }
}

window.onload = async function () {
    // For Chart 1
    // sort both these array based on dates in ascending order
    const { revenurArray, profitArray } = await fetchChart1Data();
    revenurArray.sort((a, b) => a.x - b.x);
    profitArray.sort((a, b) => a.x - b.x);

    // For Chart 3
    const { pendingOrderCount, completeOrderCount } = await fetchChart3Data();

    // Chart 1
    var chart1 = new CanvasJS.Chart("chartContainer1", {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "Site Traffic"
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
            text: "Fortune 500 Companies by Country"
        },
        axisX: {
            interval: 1
        },
        axisY2: {
            interlacedColor: "rgba(1,77,101,.2)",
            gridColor: "rgba(1,77,101,.1)",
            title: "Number of Companies"
        },
        data: [{
            type: "bar",
            name: "companies",
            color: "#014D65",
            axisYType: "secondary",
            dataPoints: [
                { y: 3, label: "Sweden" },
                { y: 7, label: "Taiwan" },
                { y: 5, label: "Russia" },
                { y: 9, label: "Spain" },
                { y: 7, label: "Brazil" },
                { y: 7, label: "India" },
                { y: 9, label: "Italy" },
                { y: 8, label: "Australia" },
                { y: 11, label: "Canada" },
                { y: 15, label: "South Korea" },
                { y: 12, label: "Netherlands" },
                { y: 15, label: "Switzerland" },
                { y: 25, label: "Britain" },
                { y: 28, label: "Germany" },
                { y: 29, label: "France" },
                { y: 52, label: "Japan" },
                { y: 103, label: "China" },
                { y: 134, label: "US" }
            ]
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
            startAngle: 18,
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
            text: "Car Parts Sold in Different States"
        },
        subtitles: [{
            text: "Click Legend to Hide or Unhide Data Series"
        }],
        axisX: {
            title: "States"
        },
        axisY: {
            title: "Oil Filter - Units",
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            labelFontColor: "#4F81BC",
            tickColor: "#4F81BC",
            includeZero: true
        },
        axisY2: {
            title: "Clutch - Units",
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
            name: "Oil Filter",
            showInLegend: true,
            yValueFormatString: "#,##0.# Units",
            dataPoints: [
                { label: "New Jersey", y: 19034.5 },
                { label: "Texas", y: 20015 },
                { label: "Oregon", y: 25342 },
                { label: "Montana", y: 20088 },
                { label: "Massachusetts", y: 28234 }
            ]
        },
        {
            type: "column",
            name: "Clutch",
            axisYType: "secondary",
            showInLegend: true,
            yValueFormatString: "#,##0.# Units",
            dataPoints: [
                { label: "New Jersey", y: 210.5 },
                { label: "Texas", y: 135 },
                { label: "Oregon", y: 425 },
                { label: "Montana", y: 130 },
                { label: "Massachusetts", y: 528 }
            ]
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
