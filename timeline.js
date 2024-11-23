function addNewItem() {
    // گرفتن مقادیر ورودی فرم
    const time = document.getElementById("time").value;
    const date = document.getElementById("date").value;
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    // ایجاد یک عنصر جدید برای تایم‌لاین
    const newItem = document.createElement("div");
    newItem.classList.add("timeline-row");
    newItem.innerHTML = `
        <div class="timeline-time" align="center">
           <h3> ${time}</h3><h4>${date}</h4>
        </div>
        <div class="timeline-dot fb-bg"></div>
        <div class="timeline-content" style="text-align: left;>
            <i class="fa fa-bell"></i>
            <h3>${title}</h3>
            <p>\t${description}</p>
            <button class="btn  p-2 btn-sm mt-2" onclick="removeItem(this)" id="delete-btn" >Delete Item</button>
        </div>
    `;
    // اضافه کردن آیتم جدید به تایم‌لاین
    document.getElementById("timeline").appendChild(newItem);

    // پاک کردن فرم پس از اضافه کردن
    document.getElementById("newItemForm").reset();

  
}
function removeItem(button) {
    // حذف عنصر والد مربوط به دکمه حذف
         button.parentElement.parentElement.remove();
    }



    function downloadPDF() {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');  
        const content = document.body;

        const fileName = prompt("لطفاً نام فایل را وارد کنید:", "page.pdf");
        if (!fileName) return; // اگر کاربر نام فایل را وارد نکند، عملیات متوقف می‌شود
    
        // تنظیمات html2canvas برای بهبود کیفیت تصویر و حذف فضای خالی
        html2canvas(content, {
          scale: 2,  // بالا بردن کیفیت تصویر
          useCORS: true,  // برای لود کردن تصاویر از سرورهای دیگر
          scrollX: 0,  // غیرفعال کردن اسکرول افقی
          scrollY: 0   // غیرفعال کردن اسکرول عمودی
        }).then(canvas => {
          const imgData = canvas.toDataURL("image/png");
          const imgWidth = 210;  
          const pageHeight = 297;  
          const imgHeight = (canvas.height * imgWidth) / canvas.width;  // محاسبه ارتفاع تصویر بر اساس نسبت
          let heightLeft = imgHeight;
          let position = 0;
    
          // اضافه کردن تصویر به صفحه اول
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
    
          // ایجاد صفحات اضافی برای بقیه محتوا
          while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
    
          // ذخیره pdf فایل 
          pdf.save(fileName);
        });
      }





// آرایه‌ای برای ذخیره آیتم‌های تایم‌لاین
let timelineItems = [];

// بازیابی داده‌ها از localStorage هنگام بارگذاری صفحه
window.onload = function () {
    const savedItems = localStorage.getItem("timelineItems");
    if (savedItems) {
        timelineItems = JSON.parse(savedItems);
        renderTimeline(); // نمایش آیتم‌ها در تایم‌لاین
    }
};

// اضافه کردن آیتم به تایم‌لاین
function addNewItem() {
    const time = document.getElementById("time").value;
    const date = document.getElementById("date").value;
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    if (time && title) {
        const newItem = { time, date, title, description };
        timelineItems.push(newItem);

        // ذخیره در localStorage
        localStorage.setItem("timelineItems", JSON.stringify(timelineItems));

        // رندر تایم‌لاین
        renderTimeline();

        alert("New item added successfully!");
    } else {
        alert("Please fill in required fields!");
    }
}

// نمایش آیتم‌ها در تایم‌لاین
function renderTimeline() {
    const timeline = document.getElementById("timeline");


    timelineItems.forEach(item => {
        const newElement = `
            <div class="timeline-row">
                <div class="timeline-time">
                    <h2>${item.time}</h2><h5>${item.date}</h5>
                </div>
                <div class="timeline-dot fb-bg"></div>
                <div class="timeline-content">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                    <button class="btn  p-2 btn-sm mt-2" onclick="removeItem(this)" id="delete-btn" >Delete Item</button>
                </div>
            </div>`;
        timeline.innerHTML += newElement;
    });
}

// فیلتر کردن آیتم‌های تایم‌لاین
function filterTimeline() {
    const filterTime = document.getElementById("filter-time").value.toLowerCase();
    const filterTitle = document.getElementById("filter-title").value.toLowerCase();

    // فیلتر کردن آیتم‌ها
    const filtered = timelineItems.filter(item => {
        return (
            (filterTime === "" || item.time.toLowerCase().includes(filterTime)) &&
            (filterTitle === "" || item.title.toLowerCase().includes(filterTitle))
        );
    });

    // نمایش نتایج فیلترشده
    const resultsContent = document.getElementById("results-content");
    resultsContent.innerHTML = "";

    if (filtered.length > 0) {
        filtered.forEach(item => {
            const result = `
                <div class="timeline-row">
                    <div class="timeline-time">
                        <h2>${item.time}</h2><h5>${item.date}</h5>
                    </div>
                    <div class="timeline-dot fb-bg"></div>
                    <div class="timeline-content">
                        <h4>${item.title}</h4>
                        <p>${item.description}</p>
                        <button class="btn  p-2 btn-sm mt-2" onclick="removeItem(this)" id="delete-btn" >Delete Item</button>
                    </div>
                </div>`;
            resultsContent.innerHTML += result;
        });
    } else {
        resultsContent.innerHTML = "<p>No results found.</p>";
    }
}
// حذف آیتم از تایم‌لاین
function removeItem(button) {
  const timelineRow = button.closest(".timeline-row");
  const time = timelineRow.querySelector(".timeline-time h2").textContent;
  const title = timelineRow.querySelector(".timeline-content h4").textContent;

  // حذف از آرایه timelineItems
  timelineItems = timelineItems.filter(item => !(item.time === time && item.title === title));

  // ذخیره آرایه به‌روزرسانی‌شده در localStorage
  localStorage.setItem("timelineItems", JSON.stringify(timelineItems));

  // حذف آیتم از نمایش تایم‌لاین
  timelineRow.remove();

  alert("Item deleted successfully!");
}