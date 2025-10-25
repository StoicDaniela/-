// Data Management
let hypotheses = JSON.parse(localStorage.getItem('hypotheses') || '[]');
let scenarios = JSON.parse(localStorage.getItem('scenarios') || '[]');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    updateDashboard();
    renderHypotheses();
    renderScenarios();
    initializeCharts();
});

// App Initialization
function initializeApp() {
    // Add some sample data if none exists
    if (hypotheses.length === 0) {
        addSampleData();
    }
    
    // Setup form handler
    document.getElementById('hypothesis-form').addEventListener('submit', handleHypothesisSubmit);
    
    // Setup search and filter handlers
    document.getElementById('hypothesis-search').addEventListener('input', filterHypotheses);
    document.getElementById('hypothesis-filter').addEventListener('change', filterHypotheses);
}

// Add sample data for demonstration
function addSampleData() {
    const sampleHypotheses = [
        {
            id: generateId(),
            title: "Увеличение на Email CTR с A/B тест",
            description: "Тестване на нов subject line за по-висок click-through rate",
            category: "marketing",
            priority: "high",
            status: "testing",
            metrics: ["CTR", "Open Rate"],
            target: 15.5,
            timeframe: 14,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            progress: 65
        },
        {
            id: generateId(),
            title: "Оптимизация на Landing Page",
            description: "Тест на нов дизайн за увеличаване на конверсиите",
            category: "product",
            priority: "high",
            status: "validated",
            metrics: ["Conversion Rate", "Bounce Rate"],
            target: 8.2,
            timeframe: 21,
            createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            progress: 100
        },
        {
            id: generateId(),
            title: "Персонализация на Product Recommendations",
            description: "Внедряване на ML алгоритъм за персонализирани препоръки",
            category: "product",
            priority: "medium",
            status: "draft",
            metrics: ["Revenue per User", "Session Duration"],
            target: 23.4,
            timeframe: 45,
            createdAt: new Date().toISOString(),
            progress: 0
        }
    ];
    
    const sampleScenarios = [
        {
            id: generateId(),
            title: "Q4 Revenue Projections",
            type: "optimistic",
            description: "Оптимистичен сценарий за Q4 със силни коледни продажби",
            impact: "high",
            probability: 75,
            metrics: {
                revenue: 2500000,
                growth: 25,
                customers: 15000
            },
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: generateId(),
            title: "Market Downturn Impact",
            type: "pessimistic",
            description: "Негативен сценарий при икономическа криза",
            impact: "high",
            probability: 30,
            metrics: {
                revenue: 1200000,
                growth: -15,
                customers: 8000
            },
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: generateId(),
            title: "Baseline Performance",
            type: "realistic",
            description: "Реалистичен сценарий при запазване на текущите тенденции",
            impact: "medium",
            probability: 85,
            metrics: {
                revenue: 1800000,
                growth: 8,
                customers: 12000
            },
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];
    
    hypotheses = sampleHypotheses;
    scenarios = sampleScenarios;
    saveData();
}

// Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    event.target.classList.add('active');
    
    // Update charts if analytics section
    if (sectionId === 'analytics') {
        setTimeout(initializeCharts, 100);
    }
}

// Dashboard Updates
function updateDashboard() {
    const totalHypotheses = hypotheses.length;
    const validatedHypotheses = hypotheses.filter(h => h.status === 'validated').length;
    const totalScenarios = scenarios.length;
    
    document.getElementById('total-hypotheses').textContent = totalHypotheses;
    document.getElementById('validated-hypotheses').textContent = validatedHypotheses;
    document.getElementById('total-scenarios').textContent = totalScenarios;
    
    // Update recent hypotheses
    const recentHypotheses = hypotheses
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    
    const recentHypothesesHtml = recentHypotheses.map(h => `
        <div class="recent-item priority-${h.priority}">
            <h4>${h.title}</h4>
            <p>${h.category} • ${formatDate(h.createdAt)}</p>
        </div>
    `).join('');
    
    document.getElementById('recent-hypotheses').innerHTML = recentHypothesesHtml;
    
    // Update active scenarios
    const activeScenarios = scenarios
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 5);
    
    const activeScenariosHtml = activeScenarios.map(s => `
        <div class="recent-item">
            <h4>${s.title}</h4>
            <p>${s.type} • ${s.probability}% вероятност</p>
        </div>
    `).join('');
    
    document.getElementById('active-scenarios').innerHTML = activeScenariosHtml;
}

// Hypothesis Management
function renderHypotheses() {
    const container = document.getElementById('hypotheses-list');
    const filteredHypotheses = getFilteredHypotheses();
    
    if (filteredHypotheses.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Няма намерени хипотези</p>
            </div>
        `;
        return;
    }
    
    const hypothesesHtml = filteredHypotheses.map(hypothesis => `
        <div class="item-card">
            <div class="item-header">
                <div>
                    <div class="item-title">${hypothesis.title}</div>
                    <div class="item-meta">
                        <span class="status-badge status-${hypothesis.status}">${getStatusText(hypothesis.status)}</span>
                        <span>${hypothesis.category}</span>
                        <span>Приоритет: ${getPriorityText(hypothesis.priority)}</span>
                        <span>${formatDate(hypothesis.createdAt)}</span>
                    </div>
                </div>
            </div>
            <div class="item-description">${hypothesis.description}</div>
            <div class="item-metrics">
                ${hypothesis.metrics.map(metric => `<span class="metric">${metric}</span>`).join('')}
                <span class="metric">Цел: ${hypothesis.target}%</span>
                <span class="metric">Срок: ${hypothesis.timeframe} дни</span>
            </div>
            <div class="progress-bar" style="margin: 1rem 0;">
                <div class="progress-fill" style="width: ${hypothesis.progress || 0}%; height: 8px; background: #10b981; border-radius: 4px; background-color: #e5e7eb;"></div>
            </div>
            <div class="item-actions">
                <button class="action-btn" onclick="editHypothesis('${hypothesis.id}')">
                    <i class="fas fa-edit"></i> Редактирай
                </button>
                <button class="action-btn" onclick="updateHypothesisStatus('${hypothesis.id}')">
                    <i class="fas fa-check"></i> Обнови статус
                </button>
                <button class="action-btn" onclick="deleteHypothesis('${hypothesis.id}')">
                    <i class="fas fa-trash"></i> Изтрий
                </button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = hypothesesHtml;
}

function getFilteredHypotheses() {
    const searchTerm = document.getElementById('hypothesis-search').value.toLowerCase();
    const statusFilter = document.getElementById('hypothesis-filter').value;
    
    return hypotheses.filter(hypothesis => {
        const matchesSearch = hypothesis.title.toLowerCase().includes(searchTerm) ||
                            hypothesis.description.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || hypothesis.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });
}

function filterHypotheses() {
    renderHypotheses();
}

// Scenario Management
function renderScenarios() {
    const container = document.getElementById('scenarios-list');
    
    if (scenarios.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Няма създадени сценарии</p>
            </div>
        `;
        return;
    }
    
    const scenariosHtml = scenarios.map(scenario => `
        <div class="scenario-card">
            <div class="scenario-type scenario-${scenario.type}">${getScenarioTypeText(scenario.type)}</div>
            <h3>${scenario.title}</h3>
            <p>${scenario.description}</p>
            <div class="scenario-metrics" style="margin: 1rem 0;">
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; font-size: 0.875rem;">
                    <div>Приход: €${scenario.metrics.revenue.toLocaleString()}</div>
                    <div>Растеж: ${scenario.metrics.growth}%</div>
                    <div>Клиенти: ${scenario.metrics.customers.toLocaleString()}</div>
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem; color: #64748b;">
                <span>Вероятност: ${scenario.probability}%</span>
                <span>${formatDate(scenario.createdAt)}</span>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = scenariosHtml;
}

function filterScenarios(type) {
    // Update active button
    document.querySelectorAll('.scenario-type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter scenarios (implementation can be added later)
    renderScenarios();
}

// Modal Management
function showNewHypothesisModal() {
    document.getElementById('hypothesis-modal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    
    // Reset form
    if (modalId === 'hypothesis-modal') {
        document.getElementById('hypothesis-form').reset();
    }
}

// Form Handling
function handleHypothesisSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const hypothesis = {
        id: generateId(),
        title: document.getElementById('hypothesis-title').value,
        description: document.getElementById('hypothesis-description').value,
        category: document.getElementById('hypothesis-category').value,
        priority: document.getElementById('hypothesis-priority').value,
        status: 'draft',
        metrics: document.getElementById('hypothesis-metrics').value.split(',').map(m => m.trim()),
        target: parseFloat(document.getElementById('hypothesis-target').value),
        timeframe: parseInt(document.getElementById('hypothesis-timeframe').value),
        createdAt: new Date().toISOString(),
        progress: 0
    };
    
    hypotheses.push(hypothesis);
    saveData();
    updateDashboard();
    renderHypotheses();
    closeModal('hypothesis-modal');
    
    // Show success message
    showNotification('Хипотезата е създадена успешно!', 'success');
}

// Hypothesis Actions
function editHypothesis(id) {
    // Implementation for editing hypothesis
    showNotification('Функцията за редактиране ще бъде добавена скоро!', 'info');
}

function updateHypothesisStatus(id) {
    const hypothesis = hypotheses.find(h => h.id === id);
    if (!hypothesis) return;
    
    const statusCycle = ['draft', 'testing', 'validated', 'rejected'];
    const currentIndex = statusCycle.indexOf(hypothesis.status);
    const nextIndex = (currentIndex + 1) % statusCycle.length;
    
    hypothesis.status = statusCycle[nextIndex];
    
    // Update progress based on status
    if (hypothesis.status === 'testing') hypothesis.progress = 50;
    if (hypothesis.status === 'validated') hypothesis.progress = 100;
    if (hypothesis.status === 'rejected') hypothesis.progress = 0;
    
    saveData();
    updateDashboard();
    renderHypotheses();
    
    showNotification(`Статусът е обновен на "${getStatusText(hypothesis.status)}"`, 'success');
}

function deleteHypothesis(id) {
    if (confirm('Сигурни ли сте, че искате да изтриете тази хипотеза?')) {
        hypotheses = hypotheses.filter(h => h.id !== id);
        saveData();
        updateDashboard();
        renderHypotheses();
        showNotification('Хипотезата е изтрита!', 'success');
    }
}

// Data Export
function exportData() {
    const data = {
        hypotheses: hypotheses,
        scenarios: scenarios,
        exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bi-hypotheses-scenarios-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Данните са експортирани успешно!', 'success');
}

// Charts
function initializeCharts() {
    // Hypothesis Success Chart
    const hypothesesCtx = document.getElementById('hypotheses-chart');
    if (hypothesesCtx) {
        const statusCounts = {
            'draft': hypotheses.filter(h => h.status === 'draft').length,
            'testing': hypotheses.filter(h => h.status === 'testing').length,
            'validated': hypotheses.filter(h => h.status === 'validated').length,
            'rejected': hypotheses.filter(h => h.status === 'rejected').length
        };
        
        new Chart(hypothesesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Чернова', 'В тестване', 'Валидирани', 'Отхвърлени'],
                datasets: [{
                    data: [statusCounts.draft, statusCounts.testing, statusCounts.validated, statusCounts.rejected],
                    backgroundColor: ['#6b7280', '#f59e0b', '#10b981', '#ef4444']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Scenarios Chart
    const scenariosCtx = document.getElementById('scenarios-chart');
    if (scenariosCtx) {
        const typeCounts = {
            'optimistic': scenarios.filter(s => s.type === 'optimistic').length,
            'realistic': scenarios.filter(s => s.type === 'realistic').length,
            'pessimistic': scenarios.filter(s => s.type === 'pessimistic').length
        };
        
        new Chart(scenariosCtx, {
            type: 'bar',
            data: {
                labels: ['Оптимистични', 'Реалистични', 'Песимистични'],
                datasets: [{
                    label: 'Брой сценарии',
                    data: [typeCounts.optimistic, typeCounts.realistic, typeCounts.pessimistic],
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
}

// Utility Functions
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('bg-BG');
}

function getStatusText(status) {
    const statusMap = {
        'draft': 'Чернова',
        'testing': 'В тестване',
        'validated': 'Валидирана',
        'rejected': 'Отхвърлена'
    };
    return statusMap[status] || status;
}

function getPriorityText(priority) {
    const priorityMap = {
        'low': 'Нисък',
        'medium': 'Среден',
        'high': 'Висок',
        'critical': 'Критичен'
    };
    return priorityMap[priority] || priority;
}

function getScenarioTypeText(type) {
    const typeMap = {
        'optimistic': 'Оптимистичен',
        'realistic': 'Реалистичен',
        'pessimistic': 'Песимистичен'
    };
    return typeMap[type] || type;
}

function saveData() {
    localStorage.setItem('hypotheses', JSON.stringify(hypotheses));
    localStorage.setItem('scenarios', JSON.stringify(scenarios));
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            z-index: 1001;
            animation: slideIn 0.3s;
        ">
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}