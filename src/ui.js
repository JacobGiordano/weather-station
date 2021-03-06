import currentWeather from "./currentWeather";
import data_ops from "./data_ops";
import makeNewEl from "./makeNewEl";

const ui = {
  clearElement(parentElement) {
    while (parentElement.firstChild) {
      parentElement.removeChild(parentElement.firstChild);
    }
  },
  listFoundLocations(foundJson, searchTerms) {
    const resultsList = document.getElementById("results-list");
    pageMsgs.textContent = "";
    this.clearElement(resultsList);
    resultsEl.classList.remove("fade-in");

    if (foundJson.length === 0) {
      pageMsgs.textContent = `No cities found matching "${searchTerms}". Please try again.`;
    } else if (foundJson.length > 1) {

      pageMsgs.textContent = `${foundJson.length} cities found matching "${searchTerms}"`

      for (let i = 0; i < foundJson.length; i ++) {
        const currentObj = foundJson[i];
        const cityEl = makeNewEl({
          tag: "span",
          classes: "result-city",
          text: `${currentObj.name}`
        });
        const commaEl = makeNewEl({
          tag: "span",
          classes: "result-comma",
          text: ", "
        });
        let stateEl = currentObj.state;
        if (stateEl) {
          stateEl = makeNewEl({
            tag: "span",
            classes: "result-state",
            text: currentObj.state
          });
        }
        const countryEl = makeNewEl({
          tag: "span",
          classes: "result-country",
          text: currentObj.country
        });
        const newLi = makeNewEl({
          tag: "div",
          classes: "results__result",
          attributes: {
            id: `result-${i + 1}`,
            "data-coordinates": `${currentObj.coord.lat}, ${currentObj.coord.lon}`
          }
        });
        newLi.appendChild(cityEl);
        newLi.appendChild(commaEl.cloneNode(true));
        stateEl ? newLi.appendChild(stateEl) : null;
        stateEl ? newLi.appendChild(commaEl) : null;
        newLi.appendChild(countryEl);
        newLi.addEventListener("click", this.handleLocationClick, false);
        newLi.classList.add("fade-in");
        resultsList.appendChild(newLi);
      }
    }
    resultsEl.classList.add("fade-in");
    if (!currentWeatherEl.classList.contains("fade-in")) {
      currentWeatherEl.classList.add("fade-in");
    }
  },
  async handleLocationClick(e) {
    const filteredData = await data_ops.fetchSelectedCityData(e);
    pageMsgs.textContent = "";
    ui.clearElement(resultsList);
    currentWeather.populateCurrentWeather(filteredData);
  },
  async handleSearch() {
    const searchTerms = searchInput.value.trim();
    let foundJson;
    if (searchTerms !== undefined && searchTerms !== "") {
      foundJson = data_ops.findCityInJson(searchTerms);
    } else {
      foundJson = "";
    }
    if (foundJson.length === 0 || foundJson.length > 1) {
      ui.listFoundLocations(foundJson, searchTerms);
    } else {
      pageMsgs.textContent = "";
      const fetchObj = foundJson[0];
      fetchObj.lat = foundJson[0].coord.lat;
      fetchObj.lon = foundJson[0].coord.lon; 
      const returnedData = await data_ops.fetchCityData(fetchObj);
      const filteredData = data_ops.filterData(returnedData, fetchObj);
      currentWeather.populateCurrentWeather(filteredData);
      return filteredData;
    }
  },
  toggleTemp(tempCheckboxIsCheckedBool) {
    tempCheckboxIsCheckedBool ? tempUnitCheckbox.checked = false : tempUnitCheckbox.checked = true;
    if (!tempCheckboxIsCheckedBool) {
      farenheit.classList.add("selected");
      celcius.classList.remove("selected");
    } else {
      celcius.classList.add("selected");
      farenheit.classList.remove("selected");
    }
  },
  updateTemps() {
    const tempElementIdArray = ["current-weather-temp", "current-weather-feels-like"];
    const forecastEls = document.querySelectorAll(".daily-forecast__row");
    for (let i = 0; i < forecastEls.length; i++) {
      const highString = `forecast-row-${i + 1}-high`;
      const lowString = `forecast-row-${i + 1}-low`;
      tempElementIdArray.push(highString, lowString);
    }
    currentWeather.convertTemps(tempElementIdArray);
    data_ops.setTempCheckbox();
  },
  handleTempUnitClick() {
    ui.toggleTemp(tempUnitCheckbox.checked);
    ui.updateTemps();
  },
  closeResults() {
    resultsEl.classList.add("fade-out");

    if (bodyEl.classList.contains("day") || bodyEl.classList.contains("night") || bodyEl.classList.contains("day-gray") || bodyEl.classList.contains("night-gray")) {
      setTimeout(() => {
        resultsEl.classList.remove("fade-in");
        resultsEl.classList.remove("fade-out");
      }, 250);
    } else {
      currentWeatherEl.classList.add("fade-out");
      setTimeout(() => {
        resultsEl.classList.remove("fade-in");
        resultsEl.classList.remove("fade-out");
        currentWeatherEl.classList.remove("fade-in");
        currentWeatherEl.classList.remove("fade-out");
      }, 250);
    }

  }
}

const bodyEl = document.getElementById("body");
const currentWeatherEl = document.getElementById("current-weather");
const searchInput = document.getElementById("search-input");
const resultsEl = document.getElementById("results");
const resultsCloseBtn = document.getElementById("results-close-btn");
const pageMsgs = document.getElementById("results-msg");
const resultsList = document.getElementById("results-list");
const tempUnitCheckbox = document.getElementById("temp-unit-checkbox");
const tempUnitSlider = document.getElementById("temp-unit-slider");
const celcius = document.getElementById("celcius");
const farenheit = document.getElementById("farenheit");

tempUnitSlider.addEventListener("click", e => {
  ui.handleTempUnitClick(e);
});

resultsCloseBtn.addEventListener("click", ui.closeResults, false);

export default ui;