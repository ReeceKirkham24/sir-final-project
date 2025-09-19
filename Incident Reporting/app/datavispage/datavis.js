window.onload = async function() {
	let ticketResources = [];
	try {
		const response = await fetch('http://localhost:5001/ticket');
		if (!response.ok) throw new Error('Network response was not ok');
		ticketResources = await response.json();
		console.log('Fetched tickets:', ticketResources);
	} catch (error) {
		console.error('Error fetching tickets:', error);
	}

	const placeholder = document.querySelector('.chart-placeholder');
	const datasetSelect = document.getElementById('dataset');
	let chartInstance = null;

	function loadChartJs(callback) {
		if (window.Chart) {
			callback();
			return;
		}
		const script = document.createElement('script');
		script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
		script.onload = callback;
		document.head.appendChild(script);
	}

    let status = {}
    let severity = {}
    let category = {}

    for(let i = 0; i < ticketResources.length; i++){
        if(status[ticketResources[i].status]){
            status[ticketResources[i].status]++
        }
        else{
            status[ticketResources[i].status]=1
        }

        if(severity[ticketResources[i].severity]){
            severity[ticketResources[i].severity]++
        }
        else{
            severity[ticketResources[i].severity]=1
        }
        
        if(category[ticketResources[i].category]){
            category[ticketResources[i].category]++
        }
        else{
            category[ticketResources[i].category]=1
        }
    }
    console.log(category);
	function getChartData(selectedDataset) {
		if (selectedDataset === 'status') {
			return {
				labels: Object.keys(status),
				data: Object.values(status)
			};
		} else if (selectedDataset === 'severity') {
			return {
				labels: Object.keys(severity),
				data: Object.values(severity)
			};
		} else if (selectedDataset === 'categories') {
			return {
				labels: Object.keys(category),
				data: Object.values(category)
			};
		}
		return {
			labels: ['Variable 1', 'Variable 2', 'Variable 3'],
			data: [33, 33, 34]
		};
	}

	function generateColors(numColors) {
		const colors = [];
		const saturation = 50;
		const lightness = 70;
        // after testing, these values for light and sat seem to make the least harsh colours
		for (let i = 0; i < numColors; i++) {
			const hue = Math.round((360 * i) / numColors);
			colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
		}
		return colors;
	}

	function renderChart(selectedDataset) {
		placeholder.innerHTML = '';
		let canvas = document.createElement('canvas');
		canvas.id = 'pieChart';
		placeholder.appendChild(canvas);
		const ctx = document.getElementById('pieChart').getContext('2d');
		const chartData = getChartData(selectedDataset);
		if (chartInstance) {
			chartInstance.destroy();
		}
		const colors = generateColors(chartData.data.length);
		chartInstance = new Chart(ctx, {
			type: 'pie',
			data: {
				labels: chartData.labels,
				datasets: [{
					data: chartData.data,
					backgroundColor: colors,
					borderWidth: 1
				}]
			},
			options: {
				responsive: true,
				plugins: {
					legend: {
						position: 'bottom',
					},
					title: {
						display: true,
						text: 'Pie Chart (' + selectedDataset.charAt(0).toUpperCase() + selectedDataset.slice(1) + ')'
					}
				}
			}
		});
	}

	loadChartJs(function() {
		renderChart(datasetSelect.value);
		datasetSelect.addEventListener('change', function() {
			renderChart(datasetSelect.value);
		});
	});
}
