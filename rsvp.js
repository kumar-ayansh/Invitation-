(function() {
  const form = document.getElementById("rsvpForm");
  const statusEl = document.getElementById("rsvpStatus");
  if (!form) return;
  
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const endpoint = window.APP_CONFIG?.rsvp?.endpoint || "";
    const data = Object.fromEntries(new FormData(form).entries());
    
    if (!endpoint) {
      statusEl.textContent = "RSVP saved locally (demo mode). Add endpoint in config.js for live submission.";
      localStorage.setItem("rsvp_demo", JSON.stringify(data));
      form.reset();
      return;
    }
    
    try {
      statusEl.textContent = "Submitting...";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      });
      statusEl.textContent = res.ok ? "Thank you! RSVP submitted successfully." : "Submission failed. Please try again.";
      if (res.ok) form.reset();
    } catch {
      statusEl.textContent = "Network error. Please try again.";
    }
  });
})();