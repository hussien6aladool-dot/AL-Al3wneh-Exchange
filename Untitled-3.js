// المتغيرات العامة
let records = JSON.parse(localStorage.getItem('deliveryRecords')) || [];

// تحديث الوقت كل ثانية ✅
function updateDateTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    document.getElementById('currentDate').textContent = `${day}/${month}/${year}`;

    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    document.getElementById('currentDay').textContent = days[now.getDay()];
}

// تحديث الوقت تلقائياً كل ثانية
setInterval(updateDateTime, 1000);
updateDateTime(); // تشغيل أول مرة

// تحميل البيانات عند بدء التشغيل ✅
window.addEventListener('load', function() {
    // معالج النموذج
    const movementForm = document.getElementById('movementForm');
    if (movementForm) {
        movementForm.addEventListener('submit', handleFormSubmit);
    }
    
    // معالج الـ checkboxes ✅
    setupCheckboxes();
    
    // رسالة افتراضية في السجلات
    const historyList = document.getElementById('historyList');
    if (historyList) {
        historyList.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #6c757d;">
                <div style="font-size: 4em; margin-bottom: 20px;">🔐</div>
                <h3>اضغط على زر "السجلات (مدير)" للعرض</h3>
            </div>
        `;
    }
});

// إعداد الشيك بوكس ✅
function setupCheckboxes() {
    const checkboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const item = this.closest('.checkbox-item');
            updateCheckboxStyle(item, this.checked);
        });
    });
    
    // للـ click على العنصر كامل
    const checkboxItems = document.querySelectorAll('.checkbox-item');
    checkboxItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const checkbox = this.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
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
    const password = document.getElementById('managerPassword').value;
    const MANAGER_PASSWORD = "1234";

    if (password === MANAGER_PASSWORD) {
        hidePasswordScreen();
        document.getElementById('recordsSection').style.display = 'block';
        loadRecords();
    } else {
        alert('❌ كلمة السر غير صحيحة!');
        document.getElementById('managerPassword').value = '';
    }
}

function hideRecords() {
    document.getElementById('recordsSection').style.display = 'none';
}

function loadRecords() {
    displayHistory();
}

function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    const distance = calculateDistance();
    const formData = {
        id: Date.now(),
        timestamp: new Date().toLocaleString('ar-SA'),
        direction: document.getElementById('direction').value,
        driver: document.getElementById('driver').value,
        operations: getSelectedOperations(),
        amount: document.getElementById('amount').value,
        currency: document.getElementById('currency').value,
        startOdometer: document.getElementById('startOdometer').value,
        endOdometer: document.getElementById('endOdometer').value,
        distance: distance,
        notes: document.getElementById('notes').value
    };

    records.unshift(formData);
    localStorage.setItem('deliveryRecords', JSON.stringify(records.slice(0, 500)));

    e.target.reset();
    hideDistance();
    document.querySelectorAll('.checkbox-item').forEach(item => {
        item.classList.remove('selected');
        item.querySelector('input[type="checkbox"]').checked = false;
    });

    showSuccess('✅ تم حفظ السجل بنجاح!');
}

function validateForm() {
    const direction = document.getElementById('direction').value.trim();
    const driver = document.getElementById('driver').value;
    const operations = document.querySelectorAll('input[name="operation"]:checked');
    const amount = document.getElementById('amount').value;
    const currency = document.getElementById('currency').value;
    const startOdometer = parseFloat(document.getElementById('startOdometer').value);
    const endOdometer = parseFloat(document.getElementById('endOdometer').value);

    if (!direction || !driver || operations.length === 0 || !amount || !currency) {
        alert('⚠️ يرجى ملء جميع الحقول المطلوبة ✓');
        return false;
    }

    if (isNaN(startOdometer) || isNaN(endOdometer) || endOdometer <= startOdometer) {
        alert('⚠️ يرجى إدخال قراءات العداد بشكل صحيح');
        return false;
    }

    return true;
}

function getSelectedOperations() {
    const selected = document.querySelectorAll('input[name="operation"]:checked');
    return Array.from(selected).map(cb => cb.value).join(', ');
}

function calculateDistance() {
    const start = parseFloat(document.getElementById('startOdometer').value);
    const end = parseFloat(document.getElementById('endOdometer').value);

    if (isNaN(start) || isNaN(end) || end <= start) {
        document.getElementById('distanceDisplay').style.display = 'none';
        return 0;
    }

    const distance = ((end - start) / 1000).toFixed(2);
    document.getElementById('distanceValue').textContent = distance;
    document.getElementById('distanceDisplay').style.display = 'block';
    return distance;
}

function hideDistance() {
    document.getElementById('distanceDisplay').style.display = 'none';
}

function showSuccess(message) {
    const successMsg = document.getElementById('successMessage');
    successMsg.innerHTML = message +
    '<br><small>تم حفظ السجل محلياً للرجوع إليه لاحقاً</small>' +
    '<button class="print-btn btn" onclick="printRecord()">🖨️ طباعة السجل</button>';
    successMsg.style.display = 'block';
    setTimeout(() => successMsg.style.display = 'none', 8000);
}

function displayHistory() {
    const historyList = document.getElementById('historyList');

    if (records.length === 0) {
        historyList.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #6c757d;">
                <div style="font-size: 4em; margin-bottom: 20px;">📭</div>
                <h3 style="color: #495057;">لا توجد سجلات بعد</h3>
                <p>ابدأ بإضافة سجل جديد</p>
            </div>
        `;
        return;
    }

    historyList.innerHTML = records.slice(0, 50).map(record => {
        const recordDate = new Date(record.timestamp);
        const dayName = recordDate.toLocaleDateString('ar-SA', { weekday: 'long' });
        const dateStr = recordDate.toLocaleDateString('ar-SA');
        return `
            <div class="history-item">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <div style="font-weight: bold; font-size: 1.3em; color: #2c3e50;">
                        ${record.driver}
                    </div>
                    <div style="font-size: 0.9em; color: #6c757d;">
                        <div>${dayName}</div>
                        <div>${dateStr}</div>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 0.95em;">
                    <div>
                        <strong>📍 ${record.direction}</strong><br>
                        <strong style="color: #27ae60;">💰 ${parseFloat(record.amount).toLocaleString()} ${record.currency}</strong><br>
                        <strong style="color: #e67e22;">🔄 ${record.operations}</strong>
                    </div>
                    <div style="text-align: left;">
                        <strong>📏 ${record.distance} كم</strong><br>
                        <strong>📊 ${parseFloat(record.startOdometer).toLocaleString()} → ${parseFloat(record.endOdometer).toLocaleString()}</strong><br>
                        ${record.notes ? `<strong style="color: #8e44ad;">📝 ${record.notes}</strong>` : '<strong style="color: #95a5a6;">📝 لا يوجد</strong>'}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function clearAllRecords() {
    if (confirm('⚠️ هل تريد حذف جميع السجلات؟\n\nهذا الإجراء لا يمكن التراجع عنه!')) {
        records = [];
        localStorage.removeItem('deliveryRecords');
        displayHistory();
        alert('✅ تم مسح جميع السجلات!');
    }
}

function printRecord() {
    if (records.length === 0) {
        alert('لا توجد سجلات للطباعة!');
        return;
    }

    const lastRecord = records[0];
    const printContent = `
        <div style="padding: 30px; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.8; direction: rtl;">
            <h2 style="text-align: center; color: #2c3e50; border-bottom: 4px solid #3498db; padding-bottom: 20px;">
                📋 سجل حركة الشحن - شركة العلاونة للصرافة
            </h2>
            <div style="background: #f8f9fa; padding: 30px; border-radius: 15px; margin: 20px 0; border: 2px solid #e9ecef;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div>
                        <p><strong style="color: #3498db;">👨‍💼 السائق:</strong><br>
                        <span style="font-size: 1.2em;">${lastRecord.driver}</span></p>
                        <p><strong style="color: #3498db;">📍 الوجهة:</strong><br>${lastRecord.direction}</p>
                        <p><strong style="color: #3498db;">🕒 التاريخ:</strong><br>${lastRecord.timestamp}</p>
                    </div>
                    <div>
                        <p><strong style="color: #27ae60;">💰 المبلغ:</strong><br>
                        <span style="font-size: 1.4em; color: #27ae60;">${parseFloat(lastRecord.amount).toLocaleString()} ${lastRecord.currency}</span></p>
                        <p><strong style="color: #27ae60;">📏 المسافة:</strong><br>${lastRecord.distance} كم</p>
                        <p><strong style="color: #27ae60;">📊 العداد:</strong><br>${parseFloat(lastRecord.startOdometer).toLocaleString()} → ${parseFloat(lastRecord.endOdometer).toLocaleString()}</p>
                    </div>
                </div>
                <div style="background: white; padding: 20px; border-radius: 10px; border-left: 5px solid #f39c12;">
                    <p><strong style="color: #e67e22;">🔄 العمليات:</strong><br>${lastRecord.operations}</p>
                    ${lastRecord.notes ? `<p><strong style="color: #e67e22;">📝 الملاحظات:</strong><br>${lastRecord.notes}</p>` : ''}
                </div>
            </div>
            <p style="text-align: center; color: #7f8c8d; font-size: 0.9em; margin-top: 30px;">
                © نظام إدارة حركة الشحن المتطور
            </p>
        </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <title>سجل الشحن - ${lastRecord.driver}</title>
            <style>body { margin: 0; padding: 0; background: white; font-family: Arial, sans-serif; } @media print { body { margin: 0; } }</style>
        </head>
        <body>${printContent}</body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}

function updateCheckboxStyle(item, isChecked) {
    if (isChecked) {
        item.classList.add('selected');
    } else {
        item.classList.remove('selected');
    }
}

// إضافة event listeners للعدادات
document.addEventListener('DOMContentLoaded', function() {
    const endOdometer = document.getElementById('endOdometer');
    const startOdometer = document.getElementById('startOdometer');
    
    if (endOdometer) endOdometer.addEventListener('input', calculateDistance);
    if (startOdometer) startOdometer.addEventListener('input', calculateDistance);
    
    // ربط زر السجلات ✅
    const recordsBtn = document.querySelector('.records-toggle button');
    if (recordsBtn) {
        recordsBtn.addEventListener('click', showPasswordScreen);
    }
});
