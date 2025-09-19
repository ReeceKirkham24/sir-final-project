const orgform = document.querySelector('#orgloginform')
const orgemailinput = document.querySelector('#orgemailinput')
const orgpasswordinput = document.querySelector('#orgpasswordinput')
const userform = document.querySelector("#userform");
const useremail = document.querySelector('#useremail')
const userpassword = document.querySelector('#userpassword')

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
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: orgemailinput.value,
                password: orgpasswordinput.value
            })    
        })
        const data = await response.json()
        console.log(data)
    }catch (err){
        console.error(err.message)
    }
}




async function submitForm(e) {
    e.preventDefault()
    const data = { 
        email: e.target.useremail.value,
        password: e.target.userpassword.value
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
    console.log(message)

}















// user makes req to an endpoint that triggers api > passes their login credentials to backend >
//  backend looks for user where their unique details are same(i.e email) >
//  if there is 1, remove hashin on their pass and compare to user data >
//  if there is match, return jwt and other auth stuff



