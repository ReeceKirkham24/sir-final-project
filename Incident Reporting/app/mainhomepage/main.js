const orgform = document.querySelector('#orgloginform')
const orgemailinput = document.querySelector('#orgemailinput')
const orgpasswordinput = document.querySelector('#orgpasswordinput')


orgform.addEventListener('submit', (e) =>{
    e.preventDefault()
    orgLogin()
})


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















// user makes req to an endpoint that triggers api > passes their login credentials to backend >
//  backend looks for user where their unique details are same(i.e email) >
//  if there is 1, remove hashin on their pass and compare to user data >
//  if there is match, return jwt and other auth stuff



