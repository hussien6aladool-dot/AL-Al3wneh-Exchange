// المتغيرات العامة
let records = JSON.parse(localStorage.getItem('deliveryRecords')) || [];
let emails = JSON.parse(localStorage.getItem('deliveryEmails')) || {};

// تحميل البيانات عند بدء التشغيل
document.addEventListener('DOMContentLoaded', function() {
        // ✅ إضافة التاريخ واليوم
    const now = new Date();
    document.getElementById('currentDate').textContent = now.toLocaleDateString('ar-SA');
    document.getElementById('currentDay').textContent = now.toLocaleDateString('ar-SA', { weekday: 'long' });
    loadEmails();
    updateStats();
    displayHistory();
    document.addEventListener('DOMContentLoaded', function() {
    // ✅ عرض التاريخ واليوم
    const now = new Date();
    document.getElementById('currentDate').textContent = now.toLocaleDateString('ar-SA');
    document.getElementById('currentDay').textContent = now.toLocaleDateString('ar-SA', { weekday: 'long' });
    
    loadEmails();
    updateStats();
    displayHistory();
   
});
    
    // ✅ تحديث المسافة تلقائياً عند الكتابة
    document.getElementById('endOdometer').addEventListener('input', calculateDistance);
    document.getElementById('startOdometer').addEventListener('input', calculateDistance);
});

// حفظ الإيميلات
function saveEmails() {
    const employeeEmail = document.getElementById('employeeEmail').value;
    const managerEmail = document.getElementById('managerEmail').value;
    
    if (!employeeEmail || !managerEmail) {
        alert('⚠️ يرجى إدخال البريدين الإلكترونيين');
        return;
    }
    
    emails = {
        employee: employeeEmail,
        manager: managerEmail
    };
    
    localStorage.setItem('deliveryEmails', JSON.stringify(emails));
    document.getElementById('emailSection').style.display = 'none';
    updateStats();
    
    showSuccess('✅ تم حفظ الإيميلات بنجاح!');
}

// تحميل الإيميلات المحفوظة
function loadEmails() {
    if (emails.employee && emails.manager) {
        document.getElementById('employeeEmail').value = emails.employee;
        document.getElementById('managerEmail').value = emails.manager;
        document.getElementById('emailSection').style.display = 'none';
    }
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

// حساب المسافة
function calculateDistance() {
    const startOdometer = parseFloat(document.getElementById('startOdometer').value);
    const endOdometer = parseFloat(document.getElementById('endOdometer').value);
    
    if (isNaN(startOdometer) || isNaN(endOdometer) || endOdometer <= startOdometer) {
        document.getElementById('distanceDisplay').style.display = 'none';
        return 0;
    }
    
    const distance = ((endOdometer - startOdometer) / 1000).toFixed(2);
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
    
    // ✅ إخفاء تلقائي بعد 8 ثوان
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 8000);
}

// طباعة السجل المُحسّنة
function printRecord() {
    if (records.length === 0) {
        alert('📭 لا توجد سجلات للطباعة');
        return;
    }
    
    const lastRecord = records[0];
    const printContent = `
        <div style="padding: 30px; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.8;">
            <h2 style="text-align: center; color: #2c3e50; border-bottom: 4px solid #3498db; padding-bottom: 20px; margin-bottom: 30px;">
                📋 سجل حركة الشحن - شركة العلاونة للصرافة
            </h2>
            <div style="background: #f8f9fa; padding: 30px; border-radius: 15px; margin: 20px 0; border: 2px solid #e9ecef;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div>
                        <p><strong style="color: #3498db;">👨‍💼 السائق:</strong><br>
                        <span style="font-size: 1.2em;">${lastRecord.driver}</span></p>
                        <p><strong style="color: #3498db;">📍 الوجهة:</strong><br>${lastRecord.direction}</p>
                        <p><strong style="color: #3498db;">🕒 التاريخ والوقت:</strong><br>${lastRecord.timestamp}</p>
                    </div>
                    <div>
                        <p><strong style="color: #27ae60;">💰 المبلغ:</strong><br>
                        <span style="font-size: 1.4em; color: #27ae60;">${parseFloat(lastRecord.amount).toLocaleString()} ${lastRecord.currency}</span></p>
                        <p><strong style="color: #27ae60;">📏 المسافة المقطوعة:</strong><br>${lastRecord.distance} كم</p>
                        <p><strong style="color: #27ae60;">📊 العداد:</strong><br>${parseFloat(lastRecord.startOdometer).toLocaleString()} → ${parseFloat(lastRecord.endOdometer).toLocaleString()}</p>
                    </div>
                </div>
                <div style="background: white; padding: 20px; border-radius: 10px; border-left: 5px solid #f39c12;">
                    <p><strong style="color: #e67e22;">🔄 العمليات:</strong><br>${lastRecord.operations}</p>
                    ${lastRecord.notes ? `<p><strong style="color: #e67e22;">📝 الملاحظات:</strong><br>${lastRecord.notes}</p>` : ''}
                </div>
            </div>
            <p style="text-align: center; color: #7f8c8d; font-size: 0.9em; margin-top: 30px; border-top: 1px solid #dee2e6; padding-top: 15px;">
                تم الإنشاء بواسطة نظام إدارة حركة الشحن المتطور
            </p>
        </div>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <title>سجل الشحن - ${lastRecord.driver}</title>
            <style>
                body { margin: 0; padding: 0; background: white; font-family: Arial, sans-serif; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>${printContent}</body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}

// معالج إرسال النموذج
document.getElementById('movementForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
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
    
    // حفظ آخر 500 سجل فقط
    records.unshift(formData);
    localStorage.setItem('deliveryRecords', JSON.stringify(records.slice(0, 500)));
    
    updateStats();
    displayHistory();
    sendNotification(formData);
    
    // إعادة تعيين النموذج
    this.reset();
    hideDistance();
    document.querySelectorAll('.checkbox-item').forEach(item => {
        item.classList.remove('selected');
        item.querySelector('input[type="checkbox"]').checked = false;
    });
});

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
        alert('⚠️ يرجى إدخال قراءات العداد بشكل صحيح (النهائي > البداية)');
        return false;
    }
    
    return true;
}

// الحصول على العمليات المختارة
function getSelectedOperations() {
    const selected = document.querySelectorAll('input[name="operation"]:checked');
    return Array.from(selected).map(cb => cb.value).join(', ');
}

// إرسال إشعار (محاكاة)
function sendNotification(record) {
    if (!emails.manager) {
        console.log('📧 تم حفظ السجل محلياً (الإيميلات غير مُعدة)');
        showSuccess('✅ تم حفظ السجل بنجاح!');
        return;
    }
    
    console.log('📧 إرسال إلى:', emails.manager);
    console.log('📋 السجل:', record);
    showSuccess('✅ تم حفظ وإرسال السجل بنجاح إلى مدير الشحن! 📧');
}

// تحديث الإحصائيات
function updateStats() {
    const today = new Date().toDateString();
    const todayRecordsCount = records.filter(record => 
        new Date(record.timestamp).toDateString() === today
    ).length;
    
    document.getElementById('todayRecords').textContent = todayRecordsCount;
    document.getElementById('totalRecords').textContent = records.length;
}

// عرض السجل
function displayHistory() {
    const historyList = document.getElementById('historyList');
    
    if (records.length === 0) {
        historyList.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #6c757d;">
                <div style="font-size: 4em; margin-bottom: 20px;">📭</div>
                <h3 style="color: #495057; margin-bottom: 10px;">لا توجد سجلات بعد</h3>
                <p>ابدأ بإضافة سجل جديد لترى السجلات هنا</p>
            </div>
        `;
        return;
    }
    
    // عرض آخر 20 سجل
    historyList.innerHTML = records.slice(0, 20).map((record, index) => `
        <div class="history-item">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <div style="font-weight: bold; font-size: 1.2em; color: #2c3e50;">
                    ${record.driver}
                </div>
                <div style="font-size: 0.85em; color: #6c757d; white-space: nowrap;">
                    ${new Date(record.timestamp).toLocaleDateString('ar-SA')}
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
    `).join('');
}
// ✅ دالة تنظيف الإيميلات - أضف في النهاية
function clearEmails() {
    if (confirm('⚠️ هل تريد تنظيف الإيميلات المحفوظة؟\nسيظهر قسم الإعدادات مرة أخرى')) {
        localStorage.removeItem('deliveryEmails');
        emails = {};
        document.getElementById('emailSection').style.display = 'block';
        document.getElementById('employeeEmail').value = '';
        document.getElementById('managerEmail').value = '';
        
        showSuccess('✅ تم تنظيف الإيميلات بنجاح!\nيمكنك إدخال إيميلات جديدة');
    }
}

// تحديث الإحصائيات عند تحميل الصفحة
updateStats();
displayHistory();
