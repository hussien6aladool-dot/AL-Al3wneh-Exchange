// ✅ دائماً اقرأ من localStorage مباشرة لتجنب البيانات القديمة في الذاكرة
function getRecords() {
    return JSON.parse(localStorage.getItem('deliveryRecords')) || [];
}

function saveRecords(records) {
    localStorage.setItem('deliveryRecords', JSON.stringify(records.slice(0, 500)));
}

// تشغيل كل شيء فوراً
document.addEventListener('DOMContentLoaded', function () {

    // ✅ إصلاح 1: تشغيل التاريخ فوراً بدون تأخير
    updateDateTime();
    setInterval(updateDateTime, 1000);

    document.getElementById('showRecordsBtn').addEventListener('click', showPasswordScreen);
    document.getElementById('clearRecordsBtn').addEventListener('click', clearAllRecords);
    document.getElementById('hideRecordsBtn').addEventListener('click', hideRecords);
    document.getElementById('enterRecordsBtn').addEventListener('click', checkPasswordForRecords);
    document.getElementById('cancelPasswordBtn').addEventListener('click', hidePasswordScreen);

    document.getElementById('managerPassword').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') checkPasswordForRecords();
    });

    document.getElementById('movementForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('endOdometer').addEventListener('input', calculateDistance);
    document.getElementById('startOdometer').addEventListener('input', calculateDistance);

    setupCheckboxes();
});

// ✅ إصلاح 1: التاريخ واليوم - يكتب textContent مباشرة بدون أي تأخير أو ترقيم
function updateDateTime() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const dateEl = document.getElementById('currentDate');
    const dayEl = document.getElementById('currentDay');

    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

    if (dateEl) {
        // ✅ كتابة التاريخ بشكل صريح بدون padStart لأنها تضيف صفر أحياناً يسبب مشكلة عرض
        dateEl.textContent = day + '/' + month + '/' + year;
    }
    if (dayEl) {
        dayEl.textContent = days[now.getDay()];
    }
}

function setupCheckboxes() {
    document.querySelectorAll('.checkbox-item').forEach(item => {
        item.addEventListener('click', function (e) {
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

function showPasswordScreen() {
    document.getElementById('passwordScreen').style.display = 'flex';
    setTimeout(() => document.getElementById('managerPassword').focus(), 100);
}

function hidePasswordScreen() {
    document.getElementById('passwordScreen').style.display = 'none';
    document.getElementById('managerPassword').value = '';
}

function checkPasswordForRecords() {
    if (document.getElementById('managerPassword').value === '1234') {
        hidePasswordScreen();
        document.getElementById('recordsSection').style.display = 'block';
        document.getElementById('recordsSection').scrollIntoView({ behavior: 'smooth' });
        // ✅ إصلاح 2: استدعاء displayHistory بعد فتح القسم مباشرة - يقرأ من localStorage
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

    // ✅ إصلاح 2: اقرأ السجلات من localStorage في لحظة الحفظ
    const records = getRecords();

    const data = {
        id: Date.now(),
        // ✅ إصلاح التاريخ في السجل: استخدام تنسيق عربي واضح
        timestamp: formatArabicDate(new Date()),
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
    // ✅ إصلاح 2: احفظ مباشرة في localStorage
    saveRecords(records);

    e.target.reset();
    document.querySelectorAll('.checkbox-item').forEach(item => {
        item.classList.remove('selected');
        item.querySelector('input').checked = false;
    });
    document.getElementById('distanceDisplay').style.display = 'none';
    showSuccess();
}

// ✅ دالة مساعدة لتنسيق التاريخ بشكل واضح
function formatArabicDate(date) {
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return days[date.getDay()] + ' ' + d + '/' + m + '/' + y + ' - ' + h + ':' + min;
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

// ✅ إصلاح 2: displayHistory تقرأ دائماً من localStorage مباشرة
function displayHistory() {
    const records = getRecords();
    const list = document.getElementById('historyList');
    if (records.length === 0) {
        list.innerHTML = '<div style="text-align:center;padding:40px;color:#666;font-size:1.2em">📭 لا توجد سجلات بعد</div>';
        return;
    }
    list.innerHTML = records.slice(0, 50).map(r => `
        <div class="history-item">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px">
                <strong style="font-size:1.2em;color:#e8c96a">👤 ${r.driver}</strong>
                <small style="color:#8a8070;background:rgba(201,168,76,0.1);padding:4px 10px;border-radius:20px;font-size:0.85em">${r.timestamp}</small>
            </div>
            <div style="color:#aaa;margin-bottom:8px">📍 ${r.direction}</div>
            <div style="color:#e67e22;font-weight:bold;margin-bottom:8px">🔄 ${r.operations}</div>
            <div style="display:flex;gap:20px;flex-wrap:wrap">
                <span style="color:#2ecc71;font-weight:bold">💰 ${r.amount} ${r.currency}</span>
                ${r.distance && r.distance > 0 ? `<span style="color:#3498db">🚗 ${r.distance} كم</span>` : ''}
            </div>
            ${r.notes ? `<div style="margin-top:10px;color:#888;border-top:1px solid rgba(255,255,255,0.06);padding-top:8px">📝 ${r.notes}</div>` : ''}
        </div>
    `).join('');
}

function hideRecords() {
    document.getElementById('recordsSection').style.display = 'none';
}

function clearAllRecords() {
    if (confirm('⚠️ هل أنت متأكد من حذف جميع السجلات؟ لا يمكن التراجع!')) {
        localStorage.removeItem('deliveryRecords');
        displayHistory();
    }
}

function printRecord() {
    window.print();
}
