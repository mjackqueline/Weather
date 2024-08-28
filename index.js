
const astronomyIconClass = 'astronomy-icon';

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
      hideSpinner();
  }, 3000); 
});

function showSpinner() {
  document.getElementById('loading-spinner').style.display = 'flex';

  const images = document.querySelectorAll('.hidden__image'); // Select all elements with the class 'movie-image'
  images.forEach(image => {
      image.style.visibility = 'hidden'; // Hide each image
  });
}

function hideSpinner() {
  document.getElementById('loading-spinner').style.display = 'none';
  
  const images = document.querySelectorAll('.hidden__image'); // Select all elements with the class 'movie-image'
  images.forEach(image => {
      image.style.visibility = 'visible'; })
}

document.getElementById('fetchWeather').addEventListener('click', () => {
  const city = document.getElementById('cityInput').value;
  if (city) {
    console.log(`Fetching 3-day forecast and astronomy info for: ${city}`);
    getThreeDayForecast(city);
  } else {
    alert('Please enter a city name.');
  }
});

document.getElementById('cityInput').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    const city = document.getElementById('cityInput').value;
    if (city) {
      console.log(`Fetching 3-day forecast and astronomy info for: ${city}`);
      getThreeDayForecast(city);
    } else {
      alert('Please enter a city name.');
    }
  }
});

function getThreeDayForecast(city) {
  const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=bc8c1934794f4ff8ac985719242708&q=${city}&days=3`;
  console.log(`Forecast URL: ${forecastUrl}`); // Debugging

  showSpinner();

setTimeout(() => {
  return fetch(forecastUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('3-day forecast data:', data); // Debugging
      displayForecastInModal(data);
      openModal();
    })
    .catch(error => {
      console.error('Error fetching the 3-day forecast:', error);
      document.getElementById('modalWeatherContainer').innerHTML = `<p>${error.message}</p>`;
      openModal();
    })
    .finally(() => {
      hideSpinner();
  });
  }, 2000); 
}

function openModal() {
  const modal = document.getElementById('weatherModal');
  modal.style.display = 'flex';
  setTimeout(() => {
    modal.classList.add('show');
  }, 50); 
}

function closeModal() {
  const modal = document.getElementById('weatherModal');
  modal.classList.remove('show');
  modal.classList.add('hide');
  setTimeout(() => {
    modal.style.display = 'none';
    modal.classList.remove('hide');
  }, 300); 
}

document.querySelector('.close-button').addEventListener('click', closeModal);


window.addEventListener('click', event => {
  const modal = document.getElementById('weatherModal');
  if (event.target === modal) {
    closeModal();
  }

});

function displayForecastInModal(data) {
  const modalWeatherContainer = document.getElementById('modalWeatherContainer');
  modalWeatherContainer.innerHTML = ''; 

  data.forecast.forecastday.forEach(day => {
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(day.date).toLocaleDateString('en-US', dateOptions);

    const tempCelsiusMin = day.day.mintemp_c.toFixed(1);
    const tempCelsiusMax = day.day.maxtemp_c.toFixed(1);
    const tempFahrenheitMin = day.day.mintemp_f.toFixed(1);
    const tempFahrenheitMax = day.day.maxtemp_f.toFixed(1);
    const weatherText = day.day.condition.text;
    const weatherIcon = day.day.condition.icon; 
    const astronomyIcon = './assets/moon-solid-white.svg'; 

    const sunrise = day.astro.sunrise;
    const sunset = day.astro.sunset;
    const moonrise = day.astro.moonrise;
    const moonset = day.astro.moonset;

    const weatherCard = document.createElement('div');
    weatherCard.className = 'weather-card';

    weatherCard.innerHTML = `
      <h3><span class="dark-pink">${formattedDate}</span></h3>
      <img src="${weatherIcon}" alt="${weatherText}" class="weather-icon">
      <div class="weather-info">
        <p><span class="dark-pink">Min Temperature:</span> ${tempCelsiusMin}°C (${tempFahrenheitMin}°F)</p>
        <p><span class="dark-pink">Max Temperature:</span> ${tempCelsiusMax}°C (${tempFahrenheitMax}°F)</p>
        <p><span class="dark-pink">Condition:</span> ${weatherText}</p>
      </div>
      <div class="astronomy-info" style="display: none;">
        <h4><span class="dark-pink">Astronomy Info</span></h4>
        <p><span class="dark-pink">Sunrise:</span> ${sunrise}</p>
        <p><span class="dark-pink">Sunset:</span> ${sunset}</p>
        <p><span class="dark-pink">Moonrise:</span>: ${moonrise}</p>
        <p><span class="dark-pink">Moonset:</span>: ${moonset}</p>
      </div>
    `;

    const weatherIconElement = weatherCard.querySelector('.weather-icon');

    // Add event listener to the weather icon
    weatherIconElement.addEventListener('click', () => {
      const weatherInfo = weatherCard.querySelector('.weather-info');
      const astronomyInfo = weatherCard.querySelector('.astronomy-info');
      
      if (weatherInfo.style.display === 'none') {
        weatherInfo.style.display = 'block';
        astronomyInfo.style.display = 'none';
        weatherIconElement.src = weatherIcon; // Revert to the original weather icon
        weatherIconElement.classList.remove(astronomyIconClass);

      } else {
        weatherInfo.style.display = 'none';
        astronomyInfo.style.display = 'block';
        weatherIconElement.src = astronomyIcon; // Change to the astronomy icon
        weatherIconElement.classList.add(astronomyIconClass);
      }
    });

    modalWeatherContainer.appendChild(weatherCard);
  });
}
