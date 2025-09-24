window.onload = async function() {
	let ticketResources = [];
	try {
		const options = {
			method: "GET",
			headers:{
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'authorisation': localStorage.getItem("otoken")
			}
		}
		const response = await fetch('http://localhost:5000/ticket', options);
		if (!response.ok) throw new Error('Network response was not ok');
		ticketResources = await response.json();
		console.log('Fetched tickets:', ticketResources);
	} catch (error) {
		console.error('Error fetching tickets:', error);
	}

	const placeholder = document.querySelector('.chart-placeholder');
	const datasetSelectX = document.getElementById('datasetX');
	const datasetSelectY = document.getElementById('datasetY');
	let yValueSelect = document.getElementById('datasetYValue');
	if (!yValueSelect) {
		yValueSelect = document.createElement('select');
		yValueSelect.id = 'datasetYValue';
		datasetSelectY.parentNode.insertBefore(yValueSelect, datasetSelectY.nextSibling);
	}
	yValueSelect.style.display = 'none';
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
	let month = {"January": 0, "February": 0, "March": 0, "April": 0, "May": 0, "June": 0, "July": 0, "August": 0, "September": 0, "October": 0, "November": 0, "December": 0}
	let department = {}
	let author = {}

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

		if(author[ticketResources[i].user_name]){
            author[ticketResources[i].user_name]++
        }
        else{
            author[ticketResources[i].user_name]=1
        }

		if(month[new Date(ticketResources[i].date_created).toLocaleString('default', { month: 'long' })]){
            month[new Date(ticketResources[i].date_created).toLocaleString('default', { month: 'long' })]++
        }
        else{
            month[new Date(ticketResources[i].date_created).toLocaleString('default', { month: 'long' })]=1
        }

		if(department[ticketResources[i].department_name]){
            department[ticketResources[i].department_name]++
        }
        else{
            department[ticketResources[i].department_name]=1
        }
    }
	console.log(month);
	function getDatasetProperty(key) {
		switch (key) {
			case 'status': return 'status';
			case 'severity': return 'severity';
			case 'categories': return 'category';
			case 'author': return 'user_name';
			case 'timePeriod': return 'date_created';
			case 'department': return 'department_name';
			default: return null;
		}
	}

	function getAllDatasetValues(key) {
		const prop = getDatasetProperty(key);
		if (!prop) return [];
		if (key == 'timePeriod') {
			return Object.keys(month);
		}
		const values = new Set();
		for (const t of ticketResources) {
			if (t[prop]) values.add(t[prop]);
		}
		return Array.from(values);
	}

	function getChartData(selectedDatasetX, selectedDatasetY, selectedYValue) {
		let filteredTickets = ticketResources;
		if (selectedDatasetY && selectedDatasetY !== 'none' && selectedYValue) {
			const yProp = getDatasetProperty(selectedDatasetY);
			if (selectedDatasetY == 'timePeriod') {
				filteredTickets = ticketResources.filter(t => {
					const monthName = new Date(t.date_created).toLocaleString('default', { month: 'long' });
					return monthName == selectedYValue;
				});
			} else {
				filteredTickets = ticketResources.filter(t => t[yProp] == selectedYValue);
			}
		}

		const xProp = getDatasetProperty(selectedDatasetX);
		let counts = {};
		if (selectedDatasetX == 'timePeriod') {
			counts = {"January": 0, "February": 0, "March": 0, "April": 0, "May": 0, "June": 0, "July": 0, "August": 0, "September": 0, "October": 0, "November": 0, "December": 0};
			for (const t of filteredTickets) {
				const monthName = new Date(t.date_created).toLocaleString('default', { month: 'long' });
				if (counts[monthName] !== undefined) counts[monthName]++;
			}
		} else if (xProp) {
			for (const t of filteredTickets) {
				const val = t[xProp];
				if (val) {
					counts[val] = (counts[val] || 0) + 1;
				}
			}
		}
		if (selectedDatasetX == 'timePeriod') {
			for (const m in counts) {
				if (counts[m] == 0) delete counts[m];
			}
		}
		return {
			labels: Object.keys(counts),
			data: Object.values(counts)
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

	function renderChart(selectedDatasetX, selectedDatasetY, selectedYValue) {
		placeholder.innerHTML = '';
		let canvas = document.createElement('canvas');
		canvas.id = 'pieChart';
		placeholder.appendChild(canvas);
		const ctx = document.getElementById('pieChart').getContext('2d');
		const chartData = getChartData(selectedDatasetX, selectedDatasetY, selectedYValue);
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
						text: 'Pie Chart (' + selectedDatasetX.charAt(0).toUpperCase() + selectedDatasetX.slice(1) + (selectedDatasetY && selectedDatasetY !== 'none' && selectedYValue ? ' filtered by ' + selectedDatasetY + ': ' + selectedYValue : '') + ')'
					}
				}
			}
		});
	}

	function updateYValueDropdown(selectedDatasetY) {
		if (selectedDatasetY == 'none') {
			yValueSelect.style.display = 'none';
			yValueSelect.innerHTML = '';
			return;
		}
		let values = getAllDatasetValues(selectedDatasetY);
		if (selectedDatasetY == 'severity') {
			const severityOrder = ["Critical", "High", "Medium", "Low"];
			values = severityOrder.filter(v => values.includes(v));
		}
		yValueSelect.innerHTML = '';
		for (const v of values) {
			const opt = document.createElement('option');
			opt.value = v;
			opt.textContent = v;
			yValueSelect.appendChild(opt);
		}
		yValueSelect.style.display = 'inline-block';
	}

	loadChartJs(function() {
		let selectedYValue = null;
		updateYValueDropdown(datasetSelectY.value);
		if (datasetSelectY.value !== 'none') {
			selectedYValue = yValueSelect.value;
		}
		renderChart(datasetSelectX.value, datasetSelectY.value, selectedYValue);

		datasetSelectX.addEventListener('change', function() {
			renderChart(datasetSelectX.value, datasetSelectY.value, yValueSelect.value);
		});
		datasetSelectY.addEventListener('change', function() {
			updateYValueDropdown(datasetSelectY.value);
			renderChart(datasetSelectX.value, datasetSelectY.value, yValueSelect.value);
		});
		yValueSelect.addEventListener('change', function() {
			renderChart(datasetSelectX.value, datasetSelectY.value, yValueSelect.value);
		});
	});
}
