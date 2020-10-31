var cityNameInput = document.querySelector("#inputCityName");
var searchButton = document.querySelector("#searchBtn");

//empty array for use to store search history
var searchHistory = [];
var currentWeatherData = [];

//main function to hit the weather API
var getWeather = function (inputCityName) {
  var queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${inputCityName}&units=imperial&appid=789c208b0036afe3defb6d2d5ebbbe29`;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (data) {
    console.log(data);
    var {
      coord: { lat, lon },
    } = data;
    var day = $("#current-day");
    day.empty();
    var cityName = $("<h2>");
    var temp = $("<h6>");
    var humidity = $("<h6>");
    var windSpeed = $("<h6>");

    cityName.text(data.name + "" + moment().format("l"));
    temp.text("Temperature: " + data.main.temp + " °F");
    humidity.text("Humidity: " + data.main.humidity + " %");
    windSpeed.text("Wind Speed: " + data.wind.speed + " M.P.H");

    day.append(cityName);
    day.append(temp);
    day.append(humidity);
    day.append(windSpeed);

    var uvIndexUrl = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=789c208b0036afe3defb6d2d5ebbbe29`;

    $.ajax({
      url: uvIndexUrl,
      method: "GET",
    }).then(function (data) {
      console.log(data);
      var uvIndex = $("<h6>");
      uvIndex.text("UV Index: " + data.value);
      day.append(uvIndex);
    });

    searchHistory.push(inputCityName);
    //calling setSearch()
    setSearch();
    //five day forecast
    fiveDay(lat, lon);
    $("#inputCityName").val("");
  });
};

//function to create the search history and append it
//TODO: store to local storage
function setSearch() {
  var historyDiv = $("#search-history");
  historyDiv.empty();
  for (var i = 0; i < searchHistory.length; i++) {
    var li = $("<li>", { class: "list-group-item" });
    var newSearchHistory = $("<button>" + searchHistory[i] + "</button>", {
      class: "list-group-item-action",
    });
    li.append(newSearchHistory);
    historyDiv.prepend(li);
  }
}

//fucntion to display current weather in the weather-container
var fiveDay = function (lat, lon) {
  $("#five-day-cards").empty();
  var requestURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=789c208b0036afe3defb6d2d5ebbbe29`;

  $.ajax({
    url: requestURL,
    method: "GET",
  }).then(function (data) {
    console.log(data);
    var dayDiv = $("#five-day-cards");
    var fiveDays = [];
    $("#five-day-cards").empty();
    for (i = 1; i < 5; i++) {
      var day = $("<div>", { class: "card" });
      var date = $("<h5>");
      var weatherIcon = $("<img>");
      var temp = $("<h5>");
      var humidity = $("<h5>");

      date.text(moment.unix(data.daily[i].dt).format("MM/DD/YYYY"));
      weatherIcon.attr("src", data.daily[i].weather[0].icon);
      temp.text("Temp: " + data.daily[i].temp.day);
      humidity.text("Humidity: " + data.daily[i].humidity);

      dayDiv.append(day);
      day.append(date);
      day.append(weatherIcon);
      day.append(temp);
      day.append(humidity);

      fiveDays.push(day);
    }
    $("#five-day-cards").append(fiveDays);
  });
};

$("#searchBtn").on("click", function () {
  getWeather(cityNameInput.value.trim());
});
