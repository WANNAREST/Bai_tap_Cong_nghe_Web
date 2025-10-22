// Chờ cho đến khi toàn bộ nội dung HTML được tải
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Lấy các phần tử DOM cho Bài 3 ---
    const searchInput = document.getElementById('searchInput');
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductForm = document.getElementById('addProductForm');
    const cancelBtn = document.getElementById('cancelBtn');
    
    // Cải tiến: Chỉ tìm sản phẩm bên trong container chính
    const productContainer = document.getElementById('products-container');
    
    // === THAY ĐỔI (BÀI 4) ===
    let productItems = productContainer.querySelectorAll('.product-item'); 
    // === THÊM MỚI (BÀI 4): Lấy vùng báo lỗi ===
    const errorMsg = document.getElementById('errorMsg');
    // --- Chức năng 1 (Bài 3): Ẩn/Hiện Form ---
    addProductBtn.addEventListener('click', () => {
        addProductForm.classList.remove('hidden'); // Hiện form
    });
    cancelBtn.addEventListener('click', () => {
        addProductForm.classList.add('hidden'); // Ẩn form
        errorMsg.textContent = ''; // Xóa lỗi khi hủy
        addProductForm.reset(); // Xóa các trường đã nhập
    });
    // --- Chức năng 2 (Bài 3): Lọc sản phẩm ---
    searchInput.addEventListener('keyup', (e) => {
        const searchTerm = searchInput.value.toLowerCase();
        // Lặp qua từng sản phẩm (bao gồm cả sản phẩm mới)
        productItems.forEach(item => {
            const productName = item.querySelector('.product-name')?.textContent.toLowerCase();
            if (!productName) return; 
            
            if (productName.includes(searchTerm)) {
                item.style.display = 'flex'; 
            } else {
                item.style.display = 'none'; 
            }
        });
    });

    // === BÀI 4: Xử lý Submit Form ===
    addProductForm.addEventListener('submit', (event) => {
        // 1. Ngăn trình duyệt tải lại trang
        event.preventDefault(); 
        
        // 2. Lấy dữ liệu từ các ô input
        const name = document.getElementById('newName').value.trim();
        const price = document.getElementById('newPrice').value.trim();
        const author = document.getElementById('newAuthor').value.trim() || 'Không rõ tác giả';
        const description = document.getElementById('newDescription').value.trim() || 'Chưa có mô tả';
        const image = document.getElementById('newImage').value.trim();
        // === KẾT THÚC THÊM MỚI ===
        // 3. Validate (Kiểm tra) dữ liệu
        if (name === '' || price === '') {
            errorMsg.textContent = 'Tên và Giá không được để trống!';
            return; 
        }
        if (isNaN(price) || Number(price) <= 0) {
            errorMsg.textContent = 'Giá phải là một số dương!';
            return; 
        }
        // 4. Nếu dữ liệu hợp lệ
        errorMsg.textContent = ''; 
        const newItem = document.createElement('article');
        newItem.classList.add('product-item'); 
        newItem.innerHTML = `
            <img src="${image || 'https://via.placeholder.com/200'}" alt="${name}" class="product-image">
            <h3 class="product-name">${name}</h3>
            <p class="product-author">${author}</p>
            <p class="product-description">${description}</p>
            <p class="product-price">Giá: ${Number(price).toLocaleString('vi-VN')}₫</p>
        `;
        // === KẾT THÚC SỬA ===
        // 5. Thêm sản phẩm mới vào đầu danh sách
        productContainer.prepend(newItem);
        // 6. CẬP NHẬT danh sách sản phẩm
        productItems = productContainer.querySelectorAll('.product-item'); 
        // 7. Dọn dẹp
        addProductForm.reset(); 
        addProductForm.classList.add('hidden'); 
    });
});