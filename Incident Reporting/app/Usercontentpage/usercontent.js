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
            //         'Authorization': 'Bearer ' + 'eyJhbGciOiJSUzI1NiIsInR5cCI6ImF0K2p3dCJ9.eyJpc3MiOiJodHRwczovL3d3dy5ueWNrZWwuY29tIiwibmJmIjoxNzU4NTM0MjAxLCJpYXQiOjE3NTg1MzQyMDEsImV4cCI6MTc1ODUzNzgwMSwic2NvcGUiOlsiYXBpIl0sImNsaWVudF9pZCI6IjFudTJhYWEyajJ6NjR3bHdlMHdmZ3VwM2k5eWQ2d2FtIiwianRpIjoiRTEyRjU2MkY1RjY3MkQ4NTNCREMzNEY5MEY0MTIwN0QifQ.g0g4HBLK4n4W2JPGp6pW0Lro57pcnXx-IBD1jplxYz-opoH2Kmk5EPRjQLgOucC0D9u9GM2B2IZNSYhX8E85h77KitdnzJXqp5Y2Kb1DtRCl9JGsHQ9mJpg0NiUR2GBpjAsJQsWor5yXVcxjpfbChgIRRIEK0ciQyn2wEbkrtKIWPEcOAt_rLglKftKYZN9vUIWzH8wWMrgWW4VnDx8vy-d0PWzH5dkpk-vWis4FOP4-UhBRf472rS4zP011IOCODd0cE1lur9z_JYDSLR98e2CJSE6FsOwdcm3F23wWpatECyRFTlJR6Dr2jIU_83HVS70GQRaQyIvBQSLlAjXLJQ',
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

            // end of 2nd section
            
            const options = {
                method: "POST",
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorisation': localStorage.getItem("token")
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
            'authorisation': localStorage.getItem("token")
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
