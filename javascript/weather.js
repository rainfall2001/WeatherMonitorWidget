/*
 * Constructor function for a WeatherWidget instance.
 * 
 * The constructor function for Weather Widget takes a single paramener, container_element 
 * this is the DOM element passed from the HTML inside which the widget will place its UI\
 *
 */

/**
 * Town object decleared in a constructor function. Used within the WeatherWidget object.
 * @param {number} index The index of the the town in the original array
 * @param {string} name Name of the town
 * @param {number} lat Latitude of the town
 * @param {number} lon Longitude of the town
 */
function Town(index, name, lat, lon){
    var _index = index;
    var _name = name;
    var _lat = lat;
    var _lon = lon;

    this.getIndex = function(){
        return _index;
    }

    this.getName = function(){
        return _name;
    }

    this.getLat = function(){
        return _lat;
    }

    this.getLon = function(){
        return _lon;
    }
}

/**
 * Constructor function for WeatherWidget
 * @param {object} container_element HTLM object
 */
function WeatherWidget(container_element){
    
    //PROPERTIES    

    //array of WeatherLine objects 
    var _selectedTowns = [];
    //array for the places in the database
    var _towns = [];

    //create a fetch request to get the towns name, lat and lon
    var relativeUrl ="~php/getTowns.php";
    var url = relativeUrl.replace('~', '');
    //create an asyc request to the towns database
    fetch(url)
        .then(response => response.json())
        .then(_displayTowns);

    //UI elements of the widget
    var _container = container_element;

    //controls for selecting the place
    var _divSelect = document.createElement("div");
    _divSelect.id = "select-container";
    var _labelSelect = document.createElement("label");
    _labelSelect.setAttribute("for", "places");
    _labelSelect.innerHTML = "Place:";
    var _select = document.createElement("select");
    _select.setAttribute("name", "places");
    _select.id = "places";   
    //when the select drop down box changes it will execute the function
    _select.onchange = function(){
        _addPlace();
    }
    //defualt value for the select drop down box
    var _optionSelect = document.createElement("option");
    _optionSelect.value = -1;
    _optionSelect.innerHTML = "Select";
    _select.appendChild(_optionSelect);

    //controls where the weather line object will be appended to.
    var _divPlaces = document.createElement("div");
    _divPlaces.id = "places-container";
    var _divTitles = ["Town", "Condition", "Temp", "Forecast"];
    //create the four divs for the heading of the widget
    for(var i = 0; i < 4; i++){
        var _divPlaceItem = document.createElement("div");

        var _title = document.createElement("h4");
        _title.innerHTML = _divTitles[i];

        _divPlaceItem.appendChild(_title);
        _divPlaces.appendChild(_divPlaceItem);
    }

    //control to allow the user to refresh the weather 
    var _refreshButton = document.createElement("button");
    _refreshButton.onclick = function(){
        _refreshWeather();
    }

    //append all the controls created to the widget
    _container.appendChild(_divSelect);
    _container.appendChild(_divPlaces);
    _container.appendChild(_refreshButton);


    /**
     * The callback function when accessing the towns database.
     * The data will be used to create town objects.
     * @param {json} response 
     */
    function _displayTowns(response){
        for(i = 0; i < response.length; i++){
            //create an option for each town, specifying each value as the index
            var _option = document.createElement("option");
            _option.value = i;
            _option.innerHTML = response[i].name;
            _select.appendChild(_option);
            
            var town = new Town(i, response[i].name, response[i].lat, response[i].lon);
            _towns.push(town);
        }
        _divSelect.appendChild(_labelSelect);
        _divSelect.appendChild(_select);
    }
    
    //FUNCTIONS

    /**
     * This async method makes a fetch request to the weather api with the selected towns latitude and longitude.
     * @param {number} lat Latitude of the town
     * @param {number} lon Longitude of the town
     * @param {number} index Index of the town in the _towns array
     * @param {function} callback The callback function to execute after the async request has finished
     */
    var _getWeather = async function(lat, lon, index, callback){
        //get the current hour of the day
        var current = new Date();
        var hour = current.getHours();

        //set up the request to the weather api
        //set the hour to the current hour to get more accurate results
        var url = "https://api.weatherapi.com/v1/forecast.json?days=2&aqi=no&alerts=no&hour=" + hour + "&q=" + lat + "," + lon + "&key=api_key";
        
        //make the fetch request
        let response = await fetch(url);
        let responseData = await response.json();
        callback(responseData, index);
    }

    /**
     * This method is called when the user selects a town in the drop down selection.
     * If the town has not been selected the it will call the _getWeather function
     */
    var _addPlace = function(){
        //hide the 'SELECT' option in the drop down box
        _optionSelect.style.display = "none";

        //get the value of the selected option
        var index = _select.options[_select.selectedIndex].value;

        //check if the selected places has already been selected
        if(_selectedTowns.filter(place => place.getTown().getIndex() == index).length == 0){
            _getWeather(_towns[index].getLat(), _towns[index].getLon(), index, _createWeatherLine);
        }       
    } 
    
    /**
     * This method creates a new WeatherLine object with the response data received and adds it the the _selectedTowns array.
     * @param {json} response Data in a JSON object
     * @param {number} index The index number of the town selected in the _town array
     */
    var _createWeatherLine = function(response, index){
        var weatherLine = new WeatherLine(_towns[index], response.current.condition.text, response.current.temp_c, response.forecast.forecastday['1'].hour['0'].condition.text);
        _selectedTowns.push(weatherLine);
    }

    /**
     * This method is called when the user refreshes the container.
     */
    var _refreshWeather = function(){
        for(var i = 0; i < _selectedTowns.length; i++){
            //make a request to the weather api for all the selected towns
            //the callback function passed in will update the WeatherLine object specified
            _getWeather(_selectedTowns[i].getTown().getLat(), _selectedTowns[i].getTown().getLon(), i, _updateWeatherLine);
        }
    }

    /**
     * This callback function is called if the request made is to update the WeatherLine object.
     * The index will be used to update the selected the town.
     * @param {json} response The data in JSON format
     * @param {number} index The index number of the town in the _selectedTowns array
     */
    var _updateWeatherLine = function(response, index){
        _selectedTowns[index].setCondition(response.current.condition.text);
        _selectedTowns[index].setTemperature(response.current.temp_c + " &deg;C");
        _selectedTowns[index].setForecast(response.forecast.forecastday['1'].hour['0'].condition.text);
    }
    

/*********************************************************
* Constructor Function for the inner WeatherLine object to hold the
* full weather data for a town.
********************************************************/
	
    /**
     * Constructor function for WeatherLine. This object will be used to display all the towns and their respective weather selected.
     * @param {Town} town The Town object
     * @param {string} condition The condition of the forecast in the town
     * @param {string} temp The temp in the town
     * @param {string} forecast The forcast for the next day
     */
    var WeatherLine = function(town, condition, temp, forecast) {

			//declare the data properties for the object 
            var _town = town

			//OBJECT LITERAL to represent the WeatherLine widget's UI
			var _ui = {
                itemTown: null,
                itemCondition: null,
                itemTemperature: null,
                itemForecast: null,
                contentTown: null,
                contentCondition: null,
                contentTemperature: null,
                contentForecast: null,
            };

            //initialise the ui elements
			_ui.itemTown = document.createElement("div");
            _ui.itemCondition = document.createElement("div");
            _ui.itemTemperature = document.createElement("div");
            _ui.itemForecast = document.createElement("div");

            _ui.contentTown = document.createElement("p");
            _ui.contentTown.innerHTML = _town.getName();
            _ui.contentCondition = document.createElement("p");
            _ui.contentCondition.innerHTML = condition;
            _ui.contentTemperature = document.createElement("p");
            _ui.contentTemperature.innerHTML = temp + " &deg;C";
            _ui.contentForecast = document.createElement("p");
            _ui.contentForecast.innerHTML = forecast;

            _ui.itemTown.appendChild(_ui.contentTown);
            _ui.itemCondition.appendChild(_ui.contentCondition);
            _ui.itemTemperature.appendChild(_ui.contentTemperature);
            _ui.itemForecast.appendChild(_ui.contentForecast);

            _divPlaces.appendChild(_ui.itemTown);
            _divPlaces.appendChild(_ui.itemCondition);
            _divPlaces.appendChild(_ui.itemTemperature);
            _divPlaces.appendChild(_ui.itemForecast);

            this.getTown = function(){
                return _town
            }
            this.setCondition = function(condition){
                _ui.contentCondition.innerHTML = condition
            }
            this.setTemperature = function(temperature){
                _ui.contentTemperature.innerHTML = temperature;
            }
            this.setForecast = function(forecast){
                _ui.contentForecast.innerHTML = forecast;
            }

		}; 

 };