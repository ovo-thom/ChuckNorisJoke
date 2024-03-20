
const fetchFactBtn = document.getElementById("fetchFactBtn");
const clearLocalStorageBtn = document.getElementById("clearLocalStorageBtn");
const factsContainer = document.getElementById("factsContainer");
const categorySelect = document.getElementById("categorySelect");


async function fetchCategories() {
    try {
        const response = await fetch("https://api.chucknorris.io/jokes/categories");
        const categories = await response.json();
        
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error("An error occurred while retrieving categories : ", error);
    }
}


async function fetchFactByCategory(category) {
    try {
        const url = category ? `https://api.chucknorris.io/jokes/random?category=${category}` : "https://api.chucknorris.io/jokes/random";
        const response = await fetch(url);
        const data = await response.json();
        
        const factDiv = document.createElement("div");
        factDiv.textContent = data.value;
        
        factsContainer.appendChild(factDiv);
        
        
        const storedFacts = JSON.parse(localStorage.getItem("chuckNorrisFacts")) || [];
        storedFacts.push(data.value);
        localStorage.setItem("chuckNorrisFacts", JSON.stringify(storedFacts));
    } catch (error) {
        console.error("An error occurred while retrieving the Chuck Norris fact : ", error);
    }
}


fetchFactBtn.addEventListener("click", () => {
    const selectedCategory = categorySelect.value;
    fetchFactByCategory(selectedCategory);
});


clearLocalStorageBtn.addEventListener("click", () => {
    localStorage.removeItem("chuckNorrisFacts");
    factsContainer.innerHTML = "";
});


fetchCategories();


const storedFacts = JSON.parse(localStorage.getItem("chuckNorrisFacts")) || [];
storedFacts.forEach(fact => {
    const factDiv = document.createElement("div");
    factDiv.textContent = fact;
    factsContainer.appendChild(factDiv);
});