let searchButton = document.getElementById('searchButton')

searchButton.addEventListener('click', function () {
    let food = document.getElementById('search').value

    if (food === '') {
        alert("Please enter a food...");
      } 

      axios.get(`https://api.edamam.com/api/food-database/v2/parser?ingr=${food}&app_id=ff0784e8&app_key=746c8a2a9f10f042ca5cb05aae701f5e`)
        .then((data)=>{
          let results = document.getElementById('results')

          for (i=0; i<data.data.hints.length; i++){
            let resultsList = document.createElement('div')

            resultsList.innerHTML = data.data.hints[i].food.label
            results.appendChild(resultsList)

            let nutritionInfo = document.createElement('div')
            nutritionInfo.innerHTML = `
            calories: ${data.data.hints[i].food.nutrients.ENERC_KCAL},
            carbs: ${data.data.hints[i].food.nutrients.CHOCDF}g,
            fat: ${data.data.hints[i].food.nutrients.FAT}g,
            protein: ${data.data.hints[i].food.nutrients.PROCNT}g
            `

            results.appendChild(nutritionInfo)

            let addFood = document.createElement('button')
            addFood.innerHTML = 'Log Food'

            results.appendChild(addFood)
            
          console.log(data.data.hints[i].food.nutrients)
          }
        })
        .catch((error)=>{
          console.log('error')
        })
})