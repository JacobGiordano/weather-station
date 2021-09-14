import "core-js/stable";
import "regenerator-runtime/runtime";
import data_ops from "./data_ops.js";
import ui from "./ui.js";

const init = () => {
  const searchForm = document.getElementById("search-form");

  searchForm.addEventListener("submit", e => {
    e.preventDefault();
    ui.handleSearch();
  });

  const storedCheckboxState = data_ops.getTempCheckbox();
  console.log(storedCheckboxState);
  if (storedCheckboxState === "true") {
    console.log("WTF?!");
    ui.toggleTemp(false)
    ui.updateTemps();
  }
};

document.addEventListener("DOMContentLoaded", init);
