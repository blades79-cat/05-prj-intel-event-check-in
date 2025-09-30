// --- Elements ---
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const totalCountDisplay = document.getElementById("totalCount");
const progressBar = document.getElementById("progressBar");
const welcomeMessage = document.getElementById("welcomeMessage");
const attendeeList = document.getElementById("attendeeList");

const teamCounters = {
  WaterWise: document.getElementById("WaterWiseCount"),
  NetZero: document.getElementById("NetZeroCount"),
  Renewables: document.getElementById("RenewablesCount"),
};

const maxCount = 50;

/**
 * If you want to start fresh each time (count at 0 and empty list),
 * leave this TRUE. Set to FALSE later if you want to persist between reloads.
 */
const RESET_ON_LOAD = true;

// --- State ---
let count = 0;
let teamCounts = { WaterWise: 0, NetZero: 0, Renewables: 0 };
let attendees = [];

// If you later want persistence by default, flip RESET_ON_LOAD to false:
if (!RESET_ON_LOAD) {
  count = Number(localStorage.getItem("totalCount")) || 0;
  teamCounts = JSON.parse(localStorage.getItem("teamCounts")) || teamCounts;
  attendees = JSON.parse(localStorage.getItem("attendees")) || attendees;
} else {
  // Clear any previous stored values so we truly start at 0.
  localStorage.removeItem("totalCount");
  localStorage.removeItem("teamCounts");
  localStorage.removeItem("attendees");
}

// --- Helpers ---
function saveState() {
  localStorage.setItem("totalCount", count);
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendees", JSON.stringify(attendees));
}

function renderAttendeeList() {
  attendeeList.innerHTML = "";
  attendees.forEach(({ name, team }) => {
    const li = document.createElement("li");
    li.textContent = `${name} (${team})`;
    attendeeList.appendChild(li);
  });
}

function updateDisplays() {
  // total + progress
  totalCountDisplay.textContent = count;
  const percent = Math.min(Math.round((count / maxCount) * 100), 100);
  if (progressBar) {
    progressBar.style.width = percent + "%";
    progressBar.textContent = percent + "%";
    progressBar.setAttribute("aria-valuenow", String(count));
  }

  // team counters
  for (const t in teamCounts) {
    if (teamCounters[t]) teamCounters[t].textContent = teamCounts[t];
  }

  // list
  renderAttendeeList();
}

function greet(name, teamLabel) {
  if (!welcomeMessage) return;
  welcomeMessage.textContent = `🎉 Welcome, ${name} from ${teamLabel}!`;
  // fade out after 3s
  setTimeout(() => {
    welcomeMessage.textContent = "";
  }, 3000);
}

function celebrateIfGoal() {
  // optional: add a celebration banner if you have an element for it
  const celebrationEl = document.getElementById("celebrationMessage");
  if (!celebrationEl) return;

  if (count >= maxCount) {
    let winner = "";
    let max = -1;
    for (const t in teamCounts) {
      if (teamCounts[t] > max) {
        max = teamCounts[t];
        winner = t;
      }
    }
    celebrationEl.innerHTML = `🏆 Attendance Goal Reached!<br><strong>${winner}</strong> is in the lead!`;
  } else {
    celebrationEl.textContent = "";
  }
}

// --- Submit handler ---
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamLabel = teamSelect.selectedOptions[0]?.text || team;

  if (!name || !team) return;

  // update state
  count += 1;
  if (teamCounts[team] == null) teamCounts[team] = 0; // safety if new team key
  teamCounts[team] += 1;
  attendees.push({ name, team });

  // persist + UI
  saveState();
  updateDisplays();
  greet(name, teamLabel);
  celebrateIfGoal();

  form.reset();
  nameInput.focus();
});

// --- Initial paint ---
updateDisplays();
celebrateIfGoal();
