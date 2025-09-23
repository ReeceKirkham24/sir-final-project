const changePasswordForm = document.querySelector("#changePasswordForm");
const message = document.getElementById('message');

changePasswordForm.addEventListener("submit", submitForm)

async function submitForm(e) {


e.preventDefault()
    const data = { 
        token: localStorage.getItem("utoken"),
        currentpassword: currentPassword.value,
        newpassword: newPassword.value,
        repeatpassword: confirmPassword.value
    }
    console.log(data);

    
    const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }

    try {

        const response = await fetch(`http://localhost:5000/user/changepassword`, options)
        const responsejson = await response.json();

        if (response.ok) {
          message.textContent = responsejson.message || "Password updated successfully.";
          message.classList.add('success');
          changePasswordForm.reset();
        } else {
          message.textContent = responsejson.message || "Failed to update password.";
          message.classList.add('error');
        }

    } catch (error) {

        message.textContent = "An error occurred. Please try again.";
        message.classList.add('error');
        
    }
    




}

