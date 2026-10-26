/* ============================================================
   Random Password Generator - script.js
   Secure password generation using crypto.getRandomValues().
   ============================================================ */

// --- Character pools -------------------------------------------------
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{};:'\",.<>?/";

// --- DOM references --------------------------------------------------
const passwordField = document.getElementById("passwordField");
const toggleVisibilityBtn = document.getElementById("toggleVisibilityBtn");
const copyBtn = document.getElementById("copyBtn");
const regenerateBtn = document.getElementById("regenerateBtn");
const copyStatus = document.getElementById("copyStatus");

const strengthLabel = document.getElementById("strengthLabel");
const strengthBar = document.getElementById("strengthBar");
const strengthMeter = document.querySelector(".strength__meter");

const lengthSlider = document.getElementById("lengthSlider");
const lengthNumber = document.getElementById("lengthNumber");
const lengthValue = document.getElementById("lengthValue");

const optUpper = document.getElementById("optUpper");
const optLower = document.getElementById("optLower");
const optNumbers = document.getElementById("optNumbers");
const optSymbols = document.getElementById("optSymbols");

const settingsSummary = document.getElementById("settingsSummary");
const generateBtn = document.getElementById("generateBtn");
const resetBtn = document.getElementById("resetBtn");
const validationMsg = document.getElementById("validationMsg");

// --- State -----------------------------------------------------------
let currentPassword = "";
let isVisible = false; // password currently shown as plain text

// --- Secure randomness ----------------------------------------------
// Returns an unbiased random integer in [0, max) using rejection sampling.
function secureRandomIndex(max) {
  if (max <= 0) return 0;
  // Largest multiple of max that fits in a 32-bit unsigned integer.
  const limit = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  let value;
  do {
    crypto.getRandomValues(buf);
    value = buf[0];
  } while (value >= limit);
  return value % max;
}

// Fisher-Yates shuffle using secure randomness.
function secureShuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = secureRandomIndex(i + 1);
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

// --- Helpers ---------------------------------------------------------
function clamp(value, min, max) {
  const n = Number(value);
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, Math.round(n)));
}

function selectedPools() {
  const pools = [];
  if (optUpper.checked) pools.push(UPPER);
  if (optLower.checked) pools.push(LOWER);
  if (optNumbers.checked) pools.push(NUMBERS);
  if (optSymbols.checked) pools.push(SYMBOLS);
  return pools;
}

function hasSelection() {
  return selectedPools().length > 0;
}

function updateSettingsSummary() {
  const names = [];
  if (optUpper.checked) names.push("Uppercase");
  if (optLower.checked) names.push("Lowercase");
  if (optNumbers.checked) names.push("Numbers");
  if (optSymbols.checked) names.push("Symbols");
  settingsSummary.textContent = names.length ? names.join(", ") : "None selected";
}

function setStatus(message, isError, isSuccess) {
  copyStatus.textContent = message;
  copyStatus.classList.toggle("is-error", Boolean(isError));
  copyStatus.classList.toggle("is-success", Boolean(isSuccess));
}

function setValidation(message) {
  validationMsg.textContent = message || "";
}

// --- Password generation --------------------------------------------
function generatePassword(length, pools) {
  const combined = pools.join("");
  const result = [];

  // Guarantee at least one character from each selected pool when length permits.
  if (length >= pools.length) {
    pools.forEach(function (pool) {
      result.push(pool[secureRandomIndex(pool.length)]);
    });
  }

  // Fill the remaining positions from the combined pool.
  while (result.length < length) {
    result.push(combined[secureRandomIndex(combined.length)]);
  }

  // Shuffle so guaranteed characters are not always at the start.
  secureShuffle(result);
  return result.join("");
}

function generate() {
  setValidation("");

  // Validate character selection.
  const pools = selectedPools();
  if (pools.length === 0) {
    setValidation("Please select at least one character type.");
    currentPassword = "";
    passwordField.value = "";
    updateStrength(null);
    return;
  }

  // Validate and clamp length.
  const length = clamp(lengthNumber.value, 4, 64);
  lengthSlider.value = String(length);
  lengthNumber.value = String(length);
  lengthValue.textContent = String(length);

  // Generate securely.
  currentPassword = generatePassword(length, pools);

  // Display with animation.
  passwordField.classList.remove("is-new");
  // Force reflow to restart animation.
  void passwordField.offsetWidth;
  passwordField.value = currentPassword;
  passwordField.classList.add("is-new");

  // Keep visibility state consistent.
  passwordField.type = isVisible ? "text" : "password";

  updateSettingsSummary();
  updateStrength(currentPassword);
  setStatus("Password generated.", false, true);
}

// --- Strength evaluation --------------------------------------------
// Practical estimate based on length and variety. Not a guarantee.
function evaluateStrength(password) {
  if (!password) return { label: "—", percent: 0, color: "var(--muted)" };

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const variety = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
  const length = password.length;

  // A password is not "secure" solely because it has many types:
  // length requirements gate the higher ratings.
  let label = "Weak";
  let percent = 20;
  let color = "var(--danger)";

  if (length >= 8 && variety >= 2) {
    label = "Fair";
    percent = 40;
    color = "var(--warn)";
  }
  if (length >= 12 && variety >= 2) {
    label = "Strong";
    percent = 65;
    color = "var(--blue)";
  }
  if (length >= 16 && variety >= 3) {
    label = "Very Strong";
    percent = 90;
    color = "var(--success)";
  }
  // Extra length bonus for very long passwords.
  if (length >= 24 && variety >= 2 && label !== "Weak" && label !== "Fair") {
    percent = Math.min(100, percent + 8);
  }

  return { label, percent, color };
}

function updateStrength(password) {
  const { label, percent, color } = evaluateStrength(password);
  strengthLabel.textContent = label;
  strengthLabel.style.color = color;
  strengthBar.style.width = percent + "%";
  strengthBar.style.background = color;
  if (strengthMeter) {
    strengthMeter.setAttribute("aria-valuenow", String(percent));
    strengthMeter.setAttribute("aria-valuetext", label);
  }
}

// --- Visibility toggle ----------------------------------------------
const EYE_OPEN = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
const EYE_CLOSED = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';

function setVisibility(visible) {
  isVisible = visible;
  passwordField.type = visible ? "text" : "password";
  toggleVisibilityBtn.setAttribute("aria-pressed", String(visible));
  toggleVisibilityBtn.setAttribute("aria-label", visible ? "Hide password" : "Show password");
  toggleVisibilityBtn.innerHTML = visible ? EYE_CLOSED : EYE_OPEN;
}

// --- Copy to clipboard ----------------------------------------------
async function copyPassword() {
  if (!currentPassword) {
    setStatus("Nothing to copy. Generate a password first.", true);
    return;
  }
  // Try the modern Clipboard API first; fall back to execCommand on any failure.
  let copied = false;
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(currentPassword);
      copied = true;
    } catch (err) {
      copied = false;
    }
  }
  if (!copied) {
    try {
      const ta = document.createElement("textarea");
      ta.value = currentPassword;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      copied = Boolean(ok);
    } catch (err) {
      copied = false;
    }
  }
  if (copied) {
    setStatus("Password copied to clipboard.", false, true);
  } else {
    setStatus("Could not copy password. Please copy manually.", true);
  }
}

// --- Length synchronization -----------------------------------------
function syncLengthFromSlider() {
  const v = clamp(lengthSlider.value, 4, 64);
  lengthSlider.value = String(v);
  lengthNumber.value = String(v);
  lengthValue.textContent = String(v);
}

function syncLengthFromNumber() {
  const v = clamp(lengthNumber.value, 4, 64);
  // If out of range, show a hint but still clamp.
  if (Number(lengthNumber.value) !== v) {
    setValidation("Length must be between 4 and 64. Adjusted to " + v + ".");
  } else {
    setValidation("");
  }
  lengthSlider.value = String(v);
  lengthNumber.value = String(v);
  lengthValue.textContent = String(v);
}

// --- Reset settings --------------------------------------------------
function resetSettings() {
  lengthSlider.value = "12";
  lengthNumber.value = "12";
  lengthValue.textContent = "12";
  optUpper.checked = true;
  optLower.checked = true;
  optNumbers.checked = true;
  optSymbols.checked = false;
  updateSettingsSummary();
  generate();
}

// --- Debounced auto-generate on settings change ---------------------
let regenTimer = null;
function scheduleGenerate(delay) {
  if (regenTimer) clearTimeout(regenTimer);
  regenTimer = setTimeout(function () {
    if (hasSelection()) generate();
    else {
      setValidation("Please select at least one character type.");
      currentPassword = "";
      passwordField.value = "";
      updateStrength(null);
    }
  }, delay);
}

// --- Event listeners -----------------------------------------------
lengthSlider.addEventListener("input", function () {
  syncLengthFromSlider();
  scheduleGenerate(80);
});

lengthNumber.addEventListener("input", function () {
  syncLengthFromNumber();
  scheduleGenerate(0);
});

lengthNumber.addEventListener("blur", function () {
  syncLengthFromNumber();
});

[optUpper, optLower, optNumbers, optSymbols].forEach(function (cb) {
  cb.addEventListener("change", function () {
    updateSettingsSummary();
    scheduleGenerate(0);
  });
});

generateBtn.addEventListener("click", generate);
regenerateBtn.addEventListener("click", generate);
copyBtn.addEventListener("click", copyPassword);

toggleVisibilityBtn.addEventListener("click", function () {
  setVisibility(!isVisible);
});

resetBtn.addEventListener("click", resetSettings);

// Keyboard: Enter on number input triggers generate.
lengthNumber.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    generate();
  }
});

// --- Init -----------------------------------------------------------
updateSettingsSummary();
setVisibility(false);
generate();
passwordField.type = "password";