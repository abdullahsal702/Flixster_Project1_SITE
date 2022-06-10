//DOM
nowPlayingLabel = document.querySelector(".now-playing-label")
movieArea = document.querySelector(".movie-area")
moreBtn = document.querySelector("#more-btn")
formElement = document.querySelector("form")
clearBtn = document.querySelector("#clear-btn")

//parameters for movies now playing - api_key, language, page 
//each page returns 20 movies 
const apiKey = "e4fd27e210774cb80f601a9ef1f77fc6"
let page = 1 
let keyWord = ""
let searched = false 

//test for batman query 
//let url = "https://api.themoviedb.org/3/search/movie?api_key=e4fd27e210774cb80f601a9ef1f77fc6&language=en-US&query=batman&page=1&include_adult=false"

async function getHomePageResults() {
    let url = "https://api.themoviedb.org/3/movie/popular?api_key=" + apiKey + "&language=en-US&page=" + page 
    
    let response = await fetch(url)
    let responseData = await response.json()
    console.log(responseData)
    displayResults(responseData)
    page += 1
}

async function getResults(evt) {

    evt.preventDefault() 

    if (evt.target.id == "clear-btn"){
        page = 1
        let moviesDisplayed = document.querySelectorAll(".movie-cell")
        moviesDisplayed.forEach((movie) => {
            movie.remove()
        })
        searched = false 
        keyWord = ""
        clearBtn.classList.add("hidden")
        nowPlayingLabel.classList.remove("hidden")
    }

    let url = ""

    if (evt.target.className == "search"){
        clearBtn.classList.remove("hidden")
        nowPlayingLabel.classList.add("hidden")
        console.log(nowPlayingLabel.classList)
        page = 1
        let moviesDisplayed = document.querySelectorAll(".movie-cell")
        moviesDisplayed.forEach((movie) => {
            movie.remove()
        })
        //for searching with keyword
        keyWord = evt.target.searchbox.value
        url += "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&language=en-US&page=" + page + "&query=" + keyWord
        searched = true 
    } else if (searched == true) {
        //loading more movies of a searched keyword
        url += "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&language=en-US&page=" + page + "&query=" + keyWord
    } else {
        //for displaying current movies 
        url += "https://api.themoviedb.org/3/movie/popular?api_key=" + apiKey + "&language=en-US&page=" + page 
    }
    
    let response = await fetch(url)
    let responseData = await response.json()
    console.log(responseData)
    displayResults(responseData)
    page += 1
    // console.log(evt.target.className)
}

function displayResults(responseData) {
    responseData.results.forEach((data) =>  {
        //accounts for a movie not having a poster image
        if (data.poster_path == null) {
            movieArea.innerHTML += `
            <div class="movie-cell">
                <img class="blank-poster" src="assets/no-image.png" width="500 alt="movie-poster" />
                <p>Rating: ${data.vote_average}</p>
                <p>${data.original_title}</p>
            </div> 
            `
        } else {
            movieArea.innerHTML += `
            <div class="movie-cell">
                <img class="poster" src="https://image.tmdb.org/t/p/w500/${data.poster_path}" alt="movie-poster" />
                <div class="rating">
                    <img class="rating-icon" src="assets/star.png" alt="star-icon" />
                    <span class="rating-txt">${data.vote_average}</span>
                </div>
                <p>${data.original_title}</p>
            </div> 
            `
        }
    })
}

//loads more movies
moreBtn.addEventListener("click", getResults)

//searches for specific movies 
formElement.addEventListener("submit", getResults)

//clears search results and returns to current movie screen 
clearBtn.addEventListener("click", getResults)

//for modal
modalElement = document.querySelector(".modal-container")
closeElement = document.querySelector(".close")

window.onload = function() {
    getHomePageResults()
    moviePosterElements = document.getElementsByClassName("poster")
    //modal popup on poster click 
    console.log(moviePosterElements)
    console.log(moviePosterElements.item(0))
    console.log(moviePosterElements.length)
    // moviePosterElements[0].onclick = function() {
    //     modalElement.style.display = "block"
    // }
};