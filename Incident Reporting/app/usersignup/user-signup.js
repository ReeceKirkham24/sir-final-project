document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const options = {
        method: "POST",
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            org_id: 1,
            department_id: 1,
            password_hash: password,
        })
    }
    console.log(options);
    const response = await fetch("http://localhost:3000/user/create", options)
    const data = await response.json();

    if (response.status == 201) {
    window.location.assign("/Incident Reporting/app/Usercontentpage/usercontent.html")
    } else {
        alert(data.error);
    }
})