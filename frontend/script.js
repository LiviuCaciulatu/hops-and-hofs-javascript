const buttonComponent = (id, text) => `<button id="${id}">${text}</button>`;

const beerTypeComponent = (list) => list.map((tag) => `<li>${tag}</li>`);

const beerComponent = ({ brewery, name, type, score, abv }) => `
	<div class="beer">
		<h2>${name}</h2>
		<h3>${brewery}</h3>
		<ul>${beerTypeComponent(type)}</ul>
		<h4>${score}</h4>
		<h5>${abv}</h5>
	</div>
`;

const winnerComponent = (beer) => `
	<div id="winner">
		<h1>The best light Ale is</h1>
		${beerComponent(beer)}
		${buttonComponent("closeWinner", "Close")}
	</div>
`;

const loadEvent = (_) => {
  // the HTML elements with ID are available as global variables with the ID (eg. root) but it is better if you
  const rootElement = document.getElementById("root");

  //You can add the HTML code to the DOM like this
  rootElement.insertAdjacentHTML("afterbegin",buttonComponent("loadBeers", "Load the Beers"));
  const buttonElement = document.getElementById("loadBeers");
  let isAscending = true;
  let isStrong = false;
  const renderBeers = (beers) => {
    document.querySelectorAll(".beer").forEach((e) => e.remove());
    const beerElements = beers.map((beer) => beerComponent(beer)).join("");
    rootElement.insertAdjacentHTML("beforeend", beerElements);
  };
  const sortedBeers = (beers) => {
    document.querySelectorAll(".beer").forEach((e) => e.remove());
    const sortedBeers = [...beers].sort((a, b) => a.score - b.score);
    if (!isAscending) {
      sortedBeers.reverse();
    }
    const beerElements = sortedBeers.map((beer) => beerComponent(beer)).join("");
    rootElement.insertAdjacentHTML("beforeend", beerElements);
  };
  const filteredSortedBeers = (beers) => {
    document.querySelectorAll(".beer").forEach((e) => e.remove());
    const sortedBeers = [...beers].sort((a, b) => a.score - b.score);
    if (!isAscending) {
      sortedBeers.reverse();
    }
    const filteredBeers = sortedBeers.filter(
      (beer) => beer.type.includes("IPA") && beer.abv >= 6
    );
    const beerElements = filteredBeers.map((beer) => beerComponent(beer)).join("");
    rootElement.insertAdjacentHTML("beforeend", beerElements);
  };
  const winningBeer = (beers) => {
    document.querySelectorAll(".beer").forEach((e) => e.remove());
    const lightAles = beers.filter(
      (beer) => beer.type.includes("Ale") && beer.abv <= 6
    );
    const bestLightAle = lightAles.reduce(
      (acc, curr) => {
        if (curr.score > acc.score) {
          return curr;
        }
        return acc;
      },
      { score: 0 }
    );
    rootElement.insertAdjacentHTML("beforeend", winnerComponent(bestLightAle));
  };

  const clickEvent = (event) => {
    if (event.target.id === "loadBeers") {
      buttonElement.remove();
      renderBeers(beers);
      rootElement.insertAdjacentHTML( "afterbegin",buttonComponent("filterStrongIPAs", "Strong IPAs"));
      rootElement.insertAdjacentHTML("afterbegin", buttonComponent("sortByScore", "Sort by Score"));
      rootElement.insertAdjacentHTML( "afterbegin", buttonComponent("bestLightAle", "Best Light Ale"));
    } else if (event.target.id === "sortByScore") {
      document.querySelectorAll(".beer").forEach((e) => e.remove());
      if (isAscending && !isStrong) {
        sortedBeers(beers);
        isAscending = false;
      } else if (isAscending && isStrong) {
        filteredSortedBeers(beers);
        isAscending = false;
      } else if (!isAscending && isStrong) {
        filteredSortedBeers(beers);
        isAscending = true;
      } else if (!isAscending && !isStrong) {
        sortedBeers(beers);
        isAscending = true;
      }
    } else if (event.target.id === "filterStrongIPAs") {
      const buttonElement = document.getElementById("filterStrongIPAs");
      buttonElement.remove();
      if (!document.querySelector("#resetFilter")) {
        rootElement.insertAdjacentHTML("beforeend",buttonComponent("resetFilter", "Reset filter"));
      }
      filteredSortedBeers(beers);
      isStrong = true;
    } else if (event.target.id === "resetFilter") {
      const buttonElement = document.getElementById("resetFilter");
      buttonElement.remove();
      if (!document.querySelector("#filterStrongIPAs")) {
        rootElement.insertAdjacentHTML("beforeend",buttonComponent("filterStrongIPAs", "Strong IPAs"));
      }
      sortedBeers(beers);
      isStrong = false;
    } else if (event.target.id === "bestLightAle") {
      winningBeer(beers);
      const bestBtnElement = document.getElementById("bestLightAle");
      const sortBtnElement = document.getElementById("sortByScore");
      const strongBtnElement = document.getElementById("filterStrongIPAs");
      const filterBtnElement = document.getElementById("resetFilter");
      bestBtnElement.remove();
      sortBtnElement.remove();
      if (strongBtnElement) {
        strongBtnElement.remove();
      } else if (filterBtnElement) {
        filterBtnElement.remove();
      }
    } else if (event.target.id === "closeWinner") {
      document.getElementById("winner").remove();
      renderBeers(beers);
      rootElement.insertAdjacentHTML("afterbegin",buttonComponent("filterStrongIPAs", "Strong IPAs"));
      rootElement.insertAdjacentHTML("afterbegin", buttonComponent("sortByScore", "Sort by Score"));
      rootElement.insertAdjacentHTML("afterbegin",buttonComponent("bestLightAle", "Best Light Ale"));
    }
  };
  window.addEventListener("click", clickEvent);
};

// you can run your code in different ways but this is the safest. This way you can make sure that all the content (including css, fonts) is loaded.
window.addEventListener("load", loadEvent);
