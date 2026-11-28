const halamanCheckout = ambilElemen("[data-checkout-page]");

let itemCheckout = [
  { slug: "kue-mpit", name: "Kue Mpit", size: "350 Gram", qty: 1, price: 125000 },
  { slug: "kue-kacang-cokelat", name: "Kue Kacang Cokelat", size: "350 Gram", qty: 1, price: 125000 }
];

let diskonCheckout = 0;
let ongkirCheckout = 10000;
let kurirDipilih = "Cash On Delivery";

function renderCheckout() {
  let jumlahItem = 0;

  for (let i = 0; i < itemCheckout.length; i++) {
    let qty = itemCheckout[i].qty;
    if (!qty) {
      qty = 1;
    }
    jumlahItem = jumlahItem + qty;
  }

  const elemenJumlah = ambilElemen("[data-order-count]");
  if (elemenJumlah !== null) {
    elemenJumlah.textContent = "" + jumlahItem;
  }

  const wadahItem = ambilElemen("[data-order-items]");
  if (wadahItem !== null) {
    let htmlItem = "";

    for (let j = 0; j < itemCheckout.length; j++) {
      const item = itemCheckout[j];
      let q = item.qty;
      if (!q) {
        q = 1;
      }

      const totalBaris = item.price * q;
      let meta = "";

      if (q > 1) {
        meta = '<span class="order-item-meta">' + q + " × " + formatRupiah(item.price);
        if (item.size) {
          meta = meta + " (" + escapeHtml(item.size) + ")";
        }
        meta = meta + "</span>";
      }

      htmlItem += '<div class="order-item">';
      htmlItem += '  <img src="images/' + escapeHtml(item.slug) + '.jpg" alt="' + escapeHtml(item.name) + '">';
      htmlItem += '  <div class="order-item-info">';
      htmlItem += '    <h3>' + escapeHtml(item.name) + '</h3>';
      htmlItem += '    <p>' + formatRupiah(totalBaris) + '</p>';
      htmlItem += '    ' + meta;
      htmlItem += '  </div>';
      htmlItem += '</div>';
    }

    wadahItem.innerHTML = htmlItem;
  }

  let subtotal = 0;
  for (let k = 0; k < itemCheckout.length; k++) {
    let jumlah = itemCheckout[k].qty;
    if (!jumlah) {
      jumlah = 1;
    }
    subtotal = subtotal + (itemCheckout[k].price * jumlah);
  }

  let diskon = diskonCheckout;
  if (diskon > subtotal) {
    diskon = subtotal;
  }

  let total = subtotal - diskon + ongkirCheckout;
  if (total < 0) {
    total = 0;
  }

  const elemenSubtotal = ambilElemen("[data-co-subtotal]");
  const elemenOngkir = ambilElemen("[data-co-shipping]");
  const barisDiskon = ambilElemen("[data-co-discount-row]");
  const elemenDiskon = ambilElemen("[data-co-discount]");
  const elemenTotal = ambilElemen("[data-co-total]");

  if (elemenSubtotal !== null) {
    elemenSubtotal.textContent = formatRupiah(subtotal);
  }

  if (elemenOngkir !== null) {
    if (ongkirCheckout === 0) {
      elemenOngkir.textContent = "Gratis";
    } else {
      elemenOngkir.textContent = formatRupiah(ongkirCheckout);
    }
  }

  if (barisDiskon !== null && elemenDiskon !== null) {
    if (diskon > 0) {
      barisDiskon.hidden = false;
      elemenDiskon.textContent = "Rp -" + diskon.toLocaleString("id-ID");
    } else {
      barisDiskon.hidden = true;
    }
  }

  if (elemenTotal !== null) {
    elemenTotal.textContent = formatRupiah(total);
  }
}

function pasangPilihanKurir() {
  const kartuKurir = ambilSemuaElemen(".courier-card");

  for (let i = 0; i < kartuKurir.length; i++) {
    kartuKurir[i].addEventListener("click", function () {
      for (let j = 0; j < kartuKurir.length; j++) {
        kartuKurir[j].classList.remove("is-active");
        kartuKurir[j].setAttribute("aria-checked", "false");
      }

      this.classList.add("is-active");
      this.setAttribute("aria-checked", "true");

      let namaKurir = this.getAttribute("data-courier");
      if (namaKurir === null) {
        namaKurir = "Cash On Delivery";
      }
      kurirDipilih = namaKurir;

      let biaya = parseInt(this.getAttribute("data-shipping"), 10);
      if (isNaN(biaya)) {
        biaya = 0;
      }
      ongkirCheckout = biaya;

      renderCheckout();
    });
  }
}

if (halamanCheckout !== null) {

  const dataCheckout = JSON.parse(localStorage.getItem("hb_checkout") || "null");

  if (dataCheckout !== null && dataCheckout.items && dataCheckout.items.length > 0) {
    itemCheckout = dataCheckout.items;
    diskonCheckout = parseInt(dataCheckout.discount, 10);
    if (isNaN(diskonCheckout)) {
      diskonCheckout = 0;
    }
  } else {
    const isiKeranjang = ambilKeranjang();

    if (isiKeranjang !== null) {
      const itemDipilih = [];
      for (let i = 0; i < isiKeranjang.length; i++) {
        if (isiKeranjang[i].checked !== false) {
          itemDipilih.push(isiKeranjang[i]);
        }
      }

      if (itemDipilih.length > 0) {
        itemCheckout = itemDipilih;
      }
    }
  }

  const tombolUbahAlamat = ambilElemen("[data-edit-address]");
  const teksAlamat = ambilElemen("[data-address-text]");
  const formAlamat = ambilElemen("[data-address-form]");
  const inputAlamat = ambilElemen("[data-address-input]");

  const alamatTersimpan = localStorage.getItem("hb_address");
  if (alamatTersimpan !== null && teksAlamat !== null && inputAlamat !== null) {
    teksAlamat.textContent = alamatTersimpan;
    inputAlamat.value = alamatTersimpan;
  }

  if (tombolUbahAlamat !== null && formAlamat !== null && teksAlamat !== null && inputAlamat !== null) {
    tombolUbahAlamat.addEventListener("click", function () {
      if (formAlamat.hidden === true) {
        formAlamat.hidden = false;
        teksAlamat.hidden = true;
        tombolUbahAlamat.textContent = "Batal";
        inputAlamat.focus();
      } else {
        formAlamat.hidden = true;
        teksAlamat.hidden = false;
        tombolUbahAlamat.textContent = "Ubah";
      }
    });

    formAlamat.addEventListener("submit", function (event) {
      event.preventDefault();

      const alamatBaru = inputAlamat.value.trim();
      if (alamatBaru === "") {
        tampilkanToast("Alamat pengiriman tidak boleh kosong");
        return;
      }

      teksAlamat.textContent = alamatBaru;
      formAlamat.hidden = true;
      teksAlamat.hidden = false;
      tombolUbahAlamat.textContent = "Ubah";

      localStorage.setItem("hb_address", alamatBaru);

      tampilkanToast("Alamat pengiriman diperbarui");
    });
  }

  pasangPilihanKurir();

  const tombolBayar = ambilElemen("[data-pay-btn]");

  if (tombolBayar !== null) {
    tombolBayar.addEventListener("click", function () {
      const dataPembayaran = {
        orderId: "#ORD-0234",
        items: itemCheckout,
        discount: diskonCheckout,
        shipping: ongkirCheckout,
        courier: kurirDipilih
      };

      localStorage.setItem("hb_payment_order", JSON.stringify(dataPembayaran));

      window.location.href = "pembayaran.html";
    });
  }

  renderCheckout();
}
