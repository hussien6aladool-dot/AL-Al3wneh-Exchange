// المتغيرات العامة
let records = JSON.parse(localStorage.getItem('deliveryRecords')) || [];

// تحميل البيانات عند بدء التشغيل
document.addEventListener('DOMContentLoaded', function() {
    // عرض التاريخ واليوم
    updateDateTime();
    
    // تحديث المسافة تلقائياً
    document.getElementById('endOdometer').addEventListener('input', calculateDistance);
    document.getElementById('startOdometer').addEventListener('input', calculateDistance);
    
    // معالج النموذج
    document.getElementById('movementForm').addEventListener('submit', handleFormSubmit);
    
    // عرض رسالة افتراضية في السجلات
    document.getElementById('historyList').innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: #6c757d;">
            <div style="font-size: 4em; margin-bottom: 20px;">🔐</div>
            <h3>اضغط على زر "السجلات (مدير)" للعرض</h3>
        </div>
    `;
});

// تحديث التاريخ واليوم
function updateDateTime() {
    const now = new Date();
    document.getElementById('currentDate').textContent = now.toLocaleDateString('ar-SA');
    document.getElementById('currentDay').textContent = now.toLocaleDateString('ar-SA', { weekday: 'long' });
}

// عرض شاشة كلمة السر
function showPasswordScreen() {
    document.getElementById('passwordScreen').style.display = 'flex';
    document.getElementById('managerPassword').focus();
}

// إخفاء شاشة كلمة السر
function hidePasswordScreen() {
    document.getElementById('passwordScreen').style.display = 'none';
    document.getElementById('managerPassword').value = '';
}

// التحقق من كلمة السر للسجلات
function checkPasswordForRecords() {
    const password = document.getElementById('managerPassword').value;
    const MANAGER_PASSWORD = "1234"; // غير الكلمة هنا
    
    if (password === MANAGER_PASSWORD) {
        hidePasswordScreen();
        toggleRecords();
        alert('✅ تم فتح السجلات بنجاح!');
    } else {
        alert('❌ كلمة السر غير صحيحة!');
        document.getElementById('managerPassword').value = '';
        document.getElementById('managerPassword').focus();
    }
}

// إخفاء السجلات
function hideRecords() {
    document.getElementById('recordsSection').style.display = 'none';
}

// تبديل عرض السجلات (بعد كلمة السر)
function toggleRecords() {
    const recordsSection = document.getElementById('recordsSection');
    const isVisible = recordsSection.style.display === 'block';
    
    if (!isVisible) {
        loadRecords();
        recordsSection.style.display = 'block';
    } else {
        recordsSection.style.display = 'none';
    }
}

// تحميل وعرض السجلات
function loadRecords() {
    displayHistory();
}

// معالج إرسال النموذج
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

// التحقق من صحة النموذج
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

// الحصول على العمليات المختارة
function getSelectedOperations() {
    const selected = document.querySelectorAll('input[name="operation"]:checked');
    return Array.from(selected).map(cb => cb.value).join(', ');
}

// حساب المسافة
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

// إخفاء المسافة
function hideDistance() {
    document.getElementById('distanceDisplay').style.display = 'none';
}

// عرض رسالة النجاح
function showSuccess(message) {
    const successMsg = document.getElementById('successMessage');
    successMsg.innerHTML = message + 
        '<br><small>تم حفظ السجل محلياً للرجوع إليه لاحقاً</small>' +
        '<button class="print-btn btn" onclick="printRecord()">🖨️ طباعة السجل</button>';
    successMsg.style.display = 'block';
    setTimeout(() => successMsg.style.display = 'none', 8000);
}

// عرض السجلات
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

// مسح جميع السجلات
function clearAllRecords() {
    if (confirm('⚠️ هل تريد حذف جميع السجلات؟\n\nهذا الإجراء لا يمكن التراجع عنه!')) {
        records = [];
        localStorage.removeItem('deliveryRecords');
        displayHistory();
        alert('✅ تم مسح جميع السجلات!');
    }
}

// طباعة آخر سجل
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

// تبديل حالة الـ checkbox
function toggleCheckbox(item) {
    const checkbox = item.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
    updateCheckboxStyle(item, checkbox.checked);
}

// تحديث ستايل الـ checkbox
function updateCheckboxStyle(item, isChecked) {
    if (isChecked) {
        item.classList.add('selected');
    } else {
        item.classList.remove('selected');
    }
}
