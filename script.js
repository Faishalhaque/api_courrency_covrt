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

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.appendChild(newOption);
  }

  select.addEventListener("change", (e) => {
    updateFlag(e.target);
    updateCurrencyDisplay();
  });
}

const convert = async () => {
  btn.classList.add("loading");

  const amtVal = parseFloat(amountInput.value.trim()) || 1;
  amountInput.value = amtVal;

  const apiKey = "2874dfb39c9c3b64c9698f1d";
  const URL = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurr.value}`;

  try {
    const response = await fetch(URL);
    const data = await response.json();

    if (data.result === "success") {
      const rate = data.conversion_rates[toCurr.value];
      const convertedAmount = (amtVal * rate).toFixed(2);

      rateValues[0].textContent = amtVal;
      fromCurrencyDisplay.textContent = fromCurr.value;
      animateRateChange(rateValues[1], convertedAmount);
      toCurrencyDisplay.textContent = toCurr.value;

      updateTime.textContent = new Date().toLocaleTimeString();
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

function animateRateChange(element, newValue) {
  element.style.transform = "scale(1.2)";
  element.style.color = "#fd79a8";
  setTimeout(() => {
    element.textContent = newValue;
    element.style.transform = "scale(1)";
    element.style.color = "#6c5ce7";
  }, 300);
}

function showError(message) {
  msg.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-circle"></i> ${message}</div>`;
  msg.style.backgroundColor = "#ffebee";
  msg.style.borderLeft = "5px solid #d63031";

  setTimeout(() => {
    msg.style.backgroundColor = "#f5f6fa";
    msg.style.borderLeft = "5px solid #6c5ce7";
  }, 3000);
}

function updateCurrencyDisplay() {
  fromCurrencyDisplay.textContent = fromCurr.value;
  toCurrencyDisplay.textContent = toCurr.value;
}

const updateFlag = (element) => {
  const currCode = element.value;
  const countryCode = countryList[currCode];
  const img = element.parentElement.querySelector("img");

  img.style.opacity = 0;
  setTimeout(() => {
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
    setTimeout(() => img.style.opacity = 1, 50);
  }, 200);
};

btn.addEventListener("click", (e) => {
  e.preventDefault();
  convert();
});

amountInput.addEventListener("input", () => {
  if (!isNaN(amountInput.value.trim())) {
    convert();
  }
});

window.addEventListener("load", () => {
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateCurrencyDisplay();
  convert();

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

document.querySelector(".swap-btn").addEventListener("click", (e) => {
  e.preventDefault();

  const swapIcon = e.currentTarget.querySelector("i");
  swapIcon.style.transform = "rotate(180deg)";
  setTimeout(() => swapIcon.style.transform = "rotate(0deg)", 300);

  [fromCurr.value, toCurr.value] = [toCurr.value, fromCurr.value];
  updateFlag(fromCurr);
  updateFlag(toCurr);
  convert();
});

// Enhanced mobile handling
document.addEventListener('DOMContentLoaded', function() {
  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    // Prevent zoom on input focus
    document.querySelector('input').addEventListener('focus', function() {
      window.scrollTo(0, 0);
      document.body.style.transform = 'scale(1)';
    });
    
    // Better touch handling
    document.querySelectorAll('select, input, button').forEach(el => {
      el.style.tapHighlightColor = 'transparent';
      el.style.webkitTapHighlightColor = 'transparent';
    });

    // Prevent multi-touch gestures
    document.addEventListener('gesturestart', function(e) {
      e.preventDefault();
    });

    // Prevent double-tap zoom
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) e.preventDefault();
      lastTouchEnd = now;
    }, { passive: false });
  }
});