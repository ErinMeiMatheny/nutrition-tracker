
let registerButton = document.getElementById('registerButton')



registerButton.addEventListener('click', function() {
  console.log('button works')

// adding variables for register page
let name = document.getElementById('name').value
let email = document.getElementById('email').value
let password = document.getElementById('password').value

if (email === '' || name === '' || password === ''){
alert('Please Enter Required Info')
  console.log(name,email,password)


} else{
  console.log(name,email,password)

axios.post(`/api/users`, {"name": `${name}`,"email": `${email}`,"password": `${password}`},function(response){
  console.log(response)
})
}

})

