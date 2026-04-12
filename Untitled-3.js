let records = JSON.parse(localStorage.getItem('deliveryRecords')) || [];

// تشغيل كل شيء فوراً
document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // ✅ ربط الأزرار بـ ID بدل querySelector لتجنب التعارض
    document.getElementById('showRecordsBtn').addEventListener('click', showPasswordScreen);
    document.getElementById('clearRecordsBtn').addEventListener('click', clearAllRecords);
    document.getElementById('hideRecordsBtn').addEventListener('click', hideRecords);
    document.getElementById('enterRecordsBtn').addEventListener('click', checkPasswordForRecords);
    document.getElementById('cancelPasswordBtn').addEventListener('click', hidePasswordScreen);

    // ✅ دخول بـ Enter من حقل كلمة السر
    document.getElementById('managerPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') checkPasswordForRecords();
    });
    
    // ربط النموذج والعدادات
    document.getElementById('movementForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('endOdometer').addEventListener('input', calculateDistance);
    document.getElementById('startOdometer').addEventListener('input', calculateDistance);
    
    // ✅ الشيك بوكس مصحح
    setupCheckboxes();
});

// ✅ إصلاح 1: التاريخ واليوم - يكتب النص مباشرة بدون مشكلة الشفافية
function updateDateTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const dateEl = document.getElementById('currentDate');
    const dayEl = document.getElementById('currentDay');
    if (dateEl) dateEl.textContent = `${day}/${month}/${now.getFullYear()}`;
    if (dayEl) dayEl.textContent = ['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'][now.getDay()];
}

// ✅ إصلاح 2: الشيك بوكس - حذف e.preventDefault() الذي كان يمنع التحديد
function setupCheckboxes() {
    document.querySelectorAll('.checkbox-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.target.tagName === 'INPUT') {
                this.classList.toggle('selected', e.target.checked);
                return;
            }
            if (e.target.tagName === 'LABEL') {
                const cb = this.querySelector('input[type="checkbox"]');
                setTimeout(() => {
                    this.classList.toggle('selected', cb.checked);
                }, 0);
                return;
            }
            const cb = this.querySelector('input[type="checkbox"]');
            cb.checked = !cb.checked;
            this.classList.toggle('selected', cb.checked);
        });
    });
}

// ✅ إصلاح 3: showPasswordScreen بدون تعارض مع onclick في HTML
function showPasswordScreen() {
    document.getElementById('passwordScreen').style.display = 'flex';
    setTimeout(() => document.getElementById('managerPassword').focus(), 100);
}

function hidePasswordScreen() {
    document.getElementById('passwordScreen').style.display = 'none';
    document.getElementById('managerPassword').value = '';
}

// ✅ إصلاح 4: checkPasswordForRecords مربوطة بزر الدخول بشكل صحيح
function checkPasswordForRecords() {
    if (document.getElementById('managerPassword').value === '1234') {
        hidePasswordScreen();
        document.getElementById('recordsSection').style.display = 'block';
        document.getElementById('recordsSection').scrollIntoView({ behavior: 'smooth' });
        displayHistory();
    } else {
        alert('كلمة السر خاطئة! حاول مرة أخرى.');
        document.getElementById('managerPassword').value = '';
        document.getElementById('managerPassword').focus();
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    const ops = document.querySelectorAll('input[name="operation"]:checked');
    if (ops.length === 0) return alert('اختر عملية واحدة على الأقل!');
    
    const data = {
        id: Date.now(),
        timestamp: new Date().toLocaleString('ar-SA'),
        direction: document.getElementById('direction').value,
        driver: document.getElementById('driver').value,
        operations: Array.from(ops).map(cb => cb.value).join(', '),
        amount: document.getElementById('amount').value,
        currency: document.getElementById('currency').value,
        startOdometer: document.getElementById('startOdometer').value,
        endOdometer: document.getElementById('endOdometer').value,
        distance: calculateDistance(),
        notes: document.getElementById('notes').value
    };
    
    records.unshift(data);
    localStorage.setItem('deliveryRecords', JSON.stringify(records.slice(0, 500)));
    e.target.reset();
    document.querySelectorAll('.checkbox-item').forEach(item => {
        item.classList.remove('selected');
        item.querySelector('input').checked = false;
    });
    document.getElementById('distanceDisplay').style.display = 'none';
    showSuccess();
}

function calculateDistance() {
    const s = parseFloat(document.getElementById('startOdometer').value);
    const e = parseFloat(document.getElementById('endOdometer').value);
    if (!isNaN(s) && !isNaN(e) && e > s) {
        const dist = (e - s).toFixed(1);
        document.getElementById('distanceValue').textContent = dist;
        document.getElementById('distanceDisplay').style.display = 'block';
        return dist;
    }
    document.getElementById('distanceDisplay').style.display = 'none';
    return 0;
}

function showSuccess() {
    const msg = document.getElementById('successMessage');
    msg.style.display = 'block';
    msg.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => msg.style.display = 'none', 5000);
}

function displayHistory() {
    const list = document.getElementById('historyList');
    if (records.length === 0) {
        list.innerHTML = '<div style="text-align:center;padding:40px;color:#666;font-size:1.2em">📭 لا توجد سجلات بعد</div>';
        return;
    }
    list.innerHTML = records.slice(0, 50).map(r => `
        <div class="history-item">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px">
                <strong style="font-size:1.2em;color:#2c3e50">👤 ${r.driver}</strong>
                <small style="color:#7f8c8d;background:#f0f0f0;padding:4px 10px;border-radius:20px">${r.timestamp}</small>
            </div>
            <div style="color:#555;margin-bottom:8px">📍 ${r.direction}</div>
            <div style="color:#e67e22;font-weight:bold;margin-bottom:8px">🔄 ${r.operations}</div>
            <div style="display:flex;gap:20px;flex-wrap:wrap">
                <span style="color:#27ae60;font-weight:bold">💰 ${r.amount} ${r.currency}</span>
                ${r.distance && r.distance > 0 ? `<span style="color:#3498db">🚗 ${r.distance} كم</span>` : ''}
            </div>
            ${r.notes ? `<div style="margin-top:10px;color:#666;border-top:1px solid #eee;padding-top:8px">📝 ${r.notes}</div>` : ''}
        </div>
    `).join('');
}

function hideRecords() {
    document.getElementById('recordsSection').style.display = 'none';
}

function clearAllRecords() {
    if (confirm('⚠️ هل أنت متأكد من حذف جميع السجلات؟ لا يمكن التراجع!')) {
        localStorage.removeItem('deliveryRecords');
        records = [];
        displayHistory();
    }
}

function printRecord() {
    window.print();
        }
