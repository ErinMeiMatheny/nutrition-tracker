let registerButton = document.getElementById('registerButton')



registerButton.addEventListener('click', function () {
  console.log('button works')

  // adding variables for register page
  let name = document.getElementById('name').value
  let email = document.getElementById('email').value
  let age = document.getElementById('age').value
  let gender = document.getElementById('gender').value
  let height_in = document.getElementById('height').value
  let weight_lbs = document.getElementById('weight').value
  let password = document.getElementById('password').value

  if (email === '' || name === '' || password === '') {
    alert('Please Enter Required Info')
    console.log(name, email, password)


  } else {
    console.log(name, email, age, gender, height_in, weight_lbs, password)

    axios.post(`/register`, { "name": `${name}`, "age": `${age}`, "height_in": `${height_in}`, "weight_lbs": `${weight_lbs}`, "gender": `${gender}`, "email": `${email}`, "password": `${password}` })
      .then(function (response) {
        console.log(response)

        window.location.href = '/login'
      })
  }

});
