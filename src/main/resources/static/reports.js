async function submitReport() {
  const form = document.querySelector("#reportForm");
  if (!form.reportValidity()) return;
  const result = document.querySelector("#result");
  const button = document.querySelector("#submitReportButton");
  const data = {
    type: document.querySelector("#type").value,
    title: document.querySelector("#title").value.trim(),
    description: document.querySelector("#description").value.trim(),
    location: document.querySelector("#location").value.trim(),
    reporter: document.querySelector("#reporter").value.trim(),
    proofUrl: document.querySelector("#proofUrl").value.trim()
  };
  result.className = "form-result";
  result.textContent = "Submitting your report…";
  button.disabled = true;
  try {
    const report = await api("/api/reports", { method: "POST", body: JSON.stringify(data) });
    result.className = "form-result success";
    result.textContent = `Thank you. Report #${report.id} was submitted on ${new Date(report.createdAt).toLocaleString()} and is pending review.`;
    form.reset();
  } catch (error) {
    result.className = "form-result error";
    result.textContent = "Your report could not be submitted. Please check your connection and try again.";
  } finally {
    button.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const type = params.get("type");
  const title = params.get("title");
  if (type && ["ANIMAL", "PLANT"].includes(type.toUpperCase())) document.querySelector("#type").value = type.toUpperCase();
  if (title) document.querySelector("#title").value = title.slice(0, 160);
});
