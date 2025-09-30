// --- Elements ---
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const totalCountDisplay = document.getElementById("totalCount");
const progressBar = document.getElementById("progressBar");
const welcomeMessage = document.getElementById("welcomeMessage");
const celebrationMessage = document.getElementById("celebrationMessage");
const attendeeList = document.getElementById("attendeeList");

const teamCounters = {
  WaterWise: document.getElementById("WaterWiseCount"),
  NetZero: document.getElementById("NetZeroCount"),
  Renewables: document.getElementById("RenewablesCount"),
};

const maxCount = 50;

// --- State (load from localStorage) ---
let count = Number(localStorage.getItem("totalCount")) || 0;
let teamCounts = JSON.parse(localStorage.getItem("teamCounts")) || {
  WaterWise: 0,
  NetZero: 0,
  Renewables: 0,
};
let attendees = JSON.parse(localStorage.getItem("attendees")) || [];

// --- Save state ---
function saveState() {
  localStorage.setItem("totalCount", count);
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendees", JSON.stringify(attendees));
}

// --- UI Updates ---
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
  progressBar.style.width = percent + "%";
  progressBar.textContent = percent + "%";
  progressBar.setAttribute("aria-valuenow", String(count));

  // team counters
  for (const t in teamCounts) {
    teamCounters[t].textContent = teamCounts[t];
  }

  // attendee list
  renderAttendeeList();
}

function greet(name, teamLabel) {
  welcomeMessage.textContent = `🎉 Welcome, ${name} from ${teamLabel}!`;
  setTimeout(() => {
    welcomeMessage.textContent = "";
  }, 3000);
}

function celebrateIfGoal() {
  if (count >= maxCount) {
    let winner = "";
    let max = -1;
    for (const t in teamCounts) {
      if (teamCounts[t] > max) {
        max = teamCounts[t];
        winner = t;
      }
    }
    celebrationMessage.innerHTML = `🏆 Attendance Goal Reached!<br><strong>${winner}</strong> team leads!`;
  } else {
    celebrationMessage.textContent = "";
  }
}

// --- Submit Handler ---
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamLabel = teamSelect.selectedOptions[0]?.text || team;

  if (!name || !team) return;

  // update state
  count++;
  teamCounts[team]++;
  attendees.push({ name, team });

  // save + update
  saveState();
  updateDisplays();
  greet(name, teamLabel);
  celebrateIfGoal();

  form.reset();
  nameInput.focus();
});

// --- Init ---
updateDisplays();
celebrateIfGoal();
