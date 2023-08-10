const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve your HTML form
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// Handle form submission
app.post("/", function (req, res) {
  const query = req.body.CITYNAME;
  const apiKey = "ac5488019bbc6dc5bc298bec2a1cdd84";
  const unit = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    unit;

  https.get(url, function (response) {
    console.log(response.statusCode);

    let weatherData = "";
    response.on("data", function (data) {
      weatherData += data;
    });

    response.on("end", function () {
      const weather = JSON.parse(weatherData);
      const temp = weather.main.temp;
      const weatherDesc = weather.weather[0].description;
      const icon = weather.weather[0].icon;
      const imgUrl =
        "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      // Create a dynamic HTML page with weather information and styling
      const htmlOutput = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Weather Info</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                background-image: url("https://www.qsl.net/2e0fwc/Weather/noaa-18-201511111715-mcir-precip.jpg");
                background-size: cover;
              }
              .container {
                padding: 20px;
                background-color: rgba(255, 255, 255, 0.7);
                border-radius: 10px;
                margin: 50px auto;
                max-width: 400px;
              }
              h1 {
                color: #333;
              }
              h3 {
                color: #555;
              }
              img {
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Weather in ${query}</h1>
              <h3>Temperature: ${temp}°C</h3>
              <h3>Description: ${weatherDesc}</h3>
              <img src="${imgUrl}" alt="Weather Icon">
            </div>
          </body>
        </html>
      `;

      res.send(htmlOutput);
    });
  });
});

// Start the server
const PORT = 2002;
app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
});
