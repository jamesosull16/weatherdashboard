$(document).ready(function () {
  localStorage.getItem("searchHistory");
});

var cityNameInput = document.querySelector("#inputCityName");
var searchButton = document.querySelector("#searchBtn");

//empty array for use to store search history
var searchHistory = [];
var currentWeatherData = [];

//main function to hit the weather API
var getWeather = function (inputCityName) {
  var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${inputCityName}&units=imperial&appid=789c208b0036afe3defb6d2d5ebbbe29`;

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

    var weatherIcon = data.weather[0].icon;
    var weatherIconUrl =
      "<img src='https://openweathermap.org/img/wn/" +
      weatherIcon +
      "@2x.png' width='60'></img>";

    cityName.text(data.name + " " + moment().format("(" + "l" + ")"));
    temp.text("Temperature: " + data.main.temp + " °F");
    humidity.text("Humidity: " + data.main.humidity + " %");
    windSpeed.text("Wind Speed: " + data.wind.speed + " M.P.H");

    day.append(cityName);
    day.append(weatherIconUrl);
    day.append(temp);
    day.append(humidity);
    day.append(windSpeed);

    var uvIndexUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=789c208b0036afe3defb6d2d5ebbbe29`;

    $.ajax({
      url: uvIndexUrl,
      method: "GET",
    }).then(function (data) {
      console.log(data);
      var uvIndex = $("<p>", { class: "uv-index" });
      var uvIndexValue = "<p>";
      uvIndex.text("UV Index: " + data.value);
      day.append(uvIndex);
      var uvIndexValue = data.value;
      if (uvIndexValue >= 3 && uvIndexValue <= 5) {
        $("p").css({ "background-color": "yellow" });
      } else if (uvIndexValue >= 6 && uvIndexValue <= 7) {
        $("p").css({ "background-color": "Orange" });
      } else if (uvIndexValue >= 8 && uvIndexValue <= 10) {
        $("p").css({ "background-color": "Red" });
      } else if (uvIndexValue >= 11) {
        $("p").css({ "background-color": "Violet" });
      } else {
        $("p").css({ "background-color": "Green" });
      }
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
    var button = $("<button>", {
      type: "button",
      class: "list-group-item list-group-item-action",
    });
    var li = $("<li>", { class: "list-group-item" });

    li.text(searchHistory[i]);

    historyDiv.prepend(button);
    button.append(li);
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
    var fiveDays = [];
    var titleDiv = $("#title");
    $("#title").empty();
    var title = $("<h2>");
    $("#five-day-cards").empty();
    for (i = 1; i < 6; i++) {
      var dayDiv = $("#five-day-cards");
      var daysCol = $("<div>", { class: "col-lg-1.5" });
      var day = $("<div>", { class: "card card-body" });
      var date = $("<h5>");
      var temp = $("<h5>");
      var humidity = $("<h5>");

      var fiveDayWeatherIcon = data.daily[i].weather.icon;
      var fiveDayWeatherIconUrl =
        "<img src='https://openweathermap.org/img/wn/" +
        fiveDayWeatherIcon +
        "@2x.png'></img>";

      title.text("5-Day Forecast:");
      date.text(moment.unix(data.daily[i].dt).format("MM/DD/YYYY"));
      temp.text("Temp: " + data.daily[i].temp.day + " °F");
      humidity.text("Humidity: " + data.daily[i].humidity + " %");

      titleDiv.append(title);
      dayDiv.append(day);
      day.append(daysCol);
      daysCol.append(date);
      daysCol.append(fiveDayWeatherIconUrl);
      daysCol.append(temp);
      daysCol.append(humidity);

      fiveDays.push(day);
    }
    $("#five-day-cards").append(fiveDays);
  });
};

$("#searchBtn").on("click", function () {
  getWeather(cityNameInput.value.trim());
  localStorage.setItem("newSearchHistory", cityNameInput.value.trim());
});

$("#cityBtn").on("click", function () {
  getWeather(cityNameInput);
});
