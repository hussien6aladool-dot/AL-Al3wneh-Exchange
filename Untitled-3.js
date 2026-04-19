
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>سجل حركة شحن سائقي الدراجات - شركة العلاونة للصرافة</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- الصفحة الرئيسية -->
    <div id="mainContent" class="container">
        <div class="header">
            <h1>🚀 سجل حركة شحن سائقي الدراجات</h1>
            <p>شركة العلاونة للصرافة</p>

            <!-- زر السجلات (محمي بكلمة سر) -->
            <div class="records-toggle">
                <button class="btn btn-primary" id="showRecordsBtn">🔐 السجلات (مدير)</button>
            </div>

            <!-- عرض التاريخ واليوم -->
            <div class="stats">
                <div class="stat-card">
                    <span id="currentDate" class="stat-value">--/--/----</span>
                    <small>التاريخ</small>
                </div>
                <div class="stat-card">
                    <span id="currentDay" class="stat-value">------</span>
                    <small>اليوم</small>
                </div>
            </div>
        </div>

        <!-- منطقة السجلات (مخفية افتراضياً) -->
        <div id="recordsSection" class="records-section" style="display: none;">
            <div class="records-header">
                <h3>📋 جميع السجلات</h3>
                <div style="display:flex;gap:10px;flex-wrap:wrap">
                    <button class="btn btn-danger" id="clearRecordsBtn">🗑️ مسح جميع السجلات</button>
                    <button class="btn btn-secondary" id="hideRecordsBtn">🔙 العودة</button>
                </div>
            </div>
            <div id="historyList" class="history-list"></div>
        </div>

        <div class="form-container">
            <!-- رسالة النجاح -->
            <div id="successMessage" class="success-message" style="display: none;">
                ✅ تم حفظ السجل بنجاح!
                <br><small>تم حفظ السجل محلياً للرجوع إليه لاحقاً</small>
                <button class="print-btn btn" onclick="printRecord()">🖨️ طباعة السجل</button>
            </div>

            <!-- عرض المسافة -->
            <div id="distanceDisplay" class="distance-display" style="display: none;">
                🚗 المسافة المقطوعة: <span id="distanceValue">0</span> كم
            </div>

            <form id="movementForm">
                <div class="form-group full-width">
                    <label>📍 اتجاه وجهة السائق:</label>
                    <input type="text" id="direction" placeholder="اكتب الاتجاه بالتفصيل" required>
                </div>

                <div class="form-group full-width">
                    <label>👨‍💼 اسم السائق:</label>
                    <select id="driver" required>
                        <option value="">اختر السائق</option>
                        <option value="امجد العدول">امجد العدول</option>
                        <option value="شادي غوانمة">شادي غوانمة</option>
                        <option value="اسامة ابو داري">اسامة ابو داري</option>
                        <option value="محمد القصير">محمد القصير</option>
                        <option value="منذر مهيرات">منذر مهيرات</option>
                        <option value="صلاح الرفاعي">صلاح الرفاعي</option>
                        <option value="علي الشعلان">علي الشعلان</option>
                        <option value="بهجت الرياحنة">بهجت الرياحنة</option>
                        <option value="أحمد معابره">أحمد معابره</option>
                        <option value="إشتياق الملكاوي">إشتياق الملكاوي</option>
                        <option value="أحمد ابو حماد">أحمد ابو حماد</option>
                    </select>
                </div>

                <div class="form-group full-width">
                    <label>🔄 العملية:</label>
                    <div class="checkbox-group">
                        <div class="checkbox-item">
                            <input type="checkbox" id="cashTo1" name="operation" value="شحن نقد لهم">
                            <label for="cashTo1">💰 شحن نقد لهم</label>
                        </div>
                        <div class="checkbox-item">
                            <input type="checkbox" id="cashFrom1" name="operation" value="شحن نقد منهم">
                            <label for="cashFrom1">💵 شحن نقد منهم</label>
                        </div>
                        <div class="checkbox-item">
                            <input type="checkbox" id="checkClients1" name="operation" value="تحصيل شيكات من العملاء">
                            <label for="checkClients1">📄 تحصيل شيكات من العملاء</label>
                        </div>
                        <div class="checkbox-item">
                            <input type="checkbox" id="checkBranches1" name="operation" value="تحصيل شيكات من الفروع">
                            <label for="checkBranches1">🏢 تحصيل شيكات من الفروع</label>
                        </div>
                        <div class="checkbox-item">
                            <input type="checkbox" id="mail1" name="operation" value="استلام/تسليم بريد">
                            <label for="mail1">📬 استلام/تسليم بريد</label>
                        </div>
                        <div class="checkbox-item">
                            <input type="checkbox" id="signatures1" name="operation" value="تواقيع معاملات">
                            <label for="signatures1">✍️ تواقيع معاملات</label>
                        </div>
                        <div class="checkbox-item">
                            <input type="checkbox" id="cashDeposit1" name="operation" value="ايداع نقدي في البنوك">
                            <label for="cashDeposit1">🏦 ايداع نقدي في البنوك</label>
                        </div>
                        <div class="checkbox-item">
                            <input type="checkbox" id="checkClearing1" name="operation" value="ايداع شيكات مقاصة">
                            <label for="checkClearing1">⚖️ ايداع شيكات مقاصة</label>
                        </div>
                        <div class="checkbox-item">
                            <input type="checkbox" id="other1" name="operation" value="أخرى">
                            <label for="other1">➕ أخرى</label>
                        </div>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group full-width">
                        <label>💰 المبلغ:</label>
                        <input type="number" id="amount" placeholder="0.00" step="0.01" required>
                    </div>
                    <div class="form-group full-width">
                        <label>💱 العملة:</label>
                        <select id="currency" required>
                            <option value="">اختر العملة</option>
                            <option value="دولار أمريكي (USD)">دولار أمريكي (USD) $</option>
                            <option value="يورو (EUR)">يورو (EUR) €</option>
                            <option value="دينار أردني (JOD)">دينار أردني (JOD) JD</option>
                            <option value="ريال سعودي (SAR)">ريال سعودي (SAR) ر.س</option>
                            <option value="درهم إماراتي (AED)">درهم إماراتي (AED) درهم</option>
                            <option value="ليرة سورية (SYP)">ليرة سورية (SYP) ل.س</option>
                            <option value="جنيه مصري (EGP)">جنيه مصري (EGP) ج.م</option>
                            <option value="أونصة ذهب">🪙 أونصة ذهب</option>
                            <option value="أونصة فضة">☁️ أونصة فضة</option>
                            <option value="أخرى">➕ أخرى</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group full-width">
                        <label>📊 قراءة العداد (عند الانطلاق):</label>
                        <input type="number" id="startOdometer" placeholder="00000" step="0.1" required>
                    </div>
                    <div class="form-group full-width">
                        <label>📊 قراءة العداد (عند الانتهاء):</label>
                        <input type="number" id="endOdometer" placeholder="00000" step="0.1" required>
                    </div>
                </div>

                <div class="form-group full-width">
                    <label>📝 ملاحظات:</label>
                    <textarea id="notes" rows="4" placeholder="اكتب أي ملاحظات إضافية..."></textarea>
                </div>

                <button type="submit" class="btn btn-success">💾 حفظ السجل</button>
            </form>

            <div class="footer">
                <p>© 2026 شركة العلاونة للصرافة - نظام إدارة حركة الشحن المتطور<br>
                👨‍💻 برمجة: حسين أمجد العدول</p>
            </div>
        </div>
    </div>

    <!-- شاشة كلمة السر للسجلات فقط -->
    <div id="passwordScreen" class="password-overlay" style="display: none;">
        <div class="password-container">
            <h2>🔐 دخول المدير - السجلات</h2>
            <p>أدخل كلمة السر (4 أرقام)</p>
            <input type="password" id="managerPassword" maxlength="4" placeholder="____" class="password-input">
            <div class="password-buttons">
                <button class="btn" id="enterRecordsBtn">✅ دخول السجلات</button>
                <button class="btn btn-danger" id="cancelPasswordBtn">❌ إلغاء</button>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
    <script>
        // دالة الطباعة (اختياري)
        function printRecord() {
            window.print();
        }
    </script>
</body>
</html>
```

---

✅ الكود الثاني: script.js (الجافاسكريبت الرئيسي - معدل بالكامل)

```javascript
// ========== إدارة التخزين المحلي ==========
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

// ========== تحديث التاريخ واليوم تلقائياً ==========
function updateDateTime() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const arabicDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

    const dateEl = document.getElementById('currentDate');
    const dayEl = document.getElementById('currentDay');

    if (dateEl) dateEl.textContent = `${day}/${month}/${year}`;
    if (dayEl) dayEl.textContent = arabicDays[now.getDay()];
}

// ========== تنسيق التاريخ والوقت للتخزين ==========
function formatArabicDate(date) {
    const arabicDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${arabicDays[date.getDay()]} ${d}/${m}/${y} الساعة ${h}:${min}`;
}

// ========== حساب المسافة وعرضها ==========
function calculateDistance() {
    const start = parseFloat(document.getElementById('startOdometer')?.value);
    const end = parseFloat(document.getElementById('endOdometer')?.value);
    const distanceDisplay = document.getElementById('distanceDisplay');
    const distanceValueSpan = document.getElementById('distanceValue');

    if (!isNaN(start) && !isNaN(end) && end > start) {
        const dist = (end - start).toFixed(1);
        if (distanceValueSpan) distanceValueSpan.textContent = dist;
        if (distanceDisplay) distanceDisplay.style.display = 'block';
        return dist;
    } else {
        if (distanceDisplay) distanceDisplay.style.display = 'none';
        return '0';
    }
}

// ========== عرض السجلات في قسم "السجلات" ==========
function displayHistory() {
    const records = getRecords();
    const list = document.getElementById('historyList');
    if (!list) return;

    if (records.length === 0) {
        list.innerHTML = '<div style="text-align:center;padding:50px;color:#666;font-size:1.2em">📭 لا توجد سجلات بعد</div>';
        return;
    }

    list.innerHTML = records.slice(0, 100).map((r, index) => {
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

// ========== حفظ السجل (من النموذج) ==========
function handleFormSubmit(e) {
    e.preventDefault();

    const selectedOps = document.querySelectorAll('input[name="operation"]:checked');
    if (selectedOps.length === 0) {
        alert('⚠️ اختر عملية واحدة على الأقل!');
        return;
    }

    const records = getRecords();
    const distance = calculateDistance();

    const newRecord = {
        id: Date.now(),
        timestamp: formatArabicDate(new Date()),
        direction: document.getElementById('direction').value.trim(),
        driver: document.getElementById('driver').value,
        operations: Array.from(selectedOps).map(cb => cb.value).join('، '),
        amount: document.getElementById('amount').value,
        currency: document.getElementById('currency').value,
        startOdometer: document.getElementById('startOdometer').value,
        endOdometer: document.getElementById('endOdometer').value,
        distance: distance,
        notes: document.getElementById('notes').value.trim()
    };

    records.unshift(newRecord);
    saveRecords(records);

    // إعادة تعيين النموذج
    e.target.reset();
    document.querySelectorAll('.checkbox-item').forEach(item => {
        item.classList.remove('selected');
        const cb = item.querySelector('input');
        if (cb) cb.checked = false;
    });
    const distDisplay = document.getElementById('distanceDisplay');
    if (distDisplay) distDisplay.style.display = 'none';

    showSuccess();
}

// ========== رسالة النجاح ==========
function showSuccess() {
    const msg = document.getElementById('successMessage');
    if (!msg) return;
    msg.style.display = 'block';
    msg.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => msg.style.display = 'none', 6000);
}

// ========== إظهار وإخفاء قسم السجلات ==========
function showPasswordScreen() {
    const screen = document.getElementById('passwordScreen');
    if (screen) {
        screen.style.display = 'flex';
        screen.style.zIndex = '99999';
        setTimeout(() => document.getElementById('managerPassword')?.focus(), 150);
    }
}

function hidePasswordScreen() {
    const screen = document.getElementById('passwordScreen');
    if (screen) screen.style.display = 'none';
    const inp = document.getElementById('managerPassword');
    if (inp) inp.value = '';
}

function checkPasswordForRecords() {
    const inp = document.getElementById('managerPassword');
    if (!inp) return;
    if (inp.value === '1234') {
        hidePasswordScreen();
        const section = document.getElementById('recordsSection');
        const main = document.getElementById('mainContent');
        if (section && main) {
            section.style.display = 'block';
            main.style.display = 'none';
            displayHistory();  // تحديث الجدول فوراً
            setTimeout(() => section.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        }
    } else {
        inp.style.borderColor = '#e74c3c';
        inp.style.boxShadow = '0 0 0 3px rgba(231,76,60,0.2)';
        setTimeout(() => {
            inp.style.borderColor = '';
            inp.style.boxShadow = '';
        }, 1000);
        alert('⛔ كلمة السر خاطئة! حاول مرة أخرى.');
        inp.value = '';
        inp.focus();
    }
}

function hideRecords() {
    const section = document.getElementById('recordsSection');
    const main = document.getElementById('mainContent');
    if (section && main) {
        section.style.display = 'none';
        main.style.display = 'block';
    }
}

function clearAllRecords() {
    if (confirm('⚠️ هل أنت متأكد من حذف جميع السجلات؟\nلا يمكن التراجع عن هذا الإجراء!')) {
        localStorage.removeItem('deliveryRecords');
        displayHistory();
        alert('✅ تم مسح جميع السجلات بنجاح.');
    }
}

// ========== تشغيل كل شيء عند تحميل الصفحة ==========
document.addEventListener('DOMContentLoaded', function () {
    updateDateTime();
    setInterval(updateDateTime, 1000);  // تحديث كل ثانية (للوقت إذا أردت)

    // ربط الأزرار
    const showBtn = document.getElementById('showRecordsBtn');
    if (showBtn) showBtn.onclick = showPasswordScreen;

    const clearBtn = document.getElementById('clearRecordsBtn');
    if (clearBtn) clearBtn.onclick = clearAllRecords;

    const hideBtn = document.getElementById('hideRecordsBtn');
    if (hideBtn) hideBtn.onclick = hideRecords;

    const enterBtn = document.getElementById('enterRecordsBtn');
    if (enterBtn) enterBtn.onclick = checkPasswordForRecords;

    const cancelBtn = document.getElementById('cancelPasswordBtn');
    if (cancelBtn) cancelBtn.onclick = hidePasswordScreen;

    const passInput = document.getElementById('managerPassword');
    if (passInput) {
        passInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') checkPasswordForRecords();
        });
    }

    const passwordScreen = document.getElementById('passwordScreen');
    if (passwordScreen) {
        passwordScreen.addEventListener('click', function (e) {
            if (e.target === passwordScreen) hidePasswordScreen();
        });
    }

    const form = document.getElementById('movementForm');
    if (form) form.addEventListener('submit', handleFormSubmit);

    const endOdo = document.getElementById('endOdometer');
    const startOdo = document.getElementById('startOdometer');
    if (endOdo) endOdo.addEventListener('input', calculateDistance);
    if (startOdo) startOdo.addEventListener('input', calculateDistance);

    // تفعيل تأثير الـ checkbox
    document.querySelectorAll('.checkbox-item').forEach(item => {
        item.addEventListener('click', function (e) {
            if (e.target.tagName === 'INPUT') {
                item.classList.toggle('selected', e.target.checked);
                return;
            }
            if (e.target.tagName === 'LABEL') {
                const cb = item.querySelector('input[type="checkbox"]');
                setTimeout(() => item.classList.toggle('selected', cb.checked), 0);
                return;
            }
            const cb = item.querySelector('input[type="checkbox"]');
            cb.checked = !cb.checked;
            item.classList.toggle('selected', cb.checked);
        });
    });
});
```

---

✅ الكود الثالث: style.css (كما هو، لكن للتأكيد - لا تغيير فيه)

```css
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Tajawal:wght@300;400;500;700;800&display=swap');

:root {
    --gold: #c9a84c;
    --gold-light: #e8c96a;
    --gold-dim: rgba(201, 168, 76, 0.15);
    --dark-bg: #0a0c10;
    --dark-card: #111318;
    --dark-surface: #181b22;
    --dark-border: rgba(201, 168, 76, 0.2);
    --dark-border-soft: rgba(255,255,255,0.06);
    --text-primary: #f0ece0;
    --text-secondary: #8a8070;
    --text-muted: #4a4540;
    --blue-accent: #3a7bd5;
    --green-accent: #2ecc71;
    --red-accent: #e74c3c;
    --shadow-gold: 0 0 40px rgba(201, 168, 76, 0.12);
    --shadow-deep: 0 20px 60px rgba(0,0,0,0.5);
    --radius-lg: 20px;
    --radius-md: 14px;
    --radius-sm: 8px;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Cairo', 'Tajawal', sans-serif;
    background: var(--dark-bg);
    min-height: 100vh;
    padding: 24px;
    line-height: 1.7;
    direction: rtl;
    color: var(--text-primary);
    background-image:
        radial-gradient(ellipse 80% 50% at 50% -10%, rgba(201, 168, 76, 0.08) 0%, transparent 60%),
        radial-gradient(ellipse 40% 30% at 90% 80%, rgba(58, 123, 213, 0.05) 0%, transparent 50%);
}

/* ═══════════════════════════════════════
   CONTAINER
═══════════════════════════════════════ */
.container {
    max-width: 1100px;
    margin: 0 auto;
    background: var(--dark-card);
    border-radius: 28px;
    border: 1px solid var(--dark-border);
    box-shadow: var(--shadow-gold), var(--shadow-deep);
    overflow: hidden;
    animation: fadeUp 0.6s ease-out both;
}

@keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
}

/* ═══════════════════════════════════════
   HEADER
═══════════════════════════════════════ */
.header {
    background: linear-gradient(160deg, #0f1218 0%, #161920 60%, #0f1218 100%);
    padding: 50px 40px 40px;
    text-align: center;
    position: relative;
    border-bottom: 1px solid var(--dark-border);
    overflow: visible;
}

.header::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent);
    animation: shimmer 3s ease-in-out infinite;
    z-index: 1;
}

@keyframes shimmer {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
}

.header::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 1;
}

.header h1 {
    font-family: 'Tajawal', sans-serif;
    font-size: 2.2em;
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: 0.5px;
    margin-bottom: 8px;
    position: relative;
    z-index: 10;
    text-shadow: 0 2px 20px rgba(201,168,76,0.2);
}

.header > p {
    font-size: 1em;
    color: var(--gold);
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    position: relative;
    z-index: 10;
    opacity: 0.85;
}

.records-toggle {
    position: absolute;
    top: 24px;
    left: 24px;
    z-index: 20;
}

.stats {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 35px;
    flex-wrap: wrap;
    position: relative;
    z-index: 10;
}

.stat-card {
    background: rgba(201, 168, 76, 0.07);
    border: 1px solid var(--dark-border);
    padding: 18px 32px;
    border-radius: var(--radius-md);
    text-align: center;
    min-width: 160px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    position: relative;
    z-index: 10;
}

.stat-card:hover {
    border-color: rgba(201, 168, 76, 0.5);
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(201,168,76,0.1);
}

.stat-value {
    font-family: 'Tajawal', sans-serif;
    font-size: 1.9em;
    font-weight: 700;
    color: #c9a84c !important;
    margin-bottom: 4px;
    min-height: 1.2em;
    letter-spacing: 1px;
    position: relative;
    z-index: 15;
    display: block;
    isolation: isolate;
}

.stat-card small {
    font-size: 0.8em;
    color: var(--text-secondary);
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    position: relative;
    z-index: 15;
    display: block;
}

.records-section {
    background: var(--dark-surface);
    border-bottom: 1px solid var(--dark-border);
    padding: 30px 50px;
}

.records-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    flex-wrap: wrap;
    gap: 15px;
}

.records-header h3 {
    color: var(--gold);
    font-size: 1.5em;
    font-weight: 700;
    letter-spacing: 0.5px;
}

.history-list {
    max-height: 500px;
    overflow-y: auto;
    padding: 4px 0;
    scrollbar-width: thin;
    scrollbar-color: var(--gold-dim) transparent;
}

.history-list::-webkit-scrollbar { width: 4px; }
.history-list::-webkit-scrollbar-track { background: transparent; }
.history-list::-webkit-scrollbar-thumb { background: var(--dark-border); border-radius: 4px; }

.history-item {
    background: var(--dark-card);
    margin-bottom: 12px;
    padding: 22px 25px;
    border-radius: var(--radius-md);
    border: 1px solid var(--dark-border-soft);
    border-right: 3px solid var(--gold);
    transition: all 0.3s ease;
}

.history-item:hover {
    border-color: var(--dark-border);
    border-right-color: var(--gold-light);
    transform: translateX(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}

.form-container {
    padding: 50px;
    background: var(--dark-card);
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 28px;
}

.form-group {
    margin-bottom: 0;
}

.form-group.full-width {
    grid-column: 1 / -1;
    margin-bottom: 24px;
}

.form-group label {
    display: block;
    margin-bottom: 10px;
    font-weight: 600;
    color: var(--text-secondary);
    font-size: 0.9em;
    letter-spacing: 1.5px;
    text-transform: uppercase;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 16px 20px;
    border: 1px solid var(--dark-border-soft);
    border-radius: var(--radius-md);
    font-size: 1em;
    transition: all 0.3s ease;
    background: var(--dark-surface);
    font-family: 'Cairo', sans-serif;
    color: var(--text-primary);
    outline: none;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
    color: var(--text-muted);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    border-color: var(--gold);
    background: rgba(201, 168, 76, 0.04);
    box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.1);
}

.form-group select option {
    background: var(--dark-surface);
    color: var(--text-primary);
}

.checkbox-group {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 12px;
    margin-top: 12px;
}

.checkbox-item {
    padding: 16px 20px;
    border: 1px solid var(--dark-border-soft);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.25s ease;
    background: var(--dark-surface);
    position: relative;
    user-select: none;
    overflow: hidden;
}

.checkbox-item::before {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 3px;
    height: 0;
    background: var(--gold);
    transition: height 0.3s ease;
    border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

.checkbox-item:hover {
    border-color: var(--dark-border);
    background: rgba(201, 168, 76, 0.04);
    transform: translateY(-2px);
}

.checkbox-item:hover::before {
    height: 100%;
}

.checkbox-item.selected {
    border-color: var(--gold);
    background: rgba(201, 168, 76, 0.1);
    box-shadow: 0 4px 20px rgba(201, 168, 76, 0.15);
}

.checkbox-item.selected::before {
    height: 100%;
}

.checkbox-item input[type="checkbox"] {
    width: auto;
    margin-left: 10px;
    accent-color: var(--gold);
    cursor: pointer;
    padding: 0;
    border: none;
    background: none;
    vertical-align: middle;
}

.checkbox-item label {
    cursor: pointer;
    color: var(--text-primary);
    font-size: 0.95em;
    margin-bottom: 0;
    letter-spacing: 0;
    text-transform: none;
    vertical-align: middle;
}

.success-message {
    background: rgba(46, 204, 113, 0.1);
    border: 1px solid rgba(46, 204, 113, 0.3);
    color: var(--green-accent);
    padding: 24px;
    border-radius: var(--radius-md);
    margin-bottom: 30px;
    text-align: center;
    font-size: 1.1em;
    font-weight: 600;
    animation: fadeUp 0.4s ease-out;
}

.distance-display {
    background: rgba(58, 123, 213, 0.1);
    border: 1px solid rgba(58, 123, 213, 0.25);
    color: #6fa8e8;
    padding: 16px 24px;
    border-radius: var(--radius-md);
    margin-bottom: 24px;
    font-weight: 600;
    text-align: center;
    font-size: 1.05em;
}

.btn {
    padding: 14px 28px;
    border: none;
    border-radius: var(--radius-md);
    font-size: 1em;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Cairo', sans-serif;
    letter-spacing: 0.5px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    z-index: 5;
}

.btn-success {
    background: linear-gradient(135deg, rgba(46,204,113,0.15), rgba(46,204,113,0.25));
    color: var(--green-accent);
    width: 100%;
    padding: 20px;
    font-size: 1.15em;
    margin-top: 10px;
    box-shadow: 0 4px 20px rgba(46,204,113,0.25);
    border: 1px solid rgba(46,204,113,0.3);
}

.btn-success:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(46,204,113,0.35);
    background: linear-gradient(135deg, rgba(46,204,113,0.22), rgba(46,204,113,0.35));
}

.btn-primary {
    background: rgba(201, 168, 76, 0.12);
    color: var(--gold);
    border: 1px solid var(--dark-border);
    padding: 12px 20px;
    font-size: 0.9em;
}

.btn-primary:hover {
    background: rgba(201, 168, 76, 0.22);
    border-color: var(--gold);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(201,168,76,0.15);
}

.btn-danger {
    background: rgba(231, 76, 60, 0.1);
    color: var(--red-accent);
    border: 1px solid rgba(231,76,60,0.22);
}

.btn-danger:hover {
    background: rgba(231, 76, 60, 0.2);
    border-color: var(--red-accent);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(231,76,60,0.2);
}

.btn-secondary {
    background: rgba(255,255,255,0.05);
    color: var(--text-secondary);
    border: 1px solid var(--dark-border-soft);
}

.btn-secondary:hover {
    background: rgba(255,255,255,0.09);
    color: var(--text-primary);
    transform: translateY(-2px);
}

.print-btn {
    margin-top: 14px;
    padding: 10px 22px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    color: var(--green-accent);
    font-weight: 600;
    font-size: 0.9em;
}

.password-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(5, 7, 10, 0.95);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99999;
    backdrop-filter: blur(16px);
}

.password-container {
    background: var(--dark-card);
    padding: 56px 44px;
    border-radius: 24px;
    text-align: center;
    border: 1px solid var(--dark-border);
    box-shadow: var(--shadow-gold), 0 40px 80px rgba(0,0,0,0.6);
    max-width: 420px;
    width: 90%;
    animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    position: relative;
    overflow: hidden;
}

.password-container::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
}

@keyframes slideIn {
    from { opacity: 0; transform: translateY(-30px) scale(0.92); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
}

.password-container h2 {
    color: var(--gold);
    margin-bottom: 8px;
    font-size: 1.8em;
    font-weight: 800;
    font-family: 'Tajawal', sans-serif;
}

.password-container p {
    color: var(--text-secondary);
    margin-bottom: 28px;
    font-size: 0.95em;
}

.password-input {
    width: 100%;
    padding: 22px;
    font-size: 2.2em;
    text-align: center;
    border: 1px solid var(--dark-border);
    border-radius: var(--radius-md);
    margin-bottom: 28px;
    letter-spacing: 0.5em;
    font-weight: 700;
    background: var(--dark-surface);
    color: var(--gold);
    transition: all 0.3s ease;
    direction: ltr;
    outline: none;
    font-family: 'Cairo', sans-serif;
}

.password-input:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.15);
}

.password-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
}

.password-buttons .btn {
    flex: 1;
    min-width: 130px;
}

.footer {
    background: #0a0c10;
    border-top: 1px solid var(--dark-border);
    text-align: center;
    padding: 28px;
    margin-top: 50px;
}

.footer p {
    font-size: 0.9em;
    line-height: 1.8;
    color: var(--text-muted);
}

select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23c9a84c'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: left 14px center;
    background-size: 22px;
    padding-left: 44px;
    cursor: pointer;
}

@media (max-width: 768px) {
    body { padding: 12px; }
    .container { border-radius: 20px; }
    .header { padding: 60px 20px 30px; }
    .header h1 { font-size: 1.6em; }
    .records-toggle {
        position: absolute;
        top: 16px;
        left: 16px;
        margin: 0;
    }
    .stats { margin-top: 20px; gap: 12px; }
    .stat-card { min-width: 110px; padding: 14px 18px; }
    .stat-value { font-size: 1.5em; }
    .form-row { grid-template-columns: 1fr; gap: 16px; }
    .form-container { padding: 28px 20px; }
    .form-group input,
    .form-group select,
    .form-group textarea {
        padding: 18px 16px;
        font-size: 1.1em;
    }
    .checkbox-group { grid-template-columns: 1fr; }
    .btn {
        padding: 18px 22px;
        font-size: 1.1em;
        width: 100%;
        margin-bottom: 10px;
    }
    .password-buttons { flex-direction: column; }
    .password-input { font-size: 1.8em; padding: 20px; }
    .records-section { padding: 20px; }
    .records-header {
        flex-direction: column;
        text-align: center;
        gap: 12px;
    }
    select {
        padding-left: 40px;
        font-size: 1.1em;
    }
}

@media print {
    body { background: white; color: black; padding: 0; }
    .header::before, .header::after { display: none; }
    .btn, .records-toggle, #passwordScreen { display: none !important; }
    .container { box-shadow: none; border: none; }
    .stat-value { color: #8B7035 !important; }
}
