const searchInput = document.getElementById("search");
const searchButton = document.getElementById("search-btn");
const resetButton = document.getElementById("reset-btn");
const searchResults = document.getElementById("search-results");

let result;

fetch("travelRecommendation_api.json")
  .then((response) => response.json())
  .then((data) => {
    result = data;
  })
  .catch((error) => console.error("Error loading data:", error));

function handleSearch() {
  const keywords = searchInput.value.trim().toLowerCase().split(/\s+/);

  if (!keywords.length || keywords[0] === "") {
    searchResults.innerHTML = "<p>Please enter a search term.</p>";
    return;
  }

  searchResults.style.display = "block";

  const allResults = [
    ...searchItems(result.temples, keywords),
    ...searchItems(result.beaches, keywords),
    ...searchCountries(result.countries, keywords),
  ];

  if (allResults.length === 0) {
    searchResults.innerHTML = "<p>No results found.</p>";
  } else {
    displayResults(allResults);
  }
}

function searchItems(array, keywords) {
  return array.filter((item) => {
    const combinedText = `${item.name} ${item.description}`.toLowerCase();
    return keywords.some((keyword) => combinedText.includes(keyword));
  });
}

function searchCountries(countries, keywords) {
  return countries
    .map((country) => {
      const countryMatch = keywords.some((keyword) =>
        country.name.toLowerCase().includes(keyword)
      );

      const matchingCities = searchItems(country.cities, keywords);

      if (countryMatch || matchingCities.length > 0) {
        return {
          ...country,
          cities: matchingCities,
        };
      }
      return null;
    })
    .filter(Boolean);
}

function displayResults(results) {
  searchResults.innerHTML = "";

  results.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("result-item");

    if (item.cities) {
      const countryName = document.createElement("h2");
      countryName.textContent = item.name;
      itemDiv.appendChild(countryName);

      item.cities.forEach((city) => {
        const cityDiv = document.createElement("div");
        cityDiv.classList.add("city-item");

        const cityName = document.createElement("h3");
        cityName.textContent = city.name;
        const cityImage = document.createElement("img");
        cityImage.src = city.imageUrl;
        cityImage.classList.add("item-image");
        const cityDescription = document.createElement("p");
        cityDescription.textContent = city.description;

        cityDiv.appendChild(cityImage);
        cityDiv.appendChild(cityName);
        cityDiv.appendChild(cityDescription);
        itemDiv.appendChild(cityDiv);
      });
    } else {
      const itemName = document.createElement("h2");
      itemName.textContent = item.name;
      const itemImage = document.createElement("img");
      itemImage.src = city.imageUrl;
      itemImage.classList.add("item-image");
      const itemDescription = document.createElement("p");
      itemDescription.textContent = item.description;

      itemDiv.appendChild(itemImage);
      itemDiv.appendChild(itemName);
      itemDiv.appendChild(itemDescription);
    }

    searchResults.appendChild(itemDiv);
  });
}

function handleReset() {
  searchInput.value = "";
  searchResults.style.display = "none";
  searchResults.innerHTML = "";
}

searchButton.addEventListener("click", handleSearch);
resetButton.addEventListener("click", handleReset);
