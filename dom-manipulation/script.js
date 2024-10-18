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

onload = function () {
  LoadQouts();
  createAddQuoteForm();
};
// applying the function
btn.addEventListener("click", showRandomQuote);
