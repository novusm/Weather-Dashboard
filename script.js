// Function to make an API request to OpenWeather
function fetchWeatherData(city) {
  const apiKey = '532bc622e7d5dd3e064fd021859ae9ec';
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  // Make the API request using fetch
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Handle the API response data here
      displayWeatherData(data);

      // Add the searched city to the search history
      addToSearchHistory(city);

      // Display the 5-day forecast as Bootstrap cards
      displayForecast(data);
    })
    .catch((error) => {
      console.error('Error fetching weather data:', error);
    });
}

// Function to display weather data on the dashboard
function displayWeatherData(data) {
  // Extract the relevant data from the API response
  const cityName = data.city.name;
  const currentDate = new Date();
  const currentIconUrl = `https://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png`;
  const currentTemperatureKelvin = data.list[0].main.temp;
  const currentTemperatureCelsius = (currentTemperatureKelvin - 273.15).toFixed(2); // Convert Kelvin to Celsius and round to 2 decimal places
  const currentHumidity = data.list[0].main.humidity;
  const currentWindSpeed = data.list[0].wind.speed;

  // Update the elements in the current weather section
  document.getElementById('current-city').textContent = cityName;
  document.getElementById('current-date').textContent = currentDate.toDateString();
  document.getElementById('current-icon').src = currentIconUrl;
  document.getElementById('current-temperature').textContent = `Temperature: ${currentTemperatureCelsius}°C`;
  document.getElementById('current-humidity').textContent = `Humidity: ${currentHumidity}%`;
  document.getElementById('current-wind-speed').textContent = `Wind Speed: ${currentWindSpeed} m/s`;
}

// Function to update the search history
function addToSearchHistory(city) {
  // Retrieve the existing search history from localStorage
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

  // Add the new city to the search history
  searchHistory.push(city);

  // Update the localStorage with the updated search history
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

  // Display the updated search history
  displaySearchHistory();
}

// Function to display the search history
function displaySearchHistory() {
  // Retrieve the search history from localStorage
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

  // Get the element where you want to display the history
  const historyElement = document.getElementById('history');

  // Clear the existing content
  historyElement.innerHTML = '';

  // Loop through the search history and create list items
  searchHistory.forEach((city) => {
    const listItem = document.createElement('a');
    listItem.classList.add('list-group-item');
    listItem.textContent = city;

    // click event listener to each item to perform a new search
    listItem.addEventListener('click', () => {
      // Call fetchWeatherData with the selected city
      fetchWeatherData(city);
    });

    historyElement.appendChild(listItem);
  });
}

// Function to make an API request to OpenWeather and display default weather data
function displayDefaultWeather() {
  const defaultCity = 'London';
  fetchWeatherData(defaultCity);
}

// Event listener for the form submission
document.getElementById('search-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const city = document.getElementById('search-input').value;

  // Call the fetchWeatherData function with the user's input
  fetchWeatherData(city);
});

// Call displaySearchHistory() when the page loads
window.addEventListener('load', () => {
  // Display default weather data when the page loads
  displayDefaultWeather();
  displaySearchHistory();
});

// Function to display the 5-day forecast as Bootstrap cards
function displayForecast(data) {
  // Get the forecast data for the next 5 days, starting from the second item
  const forecastData = data.list.slice(1, 6); // Skip the current day

  // Get the element where you want to display the forecast cards
  const forecastElement = document.getElementById('forecast');

  // Clear the existing content
  forecastElement.innerHTML = '';

  // Initialize the current date to the date of the first forecast
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1); // Start from the next day

  // Loop through the forecast data and create cards for each day
  forecastData.forEach((forecastItem) => {
    const iconUrl = `https://openweathermap.org/img/w/${forecastItem.weather[0].icon}.png`;
    const temperatureKelvin = forecastItem.main.temp;
    const temperatureCelsius = (temperatureKelvin - 273.15).toFixed(2); // Convert Kelvin to Celsius
    const humidity = forecastItem.main.humidity;

    // Create a Bootstrap card for each day's forecast
    const card = document.createElement('div');
    card.classList.add('col-md-2', 'mb-3'); // Adjust the column size as needed

    // Display the current date and increment it by one day
    card.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${currentDate.toDateString()}</h5>
          <img src="${iconUrl}" alt="Weather Icon" class="card-img-top">
          <p class="card-text">Temperature: ${temperatureCelsius}°C</p>
          <p class="card-text">Humidity: ${humidity}%</p>
        </div>
      </div>
    `;

    forecastElement.appendChild(card);

    // Increment the current date by one day for the next card
    currentDate.setDate(currentDate.getDate() + 1);
  });
}


// Event listener for the form submission
document.getElementById('search-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const city = document.getElementById('search-input').value;

  // Call the fetchWeatherData function with the user's input
  fetchWeatherData(city);
});

// Call displaySearchHistory() when the page loads
window.addEventListener('load', displaySearchHistory);
