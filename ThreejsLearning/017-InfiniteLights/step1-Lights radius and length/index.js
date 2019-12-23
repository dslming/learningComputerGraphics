import { App } from "./App.js";
console.clear();

const options = {
  length: 200,
  width: 20,
  roadWidth: 9,
  islandWidth: 2,
  nPairs: 50,
  roadSections: 3
};

const container = document.getElementById("app");
console.log("Container", container);
const myApp = new App(container, options);
myApp.loadAssets().then(myApp.init);
