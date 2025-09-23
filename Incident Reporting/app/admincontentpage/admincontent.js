document.addEventListener('DOMContentLoaded', async function() {
    //stuff to submit ticket and auto severity
	const form = document.getElementById('ticketForm')
    const resultBox = document.getElementById('ticketResult')
    let severity = null
    let ticketBody = null
	if (form) {
        form.addEventListener('submit', async function(e) {
			e.preventDefault()
            
            ticketBody = document.getElementById('ticketbody').value
            console.log(resultBox)
            console.log(ticketBody)

            // section which calls api, if testing ticket creating, please disable this as we onlu have 100 calls per month

            // await fetch('https://www.nyckel.com/v1/functions/support-request-urgency/invoke', {
            //     method: 'POST',
            //     headers: {
            //         'Authorization': 'Bearer ' + 'eyJhbGciOiJSUzI1NiIsInR5cCI6ImF0K2p3dCJ9.eyJpc3MiOiJodHRwczovL3d3dy5ueWNrZWwuY29tIiwibmJmIjoxNzU4NjM1MTE4LCJpYXQiOjE3NTg2MzUxMTgsImV4cCI6MTc1ODYzODcxOCwic2NvcGUiOlsiYXBpIl0sImNsaWVudF9pZCI6IjFudTJhYWEyajJ6NjR3bHdlMHdmZ3VwM2k5eWQ2d2FtIiwianRpIjoiQTM2MkI5MkYwMTNDRjVDMkY5QjM4QkI0RUIzNzFBQkUifQ.XV5cZmw-Y1GeHyFJMfBVysDlgBI4qFUmHHja4MwiG4F-jI9M5aJd_eMmqVK280Ul_hAde6fzRsI_Kr-FbO8yJn4ZB1zGP_Gy0NihTreHgy8VE7-DDORADrb8EepqlBQSYo-HkBJZ9CsqWtbfu9H9oLU2yYsw-MI9twAYMhrF6Bb58fhwfVDFT8pxQFkGAoSMn_GqHkUBvhoaIRhYRHw5Fqnw1vzUulx_LAkBW2xmTht322LVHjmeGGyD971vdJSqfQluCLbwlsGloDsiGKsq0kQUhmVMAZ9MWfrgaIallzy9uwxnHgUnzJBk8FKzoJt7OFoIGuPpWBbeFC2PkXOCjw',
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(
            //         {"data": ticketBody}
            //     )
            // })
            // .then(response => response.json())
            // .then(data => {
            //     severity = data.labelName;
            //     resultBox.innerHTML = `<p><strong>Ticket submitted!</strong> Severity: ${severity}</p>`;
            // });

            // end of section, if commenting above out, uncomment this below

            severity = "Medium";
            resultBox.innerHTML = `<p><strong>Ticket submitted!</strong> Severity: ${severity}</p>`;
            
            const options = {
                method: "POST",
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorisation': localStorage.getItem("utoken")
                },
                body: JSON.stringify({
                    status: "Open",
                    text: ticketBody,
                    severity: severity,
                    category: "temp",
                
                    date_created: new Date().toISOString(),
                    date_completed: null
                })
            }
            console.log(options);
            const response = await fetch("http://localhost:5000/ticket/create", options)
            const data = await response.json();
		})

	}

    const options = {
        method: "GET",
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorisation': localStorage.getItem("utoken")
        }
    }

    const ticketResponse = await fetch("http://localhost:5000/ticket", options)
    const ticketsData = await ticketResponse.json();

    console.log(ticketsData);

    const ticketList = document.getElementById('ticketList');
    ticketList.innerHTML = "";

    ticketsData.forEach(ticket => {
        const ticketDiv = document.createElement('div');
        ticketDiv.className = 'ticket-item';
        ticketDiv.id = ticket.id;
        ticketDiv.setAttribute('data-content', ticket.text || '');
        ticketDiv.setAttribute('data-severity', ticket.severity || '');
        ticketDiv.innerText = ticket.text || 'No description';
        ticketDiv.addEventListener('click', function() {
            const detailDiv = document.querySelector('.ticket-detail');
            let completed
            if(!ticket.date_completed){
                completed = "Still in progress"
            }
            else{
                completed=new Date(ticket.date_completed).toLocaleString()
            }
            detailDiv.innerHTML = `
                <h3>Ticket Details</h3>
                <p><strong>Description:</strong> ${ticket.text}</p>
                <p><strong>Severity:</strong> ${ticket.severity}</p>
                <p><strong>Status:</strong> ${ticket.status}</p>
                <p><strong>Category:</strong> ${ticket.category || 'N/A'}</p>
                <p><strong>Date Created:</strong> ${new Date(ticket.date_created).toLocaleString()}</p>
                <p><strong>Date Completed:</strong> ${completed}</p>
            `;
        });
        ticketList.appendChild(ticketDiv);
    });
});
