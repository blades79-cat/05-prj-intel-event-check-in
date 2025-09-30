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
  Renewables: document.getElementById("RenewablesCount")
};

const maxCount = 50;

// --- State (load from localStorage) ---
let count = Number(localStorage.getItem("totalCount")) || 0;
let teamCounts = JSON.parse(localStorage.getItem("teamCounts")) || {
  WaterWise: 0,
  NetZero: 0,
  Renewables: 0
};
let attendees = JSON.parse(localStorage.getItem("attendees")) || [];

// --- Functions ---
function updateDisplays() {
  // Total count
  totalCountDisplay.textContent = count;

  // Team counts
  for (const team in teamCounts) {
    teamCounters[team].textContent = teamCounts[team];
  }

  // Progress bar
  const percent = Math.min(Math.round((count / maxCount) * 100), 100) + "%";
  progressBar.style.width = percent;
  progressBar.textContent = percent;

  // Attendee list
  renderAttendeeList();
}

function renderAttendeeList() {
  attendeeList.innerHTML = "";
  attendees.forEach(({ name, team }) => {
    const li = document.createElement("li");
    li.textContent = `${name} (${team})`;
    attendeeList.appendChild(li);
  });
}

function saveState() {
  localStorage.setItem("totalCount", count);
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendees", JSON.stringify(attendees));
}

function displayGreeting(name, team) {
  welcomeMessage.textContent = `🎉 Welcome, ${name} from ${team}!`;
  setTimeout(() => (welcomeMessage.textContent = ""), 3000);
}

function checkCelebration() {
  if (count >= maxCount) {
    // Find winning team
    let winningTeam = "";
    let max = 0;
    for (const team in teamCounts) {
      if (teamCounts[team] > max) {
        max = teamCounts[team];
        winningTeam = team;
      }
    }
    celebrationMessage.innerHTML = `🏆 Attendance Goal Reached!<br>
      Congratulations, <strong>${winningTeam}</strong> team!`;
  } else {
    celebrationMessage.textContent = "";
  }
}

// --- Form Handler ---
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const team = teamSelect.value;

  if (!name || !team) return;

  // Update state
  count++;
  teamCounts[team]++;
  attendees.push({ name, team });

  // Save + Update
  saveState();
  updateDisplays();
  displayGreeting(name, team);
  checkCelebration();

  form.reset();
});

// --- Init ---
updateDisplays();
checkCelebration();

