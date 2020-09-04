let searchButton = document.getElementById('search')

searchButton.addEventListener('click',function(){
    let food = document.getElementById('search').value

    if (food === '') {
        alert("Please entry a food...");
      } else {
        country = country.replace(/\s+/g, '-').toLowerCase();
      }

      
})