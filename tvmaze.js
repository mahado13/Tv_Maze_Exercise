/*
Author: Mahad Osman
Date: Oct 19 2022
Exercise TV Maze
References: 
- Spring Board Provided Files for the base
- Refernece for the ternary operator on line 49.
*/

"use strict";

//A div to hold the shows
const $showsList = $("#shows-list");
//A div to hold our episodes but is currently hidden
const $episodesArea = $("#episodes-area");
//Search form to accept input and search the API
const $searchForm = $("#search-form");

const noImage = "https://tinyurl.com/tv-missing";


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

/*
-get shows connects to the API for us and returns back a the data which we than loopthrough to create an object that we store in array
-The array is than returned to be used in the populateshows function
*/

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  // let newTerm = $('#search-query').val();
  // console.log(newTerm);
  let showList = [];
  let res = await axios.get("https://api.tvmaze.com/search/shows", {
    params: {
      q: term
    }
    })
  for(let show of res.data){
    let newShow = show.show;
    let shows = {id: newShow.id, 
      name: newShow.name, 
      summary: newShow.summary, 
      image: newShow.image ? newShow.image.medium: noImage
    }
    showList.push(shows)
    //console.log(shows);
  }
  console.log(showList);
  return showList;
}


/** Given list of shows, create markup for each and to DOM */
/*
This function will empty the show list section before populating it 
It will loop over the show array which gets passed in from our above function
- it will assign our jquery var the entire new div to be added.
- the data attribute will receive our shows ID
  - to later be used for us to know which shows episode list was clicked
- img src is currently hard coded in but we can pass it in the shows.image
- Show.name and and show.summary are also passed in
- It will than appened it to the DOM
*/
function populateShows(showList) {

  $showsList.empty();

  for (let show of showList) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}" 
              alt="Bletchly Circle San Francisco" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

// async function searchForShowAndDisplay() {
//   const term = $("#searchForm-term").val();
//   const shows = await getShowsByTerm(term);

//   $episodesArea.hide();
//  populateShows(shows);
// }

/* Our form submision handler
- when the form is submitted it will take the input, and pass it into searchFunction
- Than it takes the shows array returned by our search function and passes it into our populate shos function
*/

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  const term = $('#search-query').val();
  let shows = await getShowsByTerm(term);
  //await searchForShowAndDisplay();
  populateShows(shows);
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
/*
-Operates the same as our show search except it takes our ID passed in from our episode button click
-It will than search the API using that shows unique ID than generates an episode list with the specifed data.
-We than pass the object into an array to be used in our populate episodes function
*/

async function getEpisodesOfShow(id) { 
  let res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`)
  //console.log(res.data);
  let episodeList = [];
  for(let episode of res.data){
    //let newEpisode = episode.episode;
    let episodes = {
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number,
      date: episode.airdate
    }
    episodeList.push(episodes);
  }
  console.log(episodeList);
  return episodeList;
}

/** Write a clear docstring for this function... */
/**
 * @name populateEpisodes
 * @description: Operates very similarly to our populateShows function. It will appened li's to our episode ul using our passed in array.
 * - It will also than unhide the hidden episode area at the bottom of the page.
 * @param {episodes} the episodes array passed by getEpisodesofShow 
 */
function populateEpisodes(episodes) { 
  const $episodeList = $('#episodes-list');
  $episodeList.empty();
  //$episodesArea.empty();

  for(let episode of episodes){
      const $episode = $(
        `<li> 
        Season: ${episode.season}
        Ep: ${episode.number}  -${episode.name} (${episode.date})</li>`
      )

    console.log($episode)
    $episodeList.append($episode);
      }
    //$("#episodes-area").show();
    $episodesArea.show();
}


/*
- Our Event Handler to track to retrieve episodes for the clicked episode list
- It listens for a click on the .getEpisode buttons of the entire shows-list div
- It will than return the targets cloest parent elements ID 
- That ID is then passed in to be used by our getEpisodes function 
- It will than pass in our returned episode array into our populateEpisode function
*/
//let $button = $(".btn btn-outline-light btn-sm getEpisodes")
$("#shows-list").on("click",'.getEpisodes' ,async function(evt){
    //console.log($(evt.target.closest(".Show").data('showId')))//.getAttribute('data-show-id'))//.dataset("show-id")));
  let $show =$(evt.target.closest(".Show"))
  let $id = $show.data("showId");
  console.log($id);
  let episodes = await getEpisodesOfShow($id);
  populateEpisodes(episodes);
})