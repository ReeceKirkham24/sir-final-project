const loginForm = document.querySelector("#user-login form");

// loginForm.addEventListener("submit", extractInfo);

// function extractInfo(e) {
//     e.preventDefault();
//     console.log(e.target.emailInput.value);
//     console.log(e.target.passwordInput.value);
//     e.target.emailInput.value = "";
//     e.target.passwordInput.value = "";
// }

loginForm.addEventListener("submit", submitForm)

async function submitForm(e) {
    e.preventDefault()
    const data = { 
        email: e.target.emailInput.value,
        password: e.target.passwordInput.value
    }
    console.log(data);

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }

    await fetch(`http://localhost:5001/user/login`, options)


}
