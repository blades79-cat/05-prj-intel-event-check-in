// --- Constants and Initial Setup ---
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

// --- Load State from localStorage or initialize ---
let count = Number(localStorage.getItem("totalCount")) || 0;
let teamCounts = JSON.parse(localStorage.getItem("teamCounts")) || {
  WaterWise: 0,
  NetZero: 0,
  Renewables: 0
};
let attendees = JSON.parse(localStorage.getItem("attendees")) || [];

// --- Functions ---
function updateDisplays() {
  // Update total count
  totalCountDisplay.textContent = count;
  // Update team counts
  for (const team in teamCounts) {
    teamCounters[team].textContent = teamCounts[team];
  }
  // Update progress bar
  const percent = Math.min(Math.round((count / maxCount) * 100), 100) + "%";
  progressBar.style.width = percent;
  progressBar.setAttribute("aria-valuenow", count);
  progressBar.textContent = percent;
  // Attendee list
  renderAttendeeList();
}

function renderAttendeeList() {
  attendeeList.innerHTML = "";
  attendees.forEach(({ name, team }) => {
    const item = document.createElement("li");
    item.textContent = `${name} (${team.replace(/([A-Z])/g, " $1").trim()})`;
    attendeeList.appendChild(item);
  });
}

function saveState() {
  localStorage.setItem("totalCount", count);
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendees", JSON.stringify(attendees));
}

function displayGreeting(name, teamName) {
  welcomeMessage.textContent = `🎉 Welcome, ${name} from ${teamName}!`;
  setTimeout(() => {
    welcomeMessage.textContent = "";
  }, 3000);
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
    if (winningTeam) {
      celebrationMessage.innerHTML = `🏆 Attendance Goal Reached!<br>Congratulations, <strong>${winningTeam.replace(/([A-Z])/g, " $1").trim()}</strong> team!`;
    }
  } else {
    celebrationMessage.innerHTML = "";
  }
}

// --- Form Submission Handler ---
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  if (!name) return; // Ignore empty names

  // Update counts
  count++;
  teamCounts[team]++;
  attendees.push({ name, team: team });

  // Save to localStorage
  saveState();

  // Update UI
  updateDisplays();
  displayGreeting(name, teamName);
  checkCelebration();

  form.reset();
});

// --- Initial UI Population ---
updateDisplays();
checkCelebration();
