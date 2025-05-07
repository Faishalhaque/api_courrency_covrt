// Grabbing DOM elements
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");
const fromCurrencyDisplay = document.querySelector(".from-currency");
const toCurrencyDisplay = document.querySelector(".to-currency");
const rateValues = document.querySelectorAll(".rate-value");
const updateTime = document.querySelector(".update-time");

// Populate dropdowns with currencies
for (let select of dropdowns) {
  for (let currCode in countryList) {
    const newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    // Set default selections
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.appendChild(newOption);
  }

  // Attach event to update flag when selection changes
  select.addEventListener("change", (e) => {
    updateFlag(e.target);
    updateCurrencyDisplay();
  });
}

// Function to fetch and convert currency
const convert = async () => {
  // Show loading state
  btn.classList.add("loading");
  
  const amtVal = parseFloat(amountInput.value.trim()) || 1;
  amountInput.value = amtVal; // Ensure valid number is displayed

  const apiKey = "2874dfb39c9c3b64c9698f1d"; // Replace with your actual API key
  const URL = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurr.value}`;

  try {
    const response = await fetch(URL);
    const data = await response.json();

    if (data.result === "success") {
      const rate = data.conversion_rates[toCurr.value];
      const convertedAmount = (amtVal * rate).toFixed(2);
      
      // Update display with animation
      animateRateChange(rateValues[1], convertedAmount);
      
      // Update last updated time
      const now = new Date();
      updateTime.textContent = now.toLocaleTimeString();
      
      // Update currency displays
      updateCurrencyDisplay();
    } else {
      showError("Failed to fetch exchange rate.");
    }
  } catch (err) {
    showError("Error fetching data. Please try again later.");
    console.error(err);
  } finally {
    btn.classList.remove("loading");
  }
};

// Animate rate change
function animateRateChange(element, newValue) {
  element.style.transform = "scale(1.2)";
  element.style.color = "#fd79a8";
  setTimeout(() => {
    element.textContent = newValue;
    element.style.transform = "scale(1)";
    element.style.color = "#6c5ce7";
  }, 300);
}

// Show error message
function showError(message) {
  msg.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-circle"></i> ${message}</div>`;
  msg.style.backgroundColor = "#ffebee";
  msg.style.borderLeft = "5px solid #d63031";
  
  setTimeout(() => {
    msg.style.backgroundColor = "#f5f6fa";
    msg.style.borderLeft = "5px solid #6c5ce7";
  }, 3000);
}

// Update currency displays
function updateCurrencyDisplay() {
  fromCurrencyDisplay.textContent = fromCurr.value;
  toCurrencyDisplay.textContent = toCurr.value;
}

// Function to update flag image
const updateFlag = (element) => {
  const currCode = element.value;
  const countryCode = countryList[currCode];
  const img = element.parentElement.querySelector("img");
  
  // Add fade out animation
  img.style.opacity = 0;
  
  setTimeout(() => {
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
    
    // Add fade in animation
    setTimeout(() => {
      img.style.opacity = 1;
    }, 50);
  }, 200);
};

// Handle button click
btn.addEventListener("click", (e) => {
  e.preventDefault();
  convert();
});

// Handle amount input changes
amountInput.addEventListener("input", () => {
  // Only convert if the input is a valid number
  if (!isNaN(amountInput.value.trim())) {
    convert();
  }
});

// Initial conversion and flag load
window.addEventListener("load", () => {
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateCurrencyDisplay();
  convert();
  
  // Initialize particles.js
  particlesJS("particles-js", {
    particles: {
      number: { value: 50, density: { enable: true, value_area: 800 } },
      color: { value: "#ffffff" },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.3, width: 1 },
      move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "repulse" },
        onclick: { enable: true, mode: "push" }
      }
    }
  });
});

// Swap currencies and flags
document.querySelector(".swap-btn").addEventListener("click", (e) => {
  e.preventDefault();
  
  // Add animation class
  const swapIcon = e.currentTarget.querySelector("i");
  swapIcon.style.transform = "rotate(180deg)";
  
  setTimeout(() => {
    swapIcon.style.transform = "rotate(0deg)";
  }, 300);
  
  // Swap values
  let temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;
  
  // Update flags with animation
  updateFlag(fromCurr);
  updateFlag(toCurr);
  
  // Reconvert
  convert();
});