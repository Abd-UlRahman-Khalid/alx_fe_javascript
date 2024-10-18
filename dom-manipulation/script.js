let container = document.getElementById("quoteDisplay");
let btn = document.getElementById("newQuote");

let quoteArray = [
  {
    text: "It takes courage to grow up and become who you really are.— E.E. Cummings",
    category: "motivational ",
  },
  {
    text: "The best preparation for tomorrow is doing your best today. H. Jackson Brown",
    category: "Inspirational ",
  },
  {
    text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.― Albert Einstein",
    category: "Humor ",
  },
];

index = quoteArray.length;
let randomNum = Math.floor(Math.random() * index);

// Function to show Random Quote  from the array
function showRandomQuote() {
  container.innerHTML = `'${quoteArray[randomNum].text}' '${quoteArray[randomNum].category}'`;
}

// Creating Form By JS
function createAddQuoteForm() {
  let container = document.createElement("div");
  container.id = "quoteForm";

  let inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote";

  let inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";

  let addQBtn = document.createElement("button");
  addQBtn.id = "addQuoteButton";
  addQBtn.textContent = "Add Quote";

  container.appendChild(inputText);
  container.appendChild(inputCategory);
  container.appendChild(addQBtn);
  document.body.appendChild(container);
  // Applying the addFunction to the Btn
  addQBtn.addEventListener("click", addQuote);
}

// Save Qoutes in Local Storage
function saveQuotes() {
  localStorage.setItem("qoutes", JSON.stringify(quoteArray));
}
// LoadQouts
function LoadQouts() {
  let savedQoutes = localStorage.getItem("qoutes");
  if (savedQoutes) {
    quoteArray = JSON.parse(savedQoutes);
  }
}
// Function to add a Quote to the array
function addQuote() {
  let inQuote = document.getElementById("newQuoteText").value;
  let inCategory = document.getElementById("newQuoteCategory").value;
  if (inQuote && inCategory) {
    quoteArray.push({ text: inQuote, category: inCategory });

    // call saveQoutes Function to save the new qoute in localStorage
    saveQuotes();
    populateCategories();

    inQuote = "";
    inCategory = "";
    alert("You Successfully add New Qoute");
  } else {
    alert("You Must Fill Both Quote & Category Fields");
  }
}

// ==========Function to export quotes as JSON=======
function exportToJsonFile() {
  const dataStr = JSON.stringify(quoteArray, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // create a downloadLink
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "qoutes.json";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// Add an export button in the form
const exportBtn = document.getElementById("expBTN");

exportBtn.addEventListener("click", exportToJsonFile);
document.body.appendChild(exportBtn);

// ===================Function to handle importing quotes from a JSON file==================
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  // On successful read of the file
  fileReader.onload = function (event) {
    try {
      const importQoutes = JSON.parse(event.target.result);

      quoteArray.push(...importQoutes);

      saveQuotes();
      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Error importing quotes: Invalid JSON format.");
    }
  };
  // Read the selected file as text
  fileReader.readAsText(event.target.files[0]);
}

// Add file input for importing JSON
const importInput = document.getElementById("importFile");

importInput.onchange = importFromJsonFile;

// Populate the category filter dropdown with unique categories
function populateCategories() {
  let categoryFilter = document.getElementById("categoryFilter");
  // creat new array with the categories items from the quoteArray and put it in
  const uniqueCategories = [
    ...new Set(quoteArray.map((quote) => quote.category)),
  ];

  uniqueCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Function to filter quotes by category and display them
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const quoteDisplay = document.getElementById("quoteDisplay");
  // Filter quotes based on the selected category
  const filteredQuotes =
    selectedCategory === "all"
      ? quoteArray
      : quoteArray.filter((quote) => quote.category === selectedCategory);

  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;

    // Save last selected category filter and last displayed quote
    localStorage.setItem("lastFilter", selectedCategory);
    sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
  } else {
    quoteDisplay.innerHTML = "No quotes available for this category.";
  }
}

// Load last selected category filter from local storage
function loadLastFilter() {
  const lastFilter = localStorage.getItem("lastFilter");
  if (lastFilter) {
    document.getElementById("categoryFilter").value = lastFilter;
    filterQuotes(); // Apply the last selected filter
  }
}

// Simulate fetching quotes from a server
function fetchQuotesFromServer() {
  return fetch("https://jsonplaceholder.typicode.com/posts") // Simulated endpoint
    .then((response) => response.json())
    .then((serverQuotes) => {
      // Use or merge with local quotes
      console.log("Fetched server quotes:", serverQuotes);
      return serverQuotes;
    })
    .catch((error) => console.error("Error fetching server quotes:", error));
}

setInterval(() => {
  fetchQuotesFromServer();
}, 10000); // Fetch new data every 10 seconds

function postQuoteToServer(quote) {
  return fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(quote),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => console.log("Quote successfully posted:", data))
    .catch((error) => console.error("Error posting quote:", error));
}

function syncQuotesWithServer() {
  fetchQuotesFromServer().then((serverQuotes) => {
    let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    // Merge server quotes with local ones (without duplicates)
    const mergedQuotes = [
      ...localQuotes,
      ...serverQuotes.filter(
        (serverQuote) =>
          !localQuotes.some((localQuote) => localQuote.id === serverQuote.id)
      ),
    ];

    // Save merged quotes to local storage
    localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
  });
}

// Call sync function periodically
setInterval(() => {
  syncQuotesWithServer();
}, 15000); // Sync every 15 seconds

function resolveConflicts(serverQuotes) {
  let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

  const updatedLocalQuotes = localQuotes.map((localQuote) => {
    const serverMatch = serverQuotes.find(
      (serverQuote) => serverQuote.id === localQuote.id
    );

    // If a matching server quote is found, use the server version (conflict resolution)
    return serverMatch ? serverMatch : localQuote;
  });

  // Save the updated local storage after resolving conflicts
  localStorage.setItem("quotes", JSON.stringify(updatedLocalQuotes));
}

// Integrate this within the syncing logic
function syncQuotesWithServer() {
  fetchQuotesFromServer().then((serverQuotes) => {
    resolveConflicts(serverQuotes);

    // Optionally: Inform the user about the conflict resolution
    alert("Local data was synced with the server. Conflicts were resolved.");
  });
}

function notifyUserOfConflict(conflictDetails) {
  // Display a notification to the user and give them options to resolve the conflict manually
  console.log("Conflict detected:", conflictDetails);
  alert(`Conflict detected for quote: "${conflictDetails.local.text}".\n
    Local version: "${conflictDetails.local.text}"\n
    Server version: "${conflictDetails.server.text}".`);

  // You can then offer a UI for the user to choose which version to keep
}

onload = function () {
  LoadQouts();
  populateCategories();
  loadLastFilter();
  createAddQuoteForm();
};
// applying the function
btn.addEventListener("click", showRandomQuote);
