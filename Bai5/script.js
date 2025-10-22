// Chờ cho đến khi toàn bộ nội dung HTML được tải
document.addEventListener('DOMContentLoaded', () => {
    // === Lấy các phần tử DOM ===
    const searchInput = document.getElementById('searchInput');
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductForm = document.getElementById('addProductForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const productContainer = document.getElementById('products-container');
    const errorMsg = document.getElementById('errorMsg');
    // === BÀI 5: DỮ LIỆU TRUNG TÂM ===
    // Key để lưu vào LocalStorage
    const STORAGE_KEY = 'myDVDStoreProducts'; 
    // 'allProducts' sẽ là nguồn dữ liệu duy nhất
    // Nó được khởi tạo từ LocalStorage
    let allProducts = getProductsFromStorage();
    // ===============================================
    // === BÀI 5: CÁC HÀM LƯU TRỮ
    // ===============================================
    /**
     * Lấy danh sách sản phẩm từ LocalStorage.
     * Trả về một mảng (có thể rỗng).
     */
    function getProductsFromStorage() {
        const productsJSON = localStorage.getItem(STORAGE_KEY);
        // Nếu có dữ liệu, parse nó (từ JSON string về mảng)
        // Nếu không, trả về mảng rỗng
        return productsJSON ? JSON.parse(productsJSON) : [];
    }
    /**
     * Lưu mảng sản phẩm hiện tại vào LocalStorage.
     * @param {Array} products Mảng sản phẩm cần lưu
     */
    function saveProductsToStorage(products) {
        // Chuyển mảng/object thành chuỗi JSON
        const productsJSON = JSON.stringify(products);
        // Lưu vào localStorage
        localStorage.setItem(STORAGE_KEY, productsJSON);
    }
    // ===============================================
    // === HÀM HIỂN THỊ (REFACTOR TỪ BÀI 4)
    // ===============================================
    /**
     * "Vẽ" lại toàn bộ danh sách sản phẩm ra DOM
     * @param {Array} products Mảng sản phẩm để hiển thị
     */
    function renderProducts(products) {
        // 1. Xóa sạch nội dung cũ trong container
        productContainer.innerHTML = '';

        // 2. Nếu mảng rỗng, hiển thị thông báo
        if (products.length === 0) {
            productContainer.innerHTML = '<p style="width: 100%; text-align: center; color: #777;">Chưa có DVD nào. Hãy thêm sản phẩm đầu tiên!</p>';
            return;
        }
        // 3. Lặp qua mảng và tạo HTML cho từng sản phẩm
        products.forEach(product => {
            const newItem = document.createElement('article');
            newItem.classList.add('product-item'); 
            newItem.innerHTML = `
                <img src="${product.image || 'https://via.placeholder.com/200'}" alt="${product.name}" class="product-image">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-author">${product.author}</p>
                <p class="product-description">${product.description}</p>
                <p class="product-price">Giá: ${Number(product.price).toLocaleString('vi-VN')}₫</p>
            `;
            
            // 4. Thêm sản phẩm vào DOM
            productContainer.appendChild(newItem);
        });
    }
    // ===============================================
    // === BÀI 3: LỌC SẢN PHẨM (NÂNG CẤP)
    // ===============================================
    searchInput.addEventListener('keyup', (e) => {
        const searchTerm = searchInput.value.toLowerCase();
        
        // Lọc trực tiếp trên mảng 'allProducts'
        const filteredProducts = allProducts.filter(product => {
            return product.name.toLowerCase().includes(searchTerm);
        });
        
        // "Vẽ" lại danh sách sản phẩm đã lọc
        renderProducts(filteredProducts);
    });

    // ===============================================
    // === BÀI 4: THÊM SẢN PHẨM (NÂNG CẤP)
    // ===============================================
    
    addProductForm.addEventListener('submit', (event) => {
        event.preventDefault(); 
        // 1. Lấy dữ liệu
        const name = document.getElementById('newName').value.trim();
        const price = document.getElementById('newPrice').value.trim();
        const author = document.getElementById('newAuthor').value.trim() || 'Không rõ tác giả';
        const description = document.getElementById('newDescription').value.trim() || 'Chưa có mô tả';
        const image = document.getElementById('newImage').value.trim();

        // 2. Validate
        if (name === '' || isNaN(price) || Number(price) <= 0) {
            errorMsg.textContent = 'Tên và Giá phải hợp lệ!';
            return; 
        }
        errorMsg.textContent = ''; 

        // 3. Tạo đối tượng (OBJECT), không tạo HTML
        const newProduct = {
            id: Date.now(), // Tạo ID duy nhất bằng timestamp
            name: name,
            price: Number(price),
            author: author,
            description: description,
            image: image
        };

        // 4. Thêm sản phẩm mới vào mảng
        allProducts.push(newProduct);
        
        // 5. === BÀI 5: LƯU VÀO STORAGE ===
        saveProductsToStorage(allProducts);
        
        // 6. "Vẽ" lại toàn bộ danh sách
        renderProducts(allProducts);
        
        // 7. Dọn dẹp
        addProductForm.reset(); 
        addProductForm.classList.add('hidden'); 
    });
    // ===============================================
    // === BÀI 3: ẨN/HIỆN FORM (Giữ nguyên)
    // ===============================================
    addProductBtn.addEventListener('click', () => {
        addProductForm.classList.remove('hidden'); 
    });
    cancelBtn.addEventListener('click', () => {
        addProductForm.classList.add('hidden'); 
        errorMsg.textContent = ''; 
        addProductForm.reset(); 
    });
    // ===============================================
    // === BÀI 5: KHỞI TẠO ỨNG DỤNG
    // ===============================================
    // Hàm này chạy ngay khi trang được tải
    function initializeApp() {
        // "Vẽ" các sản phẩm lấy từ localStorage
        renderProducts(allProducts);
    }
    initializeApp();
});