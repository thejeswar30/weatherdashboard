const API_KEY = "YOUR_OPENWEATHER_API_KEY";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const statusMessage = document.getElementById("statusMessage");
const dashboard = document.getElementById("weatherDashboard");

const cityName = document.getElementById("cityName");
const countryName = document.getElementById("countryName");
const localTime = document.getElementById("localTime");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("weatherDescription");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");

function showMessage(message, type) {
statusMessage.textContent = message;
statusMessage.className = "status";

```
if (type) {
    statusMessage.classList.add(type);
}
```

}

async function getWeather(city) {
if (API_KEY === "YOUR_OPENWEATHER_API_KEY" || API_KEY.trim() === "") {
throw new Error("Please add your OpenWeather API key in script.js.");
}

```
const parameters = new URLSearchParams({
    q: city,
    appid: API_KEY,
    units: "metric"
});

const response = await fetch(API_URL + "?" + parameters.toString());

if (response.status === 401) {
    throw new Error("Invalid API key. Please check your API key.");
}

if (response.status === 404) {
    throw new Error("City not found. Please enter a valid city name.");
}

if (response.status === 429) {
    throw new Error("Too many requests. Please try again later.");
}

if (!response.ok) {
    throw new Error("Unable to get weather data. Please try again.");
}

return await response.json();
```

}

function displayWeather(data) {
const weather = data.weather[0];

```
cityName.textContent = data.name;
countryName.textContent = data.sys.country || "";
temperature.textContent = Math.round(data.main.temp) + "°C";
description.textContent = weather.description;
feelsLike.textContent = Math.round(data.main.feels_like) + "°C";
humidity.textContent = data.main.humidity + "%";
windSpeed.textContent = Number(data.wind.speed).toFixed(1) + " m/s";
pressure.textContent = data.main.pressure + " hPa";
visibility.textContent = (data.visibility / 1000).toFixed(1) + " km";

weatherIcon.src =
    "https://openweathermap.org/img/wn/" + weather.icon + "@2x.png";

weatherIcon.alt = weather.description;

const cityTime = new Date(
    (data.dt + data.timezone) * 1000
);

localTime.textContent = "Local time: " + cityTime.toLocaleString("en-IN", {
    timeZone: "UTC",
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
});

dashboard.hidden = false;
```

}

form.addEventListener("submit", async function (event) {
event.preventDefault();

```
const city = cityInput.value.trim();

if (city === "") {
    showMessage("Please enter a city name.", "error");
    return;
}

searchButton.disabled = true;
searchButton.textContent = "Searching...";
showMessage("Loading weather information...", "");

try {
    const data = await getWeather(city);
    displayWeather(data);
    showMessage("Weather updated successfully!", "success");
} catch (error) {
    showMessage(
        error.message || "Something went wrong. Please try again.",
        "error"
    );
} finally {
    searchButton.disabled = false;
    searchButton.textContent = "Search";
}
```

});
