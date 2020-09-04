let searchButton = document.getElementById('searchButton')

searchButton.addEventListener('click', function () {
    let food = document.getElementById('search').value

    if (food === '') {
        alert("Please enter a food...");
      } 

      axios.get(`https://api.edamam.com/api/food-database/v2/parser?ingr=${food}&app_id=ff0784e8&app_key=746c8a2a9f10f042ca5cb05aae701f5e`)
        .then((results)=>{
          console.log(results)
        })
        .catch((error)=>{
          console.log('error')
        })
})