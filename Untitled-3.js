// ✅ اقرأ دائماً من localStorage مباشرة لتجنب البيانات القديمة
function getRecords() {
    try {
        return JSON.parse(localStorage.getItem('deliveryRecords')) || [];
    } catch (e) {
        return [];
    }
}

function saveRecords(records) {
    try {
        localStorage.setItem('deliveryRecords', JSON.stringify(records.slice(0, 500)));
    } catch (e) {
        alert('⚠️ لم يتم الحفظ - التخزين ممتلئ أو غير متاح');
    }
}

// ✅ تشغيل كل شيء عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function () {

    // تشغيل التاريخ فوراً
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // ======= أزرار السجلات =======
    // ✅ الإصلاح الرئيسي لمشكلة زر السجلات:
    //    نستخدم onclick مباشرة على العنصر بدل addEventListener
    //    لضمان عمله في جميع الحالات
    const showRecordsBtn = document.getElementById('showRecordsBtn');
    if (showRecordsBtn) {
        showRecordsBtn.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();
            showPasswordScreen();
        };
    }

    const clearRecordsBtn = document.getElementById('clearRecordsBtn');
    if (clearRecordsBtn) {
        clearRecordsBtn.onclick = clearAllRecords;
    }

    const hideRecordsBtn = document.getElementById('hideRecordsBtn');
    if (hideRecordsBtn) {
        hideRecordsBtn.onclick = hideRecords;
    }

    const enterRecordsBtn = document.getElementById('enterRecordsBtn');
    if (enterRecordsBtn) {
        enterRecordsBtn.onclick = checkPasswordForRecords;
    }

    const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
    if (cancelPasswordBtn) {
        cancelPasswordBtn.onclick = hidePasswordScreen;
    }

    // كلمة السر بضغط Enter
    const passInput = document.getElementById('managerPassword');
    if (passInput) {
        passInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') checkPasswordForRecords();
        });
    }

    // إغلاق شاشة كلمة السر بالضغط خارجها
    const passwordScreen = document.getElementById('passwordScreen');
    if (passwordScreen) {
        passwordScreen.addEventListener('click', function (e) {
            if (e.target === passwordScreen) hidePasswordScreen();
        });
    }

    // النموذج
    const movementForm = document.getElementById('movementForm');
    if (movementForm) {
        movementForm.addEventListener('submit', handleFormSubmit);
    }

    const endOdo = document.getElementById('endOdometer');
    const startOdo = document.getElementById('startOdometer');
    if (endOdo) endOdo.addEventListener('input', calculateDistance);
    if (startOdo) startOdo.addEventListener('input', calculateDistance);

    setupCheckboxes();
});

// ✅ تحديث التاريخ واليوم
function updateDateTime() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const dateEl = document.getElementById('currentDate');
    const dayEl = document.getElementById('currentDay');

    const arabicDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

    if (dateEl) {
        dateEl.textContent = day + '/' + month + '/' + year;
    }
    if (dayEl) {
        dayEl.textContent = arabicDays[now.getDay()];
    }
}

// ✅ إعداد الـ Checkboxes
function setupCheckboxes() {
    document.querySelectorAll('.checkbox-item').forEach(function (item) {
        item.addEventListener('click', function (e) {
            if (e.target.tagName === 'INPUT') {
                item.classList.toggle('selected', e.target.checked);
                return;
            }
            if (e.target.tagName === 'LABEL') {
                const cb = item.querySelector('input[type="checkbox"]');
                setTimeout(function () {
                    item.classList.toggle('selected', cb.checked);
                }, 0);
                return;
            }
            const cb = item.querySelector('input[type="checkbox"]');
            cb.checked = !cb.checked;
            item.classList.toggle('selected', cb.checked);
        });
    });
}

// ✅ عرض شاشة كلمة السر
function showPasswordScreen() {
    const screen = document.getElementById('passwordScreen');
    if (!screen) return;
    screen.style.display = 'flex';
    // تأكد من الـ z-index
    screen.style.zIndex = '99999';
    setTimeout(function () {
        const inp = document.getElementById('managerPassword');
        if (inp) inp.focus();
    }, 150);
}

// ✅ إخفاء شاشة كلمة السر
function hidePasswordScreen() {
    const screen = document.getElementById('passwordScreen');
    if (screen) screen.style.display = 'none';
    const inp = document.getElementById('managerPassword');
    if (inp) inp.value = '';
}

// ✅ التحقق من كلمة السر وفتح السجلات
function checkPasswordForRecords() {
    const inp = document.getElementById('managerPassword');
    if (!inp) return;

    if (inp.value === '1234') {
        hidePasswordScreen();

        const section = document.getElementById('recordsSection');
        if (section) {
            section.style.display = 'block';
            // قراءة السجلات وعرضها فوراً
            displayHistory();
            // انتقال سلس
            setTimeout(function () {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    } else {
        // هز الحقل للإشارة للخطأ
        inp.style.borderColor = '#e74c3c';
        inp.style.boxShadow = '0 0 0 3px rgba(231,76,60,0.2)';
        setTimeout(function () {
            inp.style.borderColor = '';
            inp.style.boxShadow = '';
        }, 1000);
        alert('⛔ كلمة السر خاطئة! حاول مرة أخرى.');
        inp.value = '';
        inp.focus();
    }
}

// ✅ حفظ السجل
function handleFormSubmit(e) {
    e.preventDefault();

    const ops = document.querySelectorAll('input[name="operation"]:checked');
    if (ops.length === 0) {
        alert('⚠️ اختر عملية واحدة على الأقل!');
        return;
    }

    const records = getRecords();

    const data = {
        id: Date.now(),
        timestamp: formatArabicDate(new Date()),
        direction: document.getElementById('direction').value.trim(),
        driver: document.getElementById('driver').value,
        operations: Array.from(ops).map(function (cb) { return cb.value; }).join('، '),
        amount: document.getElementById('amount').value,
        currency: document.getElementById('currency').value,
        startOdometer: document.getElementById('startOdometer').value,
        endOdometer: document.getElementById('endOdometer').value,
        distance: calculateDistance(),
        notes: document.getElementById('notes').value.trim()
    };

    records.unshift(data);
    saveRecords(records);

    // إعادة ضبط النموذج
    e.target.reset();
    document.querySelectorAll('.checkbox-item').forEach(function (item) {
        item.classList.remove('selected');
        item.querySelector('input').checked = false;
    });
    document.getElementById('distanceDisplay').style.display = 'none';

    showSuccess();
}

// ✅ تنسيق التاريخ بالعربي
function formatArabicDate(date) {
    const arabicDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return arabicDays[date.getDay()] + ' ' + d + '/' + m + '/' + y + ' الساعة ' + h + ':' + min;
}

// ✅ حساب المسافة
function calculateDistance() {
    const s = parseFloat(document.getElementById('startOdometer').value);
    const e = parseFloat(document.getElementById('endOdometer').value);
    if (!isNaN(s) && !isNaN(e) && e > s) {
        const dist = (e - s).toFixed(1);
        const valEl = document.getElementById('distanceValue');
        const dispEl = document.getElementById('distanceDisplay');
        if (valEl) valEl.textContent = dist;
        if (dispEl) dispEl.style.display = 'block';
        return dist;
    }
    const dispEl = document.getElementById('distanceDisplay');
    if (dispEl) dispEl.style.display = 'none';
    return 0;
}

// ✅ عرض رسالة النجاح
function showSuccess() {
    const msg = document.getElementById('successMessage');
    if (!msg) return;
    msg.style.display = 'block';
    msg.scrollIntoView({ behavior: 'smooth' });
    setTimeout(function () { msg.style.display = 'none'; }, 6000);
}

// ✅ عرض السجلات من localStorage
function displayHistory() {
    const records = getRecords();
    const list = document.getElementById('historyList');
    if (!list) return;

    if (records.length === 0) {
        list.innerHTML = '<div style="text-align:center;padding:50px;color:#666;font-size:1.2em">📭 لا توجد سجلات بعد</div>';
        return;
    }

    list.innerHTML = records.slice(0, 100).map(function (r, index) {
        return `
        <div class="history-item">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
                <div style="display:flex;align-items:center;gap:10px">
                    <span style="background:rgba(201,168,76,0.15);color:#c9a84c;padding:3px 10px;border-radius:20px;font-size:0.8em;font-weight:700">#${records.length - index}</span>
                    <strong style="font-size:1.15em;color:#e8c96a">👤 ${r.driver || '—'}</strong>
                </div>
                <small style="color:#8a8070;background:rgba(201,168,76,0.08);padding:5px 12px;border-radius:20px;font-size:0.82em">🕒 ${r.timestamp}</small>
            </div>
            <div style="color:#aaa;margin-bottom:8px;font-size:0.95em">📍 ${r.direction || '—'}</div>
            <div style="color:#e67e22;font-weight:bold;margin-bottom:10px">🔄 ${r.operations || '—'}</div>
            <div style="display:flex;gap:20px;flex-wrap:wrap;margin-bottom:${(r.distance && r.distance > 0) || r.notes ? '10px' : '0'}">
                <span style="color:#2ecc71;font-weight:bold;font-size:1.05em">💰 ${r.amount || '0'} ${r.currency || ''}</span>
                ${r.distance && r.distance > 0 ? `<span style="color:#3498db">🚗 ${r.distance} كم</span>` : ''}
            </div>
            ${r.startOdometer && r.endOdometer ? `
            <div style="color:#7f8c8d;font-size:0.88em;margin-bottom:${r.notes ? '8px' : '0'}">
                📊 العداد: ${r.startOdometer} ← ${r.endOdometer}
            </div>` : ''}
            ${r.notes ? `<div style="margin-top:8px;color:#888;border-top:1px solid rgba(255,255,255,0.06);padding-top:10px;font-size:0.93em">📝 ${r.notes}</div>` : ''}
        </div>`;
    }).join('');
}

// ✅ إخفاء قسم السجلات
function hideRecords() {
    const section = document.getElementById('recordsSection');
    if (section) section.style.display = 'none';
}

// ✅ مسح جميع السجلات
function clearAllRecords() {
    if (confirm('⚠️ هل أنت متأكد من حذف جميع السجلات؟\nلا يمكن التراجع عن هذا الإجراء!')) {
        localStorage.removeItem('deliveryRecords');
        displayHistory();
    }
}

// ✅ طباعة
function printRecord() {
    window.print();
}
