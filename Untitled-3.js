let records = JSON.parse(localStorage.getItem('deliveryRecords')) || [];

// تشغيل كل شيء فوراً
document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // ربط كل الأزرار والحقول
    document.getElementById('movementForm').onsubmit = handleFormSubmit;
    document.querySelector('.records-toggle button').onclick = showPasswordScreen;
    document.querySelector('.btn-danger').onclick = clearAllRecords;
    document.querySelector('.btn-secondary').onclick = hideRecords;
    
    // العدادات
    document.getElementById('endOdometer').oninput = calculateDistance;
    document.getElementById('startOdometer').oninput = calculateDistance;
    
    // الشيك بوكس
    setupCheckboxes();
});

function updateDateTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    document.getElementById('currentDate').textContent = `${day}/${month}/${now.getFullYear()}`;
    document.getElementById('currentDay').textContent = ['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'][now.getDay()];
}

function setupCheckboxes() {
    document.querySelectorAll('.checkbox-item').forEach(item => {
        item.onclick = function(e) {
            e.preventDefault();
            const cb = this.querySelector('input[type="checkbox"]');
            cb.checked = !cb.checked;
            this.classList.toggle('selected', cb.checked);
        };
    });
}

function showPasswordScreen() {
    document.getElementById('passwordScreen').style.display = 'flex';
    document.getElementById('managerPassword').focus();
}

function checkPasswordForRecords() {
    if (document.getElementById('managerPassword').value === '1234') {
        document.getElementById('passwordScreen').style.display = 'none';
        document.getElementById('recordsSection').style.display = 'block';
        displayHistory();
    } else {
        alert('كلمة السر: 1234');
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    const ops = document.querySelectorAll('input[name="operation"]:checked');
    if (ops.length === 0) return alert('اختر عملية!');
    
    const data = {
        timestamp: new Date().toLocaleString('ar-SA'),
        direction: document.getElementById('direction').value,
        driver: document.getElementById('driver').value,
        operations: Array.from(ops).map(cb=>cb.value).join(', '),
        amount: document.getElementById('amount').value,
        currency: document.getElementById('currency').value,
        startOdometer: document.getElementById('startOdometer').value,
        endOdometer: document.getElementById('endOdometer').value,
        distance: calculateDistance(),
        notes: document.getElementById('notes').value
    };
    
    records.unshift(data);
    localStorage.setItem('deliveryRecords', JSON.stringify(records.slice(0,500)));
    e.target.reset();
    document.querySelectorAll('.checkbox-item').forEach(item => {
        item.classList.remove('selected');
        item.querySelector('input').checked = false;
    });
    document.getElementById('distanceDisplay').style.display = 'none';
    showSuccess('✅ تم الحفظ!');
}

function calculateDistance() {
    const s = parseFloat(document.getElementById('startOdometer').value);
    const e = parseFloat(document.getElementById('endOdometer').value);
    if (s && e && e > s) {
        const dist = ((e - s)/1000).toFixed(2);
        document.getElementById('distanceValue').textContent = dist;
        document.getElementById('distanceDisplay').style.display = 'block';
        return dist;
    }
    document.getElementById('distanceDisplay').style.display = 'none';
    return 0;
}

function showSuccess(msg) {
    document.getElementById('successMessage').textContent = msg;
    document.getElementById('successMessage').style.display = 'block';
    setTimeout(()=>document.getElementById('successMessage').style.display='none', 4000);
}

function displayHistory() {
    const list = document.getElementById('historyList');
    if (records.length === 0) {
        list.innerHTML = '<div style="text-align:center;padding:40px;color:#666">📭 لا سجلات</div>';
        return;
    }
    list.innerHTML = records.slice(0,20).map(r=>`
        <div style="background:#f8f9fa;padding:15px;margin:8px 0;border-radius:8px">
            <strong>${r.driver}</strong> → ${r.direction}<br>
            💰 ${r.amount} ${r.currency}<br>
            <span style="color:#e67e22">${r.operations}</span>
        </div>
    `).join('');
}

function clearAllRecords() {
    if(confirm('حذف الكل؟')) {
        localStorage.removeItem('deliveryRecords');
        records = [];
        displayHistory();
    }
}
