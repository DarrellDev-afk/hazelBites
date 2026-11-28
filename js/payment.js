const halamanPembayaran = ambilElemen("[data-payment-page]");
let metodeAktif = "va";

function gantiMetodePembayaran(metode) {
  metodeAktif = metode;

  const tabMetode = ambilSemuaElemen("[data-pay-method]");
  for (let i = 0; i < tabMetode.length; i++) {
    if (tabMetode[i].getAttribute("data-pay-method") === metode) {
      tabMetode[i].classList.add("is-active");
      tabMetode[i].setAttribute("aria-selected", "true");
    } else {
      tabMetode[i].classList.remove("is-active");
      tabMetode[i].setAttribute("aria-selected", "false");
    }
  }

  const panelMetode = ambilSemuaElemen("[data-pay-panel]");
  for (let j = 0; j < panelMetode.length; j++) {
    if (panelMetode[j].getAttribute("data-pay-panel") === metode) {
      panelMetode[j].hidden = false;
    } else {
      panelMetode[j].hidden = true;
    }
  }
}

function perbaruiPilihanOpsi(namaRadio) {
  const semuaRadio = ambilSemuaElemen('input[name="' + namaRadio + '"]');

  for (let i = 0; i < semuaRadio.length; i++) {
    const label = semuaRadio[i].parentNode;

    if (semuaRadio[i].checked) {
      label.classList.add("is-selected");
    } else {
      label.classList.remove("is-selected");
    }
  }
}

function buatQrisSvg() {
  let ukuran = 25;
  let kotak = "";
  const posisiFinder = [
    [1, 1],
    [ukuran - 6, 1],
    [1, ukuran - 6]
  ];

  for (let r = 0; r < ukuran; r++) {
    for (let c = 0; c < ukuran; c++) {
      const areaFinder = (r < 7 && c < 7) || (r < 7 && c >= ukuran - 7) || (r >= ukuran - 7 && c < 7);

      if (areaFinder) {
        continue;
      }

      const nilai = (r * 31 + c * 17 + (r ^ c) * 13) % 11;

      if (nilai < 5 || (r === 6 && c % 2 === 0) || (c === 6 && r % 2 === 0)) {
        kotak += '<rect x="' + (c + 1) + '" y="' + (r + 1) + '" width="1" height="1" fill="#1a1410"/>';
      }
    }
  }

  let finder = "";

  for (let f = 0; f < posisiFinder.length; f++) {
    let x = posisiFinder[f][0];
    let y = posisiFinder[f][1];

    finder += '<rect x="' + x + '" y="' + y + '" width="7" height="7" fill="none" stroke="#1a1410" stroke-width="1"/>';
    finder += '<rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="3" height="3" fill="#1a1410"/>';
  }

  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + (ukuran + 2) + ' ' + (ukuran + 2) + '" shape-rendering="crispEdges">' +
    '<rect width="100%" height="100%" fill="#ffffff"/>' + finder + kotak + '</svg>';
}

function duaAngka(angka) {
  if (angka < 10) {
    return "0" + angka;
  }
  return "" + angka;
}

if (halamanPembayaran !== null) {

  const tabPembayaran = ambilSemuaElemen("[data-pay-method]");

  for (let i = 0; i < tabPembayaran.length; i++) {
    tabPembayaran[i].addEventListener("click", function () {
      const metode = this.getAttribute("data-pay-method");
      gantiMetodePembayaran(metode);
    });
  }

  const radioBank = ambilSemuaElemen('input[name="va_bank"]');

  for (let j = 0; j < radioBank.length; j++) {
    radioBank[j].addEventListener("change", function () {
      perbaruiPilihanOpsi("va_bank");

      const tampilanVA = ambilElemen("[data-va-display]");
      let nomorVA = this.getAttribute("data-va-number");

      if (tampilanVA !== null && nomorVA !== null) {
        tampilanVA.textContent = nomorVA;
      }
    });
  }

  const tombolSalinVA = ambilElemen("[data-copy-va]");
  const tampilanVAUtama = ambilElemen("[data-va-display]");

  if (tombolSalinVA !== null && tampilanVAUtama !== null) {
    tombolSalinVA.addEventListener("click", function () {
      let nomorVA = tampilanVAUtama.textContent.trim();

      const inputSementara = document.createElement("textarea");
      inputSementara.value = nomorVA;
      document.body.appendChild(inputSementara);
      inputSementara.select();
      document.execCommand("copy");
      inputSementara.remove();

      tampilkanToast("Nomor Virtual Account (" + nomorVA + ") disalin");
    });
  }

  const radioEwallet = ambilSemuaElemen('input[name="ewallet_app"]');

  for (let k = 0; k < radioEwallet.length; k++) {
    radioEwallet[k].addEventListener("change", function () {
      perbaruiPilihanOpsi("ewallet_app");
    });
  }

  const kotakQris = ambilElemen("[data-qris-box]");

  if (kotakQris !== null) {
    kotakQris.innerHTML = buatQrisSvg();
  }

  const tombolUnduhQr = ambilElemen("[data-download-qr]");

  if (tombolUnduhQr !== null && kotakQris !== null) {
    tombolUnduhQr.addEventListener("click", function () {
      const isiSvg = kotakQris.innerHTML;
      const dataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(isiSvg);

      const tautan = document.createElement("a");
      tautan.setAttribute("href", dataUrl);
      tautan.setAttribute("download", "QRIS-Hazel-Bites.svg");
      document.body.appendChild(tautan);
      tautan.click();
      tautan.remove();

      tampilkanToast("Kode QRIS berhasil diunduh");
    });
  }

  const dataPembayaran = {
    orderId: "#ORD-0234",
    items: [
      { slug: "kue-mpit", name: "Kue Mpit", size: "300g", qty: 1, price: 125000 },
      { slug: "kue-kacang-cokelat", name: "Kue Kacang Cokelat", size: "300g", qty: 1, price: 125000 }
    ],
    discount: 0,
    shipping: 10000
  };

  const pesananTersimpan = JSON.parse(localStorage.getItem("hb_payment_order") || "null");

  if (pesananTersimpan !== null && pesananTersimpan.items && pesananTersimpan.items.length > 0) {
    dataPembayaran.orderId = pesananTersimpan.orderId;
    if (!dataPembayaran.orderId) {
      dataPembayaran.orderId = "#ORD-0234";
    }

    dataPembayaran.items = pesananTersimpan.items;
    dataPembayaran.discount = parseInt(pesananTersimpan.discount, 10);
    if (isNaN(dataPembayaran.discount)) {
      dataPembayaran.discount = 0;
    }

    dataPembayaran.shipping = parseInt(pesananTersimpan.shipping, 10);
    if (isNaN(dataPembayaran.shipping)) {
      dataPembayaran.shipping = 10000;
    }
  }

  const elemenOrderId = ambilElemen("[data-pay-order-id]");
  if (elemenOrderId !== null) {
    elemenOrderId.textContent = dataPembayaran.orderId;
  }

  const wadahItemBayar = ambilElemen("[data-pay-items]");
  if (wadahItemBayar !== null) {
    let htmlItemBayar = "";

    for (let m = 0; m < dataPembayaran.items.length; m++) {
      const itemBayar = dataPembayaran.items[m];
      let qtyBayar = itemBayar.qty;
      if (!qtyBayar) {
        qtyBayar = 1;
      }

      let ukuran = "300g";
      if (itemBayar.size) {
        ukuran = ubahKeGram(itemBayar.size);
      }

      htmlItemBayar += '<div class="pay-order-item">';
      htmlItemBayar += '  <img src="images/' + escapeHtml(itemBayar.slug) + '.jpg" alt="' + escapeHtml(itemBayar.name) + '">';
      htmlItemBayar += '  <div class="pay-order-info">';
      htmlItemBayar += '    <h3>' + escapeHtml(itemBayar.name) + '</h3>';
      htmlItemBayar += '    <p>' + qtyBayar + 'x Toples ' + escapeHtml(ukuran) + '</p>';
      htmlItemBayar += '  </div>';
      htmlItemBayar += '  <span class="pay-order-price">' + formatRupiah(itemBayar.price * qtyBayar) + '</span>';
      htmlItemBayar += '</div>';
    }

    wadahItemBayar.innerHTML = htmlItemBayar;
  }

  let subtotalBayar = 0;

  for (let n = 0; n < dataPembayaran.items.length; n++) {
    let jumlahBayar = dataPembayaran.items[n].qty;
    if (!jumlahBayar) {
      jumlahBayar = 1;
    }
    subtotalBayar = subtotalBayar + (dataPembayaran.items[n].price * jumlahBayar);
  }

  const biayaAdmin = 1000;
  let diskonBayar = dataPembayaran.discount;
  if (diskonBayar > subtotalBayar) {
    diskonBayar = subtotalBayar;
  }

  let totalBayar = subtotalBayar - diskonBayar + biayaAdmin + dataPembayaran.shipping;
  if (totalBayar < 0) {
    totalBayar = 0;
  }

  const elemenSubtotalBayar = ambilElemen("[data-pay-subtotal]");
  const elemenAdmin = ambilElemen("[data-pay-admin]");
  const elemenOngkirBayar = ambilElemen("[data-pay-shipping]");
  const barisDiskonBayar = ambilElemen("[data-pay-discount-row]");
  const elemenDiskonBayar = ambilElemen("[data-pay-discount]");
  const elemenTotalBayar = ambilElemen("[data-pay-total]");

  if (elemenSubtotalBayar !== null) {
    elemenSubtotalBayar.textContent = formatRupiah(subtotalBayar);
  }

  if (elemenAdmin !== null) {
    elemenAdmin.textContent = formatRupiah(biayaAdmin);
  }

  if (elemenOngkirBayar !== null) {
    if (dataPembayaran.shipping === 0) {
      elemenOngkirBayar.textContent = "Gratis";
    } else {
      elemenOngkirBayar.textContent = formatRupiah(dataPembayaran.shipping);
    }
  }

  if (barisDiskonBayar !== null && elemenDiskonBayar !== null) {
    if (diskonBayar > 0) {
      barisDiskonBayar.hidden = false;
      elemenDiskonBayar.textContent = "Rp -" + diskonBayar.toLocaleString("id-ID");
    } else {
      barisDiskonBayar.hidden = true;
    }
  }

  if (elemenTotalBayar !== null) {
    elemenTotalBayar.textContent = formatRupiah(totalBayar);
  }

  function ambilLabelMetodeAktif() {
    let labelMetode = "QRIS";

    if (metodeAktif === "va") {
      const bankDipilih = document.querySelector('input[name="va_bank"]:checked');
      if (bankDipilih !== null) {
        labelMetode = "Virtual Account " + bankDipilih.value;
      } else {
        labelMetode = "Virtual Account BCA";
      }
    } else if (metodeAktif === "ewallet") {
      const walletDipilih = document.querySelector('input[name="ewallet_app"]:checked');
      if (walletDipilih !== null) {
        labelMetode = "E-Wallet " + walletDipilih.value;
      } else {
        labelMetode = "E-Wallet DANA";
      }
    }

    return labelMetode;
  }

  function buatWaktuSekarang() {
    const daftarBulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const sekarang = new Date();
    let tanggalLengkap = sekarang.getDate() + " " + daftarBulan[sekarang.getMonth()] + " " + sekarang.getFullYear() + ", " +
      duaAngka(sekarang.getHours()) + ":" + duaAngka(sekarang.getMinutes()) + " WIB";
    let tanggalSaja = sekarang.getDate() + " " + daftarBulan[sekarang.getMonth()] + " " + sekarang.getFullYear();

    return {
      lengkap: tanggalLengkap,
      saja: tanggalSaja
    };
  }

  function arahkanKeGagal() {
    const waktuGagal = buatWaktuSekarang();
    const strukGagal = {
      orderId: dataPembayaran.orderId,
      method: ambilLabelMetodeAktif(),
      date: waktuGagal.lengkap,
      total: formatRupiah(totalBayar)
    };
    localStorage.setItem("hb_last_receipt", JSON.stringify(strukGagal));
    window.location.href = "pembayaran-gagal.html";
  }

  const elemenTimer = ambilElemen("[data-pay-timer]");

  if (elemenTimer !== null) {
    let sisaDetik = 23 * 3600 + 59 * 60 + 12;

    setInterval(function () {
      if (sisaDetik > 0) {
        sisaDetik = sisaDetik - 1;
      }

      const jam = Math.floor(sisaDetik / 3600);
      const menit = Math.floor((sisaDetik % 3600) / 60);
      const detik = sisaDetik % 60;

      elemenTimer.textContent = duaAngka(jam) + ":" + duaAngka(menit) + ":" + duaAngka(detik);

      if (sisaDetik === 0) {
        arahkanKeGagal();
      }
    }, 1000);
  }

  const tombolGagal = ambilElemen("[data-fail-pay]");

  if (tombolGagal !== null) {
    tombolGagal.addEventListener("click", function () {
      arahkanKeGagal();
    });
  }

  const tombolKonfirmasi = ambilElemen("[data-confirm-pay]");

  if (tombolKonfirmasi !== null) {
    tombolKonfirmasi.addEventListener("click", function () {
      if (metodeAktif === "ewallet") {
        const inputTelepon = ambilElemen("[data-ewallet-phone]");
        let nomorTelepon = "";

        if (inputTelepon !== null) {
          nomorTelepon = inputTelepon.value.trim();
        }

        if (nomorTelepon === "" || nomorTelepon.length < 9) {
          tampilkanToast("Masukkan nomor telepon e-wallet yang valid");
          if (inputTelepon !== null) {
            inputTelepon.focus();
          }
          return;
        }
      }

      let labelMetode = ambilLabelMetodeAktif();
      const waktuSekarang = buatWaktuSekarang();
      let tanggalLengkap = waktuSekarang.lengkap;
      let tanggalSaja = waktuSekarang.saja;

      const struk = {
        orderId: dataPembayaran.orderId,
        method: labelMetode,
        date: tanggalLengkap,
        total: formatRupiah(totalBayar)
      };
      localStorage.setItem("hb_last_receipt", JSON.stringify(struk));

      const pesananLama = JSON.parse(localStorage.getItem("hb_orders") || "null");

      if (pesananLama !== null && pesananLama.length !== undefined) {
        const itemPesananBaru = [];

        for (let p = 0; p < dataPembayaran.items.length; p++) {
          const itemLama = dataPembayaran.items[p];
          let qtyLama = itemLama.qty;
          if (!qtyLama) {
            qtyLama = 1;
          }

          let ukuranLama = "300g";
          if (itemLama.size) {
            ukuranLama = ubahKeGram(itemLama.size);
          }

          itemPesananBaru.push({
            slug: itemLama.slug,
            name: itemLama.name,
            qty: qtyLama,
            size: ukuranLama,
            price: itemLama.price
          });
        }

        const pesananBaru = {
          id: "ord-" + Date.now(),
          orderNo: dataPembayaran.orderId,
          date: tanggalSaja,
          status: "diproses",
          total: totalBayar,
          items: itemPesananBaru
        };

        pesananLama.unshift(pesananBaru);
        localStorage.setItem("hb_orders", JSON.stringify(pesananLama));
      }

      simpanKeranjang([]);
      localStorage.removeItem("hb_checkout");
      localStorage.removeItem("hb_payment_order");

      perbaruiJumlahKeranjang();
      window.location.href = "pembayaran-berhasil.html";
    });
  }
}
