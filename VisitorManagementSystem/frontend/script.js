const API_BASE = "https://visitor-management-system-2lhf.onrender.com/api";


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
    loadStats();
});


