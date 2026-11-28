const halamanKeranjang = ambilElemen("[data-cart-page]");
let daftarKeranjang = null;
let voucherAktif = null;
let diskonKeranjang = 0;

const DAFTAR_VOUCHER = {
  "HAZEL10": { type: "percent", value: 10, label: "Diskon 10%" },
  "HAZEL20": { type: "percent", value: 20, label: "Diskon 20%" },
  "HAZEL50": { type: "fixed", value: 50000, label: "Potongan Rp 50.000" },
  "HEMAT25": { type: "fixed", value: 25000, label: "Potongan Rp 25.000" }
};

function hitungSubtotalKeranjang() {
  let subtotal = 0;

  for (let i = 0; i < daftarKeranjang.length; i++) {
    if (daftarKeranjang[i].checked !== false) {
      subtotal = subtotal + (daftarKeranjang[i].price * daftarKeranjang[i].qty);
    }
  }

  return subtotal;
}

function perbaruiRingkasanKeranjang() {
  let subtotal = hitungSubtotalKeranjang();
  diskonKeranjang = 0;

  if (voucherAktif !== null && subtotal > 0) {
    if (voucherAktif.type === "percent") {
      diskonKeranjang = Math.round(subtotal * (voucherAktif.value / 100));
    } else {
      diskonKeranjang = voucherAktif.value;
      if (diskonKeranjang > subtotal) {
        diskonKeranjang = subtotal;
      }
    }
  }

  let total = subtotal - diskonKeranjang;
  if (total < 0) {
    total = 0;
  }

  const elemenSubtotal = ambilElemen("[data-subtotal]");
  const elemenDiskon = ambilElemen("[data-discount]");
  const elemenTotal = ambilElemen("[data-total]");

  if (elemenSubtotal !== null) {
    elemenSubtotal.textContent = formatRupiah(subtotal);
  }

  if (elemenDiskon !== null) {
    if (diskonKeranjang > 0) {
      elemenDiskon.textContent = "Rp -" + diskonKeranjang.toLocaleString("id-ID");
    } else {
      elemenDiskon.textContent = "Rp -00.000";
    }
  }

  if (elemenTotal !== null) {
    elemenTotal.textContent = formatRupiah(total);
  }
}

function pasangAksiItemKeranjang() {
  let wadah = ambilElemen("[data-cart-list]");
  if (wadah === null) {
    return;
  }

  const kotakCentang = wadah.querySelectorAll("[data-item-check]");
  for (let i = 0; i < kotakCentang.length; i++) {
    kotakCentang[i].addEventListener("change", function () {
      let indeks = parseInt(this.getAttribute("data-index"), 10);
      if (daftarKeranjang[indeks]) {
        daftarKeranjang[indeks].checked = this.checked;
        simpanKeranjang(daftarKeranjang);
        perbaruiRingkasanKeranjang();
      }
    });
  }

  const tombolKurang = wadah.querySelectorAll("[data-item-minus]");
  for (let j = 0; j < tombolKurang.length; j++) {
    tombolKurang[j].addEventListener("click", function () {
      let indeks = parseInt(this.getAttribute("data-index"), 10);
      let item = daftarKeranjang[indeks];

      if (item && item.qty > 1) {
        item.qty = item.qty - 1;
        renderDaftarKeranjang();
      }
    });
  }

  const tombolTambah = wadah.querySelectorAll("[data-item-plus]");
  for (let k = 0; k < tombolTambah.length; k++) {
    tombolTambah[k].addEventListener("click", function () {
      let indeks = parseInt(this.getAttribute("data-index"), 10);
      let item = daftarKeranjang[indeks];

      if (item && item.qty < 99) {
        item.qty = item.qty + 1;
        renderDaftarKeranjang();
      }
    });
  }

  const tombolHapus = wadah.querySelectorAll("[data-item-remove]");
  for (let m = 0; m < tombolHapus.length; m++) {
    tombolHapus[m].addEventListener("click", function () {
      let indeks = parseInt(this.getAttribute("data-index"), 10);
      let item = daftarKeranjang[indeks];

      if (item) {
        const namaDihapus = item.name;
        daftarKeranjang.splice(indeks, 1);
        renderDaftarKeranjang();
        tampilkanToast(namaDihapus + " dihapus dari keranjang");
      }
    });
  }
}

function renderDaftarKeranjang() {
  let wadah = ambilElemen("[data-cart-list]");
  const wadahKosong = ambilElemen("[data-cart-empty]");

  simpanKeranjang(daftarKeranjang);
  perbaruiJumlahKeranjang();

  if (wadah === null) {
    return;
  }

  if (daftarKeranjang.length === 0) {
    wadah.innerHTML = "";
    wadah.hidden = true;
    if (wadahKosong !== null) {
      wadahKosong.hidden = false;
    }
    perbaruiRingkasanKeranjang();
    return;
  }

  wadah.hidden = false;
  if (wadahKosong !== null) {
    wadahKosong.hidden = true;
  }

  let html = "";

  for (let i = 0; i < daftarKeranjang.length; i++) {
    let item = daftarKeranjang[i];
    const dicentang = item.checked !== false;

    let teksUkuran = item.size;
    if (item.size.indexOf("Toples") !== 0) {
      teksUkuran = "Toples " + item.size;
    }

    html += '<article class="cart-item" data-index="' + i + '">';
    html += '  <div class="cart-item-top">';
    html += '    <label class="cart-check">';
    html += '      <input type="checkbox" data-index="' + i + '" data-item-check';

    if (dicentang) {
      html += ' checked';
    }

    html += ' aria-label="Pilih ' + escapeHtml(item.name) + '">';
    html += '      <span class="cart-checkbox"><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg></span>';
    html += '    </label>';
    html += '    <a class="cart-item-img" href="produk.html?p=' + encodeURIComponent(item.slug) + '">';
    html += '      <img src="images/' + escapeHtml(item.slug) + '.jpg" alt="' + escapeHtml(item.name) + '">';
    html += '    </a>';
    html += '    <div class="cart-item-info">';
    html += '      <h2 class="cart-item-name"><a href="produk.html?p=' + encodeURIComponent(item.slug) + '">' + escapeHtml(item.name) + '</a></h2>';
    html += '      <p class="cart-item-size">' + escapeHtml(teksUkuran) + '</p>';
    html += '      <p class="cart-item-price">' + formatRupiah(item.price) + '</p>';
    html += '    </div>';
    html += '  </div>';
    html += '  <div class="cart-item-bottom">';
    html += '    <div class="cart-qty">';
    html += '      <button type="button" aria-label="Kurangi jumlah" data-index="' + i + '" data-item-minus>&minus;</button>';
    html += '      <span>' + item.qty + '</span>';
    html += '      <button type="button" aria-label="Tambah jumlah" data-index="' + i + '" data-item-plus>+</button>';
    html += '    </div>';
    html += '    <button type="button" class="cart-remove" data-index="' + i + '" data-item-remove>Hapus</button>';
    html += '  </div>';
    html += '</article>';
  }

  wadah.innerHTML = html;
  pasangAksiItemKeranjang();
  perbaruiRingkasanKeranjang();
}

if (halamanKeranjang !== null) {
  daftarKeranjang = ambilKeranjang();

  if (daftarKeranjang === null) {
    daftarKeranjang = [];

    for (let i = 0; i < KERANJANG_AWAL.length; i++) {
      daftarKeranjang.push(salinObject(KERANJANG_AWAL[i]));
    }

    simpanKeranjang(daftarKeranjang);
  }

  const formVoucher = ambilElemen("[data-voucher-form]");
  const inputVoucher = document.getElementById("voucher-input");

  if (formVoucher !== null && inputVoucher !== null) {
    formVoucher.addEventListener("submit", function (event) {
      event.preventDefault();

      const kode = inputVoucher.value.trim().toUpperCase();

      if (kode === "") {
        voucherAktif = null;
        perbaruiRingkasanKeranjang();
        tampilkanToast("Masukkan kode voucher terlebih dahulu");
        return;
      }

      if (DAFTAR_VOUCHER[kode]) {
        voucherAktif = DAFTAR_VOUCHER[kode];
        perbaruiRingkasanKeranjang();
        tampilkanToast("Voucher " + kode + " berhasil digunakan (" + voucherAktif.label + ")");
      } else {
        voucherAktif = null;
        perbaruiRingkasanKeranjang();
        tampilkanToast("Kode voucher tidak valid (coba: HAZEL10)");
      }
    });
  }

  const tombolCheckoutKeranjang = ambilElemen("[data-cart-checkout]");

  if (tombolCheckoutKeranjang !== null) {
    tombolCheckoutKeranjang.addEventListener("click", function () {
      const itemDipilih = [];

      for (let j = 0; j < daftarKeranjang.length; j++) {
        if (daftarKeranjang[j].checked !== false) {
          itemDipilih.push(daftarKeranjang[j]);
        }
      }

      if (itemDipilih.length === 0) {
        tampilkanToast("Pilih minimal 1 produk untuk checkout");
        return;
      }

      const dataCheckout = {
        items: itemDipilih,
        discount: diskonKeranjang
      };

      localStorage.setItem("hb_checkout", JSON.stringify(dataCheckout));

      window.location.href = "checkout.html";
    });
  }

  renderDaftarKeranjang();
}
