document.addEventListener('DOMContentLoaded', async function() {
    // ---------------- Ticket Submission ----------------
    const form = document.getElementById('ticketForm');
    const resultBox = document.getElementById('ticketResult');
    let severity = null;
    let ticketBody = null;

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            ticketBody = document.getElementById('ticketbody').value;
            severity = "Medium"; // default severity for now
            resultBox.innerHTML = `<p><strong>Ticket submitted!</strong> Severity: ${severity}</p>`;

            const options = {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    authorization: localStorage.getItem("utoken")
                },
                body: JSON.stringify({
                    status: "Open",
                    text: ticketBody,
                    severity: severity,
                    category: "temp",
                    date_created: new Date().toISOString(),
                    date_completed: null
                })
            };

            try {
                const response = await fetch("http://localhost:5000/ticket/create", options);
                const data = await response.json();
                console.log("Ticket created:", data);
            } catch (err) {
                console.error("Error creating ticket:", err);
            }
        });
    }

    // ---------------- Load Existing Tickets ----------------
    const options = {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorisation': localStorage.getItem("utoken")
        }
    };

    try {
        const ticketResponse = await fetch("http://localhost:5000/ticket", options);
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
                let completed = ticket.date_completed
                    ? new Date(ticket.date_completed).toLocaleString()
                    : "Still in progress";

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
    } catch (err) {
        console.error("Error fetching tickets:", err);
    }

    // ---------------- Delete Account Functionality ----------------
    const deleteBtn = document.getElementById('deleteAccountBtn');
    const modal = document.getElementById('deleteModal');
    const cancelDelete = document.getElementById('cancelDelete');
    const confirmDelete = document.getElementById('confirmDelete');
    const deleteError = document.getElementById('deleteError');
    const confirmInput = document.getElementById('confirmUsername');

    // Open modal
    deleteBtn.addEventListener('click', () => {
        confirmInput.value = "";
        deleteError.textContent = "";
        modal.style.display = 'flex';
    });

    // Close modal
    cancelDelete.addEventListener('click', () => modal.style.display = 'none');

    // Confirm deletion
    confirmDelete.addEventListener('click', async () => {
        const enteredUsername = confirmInput.value.trim();
        const actualUsername = localStorage.getItem("username"); // pull actual username

        if (enteredUsername !== actualUsername) {
            deleteError.textContent = "Username does not match.";
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/user/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: enteredUsername })
            });

            if (response.ok) {
                alert("Account deleted successfully.");
                localStorage.clear(); // clear user data
                window.location.href = "../mainhomepage/index.html#hero";
            } else {
                deleteError.textContent = "Failed to delete account.";
            }
        } catch (err) {
            deleteError.textContent = "An error occurred. Try again.";
        }
    });
});
