function saveState() {
    localStorage.setItem("calendarEvents", JSON.stringify(calendarEvents));
}
function loadState() {
    const savedEvents = localStorage.getItem("calendarEvents");
    if (savedEvents) {
        calendarEvents = JSON.parse(savedEvents);
        renderCalendarGrid();
    }
}
loadState(); // Chamada inicial para carregar os eventos


function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    document.getElementById("clock").innerText = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);
updateClock();
  
let timerInterval;
let timerMilliseconds = 0;
function startTimer() {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            timerMilliseconds += 10;
            const totalSeconds = Math.floor(timerMilliseconds / 1000);
            const displayMilliseconds = (timerMilliseconds % 1000).toString().padStart(3, '0');
            const displayTime = new Date(totalSeconds * 1000).toISOString().substr(11, 8);
            document.getElementById("timer").innerText = `${displayTime}.${displayMilliseconds}`;
        }, 10);
    }
}
function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}
function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerMilliseconds = 0;
    document.getElementById("timer").innerText = "00:00:00.000";
}

const monthNames = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

function renderCalendar(month, year) {
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    document.getElementById("month-year").innerText = `${monthNames[month]} de ${year}`;
    const grid = document.getElementById("calendar-grid");
    grid.innerHTML = "";
    
    for (let i = 0; i < firstDay; i++) {
        let emptyCell = document.createElement("div");
        emptyCell.classList.add("empty");
        grid.appendChild(emptyCell);
    }
    
    for (let day = 1; day <= lastDate; day++) {
        let dayCell = document.createElement("div");
        dayCell.classList.add("day");
        dayCell.innerText = day;
        if (day === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear()) {
            dayCell.classList.add("today");
        }
        grid.appendChild(dayCell);
    }
}

function changeMonth(step) {
    currentMonth += step;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
}

renderCalendar(currentMonth, currentYear);
function toggleMenu() {
    // Selecione os elementos que você deseja aplicar o efeito de blur
    const content = document.querySelector('main');
    const sidebar = document.querySelector('.sidebar');  // Seleciona a sidebar
    const dropdownMenu = document.getElementById('dropdown-menu');
    const icon = document.querySelector('.menu-icon');

    // Alterna a visibilidade do menu (mostra ou esconde)
    dropdownMenu.classList.toggle('active');
    icon.classList.toggle('active'); // Altera o ícone para formar o 'X'

    // Alterna a classe 'blur-effect' nos elementos de conteúdo
    content.classList.toggle('blur-effect');
    sidebar.classList.toggle('blur-effect'); // Aplica o blur na sidebar
    sidebar2.classList.toggle('blur-effect'); // Aplica o blur na sidebar2
}
const calendarGrid = document.getElementById('calendarGrid');
const eventManagerModal = document.getElementById('eventManagerModal');
const calendarOverlay = document.getElementById('calendarOverlay');
const closeEventModalButton = document.getElementById('closeEventModalButton');
const saveEventButton = document.getElementById('saveEventButton');
const dailyViewButton = document.getElementById('dailyViewButton');
const weeklyViewButton = document.getElementById('weeklyViewButton');
const dailyViewContainer = document.getElementById('dailyViewContainer');
const dailyEventList = document.getElementById('dailyEventList');
const eventTitleInput = document.getElementById('eventTitleInput');
const eventTimeInput = document.getElementById('eventTimeInput');
const eventDetailInput = document.getElementById('eventDetailInput');
const existingEventList = document.getElementById('existingEventList');
const prevMonthButton = document.getElementById('prevMonthButton');
const nextMonthButton = document.getElementById('nextMonthButton');
const currentMonthLabel = document.getElementById('currentMonthLabel');

let calendarEvents = [
    { name: 'Reunião', date: '2025-02-03', duration: '01:00', description: 'Discussão sobre o projeto.' },
    { name: 'Consulta Médica', date: '2025-02-04', duration: '00:30', description: 'Check-up anual.' }
];

let currentSelectedDate = null;
let currentsDate = new Date();

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function renderCalendarGrid() {
    calendarGrid.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);

    currentMonthLabel.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} de ${year}`;

    for (let i = 1; i <= daysInMonth; i++) {
        const calendarDay = document.createElement('div');
        calendarDay.className = 'calendar-day';
        calendarDay.dataset.date = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
        calendarDay.innerHTML = `<div>${i}</div>`;

        const dayDate = calendarDay.dataset.date;
        const dailyEvents = calendarEvents.filter(event => event.date === dayDate);

        if (dailyEvents.length) {
            const eventsDiv = document.createElement('div');
            eventsDiv.className = 'day-events';
            dailyEvents.forEach(event => {
                const eventMarker = document.createElement('span');
                eventMarker.textContent = `${event.name}`;
                eventMarker.dataset.eventId = event.id; // Adiciona o ID do evento
                eventsDiv.appendChild(eventMarker);
            });
            calendarDay.appendChild(eventsDiv);
        }

        calendarDay.onclick = () => {
            currentSelectedDate = dayDate;
            renderEventManagerModal(dailyEvents, dayDate);
            eventManagerModal.style.display = 'block';
            calendarOverlay.style.display = 'block';
        };

        calendarGrid.appendChild(calendarDay);
    }

    initializeDragAndDrop(); // Reaplica o comportamento de arrastar e soltar após renderizar
}

function renderDailyEventList(date) {
    dailyEventList.innerHTML = '';
    const dailyEvents = calendarEvents.filter(event => event.date === date);
    if (dailyEvents.length) {
        dailyEvents.forEach(event => {
            const listItem = document.createElement('li');
            listItem.textContent = `${event.name} - ${event.duration} - ${event.description}`;
            dailyEventList.appendChild(listItem);
        });
    } else {
        dailyEventList.innerHTML = '<li>Sem eventos</li>';
    }
}

function renderEventManagerModal(dailyEvents, dayDate) {
    existingEventList.innerHTML = '';
    if (dailyEvents.length) {
        existingEventList.innerHTML = `<h3>Eventos Existentes (${dayDate}):</h3>`;
        dailyEvents.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.innerHTML = `
            ${event.name} - ${event.date} (${event.duration}) - ${event.description} 
            <button class="button-delete" onclick="deleteCalendarEvent('${event.name}', '${event.date}')">✕</button>`;
            existingEventList.appendChild(eventDiv);
        });
    }
}

function deleteCalendarEvent(name, date) {
    calendarEvents = calendarEvents.filter(event => !(event.name === name && event.date === date));
    renderCalendarGrid();
    const dailyEvents = calendarEvents.filter(event => event.date === currentSelectedDate);
    renderEventManagerModal(dailyEvents);
}

saveEventButton.onclick = () => {
    const eventTitle = eventTitleInput.value;
    const eventDuration = eventTimeInput.value;
    const eventDetail = eventDetailInput.value;
    if (eventTitle && eventDuration && eventDetail && currentSelectedDate) {
        calendarEvents.push({ name: eventTitle, date: currentSelectedDate, duration: eventDuration, description: eventDetail });
        renderCalendarGrid();
    }
    eventManagerModal.style.display = 'none';
    calendarOverlay.style.display = 'none';
};

closeEventModalButton.onclick = () => {
    eventManagerModal.style.display = 'none';
    calendarOverlay.style.display = 'none';
};

calendarOverlay.onclick = () => {
    eventManagerModal.style.display = 'none';
    calendarOverlay.style.display = 'none';
};

dailyViewButton.onclick = () => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    renderDailyEventList(formattedDate);
    dailyViewContainer.classList.add('active');
    calendarGrid.style.display = 'none';
    weeklyViewButton.classList.remove('active');
    dailyViewButton.classList.add('active');
};

weeklyViewButton.onclick = () => {
    dailyViewContainer.classList.remove('active');
    calendarGrid.style.display = 'flex';
    dailyViewButton.classList.remove('active');
    weeklyViewButton.classList.add('active');
};

prevMonthButton.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendarGrid();
};

nextMonthButton.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendarGrid();
};

renderCalendarGrid();

function getFormattedDate() {
    const daysOfWeek = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
    const monthsOfYear = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

    const today = new Date();
    const dayOfWeek = daysOfWeek[today.getDay()];
    const day = today.getDate();
    const month = monthsOfYear[today.getMonth()];

    return `${dayOfWeek}, ${day} de ${month}`;
}

// Exibir no console ou em algum elemento HTML
console.log(getFormattedDate());

// Exemplo de como exibir no HTML
const dateDisplay = document.getElementById("dateDisplay");
if (dateDisplay) {
    dateDisplay.textContent = getFormattedDate();
}
let focusTimerInterval;
let focusTimeRemaining = 10 * 60 * 1000; // 20 minutes in milliseconds
let focusTimeDefault = 10 * 60 * 1000; // Default 20 minutes

function startFocusMode() {
    clearInterval(focusTimerInterval);
    const progressBar = document.getElementById("focusProgressBar");
    const timeDisplay = document.getElementById("focusTimeDisplay");

    focusTimerInterval = setInterval(() => {
        function showNotification(message) {
            const notification = document.getElementById("notification");
            notification.textContent = message;
            notification.classList.remove("hidden");
            notification.classList.add("visible");
        
            // Oculta a notificação após 3 segundos
            setTimeout(() => {
                notification.classList.remove("visible");
                setTimeout(() => notification.classList.add("hidden"), 300); // Garante que seja ocultado após a transição
            }, 11000);
        }
        
        if (focusTimeRemaining <= 0) {
            clearInterval(focusTimerInterval);
            showNotification("Tempo de foco concluído!");
            progressBar.style.width = "0%";
            timeDisplay.textContent = "00:00";
            return;
        }
        

        focusTimeRemaining -= 1000;
        updateFocusUI(progressBar, timeDisplay);
    }, 1000);
}

function pauseFocusMode() {
    clearInterval(focusTimerInterval);
}

function resetFocusMode() {
    clearInterval(focusTimerInterval);
    focusTimeRemaining = focusTimeDefault;
    updateFocusUI(
        document.getElementById("focusProgressBar"),
        document.getElementById("focusTimeDisplay")
    );
}

function increaseFocusTime() {
    focusTimeDefault += 2.5 * 60 * 1000;
    focusTimeRemaining = focusTimeDefault;
    updateFocusUI(
        document.getElementById("focusProgressBar"),
        document.getElementById("focusTimeDisplay")
    );
}

function decreaseFocusTime() {
    if (focusTimeDefault > 2.5 * 60 * 1000) {
        focusTimeDefault -= 2.5 * 60 * 1000;
        focusTimeRemaining = focusTimeDefault;
        updateFocusUI(
            document.getElementById("focusProgressBar"),
            document.getElementById("focusTimeDisplay")
        );
    } else {
        alert("O tempo de foco não pode ser menor que 2:30 minutos.");
    }
}

function updateFocusUI(progressBar, timeDisplay) {
    const totalMilliseconds = focusTimeDefault;
    const percentage = (focusTimeRemaining / totalMilliseconds) * 100;
    progressBar.style.width = `${percentage}%`;

    const minutes = Math.floor(focusTimeRemaining / (60 * 1000));
    const seconds = Math.floor((focusTimeRemaining % (60 * 1000)) / 1000);
    timeDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

document.getElementById("calendar-grid").addEventListener("click", (event) => {
    if (event.target.classList.contains("day")) {
        event.target.classList.toggle("active");
    }
});

