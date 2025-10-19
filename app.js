// Demo users database (in real app this would be on server)
const users = {
    'admin@stoic11.com': {
        password: 'admin123',
        role: 'admin',
        name: 'Администратор'
    },
    'client@example.com': {
        password: 'client123',
        role: 'client',
        name: 'Иван Петров'
    }
};

// Demo projects data
const projectsData = [
    {
        id: 1,
        name: 'Ресторант "Бистро"',
        client: 'Иван Петров',
        status: 'active',
        progress: 75,
        startDate: '2025-09-01',
        endDate: '2025-11-15',
        budget: 250000,
        type: 'restaurant',
        metrics: {
            roi: 24.8,
            npv: 142500,
            breakeven: 18,
            irr: 31.2
        }
    },
    {
        id: 2,
        name: 'IT Център',
        client: 'TechCorp Ltd',
        status: 'review',
        progress: 45,
        startDate: '2025-10-01',
        endDate: '2025-12-01',
        budget: 500000,
        type: 'tech',
        metrics: {
            roi: 18.5,
            npv: 85000,
            breakeven: 24,
            irr: 22.1
        }
    }
];

// Current user session
let currentUser = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    const path = window.location.pathname;
    
    if (path.includes('admin-dashboard.html')) {
        initAdminDashboard();
    } else if (path.includes('client-dashboard.html')) {
        initClientDashboard();
    } else {
        initLoginPage();
    }
}

// Login Page Functions
function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validate credentials
    if (users[email] && users[email].password === password) {
        currentUser = users[email];
        currentUser.email = email;
        
        // Store user session
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Redirect based on role
        if (currentUser.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'client-dashboard.html';
        }
    } else {
        alert('Невалиден email или парола!');
    }
}

// Admin Dashboard Functions
function initAdminDashboard() {
    // Check if user is logged in and has admin role
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
        window.location.href = 'index.html';
        return;
    }
    
    currentUser = JSON.parse(userData);
    if (currentUser.role !== 'admin') {
        window.location.href = 'index.html';
        return;
    }
    
    setupAdminDashboard();
    loadAdminData();
}

function setupAdminDashboard() {
    // Setup sidebar navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Handle navigation (in real app would load different content)
            const section = this.getAttribute('href').substring(1);
            console.log('Navigating to:', section);
        });
    });
    
    // Setup create project modal
    const createProjectForm = document.getElementById('createProjectForm');
    if (createProjectForm) {
        createProjectForm.addEventListener('submit', handleCreateProject);
    }
}

function loadAdminData() {
    // Load projects table
    const tableBody = document.querySelector('.projects-table tbody');
    if (tableBody) {
        tableBody.innerHTML = '';
        
        projectsData.forEach(project => {
            const row = createProjectRow(project);
            tableBody.appendChild(row);
        });
    }
    
    // Update stats
    updateAdminStats();
}

function createProjectRow(project) {
    const row = document.createElement('tr');
    
    const statusClass = project.status === 'active' ? 'status-active' : 
                       project.status === 'review' ? 'status-review' : 'status-completed';
    
    const statusText = project.status === 'active' ? 'Активен' : 
                      project.status === 'review' ? 'Преглед' : 'Завършен';
    
    row.innerHTML = `
        <td>${project.name}</td>
        <td>${project.client}</td>
        <td><span class="status ${statusClass}">${statusText}</span></td>
        <td>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${project.progress}%"></div>
            </div>
            <span>${project.progress}%</span>
        </td>
        <td>${formatDate(project.endDate)}</td>
        <td>
            <button class="btn btn-sm" onclick="viewProject(${project.id})">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-sm" onclick="editProject(${project.id})">
                <i class="fas fa-edit"></i>
            </button>
        </td>
    `;
    
    return row;
}

function updateAdminStats() {
    const activeProjects = projectsData.filter(p => p.status === 'active').length;
    const completedProjects = 25; // Demo data
    const totalClients = 8; // Demo data
    const totalRevenue = 2.4; // Demo data in millions
    
    // Update stat cards (in real app would query from database)
    console.log('Stats updated:', { activeProjects, completedProjects, totalClients, totalRevenue });
}

// Client Dashboard Functions
function initClientDashboard() {
    // Check if user is logged in and has client role
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
        window.location.href = 'index.html';
        return;
    }
    
    currentUser = JSON.parse(userData);
    if (currentUser.role !== 'client') {
        window.location.href = 'index.html';
        return;
    }
    
    setupClientDashboard();
    loadClientData();
}

function setupClientDashboard() {
    // Setup sidebar navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Handle navigation
            const section = this.getAttribute('href').substring(1);
            console.log('Navigating to:', section);
        });
    });
    
    // Setup file upload
    setupFileUpload();
}

function loadClientData() {
    // Load client's project data (demo - first project)
    const clientProject = projectsData[0];
    
    if (clientProject) {
        // Update progress circle
        updateProgressCircle(clientProject.progress);
        
        // Update metrics
        updateClientMetrics(clientProject.metrics);
    }
}

function setupFileUpload() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    
    if (uploadZone && fileInput) {
        // Handle drag and drop
        uploadZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
        });
        
        uploadZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.backgroundColor = '';
        });
        
        uploadZone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.backgroundColor = '';
            
            const files = e.dataTransfer.files;
            handleFileUpload(files);
        });
        
        // Handle file input change
        fileInput.addEventListener('change', function(e) {
            const files = e.target.files;
            handleFileUpload(files);
        });
    }
}

function handleFileUpload(files) {
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            console.log('Uploading file:', file.name);
            
            // In real app would upload to server
            // For demo, just show success message
            showNotification(`Файлът "${file.name}" беше качен успешно!`, 'success');
        }
    }
}

function updateProgressCircle(progress) {
    const circle = document.querySelector('.progress-circle circle:last-child');
    const progressText = document.querySelector('.progress-percentage');
    
    if (circle && progressText) {
        const circumference = 2 * Math.PI * 50; // radius = 50
        const offset = circumference - (progress / 100) * circumference;
        
        circle.style.strokeDashoffset = offset;
        progressText.textContent = `${progress}%`;
    }
}

function updateClientMetrics(metrics) {
    // Update metric cards with actual data
    const metricCards = document.querySelectorAll('.metric-card');
    
    if (metricCards.length >= 4) {
        metricCards[0].querySelector('.metric-value').textContent = `${metrics.roi}%`;
        metricCards[1].querySelector('.metric-value').textContent = `${metrics.npv.toLocaleString()} лв.`;
        metricCards[2].querySelector('.metric-value').textContent = `${metrics.breakeven} месеца`;
        metricCards[3].querySelector('.metric-value').textContent = `${metrics.irr}%`;
    }
}

// Modal Functions
function openCreateProject() {
    const modal = document.getElementById('createProjectModal');
    if (modal) {
        modal.style.display = 'block';
        
        // Set default start date to today
        const startDateInput = document.getElementById('startDate');
        if (startDateInput) {
            startDateInput.value = new Date().toISOString().split('T')[0];
        }
    }
}

function closeCreateProject() {
    const modal = document.getElementById('createProjectModal');
    if (modal) {
        modal.style.display = 'none';
        
        // Reset form
        const form = document.getElementById('createProjectForm');
        if (form) {
            form.reset();
        }
    }
}

function handleCreateProject(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const projectData = {
        id: projectsData.length + 1,
        name: formData.get('projectName'),
        client: formData.get('clientName'),
        type: formData.get('projectType'),
        budget: parseInt(formData.get('budget')),
        description: formData.get('description'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        status: 'active',
        progress: 0,
        metrics: {
            roi: 0,
            npv: 0,
            breakeven: 0,
            irr: 0
        }
    };
    
    // Add to projects array (in real app would send to server)
    projectsData.push(projectData);
    
    // Refresh projects table
    loadAdminData();
    
    // Close modal
    closeCreateProject();
    
    // Show success message
    showNotification(`Проектът "${projectData.name}" беше създаден успешно!`, 'success');
}

// Project Actions
function viewProject(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (project) {
        alert(`Преглед на проект: ${project.name}\n\nЗа пълна функционалност ще се имплементира в следващата версия.`);
    }
}

function editProject(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (project) {
        alert(`Редактиране на проект: ${project.name}\n\nЗа пълна функционалност ще се имплементира в следващата версия.`);
    }
}

// Utility Functions
function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    window.location.href = 'index.html';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('bg-BG');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
};

// Add CSS for notifications
const notificationCSS = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: auto;
        padding: 5px;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;

// Inject notification CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationCSS;
document.head.appendChild(styleSheet);

console.log('Stoic11 Business Platform initialized successfully!');

// =================================
// CRM FUNCTIONALITIES
// =================================

// Sample Data for CRM
let clientsData = [
    {
        id: 1,
        name: "Иван Петров",
        email: "ivan@example.com",
        phone: "+359 888 123 456",
        company: "Петров ЕООД",
        goals: "Разширяване на бизнеса с нов продуктов център. Инвестиция от 500,000 лв.",
        painPoints: "Недостиг на капитал, несигурност в ROI прогнозите",
        budget: "500k-1m",
        timeline: "normal",
        personality: "Детайлно ориентиран, иска ясни факти и цифри",
        meetingPrep: "Винаги подготви актуални финансови отчети. Обича да обсъжда конкретни числа.",
        currentStatus: "В процес на бизнес план разработка - фаза анализ на пазара",
        nextActions: "Обсъждане на marketing стратегия и конкуренти анализ",
        projectType: "business-plan",
        projectPhase: "analysis",
        createdAt: "2025-10-15"
    },
    {
        id: 2,
        name: "Мария Георгиева",
        email: "maria@techstart.bg",
        phone: "+359 887 654 321",
        company: "TechStart Bulgaria",
        goals: "Финансиране на иновативна IT платформа за автоматизация",
        painPoints: "Високи технологични рискове, нуждае се от инвеститори",
        budget: "100k-500k",
        timeline: "urgent",
        personality: "Бърза в решенията, технически компетентна",
        meetingPrep: "Винаги има презентация готова. Фокусирай се върху технологичните предимства.",
        currentStatus: "Търси инвеститори - готов бизнес план",
        nextActions: "Подготовка на pitch deck за инвеститори",
        projectType: "investment-evaluation",
        projectPhase: "implementation",
        createdAt: "2025-10-12"
    }
];

let meetingsData = [
    {
        id: 1,
        clientId: 1,
        clientName: "Иван Петров",
        type: "progress-review",
        date: "2025-10-20",
        time: "14:00",
        duration: 60,
        location: "Office",
        agenda: "Преглед на market analysis резултатите и обсъждане на следващи стъпки",
        preparation: "Подготовка на market research доклад",
        status: "scheduled",
        emailReminder: true,
        smsReminder: false
    },
    {
        id: 2,
        clientId: 2,
        clientName: "Мария Георгиева",
        type: "presentation",
        date: "2025-10-19",
        time: "10:00",
        duration: 90,
        location: "Zoom",
        agenda: "Презентация на бизнес план пред потенциални инвеститори",
        preparation: "Финализиране на pitch deck презентацията",
        status: "scheduled",
        emailReminder: true,
        smsReminder: true
    }
];

// Client Profiles Functions
function loadClientProfiles() {
    const container = document.getElementById('clientsGrid');
    if (!container) return;
    
    container.innerHTML = '';
    
    clientsData.forEach(client => {
        const clientCard = createClientCard(client);
        container.appendChild(clientCard);
    });
}

function createClientCard(client) {
    const card = document.createElement('div');
    card.className = 'client-card';
    card.onclick = () => viewClientDetails(client.id);
    
    const initials = client.name.split(' ').map(n => n[0]).join('');
    
    card.innerHTML = `
        <div class="client-header">
            <div class="client-avatar">${initials}</div>
            <div class="client-info">
                <h3>${client.name}</h3>
                <p>${client.email}</p>
            </div>
        </div>
        <div class="client-meta">
            <span>${client.budget || 'No budget'}</span>
            <span>${client.projectPhase || 'New'}</span>
        </div>
        <div class="client-goals">
            <h4>🎯 Goals:</h4>
            <p>${client.goals.substring(0, 100)}${client.goals.length > 100 ? '...' : ''}</p>
        </div>
        <div class="client-actions" onclick="event.stopPropagation()">
            <button class="btn-small btn-edit" onclick="editClient(${client.id})">Edit</button>
            <button class="btn-small btn-meeting" onclick="scheduleClientMeeting(${client.id})">Meeting</button>
        </div>
    `;
    
    return card;
}

function openAddClientModal() {
    const modal = document.getElementById('clientModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('clientForm');
    
    title.textContent = 'Add New Client';
    form.reset();
    modal.style.display = 'block';
}

function editClient(clientId) {
    const client = clientsData.find(c => c.id === clientId);
    if (!client) return;
    
    const modal = document.getElementById('clientModal');
    const title = document.getElementById('modalTitle');
    
    title.textContent = 'Edit Client';
    
    // Fill form with client data
    document.getElementById('clientName').value = client.name;
    document.getElementById('clientEmail').value = client.email;
    document.getElementById('clientPhone').value = client.phone || '';
    document.getElementById('clientCompany').value = client.company || '';
    document.getElementById('clientGoals').value = client.goals || '';
    document.getElementById('clientPainPoints').value = client.painPoints || '';
    document.getElementById('clientBudget').value = client.budget || '';
    document.getElementById('clientTimeline').value = client.timeline || '';
    document.getElementById('clientPersonality').value = client.personality || '';
    document.getElementById('meetingPrep').value = client.meetingPrep || '';
    document.getElementById('currentStatus').value = client.currentStatus || '';
    document.getElementById('nextActions').value = client.nextActions || '';
    document.getElementById('projectType').value = client.projectType || '';
    document.getElementById('projectPhase').value = client.projectPhase || '';
    
    // Store editing client ID
    modal.dataset.editingId = clientId;
    modal.style.display = 'block';
}

function scheduleClientMeeting(clientId) {
    // Redirect to meeting scheduler with pre-selected client
    window.location.href = `meeting-scheduler.html?client=${clientId}`;
}

function closeClientModal() {
    const modal = document.getElementById('clientModal');
    modal.style.display = 'none';
    delete modal.dataset.editingId;
}

function setupClientModalEvents() {
    const modal = document.getElementById('clientModal');
    const form = document.getElementById('clientForm');
    const closeBtn = modal.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.onclick = closeClientModal;
    }
    
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            saveClient();
        };
    }
}

function saveClient() {
    const modal = document.getElementById('clientModal');
    const isEditing = modal.dataset.editingId;
    
    const clientData = {
        name: document.getElementById('clientName').value,
        email: document.getElementById('clientEmail').value,
        phone: document.getElementById('clientPhone').value,
        company: document.getElementById('clientCompany').value,
        goals: document.getElementById('clientGoals').value,
        painPoints: document.getElementById('clientPainPoints').value,
        budget: document.getElementById('clientBudget').value,
        timeline: document.getElementById('clientTimeline').value,
        personality: document.getElementById('clientPersonality').value,
        meetingPrep: document.getElementById('meetingPrep').value,
        currentStatus: document.getElementById('currentStatus').value,
        nextActions: document.getElementById('nextActions').value,
        projectType: document.getElementById('projectType').value,
        projectPhase: document.getElementById('projectPhase').value
    };
    
    if (isEditing) {
        const clientId = parseInt(isEditing);
        const clientIndex = clientsData.findIndex(c => c.id === clientId);
        if (clientIndex !== -1) {
            clientsData[clientIndex] = { ...clientsData[clientIndex], ...clientData };
            showNotification('Client updated successfully!', 'success');
        }
    } else {
        const newClient = {
            id: Date.now(),
            ...clientData,
            createdAt: new Date().toISOString().split('T')[0]
        };
        clientsData.push(newClient);
        showNotification('New client added successfully!', 'success');
    }
    
    closeClientModal();
    loadClientProfiles();
}

// Meeting Scheduler Functions
function loadMeetingScheduler() {
    updateMeetingStats();
    loadClientOptions();
    loadMeetingsList();
}

function updateMeetingStats() {
    const today = new Date().toISOString().split('T')[0];
    const thisWeekStart = new Date();
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekEnd.getDate() + 6);
    
    const todayMeetings = meetingsData.filter(m => m.date === today).length;
    const weekMeetings = meetingsData.filter(m => {
        const meetingDate = new Date(m.date);
        return meetingDate >= thisWeekStart && meetingDate <= thisWeekEnd;
    }).length;
    const upcomingMeetings = meetingsData.filter(m => m.date > today && m.status === 'scheduled').length;
    const completedMeetings = meetingsData.filter(m => m.status === 'completed').length;
    
    document.getElementById('todayMeetings').textContent = todayMeetings;
    document.getElementById('weekMeetings').textContent = weekMeetings;
    document.getElementById('upcomingMeetings').textContent = upcomingMeetings;
    document.getElementById('completedMeetings').textContent = completedMeetings;
}

function generateCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid) return;
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Update month header
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('currentMonth').textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Clear calendar
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        header.style.cssText = 'background: #3498db; color: white; font-weight: bold; padding: 10px;';
        calendarGrid.appendChild(header);
    });
    
    // Generate calendar days
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        if (date.getMonth() !== currentMonth) {
            dayElement.classList.add('other-month');
        }
        
        if (date.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }
        
        // Check for meetings on this date
        const dateString = date.toISOString().split('T')[0];
        const dayMeetings = meetingsData.filter(m => m.date === dateString);
        
        if (dayMeetings.length > 0) {
            dayElement.classList.add('has-meeting');
            dayElement.innerHTML = `
                <div>${date.getDate()}</div>
                <div class="meeting-dot"></div>
            `;
        } else {
            dayElement.textContent = date.getDate();
        }
        
        dayElement.onclick = () => showDayMeetings(dateString);
        calendarGrid.appendChild(dayElement);
    }
}

function loadClientOptions() {
    const select = document.getElementById('meetingClient');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select a client</option>';
    clientsData.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = client.name;
        select.appendChild(option);
    });
    
    // Pre-select client if URL parameter exists
    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get('client');
    if (clientId) {
        select.value = clientId;
        loadClientHints();
    }
}

function loadClientHints() {
    const clientId = parseInt(document.getElementById('meetingClient').value);
    const client = clientsData.find(c => c.id === clientId);
    const hintsSection = document.getElementById('clientHintsSection');
    
    if (client && hintsSection) {
        hintsSection.style.display = 'block';
        document.getElementById('clientGoalsHint').textContent = client.goals || 'No goals specified';
        document.getElementById('clientPainPointsHint').textContent = client.painPoints || 'No pain points specified';
        document.getElementById('clientStatusHint').textContent = client.currentStatus || 'No current status';
        document.getElementById('clientNextActionsHint').textContent = client.nextActions || 'No suggested actions';
    } else if (hintsSection) {
        hintsSection.style.display = 'none';
    }
}

function openScheduleMeetingModal() {
    const modal = document.getElementById('meetingModal');
    const form = document.getElementById('meetingForm');
    
    form.reset();
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('meetingDate').value = today;
    document.getElementById('meetingTime').value = '10:00';
    
    modal.style.display = 'block';
}

function closeMeetingModal() {
    const modal = document.getElementById('meetingModal');
    modal.style.display = 'none';
}

function setupMeetingModalEvents() {
    const modal = document.getElementById('meetingModal');
    const form = document.getElementById('meetingForm');
    const closeBtn = modal.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.onclick = closeMeetingModal;
    }
    
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            saveMeeting();
        };
    }
}

function saveMeeting() {
    const clientId = parseInt(document.getElementById('meetingClient').value);
    const client = clientsData.find(c => c.id === clientId);
    
    if (!client) {
        alert('Please select a client');
        return;
    }
    
    const meetingData = {
        id: Date.now(),
        clientId: clientId,
        clientName: client.name,
        type: document.getElementById('meetingType').value,
        date: document.getElementById('meetingDate').value,
        time: document.getElementById('meetingTime').value,
        duration: parseInt(document.getElementById('meetingDuration').value),
        location: document.getElementById('meetingLocation').value,
        agenda: document.getElementById('meetingAgenda').value,
        preparation: document.getElementById('meetingPreparation').value,
        status: 'scheduled',
        emailReminder: document.getElementById('emailReminder').checked,
        smsReminder: document.getElementById('smsReminder').checked
    };
    
    meetingsData.push(meetingData);
    
    showNotification('Meeting scheduled successfully!', 'success');
    closeMeetingModal();
    updateMeetingStats();
    generateCalendar();
    loadMeetingsList();
}

function loadMeetingsList() {
    const container = document.getElementById('meetingsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    meetingsData.forEach(meeting => {
        const meetingElement = createMeetingElement(meeting);
        container.appendChild(meetingElement);
    });
}

function createMeetingElement(meeting) {
    const element = document.createElement('div');
    element.className = `meeting-item ${meeting.status}`;
    element.onclick = () => viewMeetingDetails(meeting.id);
    
    const meetingDate = new Date(`${meeting.date}T${meeting.time}`);
    const formattedDate = meetingDate.toLocaleDateString('bg-BG');
    const formattedTime = meetingDate.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' });
    
    element.innerHTML = `
        <div class="meeting-header">
            <div class="meeting-title">${meeting.type.replace('-', ' ').toUpperCase()}</div>
            <div class="meeting-time">${formattedDate} at ${formattedTime}</div>
        </div>
        <div class="meeting-client">👤 ${meeting.clientName}</div>
        <div class="meeting-agenda">${meeting.agenda || 'No agenda specified'}</div>
        <div style="margin-top: 10px;">
            <span class="status-${meeting.status}">${meeting.status.toUpperCase()}</span>
        </div>
    `;
    
    return element;
}

function toggleView() {
    const calendarView = document.getElementById('calendarView');
    const listView = document.getElementById('listView');
    const toggleText = document.getElementById('viewToggleText');
    
    if (calendarView.style.display === 'none') {
        calendarView.style.display = 'block';
        listView.style.display = 'none';
        toggleText.textContent = 'List View';
    } else {
        calendarView.style.display = 'none';
        listView.style.display = 'block';
        toggleText.textContent = 'Calendar View';
    }
}

// Calendar navigation
let currentCalendarDate = new Date();

function previousMonth() {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    generateCalendar();
}

function nextMonth() {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    generateCalendar();
}

function showDayMeetings(date) {
    const dayMeetings = meetingsData.filter(m => m.date === date);
    
    if (dayMeetings.length === 0) {
        alert(`No meetings scheduled for ${date}`);
        return;
    }
    
    let message = `Meetings for ${date}:\n\n`;
    dayMeetings.forEach(meeting => {
        message += `${meeting.time} - ${meeting.clientName} (${meeting.type})\n`;
    });
    
    alert(message);
}

function viewMeetingDetails(meetingId) {
    const meeting = meetingsData.find(m => m.id === meetingId);
    if (!meeting) return;
    
    alert(`Meeting Details:\n\nClient: ${meeting.clientName}\nType: ${meeting.type}\nDate: ${meeting.date}\nTime: ${meeting.time}\nLocation: ${meeting.location}\nAgenda: ${meeting.agenda}`);
}

function viewClientDetails(clientId) {
    const client = clientsData.find(c => c.id === clientId);
    if (!client) return;
    
    const clientMeetings = meetingsData.filter(m => m.clientId === clientId);
    
    let details = `Client Profile: ${client.name}\n\n`;
    details += `📧 ${client.email}\n`;
    details += `📱 ${client.phone}\n`;
    details += `🏢 ${client.company}\n\n`;
    details += `🎯 Goals: ${client.goals}\n\n`;
    details += `⚠️ Pain Points: ${client.painPoints}\n\n`;
    details += `💡 Smart Hints: ${client.meetingPrep}\n\n`;
    details += `📊 Current Status: ${client.currentStatus}\n\n`;
    details += `🔄 Next Actions: ${client.nextActions}\n\n`;
    details += `📅 Meetings: ${clientMeetings.length} scheduled`;
    
    alert(details);
}

// Initialize everything when page loads
console.log('CRM functionalities loaded successfully!');