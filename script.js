const searchInput = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");
const resultsSection = document.getElementById("resultsSection");
const resultsContainer = document.getElementById("resultsContainer");

const recommendations = [
  {
    category: "Beach",
    name: "Bora Bora, French Polynesia",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  },
  {
    category: "Beach",
    name: "Copacabana Beach, Brazil",
    imageUrl: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80",
  },
  {
    category: "Temple",
    name: "Angkor Wat, Cambodia",
    imageUrl: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=800&q=80",
  },
  {
    category: "Temple",
    name: "Taj Mahal, India",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  },
  {
    category: "Country",
    name: "Sydney, Australia",
    imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80",
  },
  {
    category: "Country",
    name: "Tokyo, Japan",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
  },
];

function performSearch() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    resultsSection.classList.add("hidden");
    resultsContainer.innerHTML = "";
    return;
  }
  const filtered = recommendations.filter(item => item.name.toLowerCase().includes(query));
  if (filtered.length === 0) {
    resultsContainer.innerHTML = "<p>No results found.</p>";
  } else {
    resultsContainer.innerHTML = filtered
      .map(item => `
      <div class="card">
        <img src="${item.imageUrl}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p><em>${item.category}</em></p>
      </div>
      `).join("");
  }
  resultsSection.classList.remove("hidden");
}

function clearSearch() {
  searchInput.value = "";
  resultsContainer.innerHTML = "";
  resultsSection.classList.add("hidden");
  searchInput.focus();
}

searchInput.addEventListener("input", performSearch);
clearBtn.addEventListener("click", clearSearch);
