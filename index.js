document.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    Search();
    document.getElementById("input").blur();
  }
});

function changeElementsWithClassName(classname, changedEle) {
  document.getElementsByClassName(classname)[0].innerHTML = changedEle;
}

async function Search() {
  const loc_mixcase = document.getElementById("input").value;

  const loc =
    loc_mixcase.charAt(0).toUpperCase() + loc_mixcase.slice(1).toLowerCase();
  const res_coordinates = await superagent.get(
    `https://api.openweathermap.org/geo/1.0/direct?q=${loc}&limit=1&appid={Your-api-id}`
  );
  if (res_coordinates.body.length == 0) {
    errorHandler();
    return;
  }

  const lat = res_coordinates.body[0].lat;
  const lon = res_coordinates.body[0].lon;

  const res = await superagent.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid={Your-api-id}`
  );

  changeElementsWithClassName("header-city", loc);
  changeElementsWithClassName(
    "temp-ele",
    Math.floor(res.body.main.temp - 273.15)
  );
  // for css problem for double digit negetive tempretures
  if((res.body.main.temp - 273.15)<0)
  {
    document.getElementsByClassName("temp-ele")[0].setAttribute("style", `font-size:8rem`);
  }
  else{
    document.getElementsByClassName("temp-ele")[0].setAttribute("style", `font-size:10rem`);
  }
  changeElementsWithClassName("temp-weather", res.body.weather[0].description);
  changeElementsWithClassName(
    "res-feels-like",
    `${Math.floor(res.body.main.feels_like - 273.15)}° C`
  );
  changeElementsWithClassName(
    "res-humidity",
    `${Math.floor(res.body.main.humidity)} %`
  );
  changeElementsWithClassName(
    "res-wind-speed",
    `${Math.floor(res.body.wind.speed * 3.6)} km/h`
  );
  changeElementsWithClassName(
    "res-visibility",
    `${Math.floor(res.body.visibility / 1000)} km`
  );
  changeElementsWithClassName(
    "res-max-temp",
    `${Math.floor(res.body.main.temp_max - 273.15)}° C`
  );
  changeElementsWithClassName(
    "res-air-pressure",
    `${Math.floor(res.body.main.pressure)} hPa`
  );

  updateCard2(lat, lon);
  updateCard3(lat, lon);
  updateDate();
  updatebackground();
}

function errorHandler() {
  changeElementsWithClassName("header-city", "Oops! Couldn't find the city!");
  changeElementsWithClassName("temp-ele", "--");
  changeElementsWithClassName("temp-weather", "--");
  changeElementsWithClassName("res-aq", "----");

  for (let i = 0; i < 6; i++) {
    document.getElementsByClassName("card1-res")[i].innerHTML = "--";
  }
  for (let i = 0; i < 5; i++) {
    document.getElementById(`wdi${i}`).name = "alert-outline";
    document.getElementById(`s${i}`).innerHTML = "--";
  }
  for (let i = 0; i < 4; i++) {
    document.getElementsByClassName("res-card3-comp")[i].innerHTML = "--";
  }
}

function updateDate() {
  const dt = new Date();
  const today = new Date(dt);
  const d = today.toDateString();
  document.getElementById("header-date").innerHTML = d;
}

function updatebackground() {
  change("light rain", " ", "#7c7c7c");
  change("moderate rain", " ", "#5F5F5F");
  change("heavy rain", " ", "#5F5F5F");
  change("light snow", " ", "#7c7c7c");
  change("snow", " ", "#7c7c7c");
  change("heavy snow", " ", "#5F5F5F");
  if (
    document.getElementsByClassName("temp-weather")[0].innerHTML ===
    "light rain"
  )
    document
      .getElementsByTagName("body")[0]
      .setAttribute("style", "background-image:url(./imgs/Light_rain.png)");
  else if (
    document.getElementsByClassName("temp-weather")[0].innerHTML ===
    "moderate rain"
  )
    document
      .getElementsByTagName("body")[0]
      .setAttribute("style", "background-image:url(./imgs/Moderate_rain.png)");
  else if (
    document.getElementsByClassName("temp-weather")[0].innerHTML ===
    "heavy rain"
  )
    document
      .getElementsByTagName("body")[0]
      .setAttribute("style", "background-image:url(./imgs/Heavy_rain.png)");
  else if (
    document.getElementsByClassName("temp-weather")[0].innerHTML ===
    "heavy snow"
  )
    document
      .getElementsByTagName("body")[0]
      .setAttribute("style", "background-image:url(./imgs/Heavy_snow.png)");
  else if (
    document.getElementsByClassName("temp-weather")[0].innerHTML === "snow"
  )
    document
      .getElementsByTagName("body")[0]
      .setAttribute("style", "background-image:url(./imgs/snow.png)");
  else if (
    document.getElementsByClassName("temp-weather")[0].innerHTML ===
    "light snow"
  )
    document
      .getElementsByTagName("body")[0]
      .setAttribute("style", "background-image:url(./imgs/Light_snow.png)");
    else document.getElementsByTagName("body")[0].style.background ="linear-gradient(#393939,#FFFFFF)"

  change("haze", "linear-gradient(#0094FF,#829CAE,#9B9B9B)", "#4F6F8C");
  change("scattered clouds", "linear-gradient(#0073C7,#9B9B9B)", "#00519B");
  change("overcast clouds", "linear-gradient(#393939,#FFFFFF)", "#7c7c7c");
  change("few clouds", "linear-gradient(#0085FF,#00FF47)", "#0085FF");
  change("broken clouds", "linear-gradient(#3984FF,#A8A8A8),#046BCA");
  change("clear sky", "linear-gradient(#0094FF,white)", "#0085FF");
}

function change(tobeMatched, background, themeColor) {
  if (
    document.getElementsByClassName("temp-weather")[0].innerHTML === tobeMatched
  ) {
    document.getElementsByTagName("body")[0].style.background = background;
    for (var i = 0; i < 6; i++)
      document
        .getElementsByClassName("card1-comp")
        [i].setAttribute("style", `color:${themeColor}`);
    for (var i = 0; i < 5; i++)
      document
        .getElementsByClassName("card2-comp")
        [i].setAttribute("style", `color:${themeColor}`);
    for (var i = 0; i < 4; i++)
      document
        .getElementsByClassName("card3-comp")
        [i].setAttribute("style", `color:${themeColor}`);
  }
}

async function updateCard2(lat, lon) {
  const dt = new Date();
  const today = new Date(dt);
  const d = today.getDay();
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  document.getElementById("wd1").innerHTML = "Today";
  document.getElementById("wd2").innerHTML = days[(d + 1)%7];
  document.getElementById("wd3").innerHTML = days[(d + 2)%7];
  document.getElementById("wd4").innerHTML = days[(d + 3)%7];
  document.getElementById("wd5").innerHTML = days[(d + 4)%7];

  const res_5d = await superagent.get(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid={Your-api-id}`
  );

  const iconMapping = {
    Clear: "sunny-outline",
    Clouds: "partly-sunny-outline",
    Rain: "thunderstorm-outline",
    Snow: "snow-outline",
  };

  const forecast_d1 = res_5d.body.list[2].weather[0].main;
  const forecast_d2 = res_5d.body.list[10].weather[0].main;
  const forecast_d3 = res_5d.body.list[18].weather[0].main;
  const forecast_d4 = res_5d.body.list[26].weather[0].main;
  const forecast_d5 = res_5d.body.list[34].weather[0].main;
  document.getElementById("wdi0").name = iconMapping[forecast_d1];
  document.getElementById("wdi1").name = iconMapping[forecast_d2];
  document.getElementById("wdi2").name = iconMapping[forecast_d3];
  document.getElementById("wdi3").name = iconMapping[forecast_d4];
  document.getElementById("wdi4").name = iconMapping[forecast_d5];
  document.getElementById("s0").innerHTML = forecast_d1;
  document.getElementById("s1").innerHTML = forecast_d2;
  document.getElementById("s2").innerHTML = forecast_d3;
  document.getElementById("s3").innerHTML = forecast_d4;
  document.getElementById("s4").innerHTML = forecast_d5;
}

async function updateCard3(lat, lon) {
  const res_Air = await superagent.get(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid={Your-api-id}`
  );
  const pm2_5 = Math.floor(res_Air.body.list[0].components.pm2_5);
  const pm10 = Math.floor(res_Air.body.list[0].components.pm10);
  const so2 = Math.floor(res_Air.body.list[0].components.so2);
  const no2 = Math.floor(res_Air.body.list[0].components.no2);
  const aqi = parseInt(res_Air.body.list[0].main.aqi);
  document.getElementById("pm2.5").innerHTML = pm2_5;
  document.getElementById("pm10").innerHTML = pm10;
  document.getElementById("so2").innerHTML = so2;
  document.getElementById("no2").innerHTML = no2;
  const index = ["Null", "Good", "Fair", "Moderate", "Poor", "Very Poor"];
  document.getElementsByClassName("res-aq")[0].innerHTML = index[aqi];
}
