document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#registerForm");
  const country = document.querySelector("#phoneCountry");
  const prefix = document.querySelector("#phonePrefix");
  const phone = document.querySelector("#phone");
  const help = document.querySelector("#phoneHelp");
  const message = document.querySelector("#authMessage");

  function updatePhoneState() {
    const option = country.selectedOptions[0];
    prefix.textContent = option.value;
    phone.setCustomValidity("");
    const entered = phone.value.trim();
    if (!entered) {
      help.textContent = "Enter the national number. The selected calling code is shown above.";
      return true;
    }
    if (entered.includes("+")) {
      phone.setCustomValidity("Enter the national number only; the selected country code is added for display.");
      help.textContent = "Enter the national number without a + country code.";
      return false;
    }
    if (!/^[\d\s().-]+$/.test(entered)) {
      phone.setCustomValidity("Use digits, spaces, parentheses or hyphens.");
      help.textContent = "Use digits, spaces, parentheses or hyphens.";
      return false;
    }
    let digits = entered.replace(/\D/g, "");
    if (digits.startsWith("0")) digits = digits.replace(/^0+/, "");
    const minimum = Number(option.dataset.min);
    const maximum = Number(option.dataset.max);
    if (digits.length < minimum || digits.length > maximum) {
      const requiredLength = minimum === maximum ? `${minimum} digits` : `${minimum} to ${maximum} digits`;
      phone.setCustomValidity(`Enter ${requiredLength} for ${option.textContent.trim()}.`);
      help.textContent = `Enter ${requiredLength} after the country calling code.`;
      return false;
    }
    help.textContent = `International format: ${option.value}${digits}`;
    return true;
  }

  country.addEventListener("change", updatePhoneState);
  phone.addEventListener("input", updatePhoneState);
  phone.addEventListener("blur", updatePhoneState);
  updatePhoneState();

  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!updatePhoneState() || !form.reportValidity()) {
      message.textContent = "";
      return;
    }
    message.className = "form-result";
    message.textContent = "Account registration is not connected yet. Your information was not sent or saved.";
  });
});
