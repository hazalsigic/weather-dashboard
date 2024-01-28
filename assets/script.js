

$("#search-button").on("click", function(event) {
    event.preventDefault();

    //getting lattitude and longitute info of the city
    var city = $("#search-input").val();

    // Geocodıng API URL
    var geocodingQueryUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=&appid=048d98def2a36b191797cfc81767ae40"; 


    fetch(geocodingQueryUrl)
    .then(function (response) {
        
        return response.json();
    })
    .then(function (data) {
        var lat = data[0].lat;
        var lon = data[0].lon;

        console.log(lat)
        console.log(lon)
        
        //5 day forecast API URL
        var weatherQueryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" +lon +"&appid=048d98def2a36b191797cfc81767ae40"

        fetch(weatherQueryURL)
        .then(function (response) {
            
            return response.json();
        })
        
        .then(function (data) {
            
            console.log(data)
        
        })
        
    })
    

})

