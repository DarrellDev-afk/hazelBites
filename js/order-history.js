const halamanRiwayat = ambilElemen("[data-history-page]");
let daftarPesanan = [];
let statusRiwayatAktif = "semua";
let kataCariRiwayat = "";

const PESANAN_AWAL = [
  {
    id: "ord-p1",
    orderNo: "#ORD-12345",
    date: "11 September 2026",
    status: "diproses",
    total: 225000,
    items: [{ slug: "kue-mpit", name: "Kue Mpit", qty: 1, size: "750g", price: 225000 }]
  },
  {
    id: "ord-p2",
    orderNo: "#ORD-12345",
    date: "11 September 2026",
    status: "diproses",
    total: 125000,
    items: [{ slug: "kue-yaya", name: "Kue Yaya", qty: 1, size: "300g", price: 125000 }]
  },
  {
    id: "ord-p3",
    orderNo: "#ORD-12345",
    date: "11 September 2026",
    status: "diproses",
    total: 175000,
    items: [{ slug: "cookies-cokelat", name: "Cookies Cokelat", qty: 1, size: "500g", price: 175000 }]
  },
  {
    id: "ord-k1",
    orderNo: "#ORD-12345",
    date: "11 September 2026",
    status: "dikirim",
    total: 126000,
    items: [{ slug: "lidah-kucing-keju", name: "Lidah Kucing Keju", qty: 1, size: "750g", price: 126000 }]
  },
  {
    id: "ord-k2",
    orderNo: "#ORD-12345",
    date: "11 September 2026",
    status: "dikirim",
    total: 131000,
    items: [{ slug: "kastangel-keju", name: "Kastangel Keju", qty: 1, size: "300g", price: 131000 }]
  },
  {
    id: "ord-k3",
    orderNo: "#ORD-12345",
    date: "11 September 2026",
    status: "dikirim",
    total: 126000,
    items: [{ slug: "nastar-keju", name: "Nastar Keju", qty: 1, size: "300g", price: 126000 }]
  },
  {
    id: "ord-s1",
    orderNo: "#ORD-12345",
    date: "11 September 2026",
    status: "selesai",
    total: 911000,
    items: [
      { slug: "kue-yaya", name: "Kue Yaya Cokelat Kacang", qty: 1, size: "750g", price: 225000 },
      { slug: "pia-bulan", name: "Kue Sus Cokelat", qty: 3, size: "750g", price: 225000 }
    ]
  },
  {
    id: "ord-s2",
    orderNo: "#ORD-12345",
    date: "11 September 2026",
    status: "selesai",
    total: 451000,
    items: [
      { slug: "kurma-kacang", name: "Kue Kacang", qty: 1, size: "750g", price: 225000 },
      { slug: "kue-fifty-fifty", name: "Kue Yaya Cokelat", qty: 1, size: "750g", price: 225000 }
    ]
  },
  {
    id: "ord-s3",
    orderNo: "#ORD-12345",
    date: "11 September 2026",
    status: "selesai",
    total: 261000,
    items: [
      { slug: "kue-kacang-cokelat", name: "Kue Kacang Cokelat", qty: 1, size: "300g", price: 125000 },
      { slug: "kue-mpit", name: "Kue Mpit", qty: 1, size: "300g", price: 125000 }
    ]
  },
  {
    id: "ord-b1",
    orderNo: "#ORD-12345",
    date: "11 September 2026",
    status: "dibatalkan",
    total: 226000,
    items: [{ slug: "cookies-cokelat", name: "Brownies Cokelat", qty: 1, size: "750g", price: 225000 }]
  },
  {
    id: "ord-b2",
    orderNo: "#ORD-12345",
    date: "11 September 2026",
    status: "dibatalkan",
    total: 226000,
    items: [{ slug: "kurma-kacang", name: "Kurma Cokelat", qty: 1, size: "750g", price: 225000 }]
  },
  {
    id: "ord-b3",
    orderNo: "#ORD-12345",
    date: "11 September 2026",
    status: "dibatalkan",
    total: 126000,
    items: [{ slug: "kue-yaya", name: "Kue Yaya Nanas", qty: 1, size: "300g", price: 125000 }]
  }
];

function labelStatusPesanan(status) {
  if (status === "diproses") {
    return "Diproses";
  }
  if (status === "dikirim") {
    return "Dikirim";
  }
  if (status === "selesai") {
    return "Selesai";
  }
  if (status === "dibatalkan") {
    return "Dibatalkan";
  }
  return "Diproses";
}

function cariPesanan(id) {
  for (let i = 0; i < daftarPesanan.length; i++) {
    if (daftarPesanan[i].id === id) {
      return daftarPesanan[i];
    }
  }
  return null;
}

function simpanDaftarPesanan() {
  localStorage.setItem("hb_orders", JSON.stringify(daftarPesanan));
}

function pasangAksiRiwayat() {
  let wadah = ambilElemen("[data-history-list]");
  if (wadah === null) {
    return;
  }

  const tombolBatal = wadah.querySelectorAll("[data-order-cancel]");
  for (let i = 0; i < tombolBatal.length; i++) {
    tombolBatal[i].addEventListener("click", function () {
      let id = this.getAttribute("data-order-cancel");
      let pesanan = cariPesanan(id);

      if (pesanan !== null) {
        pesanan.status = "dibatalkan";
        simpanDaftarPesanan();
        tampilkanToast("Pesanan berhasil dibatalkan");
        renderRiwayat();
      }
    });
  }

  const tombolSelesai = wadah.querySelectorAll("[data-order-finish]");
  for (let j = 0; j < tombolSelesai.length; j++) {
    tombolSelesai[j].addEventListener("click", function () {
      let id = this.getAttribute("data-order-finish");
      let pesanan = cariPesanan(id);

      if (pesanan !== null) {
        pesanan.status = "selesai";
        simpanDaftarPesanan();
        tampilkanToast("Pesanan ditandai selesai");
        renderRiwayat();
      }
    });
  }

  const tombolBeliLagi = wadah.querySelectorAll("[data-order-rebuy]");
  for (let k = 0; k < tombolBeliLagi.length; k++) {
    tombolBeliLagi[k].addEventListener("click", function () {
      let id = this.getAttribute("data-order-rebuy");
      let pesanan = cariPesanan(id);

      if (pesanan === null) {
        return;
      }

      let keranjang = ambilKeranjang();
      if (keranjang === null) {
        keranjang = [];
      }

      for (let m = 0; m < pesanan.items.length; m++) {
        let item = pesanan.items[m];

        let ukuran = item.size;
        if (!ukuran) {
          ukuran = "350 Gram";
        } else if (ukuran.indexOf("Gram") === -1) {
          ukuran = ukuran.replace("g", " Gram");
        }

        let hargaSatuan = HARGA_UKURAN[ukuran];
        if (!hargaSatuan) {
          hargaSatuan = item.price;
        }
        if (!hargaSatuan) {
          hargaSatuan = 125000;
        }

        let qty = item.qty;
        if (!qty) {
          qty = 1;
        }

        let itemLama = null;
        for (let n = 0; n < keranjang.length; n++) {
          if (keranjang[n].slug === item.slug && keranjang[n].size === ukuran) {
            itemLama = keranjang[n];
          }
        }

        if (itemLama !== null) {
          itemLama.qty = itemLama.qty + qty;
          itemLama.checked = true;
        } else {
          keranjang.push({
            slug: item.slug,
            name: item.name,
            size: ukuran,
            qty: qty,
            price: hargaSatuan,
            checked: true
          });
        }
      }

      simpanKeranjang(keranjang);
      perbaruiJumlahKeranjang();
      tampilkanToast("Produk ditambahkan kembali ke keranjang");

      setTimeout(function () {
        window.location.href = "keranjang.html";
      }, 900);
    });
  }
}

function renderRiwayat() {
  const hasilFilter = [];
  const kunci = kataCariRiwayat.trim().toLowerCase();

  for (let i = 0; i < daftarPesanan.length; i++) {
    let pesanan = daftarPesanan[i];
    const cocokTab = statusRiwayatAktif === "semua" || pesanan.status === statusRiwayatAktif;

    if (!cocokTab) {
      continue;
    }

    let cocokCari = true;

    if (kunci !== "") {
      cocokCari = pesanan.orderNo.toLowerCase().indexOf(kunci) !== -1;

      if (!cocokCari) {
        for (let j = 0; j < pesanan.items.length; j++) {
          if (pesanan.items[j].name.toLowerCase().indexOf(kunci) !== -1) {
            cocokCari = true;
          }
        }
      }
    }

    if (cocokCari) {
      hasilFilter.push(pesanan);
    }
  }

  let pesananTampil = hasilFilter;

  if (statusRiwayatAktif === "semua" && kunci === "" && hasilFilter.length >= 12) {
    let pertamaDiproses = null;
    let terakhirSelesai = null;

    for (let k = 0; k < hasilFilter.length; k++) {
      if (hasilFilter[k].status === "diproses" && pertamaDiproses === null) {
        pertamaDiproses = hasilFilter[k];
      }
      if (hasilFilter[k].status === "selesai") {
        terakhirSelesai = hasilFilter[k];
      }
    }

    if (pertamaDiproses !== null && terakhirSelesai !== null) {
      pesananTampil = [pertamaDiproses, terakhirSelesai];
    }
  }

  const wadahKosong = ambilElemen("[data-history-empty]");
  if (wadahKosong !== null) {
    if (pesananTampil.length === 0) {
      wadahKosong.hidden = false;
    } else {
      wadahKosong.hidden = true;
    }
  }

  let wadah = ambilElemen("[data-history-list]");
  if (wadah === null) {
    return;
  }

  let html = "";

  for (let m = 0; m < pesananTampil.length; m++) {
    const data = pesananTampil[m];

    let kelasBadge = "history-badge history-badge--dark";
    if (data.status === "dibatalkan") {
      kelasBadge = "history-badge history-badge--cancelled";
    }

    let htmlItem = "";
    for (let n = 0; n < data.items.length; n++) {
      let item = data.items[n];
      let qtyItem = item.qty;
      if (!qtyItem) {
        qtyItem = 1;
      }
      let ukuranItem = item.size;
      if (!ukuranItem) {
        ukuranItem = "300g";
      }

      htmlItem += '<div class="history-item">';
      htmlItem += '  <img src="images/' + escapeHtml(item.slug) + '.jpg" alt="' + escapeHtml(item.name) + '">';
      htmlItem += '  <div class="history-item-info">';
      htmlItem += '    <h2>' + escapeHtml(item.name) + '</h2>';
      htmlItem += '    <p>' + qtyItem + 'x Toples ' + escapeHtml(ukuranItem) + '</p>';
      htmlItem += '  </div>';
      htmlItem += '</div>';
    }

    let htmlAksi = "";

    if (data.status === "diproses") {
      htmlAksi = '<button type="button" class="btn-history-action" data-order-cancel="' + escapeHtml(data.id) + '">Batalkan</button>';
    } else if (data.status === "dikirim") {
      htmlAksi = '<button type="button" class="btn-history-action" data-order-finish="' + escapeHtml(data.id) + '">Selesai</button>';
    } else if (data.status === "selesai") {
      htmlAksi = '<button type="button" class="btn-history-action" data-order-rebuy="' + escapeHtml(data.id) + '">Beli Lagi</button>';

      for (let r = 0; r < data.items.length; r++) {
        const itemUlas = data.items[r];
        let slugUlas = "lidah-kucing-keju";
        let qtyUlas = 1;
        let ukuranUlas = "300g";

        if (itemUlas) {
          if (itemUlas.slug) {
            slugUlas = itemUlas.slug;
          }
          if (itemUlas.qty) {
            qtyUlas = itemUlas.qty;
          }
          if (itemUlas.size) {
            ukuranUlas = itemUlas.size;
          }
        }

        const urlUlasan = "ulasan.html?p=" + encodeURIComponent(slugUlas) +
          "&qty=" + encodeURIComponent(qtyUlas) +
          "&size=" + encodeURIComponent(ukuranUlas);

        let labelUlasan = "Beri Ulasan";
        if (data.items.length > 1 && itemUlas && itemUlas.name) {
          labelUlasan = "Ulas " + escapeHtml(itemUlas.name);
        }

        htmlAksi += '<a class="btn-history-action" href="' + urlUlasan + '">' + labelUlasan + '</a>';
      }
    }

    html += '<article class="history-card" data-order-id="' + escapeHtml(data.id) + '">';
    html += '  <div class="history-card-head">';
    html += '    <p class="history-meta">' + escapeHtml(data.orderNo) + ' &bull; ' + escapeHtml(data.date) + '</p>';
    html += '    <span class="' + kelasBadge + '">' + labelStatusPesanan(data.status) + '</span>';
    html += '  </div>';
    html += '  <div class="history-items">' + htmlItem + '</div>';
    html += '  <hr class="history-divider">';
    html += '  <div class="history-card-foot">';
    html += '    <p class="history-total">Total Pembayaran : ' + formatRupiah(data.total) + '</p>';

    if (htmlAksi !== "") {
      html += '    <div class="history-actions">' + htmlAksi + '</div>';
    }

    html += '  </div>';
    html += '</article>';
  }

  wadah.innerHTML = html;
  pasangAksiRiwayat();
}

if (halamanRiwayat !== null) {

  const pesananTersimpan = JSON.parse(localStorage.getItem("hb_orders") || "null");

  if (pesananTersimpan !== null && pesananTersimpan.length > 0) {
    daftarPesanan = pesananTersimpan;
  } else {
    daftarPesanan = [];

    for (let i = 0; i < PESANAN_AWAL.length; i++) {
      daftarPesanan.push(salinObject(PESANAN_AWAL[i]));
    }

    localStorage.setItem("hb_orders", JSON.stringify(daftarPesanan));
  }

  const tabRiwayat = ambilSemuaElemen("[data-history-tab]");

  for (let j = 0; j < tabRiwayat.length; j++) {
    tabRiwayat[j].addEventListener("click", function () {
      statusRiwayatAktif = this.getAttribute("data-history-tab");
      if (!statusRiwayatAktif) {
        statusRiwayatAktif = "semua";
      }

      for (let k = 0; k < tabRiwayat.length; k++) {
        if (tabRiwayat[k] === this) {
          tabRiwayat[k].classList.add("is-active");
          tabRiwayat[k].setAttribute("aria-selected", "true");
        } else {
          tabRiwayat[k].classList.remove("is-active");
          tabRiwayat[k].setAttribute("aria-selected", "false");
        }
      }

      renderRiwayat();
    });
  }

  const inputCariRiwayat = ambilElemen("[data-history-search]");

  if (inputCariRiwayat !== null) {
    inputCariRiwayat.addEventListener("input", function () {
      kataCariRiwayat = inputCariRiwayat.value;
      renderRiwayat();
    });
  }

  renderRiwayat();
}
