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
    const STORAGE_KEY = 'myDVDStoreProducts'; 
    let allProducts = []; // Khởi tạo mảng rỗng

    function getProductsFromStorage() {
        const productsJSON = localStorage.getItem(STORAGE_KEY);
        return productsJSON ? JSON.parse(productsJSON) : [];
    }

    function saveProductsToStorage(products) {
        const productsJSON = JSON.stringify(products);
        localStorage.setItem(STORAGE_KEY, productsJSON);
    }
    function renderProducts(products) {
        productContainer.innerHTML = ''; 
        if (products.length === 0) {
            productContainer.innerHTML = '<p style="width: 100%; text-align: center; color: #777;">Chưa có DVD nào. Hãy thêm sản phẩm đầu tiên!</p>';
            return;
        }
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
            productContainer.appendChild(newItem);
        });
    }


    
    searchInput.addEventListener('keyup', (e) => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = allProducts.filter(product => {
            return product.name.toLowerCase().includes(searchTerm);
        });
        renderProducts(filteredProducts);
    });

    
    addProductForm.addEventListener('submit', (event) => {
        event.preventDefault(); 
        const name = document.getElementById('newName').value.trim();
        const price = document.getElementById('newPrice').value.trim();
        const author = document.getElementById('newAuthor').value.trim() || 'Không rõ tác giả';
        const description = document.getElementById('newDescription').value.trim() || 'Chưa có mô tả';
        const image = document.getElementById('newImage').value.trim();
        if (name === '' || isNaN(price) || Number(price) <= 0) {
            errorMsg.textContent = 'Tên và Giá phải hợp lệ!';
            return; 
        }
        errorMsg.textContent = ''; 
        const newProduct = {
            id: Date.now(), 
            name: name,
            price: Number(price),
            author: author,
            description: description,
            image: image
        };
        allProducts.push(newProduct);
        saveProductsToStorage(allProducts);
        renderProducts(allProducts);
        addProductForm.reset(); 
        addProductForm.classList.add('hidden'); 
    });

    addProductBtn.addEventListener('click', () => {
        addProductForm.classList.remove('hidden'); 
    });
    
    cancelBtn.addEventListener('click', () => {
        addProductForm.classList.add('hidden'); 
        errorMsg.textContent = ''; 
        addProductForm.reset(); 
    });

    
    // Thêm 'async' để có thể dùng 'await' bên trong
    async function initializeApp() {
        // 1. (Bài 5) Thử lấy dữ liệu từ LocalStorage trước
        let productsFromStorage = getProductsFromStorage();
        
        if (productsFromStorage.length > 0) {
            // Nếu có, gán vào mảng chính và dùng luôn
            allProducts = productsFromStorage;
            console.log('Đã tải dữ liệu từ LocalStorage.');
        } else {
            // 2. (Bài 6) Nếu LocalStorage trống, dùng Fetch
            console.log('LocalStorage trống. Đang tải từ file products.json...');
            try {
                // Tải file JSON 
                const response = await fetch('./products.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const initialProducts = await response.json();
                
                // Gán dữ liệu vừa tải vào mảng chính
                allProducts = initialProducts;
                
                // (Bài 5) Lưu dữ liệu này vào LocalStorage cho lần sau [cite: 497]
                saveProductsToStorage(allProducts);
                console.log('Đã tải từ file JSON và lưu vào LocalStorage.');

            } catch (error) {
                console.error('Không thể tải dữ liệu ban đầu:', error);
                productContainer.innerHTML = '<p style="color: red;">Lỗi: Không thể tải danh sách sản phẩm.</p>';
            }
        }

        // 3. "Vẽ" ra màn hình (dù dữ liệu từ đâu)
        renderProducts(allProducts);
    }
    // Chạy hàm!
    initializeApp();
});