// المتغيرات العامة
let records = JSON.parse(localStorage.getItem('deliveryRecords')) || [];
let emails = JSON.parse(localStorage.getItem('deliveryEmails')) || {};

// تحميل البيانات عند بدء التشغيل
document.addEventListener('DOMContentLoaded', function() {
    loadEmails();
    updateStats();
    displayHistory();
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
    
    // إظهار رسالة نجاح
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
    
    if (isNaN(startOdometer) || isNaN(endOdometer)) {
        return 0;
    }
    
    const distance = (endOdometer - startOdometer).toFixed(2);
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
    successMsg.innerHTML = message + '<br><small>تم حفظ السجل محلياً للرجوع إليه لاحقاً</small><button class="print-btn btn" onclick="printRecord()">🖨️ طباعة السجل</button>';
    successMsg.style.display = 'block';
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 5000);
}

// طباعة السجل
function printRecord() {
    window.print();
}

// معالج إرسال النموذج
document.getElementById('movementForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // التحقق من صحة البيانات
    if (!validateForm()) {
        return;
    }
    
    // حساب المسافة
    const distance = calculateDistance();
    
    // جمع البيانات
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
    
    // حفظ السجل
    records.unshift(formData);
    localStorage.setItem('deliveryRecords', JSON.stringify(records));
    
    // تحديث الإحصائيات
    updateStats();
    
    // عرض السجل
    displayHistory();
    
    // إرسال الإشعار (محاكاة)
    sendNotification(formData);
    
    // إعادة تعيين النموذج
    this.reset();
    hideDistance();
    
    // إخفاء العمليات المختارة
    document.querySelectorAll('.checkbox-item').forEach(item => {
        item.classList.remove('selected');
        item.querySelector('input[type="checkbox"]').checked = false;
    });
});

// التحقق من صحة النموذج
function validateForm() {
    const direction = document.getElementById('direction').value;
    const driver = document.getElementById('driver').value;
    const operations = document.querySelectorAll('input[name="operation"]:checked');
    const amount = document.getElementById('amount').value;
    const currency = document.getElementById('currency').value;
    const startOdometer = document.getElementById('startOdometer').value;
    const endOdometer = document.getElementById('endOdometer').value;
    
    if (!direction || !driver || operations.length === 0 || !amount || !currency || !startOdometer || !endOdometer) {
        alert('⚠️ يرجى ملء جميع الحقول المطلوبة والعمليات');
        return false;
    }
    
    if (parseFloat(endOdometer) <= parseFloat(startOdometer)) {
        alert('⚠️ قراءة العداد النهائية يجب أن تكون أكبر من البداية');
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
    
    // محاكاة إرسال البريد
    console.log('📧 إرسال إلى:', emails.manager);
    console.log('📋 السجل:', record);
    
    showSuccess('✅ تم حفظ وإرسال السجل بنجاح إلى مدير الشحن! 📧');
}

// تحديث الإحصائيات
function updateStats() {
    const today = new Date().toDateString();
    const todayRecords = records.filter(record => 
        new Date(record.timestamp).toDateString() === today
    ).length;
    
    document.getElementById('todayRecords').textContent = todayRecords;
    document.getElementById('totalRecords').textContent = records.length;
}

// عرض السجل
function displayHistory() {
    const historyList = document.getElementById('historyList');
    
    if (records.length === 0) {
        historyList.innerHTML = '<div style="text-align: center; padding: 40px; color: #6c757d;">📭 لا توجد سجلات بعد</div>';
        return;
    }
    
    historyList.innerHTML = records.slice(0, 20).map(record => `
        <div class="history-item">
            <div style="font-weight: bold; font-size: 1.1em; margin-bottom: 10px;">
                ${record.driver} → ${record.direction}
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 0.95em;">
                <div>
                    <strong>🕒 الوقت:</strong> ${record.timestamp}<br>
                    <strong>🔄 العمليات:</strong> ${record.operations}<br>
                    <strong>💰 المبلغ:</strong> ${record.amount} ${record.currency}
                </div>
                <div>
                    <strong>📏 المسافة:</strong> ${record.distance} كم<br>
                    <strong>📊 العداد:</strong> ${record.startOdometer} → ${record.endOdometer}<br>
                    <strong>📝 الملاحظات:</strong> ${record.notes || 'لا يوجد'}
                </div>
            </div>
        </div>
    `).join('');
}

// مسح السجل
function clearHistory() {
    if (confirm('⚠️ هل أنت متأكد من حذف جميع السجلات؟ هذا الإجراء لا يمكن التراجع عنه!')) {
        records = [];
        localStorage.removeItem('deliveryRecords');
        updateStats();
        displayHistory();
        showSuccess('🗑️ تم مسح جميع السجلات بنجاح');
    }
}

// تحديث الإحصائيات عند تحميل الصفحة
updateStats();
displayHistory();