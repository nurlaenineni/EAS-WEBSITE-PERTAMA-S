let cart = [];

function addToCart(name, price) {
    let existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCart();
}

function updateCart() {
    let cartList = document.getElementById("cart");
    let total = 0;
    cartList.innerHTML = "";

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        cartList.innerHTML += `<li>
            ${item.name} - Rp ${item.price} x ${item.quantity}
            <button class='btn' onclick="increaseQuantity(${index})">+</button>
            <button class='btn' onclick="decreaseQuantity(${index})">-</button>
            <button class='btn' onclick="removeItem(${index})">Hapus</button>
        </li>`;
    });

    document.getElementById("total").innerText = total;


}

function increaseQuantity(index) {
    cart[index].quantity++;
    updateCart();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }
    updateCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

function checkout() {
    if (cart.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }

    function checkout() {
        let total = document.getElementById("total").innerText;
    
        fetch("/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ total: total })
        })
        .then(response => response.json())
        .then(data => alert(data.message))
        .catch(error => console.error("Error:", error));
    }
    
    let paymentMethod = document.getElementById("payment-method").value;
    if (!paymentMethod) {
        alert("Silakan pilih metode pembayaran terlebih dahulu!");
        return;
    }

    let totalHarga = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    let confirmCheckout = confirm("Total yang harus dibayar: Rp " + totalHarga.toLocaleString() + 
                                  "\nMetode Pembayaran: " + paymentMethod + 
                                  "\nLanjutkan pembayaran?");

    if (!confirmCheckout) {
        return;
    }

    // Simpan data ke localStorage (Riwayat Transaksi)
    let transaksiSebelumnya = JSON.parse(localStorage.getItem("riwayatTransaksi")) || [];
    let transaksiBaru = {
        tanggal: new Date().toLocaleString(),
        pesanan: cart,
        metodePembayaran: paymentMethod,
        totalHarga: totalHarga
    };

    transaksiSebelumnya.push(transaksiBaru);
    localStorage.setItem("riwayatTransaksi", JSON.stringify(transaksiSebelumnya));

    // Hapus keranjang setelah checkout
    localStorage
    
    // Simpan pesanan dan metode pembayaran tanpa menghapus data produk
    localStorage.setItem("metodePembayaran", paymentMethod);{

    }

    alert("Pembayaran berhasil! Pesanan Anda Telah Dicatat dengan metode: " + paymentMethod); 

    localStorage.setItem("pesanan", JSON.stringify(cart)); 
    cart = [];
    updateCart();
}

function searchProduct() {
    let searchValue = document.getElementById("search").value.toLowerCase();
    let items = document.querySelectorAll(".item");
    items.forEach(item => {
        let name = item.getAttribute("data-name").toLowerCase();
        item.style.display = name.includes(searchValue) ? "flex" : "none";
    });
}

// Perbaikan Fungsi Pencarian Produk
function searchProduct() {
    let searchValue = document.getElementById("search").value.toLowerCase();
    let items = document.querySelectorAll(".item");

    items.forEach(item => {
        let name = item.querySelector(".product-name").innerText.toLowerCase(); // Mengambil teks produk
        if (name.includes(searchValue)) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
}

function tampilkanKontak() {
    let kontakContainer = document.getElementById("kontak-container");
    kontakContainer.style.display = kontakContainer.style.display === "none" ? "block" : "none";
}


function printReceipt() {
    let cartData = localStorage.getItem("pesanan");
    
    if (cart.length === 0) {
        alert("Tidak ada pesanan untuk dicetak!");
        return;
    }

    let paymentMethod = localStorage.getItem("metodePembayaran") || "Tunai";
    let receiptWindow = window.open("", "", "width=600,height=600");
    
    receiptWindow.document.write("<html><head><title>Struk Pemesanan</title>");
    receiptWindow.document.write("<style>");
    receiptWindow.document.write("body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }");
    receiptWindow.document.write("h2 { color: #d35400; }");
    receiptWindow.document.write("table { width: 100%; border-collapse: collapse; margin-top: 20px; }");
    receiptWindow.document.write("th, td { border: 1px solid black; padding: 10px; text-align: left; }");
    receiptWindow.document.write("th { background-color: #f4a261; color: white; }");
    receiptWindow.document.write("</style></head><body>");

    receiptWindow.document.write("<h2>Struk Pemesanan</h2>");
    receiptWindow.document.write("<p>Toko Jivana Cookies</p>");
    receiptWindow.document.write("<p>Tanggal: " + new Date().toLocaleString() + "</p>");
    receiptWindow.document.write("<p>Metode Pembayaran: <strong>" + paymentMethod + "</strong></p>");

    receiptWindow.document.write("<table>");
    receiptWindow.document.write("<tr><th>Produk</th><th>Qty</th><th>Harga</th><th>Subtotal</th></tr>");

    let totalHarga = 0;
    cart.forEach(item => {
        let subtotal = item.price * item.quantity;
        totalHarga += subtotal;
        receiptWindow.document.write(
            `<tr><td>${item.name}</td><td>${item.quantity}</td><td>Rp ${item.price.toLocaleString()}</td><td>Rp ${subtotal.toLocaleString()}</td></tr>`
        );
    });

    receiptWindow.document.write("</table>");
    receiptWindow.document.write("<h3>Total: Rp " + totalHarga.toLocaleString() + "</h3>");
    receiptWindow.document.write("<p>Terima kasih telah berbelanja di Jivana Cookies Kami!🍪💕 Kami sangat menghargai kepercayaan Anda dan berharap setiap gigitan membawa kebahagiaan. Jangan ragu untuk kembali dan mencoba varian lezat lainnya. Sampai jumpa di pembelian berikutnya! 😊✨</p>");

    receiptWindow.document.write("</body></html>");
    receiptWindow.document.close();
    receiptWindow.print();
}
