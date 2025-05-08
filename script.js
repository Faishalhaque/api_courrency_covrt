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

  // Update flag and display when currency changes
  select.addEventListener("change", (e) => {
    updateFlag(e.target);
    updateCurrencyDisplay();
  });
}

// Fetch exchange rates and convert
const convert = async () => {
  btn.classList.add("loading"); // Show loading spinner
  
  const amtVal = parseFloat(amountInput.value.trim()) || 1;
  amountInput.value = amtVal; // Ensure valid number

  const apiKey = "2874dfb39c9c3b64c9698f1d";
  const URL = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurr.value}`;

  try {
    const response = await fetch(URL);
    const data = await response.json();

    if (data.result === "success") {
      const rate = data.conversion_rates[toCurr.value];
      const convertedAmount = (amtVal * rate).toFixed(2);
      
      // Update ALL parts of the message:
      rateValues[0].textContent = amtVal;               // Input amount (e.g., 100)
      fromCurrencyDisplay.textContent = fromCurr.value;  // From currency (e.g., USD)
      animateRateChange(rateValues[1], convertedAmount); // Converted amount (e.g., 8200)
      toCurrencyDisplay.textContent = toCurr.value;      // To currency (e.g., INR)
      
      // Update timestamp
      updateTime.textContent = new Date().toLocaleTimeString();
    } else {
      showError("Failed to fetch exchange rate.");
    }
  } catch (err) {
    showError("Error fetching data. Please try again later.");
    console.error(err);
  } finally {
    btn.classList.remove("loading"); // Hide spinner
  }
};

// Animate the converted rate
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

// Update currency code displays
function updateCurrencyDisplay() {
  fromCurrencyDisplay.textContent = fromCurr.value;
  toCurrencyDisplay.textContent = toCurr.value;
}

// Update flag image with fade animation
const updateFlag = (element) => {
  const currCode = element.value;
  const countryCode = countryList[currCode];
  const img = element.parentElement.querySelector("img");
  
  img.style.opacity = 0; // Fade out
  setTimeout(() => {
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
    setTimeout(() => img.style.opacity = 1, 50); // Fade in
  }, 200);
};

// Convert on button click
btn.addEventListener("click", (e) => {
  e.preventDefault();
  convert();
});

// Real-time conversion on input change
amountInput.addEventListener("input", () => {
  if (!isNaN(amountInput.value.trim())) {
    convert();
  }
});

// Initialize on page load
window.addEventListener("load", () => {
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateCurrencyDisplay();
  convert();
  
  // Floating particles effect
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

// Swap currencies
document.querySelector(".swap-btn").addEventListener("click", (e) => {
  e.preventDefault();
  
  // Rotate icon
  const swapIcon = e.currentTarget.querySelector("i");
  swapIcon.style.transform = "rotate(180deg)";
  setTimeout(() => swapIcon.style.transform = "rotate(0deg)", 300);
  
  // Swap currencies
  [fromCurr.value, toCurr.value] = [toCurr.value, fromCurr.value];
  updateFlag(fromCurr);
  updateFlag(toCurr);
  convert();
});

// Disable touch events 
document.addEventListener('touchstart', function(e) {
  e.preventDefault();
}, { passive: false });