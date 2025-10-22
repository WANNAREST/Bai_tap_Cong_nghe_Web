// Chờ cho đến khi toàn bộ nội dung HTML được tải
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Lấy các phần tử DOM cho Bài 3 ---
    const searchInput = document.getElementById('searchInput');
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductForm = document.getElementById('addProductForm');
    const cancelBtn = document.getElementById('cancelBtn');
    
    // Cải tiến: Chỉ tìm sản phẩm bên trong container chính
    const productContainer = document.getElementById('products-container');
    const productItems = productContainer.querySelectorAll('.product-item'); // An toàn hơn

    // --- Chức năng 1 (Bài 3): Ẩn/Hiện Form ---
    // Khi bấm nút "Thêm sản phẩm mới"
    addProductBtn.addEventListener('click', () => {
        addProductForm.classList.remove('hidden'); // Hiện form
    });
    
    // Khi bấm nút "Hủy"
    cancelBtn.addEventListener('click', () => {
        addProductForm.classList.add('hidden'); // Ẩn form
    });

    // --- Chức năng 2 (Bài 3): Lọc sản phẩm ---
    searchInput.addEventListener('keyup', (e) => {
        const searchTerm = searchInput.value.toLowerCase();

        // Lặp qua từng sản phẩm tĩnh
        productItems.forEach(item => {
            // Tìm thẻ h3.product-name bên trong sản phẩm
            // Thêm dấu ? (optional chaining) để đề phòng lỗi
            const productName = item.querySelector('.product-name')?.textContent.toLowerCase();

            // Nếu không tìm thấy tên (phòng trường hợp item rỗng), bỏ qua
            if (!productName) {
                return; 
            }
            
            // Nếu tên sản phẩm chứa từ khóa tìm kiếm
            if (productName.includes(searchTerm)) {
                item.style.display = 'flex'; // Hiển thị (vì .product-item dùng display: flex)
            } else {
                item.style.display = 'none'; // Ẩn đi
            }
        });
    });
});