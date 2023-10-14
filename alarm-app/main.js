const timerRef = document.querySelector(".current-time");
const hourInput = document.getElementById("hour-input");
const minuteInput = document.getElementById("minute-input");
const activeAlarms = document.querySelector(".alarms-list");
const setAlarm = document.getElementById("set");
const clearAllButton = document.querySelector(".clear");
const alarmSound = new Audio("/");

let alarmIndex = 0;
let alarmsArray = [];
let initialHour = 0;
let initialMinute = 0;

// 글자수 맞추는 함수 두문자수 이하면 0추가

const appendZero = (value) => (value < 10 ? "0" + value : value);

const displayTimer = () => {
  const date = new Date();
  const currentTime = date.toLocaleTimeString("en-US", {
    hour12: false,
  });
  timerRef.textContent = currentTime;

  alarmsArray.forEach((alarm) => {
    if (alarm.isActive && alarm.time === currentTime.slice(0, 5)) {
      alarmSound.play();
    }
  });
};

const createAlarm = (hour, minute) => {
  alarmIndex += 1;

  const alarmObj = {
    id: `${alarmIndex}_${hour}_${minute}`,
    time: `${appendZero(hour)}:${appendZero(minute)}`,
    isActive: false,
  };

  alarmsArray.push(alarmObj);
  const alarmDiv = document.createElement("div");
  alarmDiv.className = "alarm";
  alarmDiv.dataset = alarmObj.id;
  alarmDiv.innerHTML = `<span>${alarmObj.time}</span>`;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", () => toggleAlarm(alarmObj));
  alarmDiv.appendChild(checkbox);
  console.log(alarmsArray);

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
  deleteButton.className = "deleteButton";
  deleteButton.addEventListener("click", () => deleteAlarm(alarmObj));
  alarmDiv.appendChild(deleteButton);

  activeAlarms.appendChild(alarmDiv);
};

// 함수 엑티브 토글 스테이트

const toggleAlarm = (alarm) => {
  alarm.isActive = !alarm.isActive;
  if (alarm.isActive) {
    const currentTime = new Date()
      .toLocaleTimerString("en-US", { hour12: false })
      .slice(0, 5);
    if (alarm.time === currentTime) {
      alarmSound.play();
    }
  } else {
    alarmSound.play();
  }
};

// 알람 지우는 함수
const deleteAlarm = (alarm) => {
  const index = alarmsArray.indexOf(alarm);
  if (index > -1) {
    alarmsArray.splice(index, 1);
    document.querySelector(`[data-id="${alarm.id}"]`).remove();
  }
};

// 클리어 올 함수

clearAllButton.addEventListener("click", () => {
  alarmsArray = [];
  activeAlarms.innerHTML = "";
});

// 새로운 알람 세팅 함수
setAlarm.addEventListener("click", () => {
  let hour = parseInt(hourInput.value) || 0;
  let minute = parseInt(minuteInput.value) || 0;

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    alert(
      "Invalid hoour or minute. Please enter values within the valid range"
    );
    return;
  }
  // 이미 존재하는 알람 시간이랑 겹칠때
  if (
    !alarmsArray.some(
      (alarm) => alarm.time === `${appendZero(hour)}:${appendZero(minute)}`
    )
  ) {
    createAlarm(hour, minute);
  }

  // input 클리어
  [hourInput.value, minuteInput.value] = ["", ""];
});

window.onload = () => {
  setInterval(displayTimer, 1000);
  [hourInput.value, minuteInput.value] = ["", ""];
};
