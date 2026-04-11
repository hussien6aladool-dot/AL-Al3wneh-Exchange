// المتغيرات العامة
let records = JSON.parse(localStorage.getItem('deliveryRecords')) || [];
let isAuthenticated = false;
const MANAGER_PASSWORD = "1234"; // كلمة السر الافتراضية (4 أرقام)

// تحميل البيانات عند بدء التشغيل
document.addEventListener('DOMContentLoaded', function() {
    // عرض التاريخ واليوم
    const now = new Date();
    document.getElementById('currentDate').textContent = now.toLocaleDateString('ar-SA');
    document.getElementById('currentDay').textContent = now.toLocaleDateString('ar-SA', { weekday: 'long' });
    
    // تحديث المسافة تلقائياً
    document.getElementById('endOdometer').addEventListener('input', calculateDistance);
    document.getElementById('startOdometer').addEventListener('input', calculateDistance);
    
    // معالج النموذج
    document.getElementById('movementForm').addEventListener('submit', handleFormSubmit);
});

// التحقق من كلمة السر
function checkPassword() {
    const inputPassword = document.getElementById('managerPassword').value;
    
    if (inputPassword === MANAGER_PASSWORD) {
        isAuthenticated = true;
        document.getElementById('passwordScreen').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        displayHistory();
        document.getElementById('managerPassword').value = '';
    } else {
        alert('❌ كلمة السر غير صحيحة!');
        document.getElementById('managerPassword').value = '';
        document.getElementById('managerPassword').focus();
    }
}

// إعادة تعيين كلمة السر
function resetPassword() {
    document.getElementById('managerPassword').value = '';
}

// تبديل عرض السجلات
function toggleRecords() {
    const recordsSection = document.getElementById('recordsSection');
    recordsSection.style.display = recordsSection.style.display === 'none' ? 'block' : 'none';
    if (recordsSection.style.display === 'block') {
        displayHistory();
    }
}

// معالج إرسال النموذج
function handleFormSubmit(e) {
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
    
    // إعادة تعيين النموذج
    e.target.reset();
    hideDistance();
    document.querySelectorAll('.checkbox-item').forEach(item => {
        item.classList.remove('selected');
        item.querySelector('input[type="checkbox"]').checked = false;
    });
    
    showSuccess('✅ تم حفظ السجل بنجاح!');
    displayHistory();
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
    
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 8000);
}

// عرض السجلات
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
    
    // عرض آخر 50 سجل مع التاريخ واليوم
    historyList.innerHTML = records.slice(0, 50).map((record, index) => {
        const recordDate = new Date(record.timestamp);
        const dayName = recordDate.toLocaleDateString('ar-SA', { weekday: 'long' });
        return `
            <div class="history-item">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                    <div
