document.addEventListener('DOMContentLoaded', async function() {

    const signout = document.querySelector('#signout')
    signout.addEventListener('click', () =>{
        localStorage.removeItem('utoken')
    })
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

    const commentResponse = await fetch("http://localhost:5000/comment", options);
    const commentData = await commentResponse.json();

    const ticketList = document.getElementById('ticketList');
    ticketList.innerHTML = "";

    ticketsData.forEach((ticket) => {
    const ticketDiv = document.createElement("div");
    ticketDiv.className = "ticket-item";
    ticketDiv.id = ticket.ticket_id;
    ticketDiv.setAttribute("data-content", ticket.text || "");
    ticketDiv.setAttribute("data-severity", ticket.severity || "");
    ticketDiv.innerText = ticket.text || "No description";
    ticketDiv.addEventListener("click", function () {
      const detailDiv = document.querySelector(".ticket-detail");
      let completed;
      if (!ticket.date_completed) {
        completed = "Still in progress";
      } else {
        completed = new Date(ticket.date_completed).toLocaleString();
      }
      const ticketComments = commentData.filter(
        (comment) => comment.ticket_id === ticket.ticket_id
      );
      let commentsHtml = "<div class='comments-section' style='margin-top:32px;'><h3>Comments:</h3>";
      if (ticketComments.length === 0) {
        commentsHtml += "<p>No comments for this ticket.</p>";
      } else {
        commentsHtml += "<ul style='padding-left:0;'>";
        ticketComments.forEach((comment) => {
          commentsHtml += `<li style='list-style:none; margin-bottom:12px;'><strong>${comment.user_name || comment.org_name}:</strong> ${comment.body}</li>`;
        });
        commentsHtml += "</ul>";
      }
      commentsHtml += "</div>";
      detailDiv.innerHTML = `
        <h3>Ticket Details</h3>
        <p><strong>Description:</strong> ${ticket.text}</p>
        <p><strong>Severity:</strong> ${ticket.severity}</p>
        <p><strong>Status:</strong> ${ticket.status}</p>
        <p><strong>Category:</strong> ${ticket.category || "N/A"}</p>
        <p><strong>Date Created:</strong> ${new Date(ticket.date_created).toLocaleString()}</p>
        <p><strong>Date Completed:</strong> ${completed}</p>
        ${commentsHtml}
        <p></p>
        <h3>Post New Comment:</h3>
        <form id="commentForm">
          <textarea id="commentText"></textarea>
          <button type="submit">Post Comment</button>
        </form>
      `;
      const commentForm = document.getElementById("commentForm");
      if (commentForm) {
        commentForm.addEventListener("submit", async function (e) {
          e.preventDefault();
          const commentText = document.getElementById("commentText").value;
          if (!commentText.trim()) {
            alert("Comment cannot be empty.");
            return;
          }
          const options = {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              authorisation: localStorage.getItem("utoken"),
              userType: "user"
            },
            body: JSON.stringify({
              ticket_id: ticket.ticket_id,
              body: commentText,
            }),
          };
          try {
            const response = await fetch("http://localhost:5000/comment/create", options);
            if (!response.ok) {
              const error = await response.json();
              alert("Error posting comment: " + (error.error || response.status));
              return;
            }
            const newComment = await response.json();
            const commentsSection = detailDiv.querySelector('.comments-section ul');
            if (commentsSection) {
              const li = document.createElement('li');
              li.style.listStyle = 'none';
              li.style.marginBottom = '12px';
              li.innerHTML = `<strong>${newComment.user_name || 'You'}:</strong> ${newComment.body}`;
              commentsSection.appendChild(li);
            }
            commentForm.reset();
          } catch (err) {
            alert("Failed to post comment.");
          }
        });
      }
    });
    ticketList.appendChild(ticketDiv);
  });

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
