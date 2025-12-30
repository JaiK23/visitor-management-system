const API_BASE = "https://visitor-management-system-2lhf.onrender.com/api";

let occupancyChart;
let flowChart;
let trendChart;
const statsHistory = [];


// Navigation
function showSection(sectionId, clickedBtn) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    if (clickedBtn) {
        clickedBtn.classList.add('active');
    } else {
        // Find the button by matching section
        const buttons = document.querySelectorAll('.nav-btn');
        buttons.forEach(btn => {
            if (btn.textContent.toLowerCase().includes(sectionId.replace('register', 'register visitor').split(' ')[0])) {
                btn.classList.add('active');
            }
        });
    }
    
    if (sectionId === 'dashboard') {
        loadStats();
    } else if (sectionId === 'visitors') {
        loadVisitorsInside();
    }
}

// Check-In/Check-Out Tabs
function showCheckTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    if (tab === 'checkin') {
        document.querySelector('.tab-btn:first-child').classList.add('active');
        document.getElementById('checkinTab').classList.add('active');
    } else {
        document.querySelector('.tab-btn:last-child').classList.add('active');
        document.getElementById('checkoutTab').classList.add('active');
    }
}

// Radio button handlers for check-in
document.querySelectorAll('input[name="checkinMethod"]').forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.value === 'qr') {
            document.getElementById('checkinQrGroup').classList.remove('hidden');
            document.getElementById('checkinAadharGroup').classList.add('hidden');
        } else {
            document.getElementById('checkinQrGroup').classList.add('hidden');
            document.getElementById('checkinAadharGroup').classList.remove('hidden');
        }
    });
});

// Radio button handlers for check-out
document.querySelectorAll('input[name="checkoutMethod"]').forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.value === 'qr') {
            document.getElementById('checkoutQrGroup').classList.remove('hidden');
            document.getElementById('checkoutAadharGroup').classList.add('hidden');
        } else {
            document.getElementById('checkoutQrGroup').classList.add('hidden');
            document.getElementById('checkoutAadharGroup').classList.remove('hidden');
        }
    });
});

// Load Statistics
async function loadStats() {
    try {
        const response = await fetch(`${API_BASE}/stats`);
        const data = await response.json();
        
        document.getElementById('visitorsInside').textContent = data.visitorsInside;
        document.getElementById('visitorsOutside').textContent = data.visitorsOutside;
        document.getElementById('todayCheckIns').textContent = data.todayCheckIns;
        document.getElementById('todayCheckOuts').textContent = data.todayCheckOuts;
        document.getElementById('totalVisitors').textContent = data.totalVisitors;
        document.getElementById('visitorsWithReturnConsent').textContent = data.visitorsWithReturnConsent;

        updateCharts(data);
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Register Visitor
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        aadharNumber: document.getElementById('aadharNumber').value,
        purpose: document.getElementById('purpose').value,
        hostName: document.getElementById('hostName').value,
        hostPhone: document.getElementById('hostPhone').value
    };
    
    try {
        const response = await fetch(`${API_BASE}/visitors/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showResult('registerResult', 'Visitor registered successfully!', 'success');
            
            // Display QR code if available
            if (data.visitor && data.visitor.qrCodeImage) {
                const qrDisplay = document.getElementById('qrCodeDisplay');
                qrDisplay.innerHTML = `
                    <h3>Visitor QR Code</h3>
                    <p><strong>Access Code (Last 4 Aadhar):</strong> ${data.visitor.aadharLastFour}</p>
                    <img src="${data.visitor.qrCodeImage}" alt="QR Code">
                    <p><small>QR Code Data: ${data.visitor.qrCode}</small></p>
                `;
            }
            
            // Reset form
            document.getElementById('registerForm').reset();
            
            // Refresh stats
            loadStats();
        } else {
            showResult('registerResult', data.error || 'Registration failed', 'error');
        }
    } catch (error) {
        showResult('registerResult', 'Error: ' + error.message, 'error');
    }
});

// Payment / UPI
const paymentForm = document.getElementById('paymentForm');
if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const upiId = document.getElementById('upiId').value.trim();
        const upiName = document.getElementById('upiName').value.trim();
        const amount = document.getElementById('upiAmount').value.trim();
        const note = document.getElementById('upiNote').value.trim();

        if (!upiId) {
            showResult('paymentResult', 'UPI ID is required.', 'error');
            return;
        }

        const params = new URLSearchParams();
        params.set('pa', upiId);
        if (upiName) params.set('pn', upiName);
        if (amount) params.set('am', amount);
        if (note) params.set('tn', note);

        const upiLink = `upi://pay?${params.toString()}`;
        updateUpiDisplay(upiId, upiLink);
        showResult('paymentResult', 'QR updated for this payment request.', 'success');
    });
}

function updateUpiDisplay(upiId, upiLink) {
    const upiText = document.getElementById('upiStringText');
    const qrImg = document.getElementById('paymentQrImg');
    if (upiText) {
        upiText.textContent = upiLink;
    }
    if (qrImg) {
        const encoded = encodeURIComponent(upiLink);
        qrImg.src = `https://quickchart.io/qr?text=${encoded}&size=240`;
        qrImg.alt = `QR for ${upiId}`;
    }
    window.currentUpiLink = upiLink;
    window.currentUpiId = upiId;
}

function copyUpiId() {
    const text = window.currentUpiId || document.getElementById('upiId')?.value || '';
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        showResult('paymentResult', 'UPI ID copied to clipboard.', 'success');
    }).catch(() => showResult('paymentResult', 'Unable to copy UPI ID.', 'error'));
}

function copyUpiLink() {
    const text = window.currentUpiLink || document.getElementById('upiStringText')?.textContent || '';
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        showResult('paymentResult', 'UPI link copied to clipboard.', 'success');
    }).catch(() => showResult('paymentResult', 'Unable to copy link.', 'error'));
}

// Seed initial QR
document.addEventListener('DOMContentLoaded', () => {
    const defaultUpiId = document.getElementById('upiId')?.value;
    if (defaultUpiId) {
        const upiLink = `upi://pay?pa=${encodeURIComponent(defaultUpiId)}`;
        updateUpiDisplay(defaultUpiId, upiLink);
    }
});

// Order Food
const foodOrderForm = document.getElementById('foodOrderForm');
if (foodOrderForm) {
    foodOrderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const order = {
            name: document.getElementById('foodVisitorName').value,
            phone: document.getElementById('foodVisitorPhone').value,
            location: document.getElementById('foodLocation').value,
            items: document.getElementById('foodItems').value,
            deliveryTime: document.getElementById('foodDeliveryTime').value,
            notes: document.getElementById('foodNotes').value
        };

        console.log('Food order captured (client-side only):', order);
        showResult('foodOrderResult', 'Order received! A staff member will confirm shortly.', 'success');
        foodOrderForm.reset();
    });
}

// Feedback
const feedbackForm = document.getElementById('feedbackForm');
if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const feedback = {
            name: document.getElementById('feedbackName').value,
            email: document.getElementById('feedbackEmail').value,
            rating: document.getElementById('feedbackRating').value,
            comments: document.getElementById('feedbackComments').value,
            wantsContact: document.getElementById('feedbackContact').checked
        };

        console.log('Feedback captured (client-side only):', feedback);
        showResult('feedbackResult', 'Thanks for your feedback! We\'ll review it soon.', 'success');
        feedbackForm.reset();
    });
}

// Check-In
document.getElementById('checkinForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const method = document.querySelector('input[name="checkinMethod"]:checked').value;
    const data = {};
    
    if (method === 'qr') {
        data.qrCode = document.getElementById('checkinQrCode').value;
    } else {
        data.aadharLastFour = document.getElementById('checkinAadharLastFour').value;
    }
    
    try {
        const response = await fetch(`${API_BASE}/checkin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showResult('checkResult', `Check-in successful! ${result.visitor.name} is now inside.`, 'success');
            document.getElementById('checkinForm').reset();
            loadStats();
            loadVisitorsInside();
        } else {
            showResult('checkResult', result.error || 'Check-in failed', 'error');
        }
    } catch (error) {
        showResult('checkResult', 'Error: ' + error.message, 'error');
    }
});

// Check-Out
document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const method = document.querySelector('input[name="checkoutMethod"]:checked').value;
    const data = {};
    
    if (method === 'qr') {
        data.qrCode = document.getElementById('checkoutQrCode').value;
    } else {
        data.aadharLastFour = document.getElementById('checkoutAadharLastFour').value;
    }
    
    const expectedReturnTime = document.getElementById('expectedReturnTime').value;
    if (expectedReturnTime) {
        data.expectedReturnTime = expectedReturnTime;
    }
    
    try {
        const response = await fetch(`${API_BASE}/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            let message = `Check-out successful! ${result.visitor.name} has left.`;
            if (result.visitor.hasReturnConsent && result.visitor.expectedReturnTime) {
                const returnTime = new Date(result.visitor.expectedReturnTime).toLocaleString();
                message += ` Expected return: ${returnTime}`;
            }
            showResult('checkResult', message, 'success');
            document.getElementById('checkoutForm').reset();
            loadStats();
            loadVisitorsInside();
        } else {
            showResult('checkResult', result.error || 'Check-out failed', 'error');
        }
    } catch (error) {
        showResult('checkResult', 'Error: ' + error.message, 'error');
    }
});

// Load Visitors Inside
async function loadVisitorsInside() {
    try {
        const response = await fetch(`${API_BASE}/stats/inside`);
        const data = await response.json();
        
        const visitorsList = document.getElementById('visitorsList');
        
        if (data.visitors && data.visitors.length > 0) {
            visitorsList.innerHTML = data.visitors.map(visitor => {
                const checkInTime = new Date(visitor.checkInTime).toLocaleString();
                return `
                    <div class="visitor-card">
                        <h3>${visitor.name}</h3>
                        <p><strong>Phone:</strong> ${visitor.phone}</p>
                        <p><strong>Email:</strong> ${visitor.email || 'N/A'}</p>
                        <p><strong>Purpose:</strong> ${visitor.purpose}</p>
                        <p><strong>Host:</strong> ${visitor.hostName}</p>
                        <p class="checkin-time"><strong>Check-In Time:</strong> ${checkInTime}</p>
                    </div>
                `;
            }).join('');
        } else {
            visitorsList.innerHTML = '<div class="empty-state">No visitors currently inside</div>';
        }
    } catch (error) {
        console.error('Error loading visitors:', error);
        document.getElementById('visitorsList').innerHTML = 
            '<div class="result-message error">Error loading visitors</div>';
    }
}

// Show Result Message
function showResult(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = `result-message ${type}`;
    
    setTimeout(() => {
        element.className = 'result-message';
    }, 5000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    loadStats();
});

function initCharts() {
    const occupancyCtx = document.getElementById('occupancyChart');
    const flowCtx = document.getElementById('flowChart');
    const trendCtx = document.getElementById('trendChart');

    if (!occupancyCtx || !flowCtx || !trendCtx || typeof Chart === 'undefined') {
        return;
    }

    Chart.defaults.font.family = "'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'";
    Chart.defaults.color = '#4b5563';

    occupancyChart = new Chart(occupancyCtx, {
        type: 'doughnut',
        data: {
            labels: ['Inside', 'Outside'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#667eea', '#a5b4fc'],
                borderWidth: 1,
                hoverOffset: 6
            }]
        },
        options: {
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    flowChart = new Chart(flowCtx, {
        type: 'bar',
        data: {
            labels: ['Check-Ins', 'Check-Outs', 'Expected Returns'],
            datasets: [{
                label: 'Today',
                data: [0, 0, 0],
                backgroundColor: ['#667eea', '#7c3aed', '#22c55e'],
                borderRadius: 6
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });

    trendChart = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Visitors Inside',
                    data: [],
                    tension: 0.35,
                    fill: true,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.12)',
                    pointRadius: 3
                },
                {
                    label: 'Total Visitors',
                    data: [],
                    tension: 0.35,
                    fill: false,
                    borderColor: '#9ca3af',
                    borderDash: [5, 4],
                    pointRadius: 0
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                }
            },
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function updateCharts(stats) {
    if (!occupancyChart || !flowChart || !trendChart) {
        initCharts();
    }
    if (!occupancyChart || !flowChart || !trendChart) {
        return;
    }

    occupancyChart.data.datasets[0].data = [stats.visitorsInside, stats.visitorsOutside];
    occupancyChart.update();

    flowChart.data.datasets[0].data = [stats.todayCheckIns, stats.todayCheckOuts, stats.visitorsWithReturnConsent];
    flowChart.update();

    pushHistory(stats);
    trendChart.data.labels = statsHistory.map(point => point.label);
    trendChart.data.datasets[0].data = statsHistory.map(point => point.inside);
    trendChart.data.datasets[1].data = statsHistory.map(point => point.total);
    trendChart.update();
}

function pushHistory(stats) {
    const now = new Date();
    const label = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    statsHistory.push({
        label,
        inside: stats.visitorsInside,
        total: stats.totalVisitors
    });

    if (statsHistory.length > 12) {
        statsHistory.shift();
    }
}


