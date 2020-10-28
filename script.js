var cityNameInput = document.querySelector("#inputCityName");
var searchButton = document.querySelector("#searchBtn");

//empty array for use to store search history
var searchHistory = [];

function getWeather(inputCityName) {
  var queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${inputCityName}&units=imperial&appid=789c208b0036afe3defb6d2d5ebbbe29`;

  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      searchHistory.push(inputCityName);
      console.log(searchHistory);
      //call the new function to display search history
      setSearch();
      $("#inputCityName").val("");
    });
}

// create a new function that manipuates the dom to add the most recent search to a search history div setSearch()
function setSearch() {
  var historyDiv = $("#search-history");
  for (var i = 0; searchHistory.length; i++) {
    var newSearchHistory = $("<button>" + searchHistory[i] + "</button>");
    historyDiv.prepend(newSearchHistory);
  }
}

$("#searchBtn").on("click", function () {
  getWeather(cityNameInput.value.trim());
});
