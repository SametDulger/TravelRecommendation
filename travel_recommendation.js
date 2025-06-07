const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const clearBtn = document.getElementById('clear-btn');
const resultsDiv = document.getElementById('results');

let dataCache = null;

async function fetchData() {
  try {
    const response = await fetch('travel_recommendation_api.json');
    const data = await response.json();
    dataCache = data;
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

function normalize(str) {
  return str.toLowerCase().trim();
}

function matchesKeyword(text, keyword) {
  const normText = normalize(text);
  const normKeyword = normalize(keyword);

  if (normText.includes(normKeyword)) return true;
  // also accept plural forms: add or remove 's'
  if (normText.includes(normKeyword + 's')) return true;
  if (normText + 's' === normKeyword) return true;

  return false;
}

function filterResults(keyword) {
  if (!dataCache) return [];

  keyword = normalize(keyword);

  const matchedCountries = [];
  const matchedTemples = [];
  const matchedBeaches = [];

  if (!keyword) return [];

  if (keyword.includes('beach') || keyword.includes('beaches') || keyword.includes('plaj')) {
    for (const beach of dataCache.beaches) {
      if (matchesKeyword(beach.name, keyword)) matchedBeaches.push(beach);
    }
    if (matchedBeaches.length === 0) matchedBeaches.push(...dataCache.beaches.slice(0, 2));
  } else if (keyword.includes('temple') || keyword.includes('temples') || keyword.includes('tapınak')) {
    for (const temple of dataCache.temples) {
      if (matchesKeyword(temple.name, keyword)) matchedTemples.push(temple);
    }
    if (matchedTemples.length === 0) matchedTemples.push(...dataCache.temples.slice(0, 2));
  } else {
    // match countries and cities
    for (const country of dataCache.countries) {
      if (matchesKeyword(country.name, keyword)) {
        matchedCountries.push(...country.cities);
      } else {
        for (const city of country.cities) {
          if (matchesKeyword(city.name, keyword)) matchedCountries.push(city);
        }
      }
    }
    if (matchedCountries.length === 0) {
      // fallback: show first two cities from first country
      matchedCountries.push(...dataCache.countries[0].cities.slice(0, 2));
    }
  }

  return {
    countries: matchedCountries,
    temples: matchedTemples,
    beaches: matchedBeaches,
  };
}

function renderResults(results) {
  resultsDiv.innerHTML = '';

  if (!results) return;

  const { countries, temples, beaches } = results;

  if (countries.length) {
    countries.forEach(city => {
      const div = document.createElement('div');
      div.classList.add('result-item');
      div.innerHTML = `
        <img src="${city.imageUrl}" alt="${city.name}" />
        <div class="result-info">
          <h3>${city.name}</h3>
          <p>${city.description}</p>
        </div>
      `;
      resultsDiv.appendChild(div);
    });
  }

  if (temples.length) {
    temples.forEach(temple => {
      const div = document.createElement('div');
      div.classList.add('result-item');
      div.innerHTML = `
        <img src="${temple.imageUrl}" alt="${temple.name}" />
        <div class="result-info">
          <h3>${temple.name}</h3>
          <p>${temple.description}</p>
        </div>
      `;
      resultsDiv.appendChild(div);
    });
  }

  if (beaches.length) {
    beaches.forEach(beach => {
      const div = document.createElement('div');
      div.classList.add('result-item');
      div.innerHTML = `
        <img src="${beach.imageUrl}" alt="${beach.name}" />
        <div class="result-info">
          <h3>${beach.name}</h3>
          <p>${beach.description}</p>
        </div>
      `;
      resultsDiv.appendChild(div);
    });
  }

  if (countries.length === 0 && temples.length === 0 && beaches.length === 0) {
    resultsDiv.innerHTML = '<p>No results found.</p>';
  }
}

searchBtn.addEventListener('click', () => {
  const keyword = searchInput.value;
  if (!keyword.trim()) {
    resultsDiv.innerHTML = '<p>Please enter a keyword to search.</p>';
    return;
  }
  const results = filterResults(keyword);
  renderResults(results);
});

clearBtn.addEventListener('click', () => {
  resultsDiv.innerHTML = '';
  searchInput.value = '';
});

fetchData();
