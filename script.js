// ----------------------------
// DARK MODE TOGGLE
// ----------------------------
document.getElementById("darkToggle")?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// ----------------------------
// PDF UPLOAD (PDF.js)
// ----------------------------
document.getElementById("pdfUpload")?.addEventListener("change", async (e) => {
  let file = e.target.files[0];
  if (!file) return;

  let pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
  let textContent = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    let page = await pdf.getPage(i);
    let txt = await page.getTextContent();
    textContent += txt.items.map(i => i.str).join(" ") + "\n";
  }

  document.getElementById("inputText").value = textContent;
});

// ----------------------------
// BACKEND API CALL (REAL AI)
// ----------------------------
async function generateAI() {
  let text = document.getElementById("inputText").value;

  let res = await fetch("http://localhost:5000/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notes: text })
  });

  let data = await res.json();

  document.getElementById("summary").innerText = data.summary;

  // Flashcards
  let f = document.getElementById("flashcards");
  f.innerHTML = "";
  data.flashcards.forEach(x => {
    let li = document.createElement("li");
    li.innerText = x;
    f.appendChild(li);
  });

  // MCQs
  let m = document.getElementById("mcqs");
  m.innerHTML = "";
  data.mcqs.forEach(x => {
    let li = document.createElement("li");
    li.innerText = x.q;
    m.appendChild(li);
  });

  // Schedule
  document.getElementById("schedule").innerHTML =
    data.schedule.map(s => `<li>${s}</li>`).join("");

  // Graph
  new Chart(document.getElementById("progressChart"), {
    type: "line",
    data: {
      labels: ["Day 1", "Day 3", "Day 7", "Day 14"],
      datasets: [{
        data: [20, 45, 70, 90],
        borderWidth: 3
      }]
    }
  });
}

// ----------------------------
// SIMPLE FRONTEND AUTH
// ----------------------------
function registerUser() {
  localStorage.setItem("email", document.getElementById("email").value);
  localStorage.setItem("password", document.getElementById("password").value);
  alert("Signup Successful!");
  window.location.href = "login.html";
}

function loginUser() {
  let email = document.getElementById("loginEmail").value;
  let pass = document.getElementById("loginPass").value;

  if (email === localStorage.getItem("email") &&
      pass === localStorage.getItem("password")) {
    window.location.href = "index.html";
  } else {
    alert("Invalid login");
  }
}
