document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#adoptionForm");
  const choice = document.querySelector("#adoptionChoice");
  const kind = document.querySelector("#interestKind");
  const result = document.querySelector("#adoptionResult");
  const params = new URLSearchParams(location.search);
  const requested = params.get("animal") || params.get("plant");
  if (requested && [...choice.options].some(option => option.value === requested || option.text === requested)) {
    choice.value = requested;
  }
  if (params.get("interest") === "foster") kind.value = "Foster care";
  if (params.get("interest") === "plant") kind.value = "Plant adoption";
  document.querySelectorAll("[data-select-animal]").forEach(link => link.addEventListener("click", () => {
    choice.value = link.dataset.selectAnimal;
  }));
  document.querySelectorAll("[data-select-plant]").forEach(link => link.addEventListener("click", () => {
    choice.value = link.dataset.selectPlant;
    kind.value = "Plant adoption";
  }));
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const selected = choice.value;
    const selectedKind = kind.value;
    form.reset();
    result.textContent = `Your ${selectedKind.toLowerCase()} interest preview for ${selected} is ready. Nothing was transmitted, stored or submitted to a rescue.`;
    result.classList.add("visible");
    result.scrollIntoView({ block: "nearest", behavior: "smooth" });
  });
});
