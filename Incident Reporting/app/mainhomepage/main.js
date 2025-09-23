
const orgform = document.querySelector('#orgform')
const orgemailinput = document.querySelector('#orgemail')
const orgpasswordinput = document.querySelector('#orgpassword')
const userform = document.querySelector("#userform");
const useremail = document.querySelector('#useremail')
const userpassword = document.querySelector('#userpassword')
const orgSigninButton = document.querySelector('#org-button-a')
const userSigninAnchor = document.querySelector('#user-button-a');
const aboutButtonAnchor = document.querySelector('#about-button-a')



document.addEventListener('DOMContentLoaded', changeUi)


orgform.addEventListener('submit', (e) =>{
    e.preventDefault()
    orgLogin()
})


userform.addEventListener("submit", submitForm)




async function orgLogin(){
    try{
        const response = await fetch("http://localhost:5000/org/login", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: orgemailinput.value,
                password: orgpasswordinput.value
            })    
        })
        const data = await response.json()
        console.log(data)
        localStorage.setItem("otoken", data.token)
    }catch (err){
        console.error(err.message)
    }
}




async function submitForm(e) {
    e.preventDefault()
    const data = { 
        email: useremail.value,
        password: userpassword.value
    }
    console.log(data);

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }

    const response = await fetch(`http://localhost:5000/user/login`, options)
    const message = await response.json()
    localStorage.setItem("utoken", message.token)
    if(message.token != 'x'){
        window.location.href = '../Usercontentpage/usercontent.html';
    }
    // we need to make the response of a req at this endpoint hold a jwt or any other form of auth
    
}


async function changeUi() {
    if (localStorage.getItem('utoken')) {
        const response = await fetch('http://localhost:5000/user/show', {
            method: 'GET',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorisation: localStorage.getItem('utoken')
            }
        });

        const data = await response.json();
        console.log(data);

        if (data.err === 'Invalid token') {
            console.log('INVALID TOKEN - > THIS WILL CHECK TO SEE IF THE TOKEN IS VALID BEFORE RENDERING');
        } else {
            console.log('we are a user, and we have a valid token');
            // now, update the ui to allow user to navigate to relevant tabs
            userSigninAnchor.textContent = 'Settings';
            userSigninAnchor.setAttribute('href', 'usersettings.html');

            orgSigninButton.textContent = 'Dashboard';
            orgSigninButton.setAttribute('href', '../Usercontentpage/usercontent.html');

            aboutButtonAnchor.textContent = 'Profile';
            aboutButtonAnchor.setAttribute('href', 'profile.html');

        }
    } else if (localStorage.getItem('otoken')) {
        // Handle organisation token updates here
    } else {
        console.log('DEV : No user is currently signed in --> there is no JWT in local storage');
    }
}


















