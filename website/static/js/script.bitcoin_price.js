// Define the URL to fetch JSON data
const url_coin_supply = 'https://www.gkenetic.com/gkenetic_btc_price/';

// Function to fetch JSON data from the URL
async function fetchSupplyData() {
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const response = await fetch(url_coin_supply);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const textData = await response.text();

        // Check if the data starts with a double quote and a [
        if (textData.startsWith('"[') && textData.endsWith(']"')) {
            // Remove both the leading and trailing double quotes
            const cleanedData = textData.slice(1, -1);

            // Convert the cleaned data into a valid JSON string
            const validJSONString = cleanedData.replace(/\\"/g, '"');

            const jsonData = JSON.parse(validJSONString); // Parse the valid JSON string
            return jsonData; // The data should be an array of objects
        } else {
            console.error('Data does not start and end with a double quote and a [:', textData);
            return [];
        }
    } catch (error) {
        console.error('Error fetching or parsing data:', error);
        return [];
    }
}

function createSupplyLineChart(data) {
    // Check if data is an array before using map
    if (!Array.isArray(data)) {
        console.error('Data is not an array:', data);
        return;
    }

    // Extract timestamp and hash power data from the JSON objects
    const timestamps = data.map(entry => new Date(entry.fields.timestamp));
    const coin_supply = data.map(entry => entry.fields.bitcoin_price);

    // Create the line chart
    const ctx = document.getElementById('bitcoinpricechart').getContext('2d');

    const chartData = {
        labels: timestamps,
        datasets: [
            {
                label: 'Predicted Bitcoin Price',
                borderColor: 'blue',
                data: coin_supply,
                fill: false,
            },
        ],
    };

    const chartConfig = {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Bitcoin Price',
                    },
                },
            },
        },
    };

    new Chart(ctx, chartConfig);
}

// Fetch data and create the chart
fetchSupplyData().then(data => {
    createSupplyLineChart(data);
});
