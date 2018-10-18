// ONUS! STEP 5: FILTER GOOD DOGS
// When a user clicks on the Filter Good Dogs button, two things should happen:

// The button's text should change from "Filter good dogs: OFF" to "Filter good dogs: ON", or vice versa.
// If the button now says "ON" (meaning the filter is on), then the Dog Bar should only show pups whose isGoodDog attribute is true. If the filter is off, the Dog Bar should show all pups (like normal).

document.addEventListener("DOMContentLoaded", () => {
  const dogBar = document.getElementById("dog-bar")
  const dogInfoDiv = document.querySelector('#dog-info')
  const goodDogFilter = document.querySelector('#good-dog-filter')
  goodDogFilter.addEventListener("click", filterDogs)
  console.log(dogInfoDiv)
  const url = "http://localhost:3000/pups";
  // fetchDogs()
  fetchDogs().then(renderDogBar)

  function fetchDogs(){
    return fetch(url)
    .then(r => r.json())
  }

  function renderDogBar(dogs){
    dogs.forEach(addDogToDogBar)
  }

  function addDogToDogBar(dog){
    const span = document.createElement("span")
    span.innerText = dog.name
    span.setAttribute("data-id", dog.id)
    // console.log(span)
    span.addEventListener("click", showDogInfo)
    dogBar.append(span)
  }


  function showDogInfo(event){
    const dogId = event.target.dataset.id
    // console.log(event.target.getAttribute("data-id"))
    fetch(`http://localhost:3000/pups/${dogId}`)
    .then(response => response.json())
    .then(dog => {
      const goodOrBad = dog.isGoodDog ? "Good dog!" : "Bad dog!"
      dogInfoDiv.innerHTML = `<img src="${dog.image}">
      <h2>${dog.name}</h2>
      <button data-id=${dog.id}>${goodOrBad}</button>`
      const button = dogInfoDiv.querySelector('button')
      // const button = document.querySelector('#dog-info button')
      button.addEventListener("click", toggleDog)
    })
  }

  function toggleDog(event){
    const goodOrBad = event.target.innerText.slice(0, -5)
    const isGoodDog = goodOrBad === "Good" ? true :false
    const newStatus = isGoodDog ? "Bad dog!" : "Good dog!"
    const dogId = event.target.dataset.id
    fetch(`http://localhost:3000/pups/${dogId}`, {
      method: "PATCH",
      body: JSON.stringify({isGoodDog: !isGoodDog}),
      headers: {"Content-Type": "application/json"}
    })
    .then(res => res.json())
    .then(() => event.target.innerText = newStatus)
    // event.target.innerText = newStatus

   }

   function filterDogs(event){
    dogBar.innerHTML = ""
    const onOrOff = event.target.innerText.split(": ")[1]
    if (onOrOff === "OFF"){
      event.target.innerText = "Filter good dogs: ON"
      fetchDogs()
      .then(dogs => dogs.filter(dog => dog.isGoodDog))
      .then(goodDogs => renderDogBar(goodDogs))
    } else {
      event.target.innerText = "Filter good dogs: OFF"
      fetchDogs().then(renderDogBar)
    }

   }











})
