

axios.get('/userdata')
    .then((data) => {
        console.log(data.data)
        document.getElementById('userAge').innerHTML = `age: ${data.data[0].age}`
        document.getElementById('userGender').innerHTML = `gender: ${data.data[0].gender}`
        document.getElementById('userHeight').innerHTML = `height: ${data.data[0].height_in} in`
        document.getElementById('userWeight').innerHTML = `weight: ${data.data[0].weight_lbs} lbs`
    })
    .catch((error) => {
        console.log("there's a snake in my boot")
    })


axios.get('/intake')
    .then((data) => {
        for (i = 0; i < data.data.length; i++) {
            console.log(data.data[i])
        }
    })
    .catch((error) => {
        console.log('error, cannot retrieve intake')
    })

axios.get('/calories')
    .then((data)=>{
        document.getElementById('calories').innerHTML = data.data[0].sum
    })
    .catch((error)=>{
        console.log('cannot load calories')
    })

    axios.get('/carbs')
    .then((data)=>{
        document.getElementById('carbs').innerHTML = data.data[0].sum
    })
    .catch((error)=>{
        console.log('cannot load calories')
    })

    axios.get('/fats')
    .then((data)=>{
        document.getElementById('fats').innerHTML = data.data[0].sum
    })
    .catch((error)=>{
        console.log('cannot load calories')
    })

    axios.get('/protein')
    .then((data)=>{
        document.getElementById('protein').innerHTML = data.data[0].sum
    })
    .catch((error)=>{
        console.log('cannot load calories')
    })


let searchButton = document.getElementById('searchButton')

let nutrition = []

searchButton.addEventListener('click', function () {

    let food = document.getElementById('search').value

    if (food === '') {
        alert("Please enter a food...");
    }



    axios.get(`https://api.edamam.com/api/food-database/v2/parser?ingr=${food}&app_id=ff0784e8&app_key=746c8a2a9f10f042ca5cb05aae701f5e`)
        .then((data) => {
            let results = document.getElementById('results')

            results.innerHTML = ''

            nutrition = data

            // console.log(nutrition)

            for (i = 0; i < 5; i++) {
                let resultsList = document.createElement('div')

                resultsList.innerHTML = data.data.hints[i].food.label
                results.appendChild(resultsList)

                let nutritionInfo = document.createElement('div')
                nutritionInfo.innerHTML = `

            calories: ${data.data.hints[i].food.nutrients.ENERC_KCAL},
            carbs: ${data.data.hints[i].food.nutrients.CHOCDF}g,
            fat: ${data.data.hints[i].food.nutrients.FAT}g,
            protein: ${data.data.hints[i].food.nutrients.PROCNT}g,
            fiber: ${data.data.hints[i].food.nutrients.FIBTG}g
            `


                results.appendChild(nutritionInfo)

                let logFood = document.createElement('button')
                logFood.innerHTML = 'Log Food'

                logFood.className = 'logFood'

                logFood.id = i

                results.appendChild(logFood)

                // console.log(data.data.hints[i].food.nutrients)

                logFood.addEventListener('click', function (event) {

                    console.log(nutrition.data.hints[event.target.id])

                    let selectedFood = nutrition.data.hints[event.target.id]

                    $.post('/intake', {
                        "food": `${selectedFood.food.label}`,
                        "calories": `${selectedFood.food.nutrients.ENERC_KCAL}`,
                        "carb_g": `${selectedFood.food.nutrients.CHOCDF}`,
                        "fat_g": `${selectedFood.food.nutrients.FAT}`,
                        "pro_g": `${selectedFood.food.nutrients.PROCNT}`,
                        "fiber": `${selectedFood.food.nutrients.FIBTG}`,
                    }, function (response) {
                        console.log(response)
                    })

                })
            }
            document.getElementById('search').value = ''


        })
        .catch((error) => {
            console.log('error')
        })
})

let updateButton = document.getElementById('updateButton')


updateButton.addEventListener('click', function () {

    let name = document.getElementById('name').value
    let age = document.getElementById('age').value
    let height_in = document.getElementById('height_in').value
    let weight_lbs = document.getElementById('weight_lbs').value
    let gender = document.getElementById('gender').value

    age = parseInt(age)
    height_in = parseInt(height_in)
    weight_lbs = parseInt(weight_lbs)


    axios.put(`/userdata`, { "name": `${name}`, "age": `${age}`, "height_in": `${height_in}`, "weight_lbs": `${weight_lbs}`, "gender": `${gender}` })
        .then((data) => {
            console.log(data)
            console.log(age, height_in, weight_lbs, gender)

            document.getElementById('age').value = ''
            document.getElementById('height_in').value = ''
            document.getElementById('weight_lbs').value = ''
            document.getElementById('gender').value = ''

            document.getElementById('userAge').innerHTML = `age: ${age}`
            document.getElementById('userGender').innerHTML = `gender: ${gender}`
            document.getElementById('userHeight').innerHTML = `height: ${height_in} in`
            document.getElementById('userWeight').innerHTML = `weight: ${weight_lbs} lbs`

        })
        .catch((error) => {
            console.log("somethin here ain't right")
        })

})

