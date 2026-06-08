const storageKey = "daily-activity-tracker:v1";

const form = document.querySelector("#activityForm");
const list = document.querySelector("#activityList");
const template = document.querySelector("#activityTemplate");
const emptyState = document.querySelector("#emptyState");
const selectedDate = document.querySelector("#selectedDate");
const todayLabel = document.querySelector("#todayLabel");
const totalCount = document.querySelector("#totalCount");
const doneCount = document.querySelector("#doneCount");
const totalMinutes = document.querySelector("#totalMinutes");
const progressBar = document.querySelector("#progressBar");
const filters = Array.from(document.querySelectorAll(".filter"));

let state = loadState();
let activeFilter = "all";

function toDateKey(date) {
  const copy = new Date(date);
  copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset());
  return copy.toISOString().slice(0, 10);
}

function formatDateLabel(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);
  const today = toDateKey(new Date());
  const yesterday = toDateKey(addDays(new Date(), -1));
  const tomorrow = toDateKey(addDays(new Date(), 1));

  if (dateKey === today) return "Today";
  if (dateKey === yesterday) return "Yesterday";
  if (dateKey === tomorrow) return "Tomorrow";

  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(date);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function getActivities(dateKey = selectedDate.value) {
  return state[dateKey] || [];
}

function setActivities(activities, dateKey = selectedDate.value) {
  state = { ...state, [dateKey]: activities };
  saveState();
  render();
}

function createActivity(formData) {
  return {
    id: crypto.randomUUID(),
    name: formData.get("activityName").trim(),
    time: formData.get("activityTime"),
    minutes: Number(formData.get("activityMinutes")) || 0,
    category: formData.get("activityCategory"),
    notes: formData.get("activityNotes").trim(),
    done: false,
    createdAt: Date.now(),
  };
}

function matchesFilter(activity) {
  if (activeFilter === "done") return activity.done;
  if (activeFilter === "open") return !activity.done;
  return true;
}

function render() {
  const activities = getActivities();
  const visibleActivities = activities.filter(matchesFilter);
  const completed = activities.filter((activity) => activity.done).length;
  const minutes = activities.reduce((sum, activity) => sum + Number(activity.minutes || 0), 0);
  const completion = activities.length ? Math.round((completed / activities.length) * 100) : 0;

  todayLabel.textContent = formatDateLabel(selectedDate.value);
  totalCount.textContent = activities.length;
  doneCount.textContent = completed;
  totalMinutes.textContent = minutes;
  progressBar.style.width = `${completion}%`;
  list.innerHTML = "";

  visibleActivities
    .sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99") || a.createdAt - b.createdAt)
    .forEach((activity) => {
      const item = template.content.firstElementChild.cloneNode(true);
      const checkButton = item.querySelector(".check-button");
      const deleteButton = item.querySelector(".delete-button");
      const name = item.querySelector("strong");
      const category = item.querySelector(".category-pill");
      const meta = item.querySelector(".activity-meta");
      const notes = item.querySelector("p");

      item.classList.toggle("done", activity.done);
      name.textContent = activity.name;
      category.textContent = activity.category;
      meta.textContent = [activity.time, activity.minutes ? `${activity.minutes} min` : ""].filter(Boolean).join(" - ");
      notes.textContent = activity.notes;
      notes.hidden = !activity.notes;
      checkButton.setAttribute("aria-label", activity.done ? "Mark activity open" : "Mark activity complete");

      checkButton.addEventListener("click", () => {
        setActivities(
          activities.map((entry) => entry.id === activity.id ? { ...entry, done: !entry.done } : entry)
        );
      });

      deleteButton.addEventListener("click", () => {
        setActivities(activities.filter((entry) => entry.id !== activity.id));
      });

      list.append(item);
    });

  emptyState.classList.toggle("visible", visibleActivities.length === 0);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const activity = createActivity(new FormData(form));
  if (!activity.name) return;

  setActivities([...getActivities(), activity]);
  form.reset();
  document.querySelector("#activityMinutes").value = 30;
  document.querySelector("#activityName").focus();
});

selectedDate.addEventListener("change", render);

document.querySelector("#previousDay").addEventListener("click", () => {
  selectedDate.value = toDateKey(addDays(new Date(`${selectedDate.value}T00:00:00`), -1));
  render();
});

document.querySelector("#nextDay").addEventListener("click", () => {
  selectedDate.value = toDateKey(addDays(new Date(`${selectedDate.value}T00:00:00`), 1));
  render();
});

filters.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filters.forEach((filter) => filter.classList.toggle("active", filter === button));
    render();
  });
});

selectedDate.value = toDateKey(new Date());
render();
