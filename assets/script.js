var cityHistory = [];
var city;

if (localStorage.getItem("cities")) {

    $("#history").empty();

     cityHistory = JSON.parse(localStorage.getItem("cities"));

    for (i = 0; i < cityHistory.length; i++) {
        var historyBtn = $("<button>");
        historyBtn.attr({class: "history-button btn btn-secondary", type: "button"});
        historyBtn.text(cityHistory[i]);
        $("#history").append(historyBtn);
    }

} else {
        var historyBtn = $("<button>");
        historyBtn.attr({class: "history-button btn btn-secondary", type: "button"});
        historyBtn.text($("#search-input").val());
        $("#history").append(historyBtn);

}



$("#search-button").on("click", function(event) {


    event.preventDefault();
    $("#today").empty();
    $("#forecast").empty();
    
    // saving searched cities to local storage
    city = $("#search-input").val();
    cityHistory.push(city);
    localStorage.setItem("cities", JSON.stringify(cityHistory));
    
    //creating buttons for search history

    var historyBtn = $("<button>");
    historyBtn.attr({class: "history-button btn btn-secondary", type: "button"});
    historyBtn.text($("#search-input").val());
    $("#history").append(historyBtn);

    //function for fetching data through API
    today();

    $("#search-input").val("");
    
})
   
$("#history").on("click",".history-button", function(event) {

    event.preventDefault();
    $("#today").empty();
    $("#forecast").empty();

    city = $(this).text();
    today();
})


function today(){
    
    //getting lattitude and longitute info of the city
    // Geocodıng API URL
    
    var geocodingQueryUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=&appid=048d98def2a36b191797cfc81767ae40"; 
    
    fetch(geocodingQueryUrl)
    
    .then(function (response) {        
        return response.json();    
    })
    
    .then(function (data) {
        
        var lat = data[0].lat;
        var lon = data[0].lon;
        
        //5 day forecast API call
        var weatherQueryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" +lon +"&appid=048d98def2a36b191797cfc81767ae40"
        
        fetch(weatherQueryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            var todayBox = $("<div>");
            todayBox.attr("class", "border border-dark p-3");
            $("#today").append(todayBox);
            
            //Today's weather data
            var cityUpperCase = city.charAt(0).toUpperCase() + city.slice(1)
            var today = dayjs();
            var todaysTempKel = data.list[0].main.temp;
            var todaysTemp = (todaysTempKel - 273.15).toFixed(2);
            var todaysWind = data.list[0].wind.speed;
            var todaysHumidity = data.list[0].main.humidity;
            var todaysIconCode = data.list[0].weather[0].icon;
    
            //Today's heading
            var todaysWeatherHeader = $("<h1>");
            todaysWeatherHeader.text(cityUpperCase + " (" + today.format("DD/MM/YYYY") + ") ");
            todayBox.append(todaysWeatherHeader);
                
            //Adding weather icon to the heading
            var todaysIcon = $("<img>");
            todaysIcon.attr("src", "https://openweathermap.org/img/wn/" + todaysIconCode + "@2x.png");
            todaysWeatherHeader.append(todaysIcon);
    
            //adding weather info
            var tempP = $("<p>");
            tempP.text("Temp: " + todaysTemp + " °C");
            todayBox.append(tempP);
            var windP = $("<p>");
            windP.text("Wind: " + todaysWind + " KPH");
            todayBox.append(windP);
            var humidityP = $("<p>");
            humidityP.text("Humidity " + todaysWind + "%");
            todayBox.append(humidityP);


            //5 day forecast
            var fiveDayHeading = $("<h3>");
            fiveDayHeading.text("5-Day Forecast:");
            $("#forecast").append(fiveDayHeading);

            var cardDiv = $("<div>");
            cardDiv.attr("class", "d-flex flex-row");
            $("#forecast").append(cardDiv);

            //checking the UNIX timestap to find midday weather data for 5 days forecast

            for (i = 1; i < data.list.length; i++){
                
                var dateUnix = new Date(data.list[i].dt * 1000);
                var hours = dateUnix.getHours();
                
                if( hours === 12) { 
                    
                    //creating the card
                    var forecastCard = $("<div>");
                    forecastCard.attr("class", "forecast-card mx-auto");
                    cardDiv.append(forecastCard);
                
                    //date
                    var cardHeading = $("<h4>");                        
                    var year = dateUnix.getFullYear();
                    var month = dateUnix.getMonth() + 1;
                    var day = dateUnix.getDate();
                
                    cardHeading.text(day + "/" + month + "/" + year);
                    forecastCard.append(cardHeading);
                
                    //icon
                    var iconCode = data.list[i].weather[0].icon;
                    var thatDaysIcon = $("<img>");
                    thatDaysIcon.attr("src", "https://openweathermap.org/img/wn/" + iconCode + "@2x.png");
                    forecastCard.append(thatDaysIcon);
                
                    //temperature
                    var thatDaysTempKel = data.list[i].main.temp_max;
                    var thatDaysTemp = (thatDaysTempKel - 273.15).toFixed(2);
                    var thatDayTempP = $("<p>");
                    thatDayTempP.text("Temp: " + thatDaysTemp + "°C");
                    forecastCard.append(thatDayTempP);
                
                    //wind
                    var thatDaysWind = data.list[i].wind.speed;
                    var thatDayswindP = $("<p>");
                    thatDayswindP.text("Wind: " + thatDaysWind + "KPH");
                    forecastCard.append(thatDayswindP);
                
                    //humidity
                    var thatDaysHumidity = data.list[i].main.humidity;
                    var thatDayshumidityP = $("<p>");
                    thatDayshumidityP.text("Humidity: " + thatDaysHumidity+ "%");
                    forecastCard.append(thatDayshumidityP);
                
                }
            }
        })   
    })
}






    

