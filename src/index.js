document.addEventListener("DOMContentLoaded", () => {
  const dogBar = document.getElementById('dog-bar');
  const dogInfoDiv = document.getElementById('dog-info')
  const goodDogButton = document.getElementById('good-dog-filter')
  goodDogButton.addEventListener("click", filterDogs)
  loadDogBar().then(dogs => dogs.forEach(dog => appendNewDog(dog)))

  function filterDogs(event){
    let onOrOff = event.target.innerText.slice(18)
    let filter = onOrOff === "OFF" ? false : true
    dogBar.innerHTML = ""
    if (filter){
      loadDogBar().then(dogs => dogs.forEach(dog => appendNewDog(dog)))
      event.target.innerText = "Filter good dogs: OFF"
    } else {
      event.target.innerText = "Filter good dogs: ON"
      loadDogBar()
      .then(dogs => dogs.filter(dog => dog.isGoodDog))
      .then(filteredDogs => filteredDogs.forEach(dog => appendNewDog(dog)))
    }
  }

  function loadDogBar(){
    return fetch('http://localhost:3000/pups')
    .then(res => res.json())
    // .then(dogs => dogs.forEach(dog => appendNewDog(dog)))
  }

  function appendNewDog(dog){
    const span = document.createElement('span')
    span.innerText = dog.name
    span.setAttribute("data-id", `${dog.id}`);
    span.addEventListener("click", fetchDog)
    dogBar.append(span)
  }

  function fetchDog(event){
    console.log("clicked for more info")
    console.log(event.target)
    const dogId = event.target.getAttribute('data-id')
    fetch(`http://localhost:3000/pups/${dogId}`)
    .then(res => res.json())
    .then(showDogInfo)
    // dogInfoDiv.innerHTML = `<img src="http://localhost:3000/pups/${dogId}"`
  }

  function showDogInfo(dog){
    const goodOrBad = dog.isGoodDog ? "Good" : "Bad"
    dogInfoDiv.innerHTML = `<img src="${dog.image}"><h2>${dog.name}</h2><button data-id=${dog.id}>${goodOrBad} Dog!</button>`
    const button = dogInfoDiv.querySelector('button')
    button.addEventListener("click", toggleGoodBad)
  }

  function toggleGoodBad(event){
    const dogId = event.target.getAttribute("data-id")
    let isGoodDog = event.target.innerText.slice(0, -5) === "Good" ? true : false
    isGoodDog = !isGoodDog
    console.log(isGoodDog)
    fetch(`http://localhost:3000/pups/${dogId}`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({isGoodDog})
    })
    .then(() => {
      let string = isGoodDog ? "Good" : "Bad"
      event.target.innerText = `${string} Dog!`
    })
  }


})
