function cafeApp() {
  return {
    search: "",
    openCart: false,
    cart: [],
    menu: [],

    async init() {
      try {
        const response = await fetch("/data/menu.json");
        this.menu = await response.json();
      } catch (error) {
        console.error("Gagal memuat menu:", error);
        // Fallback jika data belum ada (Data awal)
        this.menu = [
          {
            id: 1,
            name: "Memuat Menu...",
            price: 0,
            stock: 0,
            desc: "Mohon tunggu...",
            image: "",
          },
        ];
      }
    },

    get filteredMenu() {
      return this.menu.filter((i) =>
        i.name.toLowerCase().includes(this.search.toLowerCase()),
      );
    },

    get cartTotal() {
      return this.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    },

    addToCart(item) {
      let found = this.cart.find((c) => c.id === item.id);
      if (found) {
        if (found.qty < item.stock) found.qty++;
        else alert("Stok habis!");
      } else {
        this.cart.push({ ...item, qty: 1 });
      }
      this.openCart = true;
    },

    updateQty(index, delta) {
      let item = this.cart[index];
      let originalItem = this.menu.find((m) => m.id === item.id);
      item.qty += delta;
      if (item.qty <= 0) this.cart.splice(index, 1);
      else if (item.qty > originalItem.stock) item.qty = originalItem.stock;
    },

    formatRupiah(val) {
      return "Rp " + val.toLocaleString("id-ID");
    },

    checkoutWhatsApp() {
      if (this.cart.length === 0) return;
      const noWA = "6285185905925";
      let text = "*PESANAN BARU*%0A";
      this.cart.forEach((item) => {
        text += `- ${item.name} (x${item.qty})%0A`;
      });
      text += `%0A*Total: ${this.formatRupiah(this.cartTotal)}*`;
      window.open(`https://wa.me/${noWA}?text=${text}`, "_blank");
    },
  };
}
