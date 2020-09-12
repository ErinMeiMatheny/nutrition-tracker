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

      nutrition = data

      console.log(nutrition)

      for (i = 0; i < data.data.hints.length; i++) {
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

          $.post('/api/intake', { "food": `${selectedFood.food.label}`,
          "calories": `${selectedFood.food.nutrients.ENERC_KCAL}`,
          "carb_g": `${selectedFood.food.nutrients.CHOCDF}`,
          "fat_g": `${selectedFood.food.nutrients.FAT}`,
          "pro_g": `${selectedFood.food.nutrients.PROCNT}`,
          "fiber": `${selectedFood.food.nutrients.FIBTG}` }, function (response) {
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

