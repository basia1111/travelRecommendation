const searchInput = document.getElementById("search");
const searchButton = document.getElementById("search-btn");
const resetButton = document.getElementById("reset-btn");
const searchResults = document.getElementById("search-results");

let result;

fetch("travelRecommendation_api.json")
  .then((response) => response.json())
  .then((data) => {
    result = data;
    console.log(result);
  })
  .catch((error) => console.error("Error loading data:", error));

function normalizeKeyword(keyword) {
  const normalizedKeyword = keyword.toLowerCase().trim();
  if (normalizedKeyword === "beach" || normalizedKeyword === "beaches") {
    return "beach";
  } else if (
    normalizedKeyword === "temple" ||
    normalizedKeyword === "temples"
  ) {
    return "temple";
  } else if (
    normalizedKeyword === "country" ||
    normalizedKeyword === "countries"
  ) {
    return "country";
  }
  return normalizedKeyword;
}

function handleSearch() {
  const keywords = searchInput.value.trim().toLowerCase().split(/\s+/);

  if (!keywords.length || keywords[0] === "") {
    searchResults.innerHTML = "<p>Please enter a search term.</p>";
    return;
  }

  searchResults.style.display = "block";

  const allResults = new Set();
  keywords.forEach((keyword) => {
    const normalizedKeyword = normalizeKeyword(keyword);

    if (normalizedKeyword === "beach") {
      searchItems(result.beaches, normalizedKeyword).forEach((item) =>
        allResults.add(item)
      );
      result.beaches.forEach((item) => allResults.add(item));
    } else if (normalizedKeyword === "temple") {
      searchItems(result.temples, normalizedKeyword).forEach((item) =>
        allResults.add(item)
      );
      result.temples.forEach((item) => allResults.add(item));
    } else if (normalizedKeyword === "country") {
      searchCountries(result.countries, normalizedKeyword).forEach((item) =>
        allResults.add(item)
      );
      result.countries.forEach((country) => {
        country.cities.forEach((city) => allResults.add(city));
      });
    } else {
      searchAllItems(result.beaches, keyword).forEach((item) =>
        allResults.add(item)
      );
      searchAllItems(result.temples, keyword).forEach((item) =>
        allResults.add(item)
      );
      searchAllItems(
        result.countries.flatMap((country) => country.cities),
        keyword
      ).forEach((item) => allResults.add(item));
    }
  });

  if (allResults.size === 0) {
    searchResults.innerHTML = "<p>No results found.</p>";
  } else {
    displayResults(Array.from(allResults));
  }
}

function searchItems(array, keyword) {
  return array.filter((item) => {
    const combinedText = `${item.name} ${item.description}`.toLowerCase();
    return combinedText.includes(keyword.toLowerCase());
  });
}

function searchAllItems(array, keyword) {
  return array.filter((item) => {
    const combinedText = `${item.name} ${item.description}`.toLowerCase();
    return combinedText.includes(keyword.toLowerCase());
  });
}

function searchCountries(countries, keyword) {
  return countries
    .map((country) => {
      const countryMatch = country.name
        .toLowerCase()
        .includes(keyword.toLowerCase());

      const matchingCities = country.cities.filter((city) =>
        city.name.toLowerCase().includes(keyword.toLowerCase())
      );

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
      itemImage.src = item.imageUrl;
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
