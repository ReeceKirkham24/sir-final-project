const usernameinput = document.querySelector('#username')
const emailinput = document.querySelector('#email')
const passwordinput = document.querySelector('#password')
const confirmpasswordinput = document.querySelector('#confirmpassword')
const submitbtn = document.querySelector('#submit')
const form = document.querySelector('#signupform')


form.addEventListener('submit', (e) =>{
    e.preventDefault()
    createNewOrg()
})



async function createNewOrg(){

    try{
        // expected response will be instance of created org
        const response = await fetch("http://localhost:5000/org/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                name: usernameinput.value,
                email: emailinput.value,
                password_hash: passwordinput.value,
                is_account_active: true                
             })
        })
        const data = await response.json()
        console.log(data)

    }catch (err){
        console.error(err.message)
    }
}

// FLOW THROUGH > user enters values in fields, hits submit > pull out values and assign them to variables(or not). trigger post req to an endpoint that creates a user > provide in req.body key value pairs e.g "username" : usernameinput.value
