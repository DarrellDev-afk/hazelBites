let adminAktif = false;
if (window.location.search.indexOf("admin=1") !== -1) {
  localStorage.setItem("hb_admin_session", "1");
  sessionStorage.setItem("hb_admin_session", "1");
  adminAktif = true;
} else if (localStorage.getItem("hb_admin_session") === "1" || sessionStorage.getItem("hb_admin_session") === "1") {
  adminAktif = true;
} else if (window.name && window.name.indexOf('"hb_admin_session":"1"') !== -1) {
  localStorage.setItem("hb_admin_session", "1");
  adminAktif = true;
}

if (!adminAktif) {
  window.location.href = "login.html";
}

const emailAdmin = document.getElementById("loggedAdminEmail");
if (emailAdmin !== null) {
  emailAdmin.textContent = localStorage.getItem("hb_admin_email") || "admin@gmail.com";
}

function logoutAdmin() {
  localStorage.removeItem("hb_admin_session");
  localStorage.removeItem("hb_admin_email");
  sessionStorage.removeItem("hb_admin_session");
  window.name = "";
  window.location.href = "login.html";
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar !== null) {
    sidebar.classList.toggle("collapsed");
  }
}

function toggleProfileMenu() {
  let dropdown = document.getElementById("profileDropdown");
  if (dropdown !== null) {
    dropdown.classList.toggle("show");
  }
}

window.addEventListener("click", function (event) {
  let dropdown = document.getElementById("profileDropdown");
  if (dropdown === null) {
    return;
  }

  let elemen = event.target;
  let diDalamProfil = false;

  while (elemen !== null) {
    if (elemen.classList && elemen.classList.contains("profile-wrapper")) {
      diDalamProfil = true;
    }
    elemen = elemen.parentNode;
  }

  if (diDalamProfil === false) {
    dropdown.classList.remove("show");
  }
});

function switchTab(tab) {
  const semuaNav = document.querySelectorAll(".nav-item");

  for (let i = 0; i < semuaNav.length; i++) {
    if (semuaNav[i].getAttribute("data-tab") === tab) {
      semuaNav[i].classList.add("active");
    } else {
      semuaNav[i].classList.remove("active");
    }
  }

  const semuaSection = ["produk", "pesanan", "pengguna", "laporan"];

  for (let j = 0; j < semuaSection.length; j++) {
    const section = document.getElementById("section-" + semuaSection[j]);
    if (section !== null) {
      if (semuaSection[j] === tab) {
        section.style.display = "flex";
      } else {
        section.style.display = "none";
      }
    }
  }
}

function formatRupiah(angka) {
  return "Rp. " + Number(angka).toLocaleString("id-ID");
}

let produkList = [
  { id: 1, nama: "Cookies Cokelat", varian: "500gr", harga: 125000, status: "Ready Stock", foto: "images/cookies-cokelat.jpg", deskripsi: "Cookies renyah di luar dan lembut di dalam dengan chocolate chips." },
  { id: 2, nama: "Kue Kacang Coklat", varian: "500gr", harga: 125000, status: "Ready Stock", foto: "images/kue-kacang-cokelat.jpg", deskripsi: "Kue kacang berpadu cokelat pekat dengan kacang mede utuh." },
  { id: 3, nama: "Kastangel Keju", varian: "500gr", harga: 125000, status: "Ready Stock", foto: "images/kastangel-keju.jpg", deskripsi: "Kastangel keju edam panggang renyah dan gurih." },
  { id: 4, nama: "Kue Kacang", varian: "500gr", harga: 125000, status: "Ready Stock", foto: "images/kue-kacang-love.jpg", deskripsi: "Kue kacang berbentuk hati dengan taburan wijen." },
  { id: 5, nama: "Nastar Keju", varian: "500gr", harga: 125000, status: "Ready Stock", foto: "images/nastar-keju.jpg", deskripsi: "Nastar lembut selai nanas homemade dengan taburan keju parut." },
  { id: 6, nama: "Kurma Kacang", varian: "500gr", harga: 125000, status: "Ready Stock", foto: "images/kurma-kacang.jpg", deskripsi: "Kurma pilihan berbalut cokelat dan kacang cincang." },
  { id: 7, nama: "Kue Yaya", varian: "500gr", harga: 125000, status: "Ready Stock", foto: "images/kue-yaya.jpg", deskripsi: "Kue renyah bertabur parutan keju dengan selai stroberi." },
  { id: 8, nama: "Lidah Kucing Keju", varian: "500gr", harga: 125000, status: "Ready Stock", foto: "images/lidah-kucing-keju.jpg", deskripsi: "Lidah kucing tipis renyah dengan keju cheddar." },
  { id: 9, nama: "Pia Bulan", varian: "500gr", harga: 125000, status: "Pre Order", foto: "images/pia-bulan.jpg", deskripsi: "Kue pia keemasan bertekstur lembut dengan isian manis." },
  { id: 10, nama: "Kue Fifty Fifty", varian: "500gr", harga: 125000, status: "Ready Stock", foto: "images/kue-fifty-fifty.jpg", deskripsi: "Kue kering mentega balutan cokelat hitam dan putih." }
];

const savedProduk = JSON.parse(localStorage.getItem("hb_admin_products") || "null");
if (savedProduk !== null && savedProduk.length !== undefined && savedProduk.length > 0) {
  produkList = savedProduk;
}

function simpanProdukStorage() {
  localStorage.setItem("hb_admin_products", JSON.stringify(produkList));
}

let produkFilterState = "Semua";
let produkPage = 1;
let tempUploadedDataUrl = "";

function cycleFilterProduk() {
  let daftarFilter = ["Semua", "Ready Stock", "Pre Order"];
  let posisi = 0;

  for (let i = 0; i < daftarFilter.length; i++) {
    if (daftarFilter[i] === produkFilterState) {
      posisi = i;
    }
  }

  posisi = posisi + 1;
  if (posisi >= daftarFilter.length) {
    posisi = 0;
  }

  produkFilterState = daftarFilter[posisi];

  let tombol = document.getElementById("btnFilterProduk");
  if (tombol !== null) {
    if (produkFilterState === "Semua") {
      tombol.textContent = "Filter";
    } else {
      tombol.textContent = "Filter: " + produkFilterState;
    }
  }

  renderProduk();
}

function renderProduk() {
  let inputCari = document.getElementById("searchProduk");
  let q = "";

  if (inputCari !== null) {
    q = inputCari.value.toLowerCase();
  }

  let hasil = [];

  for (let i = 0; i < produkList.length; i++) {
    const produk = produkList[i];
    let cocokCari = produk.nama.toLowerCase().indexOf(q) !== -1;
    let cocokFilter = produkFilterState === "Semua" || produk.status === produkFilterState;

    if (cocokCari && cocokFilter) {
      hasil.push(produk);
    }
  }

  let tbody = document.getElementById("tbodyProduk");

  if (tbody !== null) {
    let html = "";

    for (let j = 0; j < hasil.length; j++) {
      const p = hasil[j];

      html += "<tr>";
      html += '<td><img src="' + p.foto + '" alt="' + p.nama + '" class="product-thumb" /></td>';
      html += "<td>" + p.nama + "</td>";
      html += "<td>" + formatRupiah(p.harga) + "</td>";
      html += "<td>" + p.status + "</td>";
      html += "<td>";
      html += '<button class="action-link" onclick="editProduk(' + p.id + ')">Edit</button>';
      html += '<button class="action-link" onclick="hapusProduk(' + p.id + ')">Hapus</button>';
      html += "</td>";
      html += "</tr>";
    }

    tbody.innerHTML = html;
  }

  renderPagination("pagProduk", produkPage, "produk");
}

function openProductModal(item) {
  if (typeof item === "undefined") {
    item = null;
  }

  tempUploadedDataUrl = "";

  const namaFile = document.getElementById("fotoFileName");
  const inputFoto = document.getElementById("inputFotoProduk");

  if (namaFile !== null) {
    namaFile.textContent = "";
  }
  if (inputFoto !== null) {
    inputFoto.value = "";
  }

  if (item !== null) {
    document.getElementById("modalProdukTitle").textContent = "EDIT PRODUK";
    document.getElementById("editProdukId").value = item.id;
    document.getElementById("inputNamaProduk").value = item.nama;
    document.getElementById("inputVarianProduk").value = item.varian || "";
    document.getElementById("inputHargaProduk").value = item.harga;
    document.getElementById("inputDeskripsiProduk").value = item.deskripsi || "";

    const semuaStatus = document.querySelectorAll('input[name="statusProduk"]');
    for (let i = 0; i < semuaStatus.length; i++) {
      if (semuaStatus[i].value === item.status) {
        semuaStatus[i].checked = true;
      } else {
        semuaStatus[i].checked = false;
      }
    }

    document.getElementById("btnSubmitProduk").textContent = "Simpan";
  } else {
    document.getElementById("modalProdukTitle").textContent = "TAMBAH PRODUK";
    document.getElementById("editProdukId").value = "";
    document.getElementById("inputNamaProduk").value = "";
    document.getElementById("inputVarianProduk").value = "";
    document.getElementById("inputHargaProduk").value = "";
    document.getElementById("inputDeskripsiProduk").value = "";

    const statusAwal = document.querySelector('input[name="statusProduk"][value="Ready Stock"]');
    if (statusAwal !== null) {
      statusAwal.checked = true;
    }

    document.getElementById("btnSubmitProduk").textContent = "Tambahkan";
  }

  document.getElementById("modalProduk").classList.add("show");
}

function previewUploadedFoto(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  document.getElementById("fotoFileName").textContent = file.name;

  const pembaca = new FileReader();
  pembaca.onload = function (hasil) {
    tempUploadedDataUrl = hasil.target.result;
  };
  pembaca.readAsDataURL(file);
}

function saveProduk() {
  const idVal = document.getElementById("editProdukId").value;
  const nama = document.getElementById("inputNamaProduk").value.trim();
  const varian = document.getElementById("inputVarianProduk").value.trim();
  const harga = Number(document.getElementById("inputHargaProduk").value) || 125000;
  const statusInput = document.querySelector('input[name="statusProduk"]:checked');
  let status = "Ready Stock";
  const deskripsi = document.getElementById("inputDeskripsiProduk").value.trim();

  if (statusInput !== null) {
    status = statusInput.value;
  }

  if (nama === "") {
    alert("Harap isi Nama Produk terlebih dahulu.");
    return;
  }

  if (idVal !== "") {
    const idAngka = parseInt(idVal, 10);
    let indeks = -1;

    for (let i = 0; i < produkList.length; i++) {
      if (produkList[i].id === idAngka) {
        indeks = i;
      }
    }

    if (indeks > -1) {
      produkList[indeks].nama = nama;
      produkList[indeks].varian = varian;
      produkList[indeks].harga = harga;
      produkList[indeks].status = status;
      produkList[indeks].deskripsi = deskripsi;

      if (tempUploadedDataUrl !== "") {
        produkList[indeks].foto = tempUploadedDataUrl;
      }
    }
  } else {
    let fotoBaru = "images/kastangel-keju.jpg";
    if (tempUploadedDataUrl !== "") {
      fotoBaru = tempUploadedDataUrl;
    }

    const produkBaru = {
      id: Date.now(),
      nama: nama,
      varian: varian,
      harga: harga,
      status: status,
      deskripsi: deskripsi,
      foto: fotoBaru
    };

    let daftarBaru = [produkBaru];
    for (let j = 0; j < produkList.length; j++) {
      daftarBaru.push(produkList[j]);
    }
    produkList = daftarBaru;
  }

  simpanProdukStorage();
  closeModal("modalProduk");
  renderProduk();
}

function editProduk(id) {
  for (let i = 0; i < produkList.length; i++) {
    if (produkList[i].id === id) {
      openProductModal(produkList[i]);
    }
  }
}

function hapusProduk(id) {
  if (confirm("Hapus produk ini dari daftar?")) {
    let daftarBaru = [];

    for (let i = 0; i < produkList.length; i++) {
      if (produkList[i].id !== id) {
        daftarBaru.push(produkList[i]);
      }
    }

    produkList = daftarBaru;
    simpanProdukStorage();
    renderProduk();
  }
}

let pesananList = [
  { id: 1, kode: "#KC-88219", nama: "Gustave", wa: "085294589849", tgl: "10 Februari 2026, 15:40 WIB", kurir: "J&T Reguler", alamat: "Jl. Tanimbar No.14 Kel. Kasin Kec. Klojen Kota Malang", barang: "Kastangel", qty: 1, hargaSatuan: 50000, status: "Diproses", resi: "", foto: "images/kastangel-keju.jpg" },
  { id: 2, kode: "#KC-88220", nama: "Yanto", wa: "081234567890", tgl: "10 Februari 2026, 16:10 WIB", kurir: "JNE Reguler", alamat: "Jl. Soekarno Hatta No. 9, Malang", barang: "Kastangel Keju", qty: 2, hargaSatuan: 125000, status: "Diproses", resi: "", foto: "images/kastangel-keju.jpg" },
  { id: 3, kode: "#KC-88221", nama: "Andi", wa: "081333444555", tgl: "11 Februari 2026, 09:15 WIB", kurir: "J&T Express", alamat: "Jl. Ijen No. 22, Klojen, Malang", barang: "Nastar Keju", qty: 1, hargaSatuan: 125000, status: "Diproses", resi: "", foto: "images/nastar-keju.jpg" },
  { id: 4, kode: "#KC-88222", nama: "Yudi", wa: "085788990011", tgl: "11 Februari 2026, 10:05 WIB", kurir: "SiCepat", alamat: "Jl. Sulfat Agung No. 45, Malang", barang: "Kastangel Keju", qty: 2, hargaSatuan: 125000, status: "Diproses", resi: "", foto: "images/kastangel-keju.jpg" },
  { id: 5, kode: "#KC-88223", nama: "Yasir", wa: "082145678912", tgl: "11 Februari 2026, 11:20 WIB", kurir: "J&T Reguler", alamat: "Jl. Dinoyo Permai No. 8, Malang", barang: "Lidah Kucing Keju", qty: 3, hargaSatuan: 125000, status: "Diproses", resi: "", foto: "images/lidah-kucing-keju.jpg" },
  { id: 6, kode: "#KC-88224", nama: "Rudi", wa: "081998877665", tgl: "12 Februari 2026, 13:00 WIB", kurir: "AnterAja", alamat: "Jl. Sawojajar Raya No. 18, Malang", barang: "Cookies Cokelat", qty: 2, hargaSatuan: 125000, status: "Diproses", resi: "", foto: "images/cookies-cokelat.jpg" },
  { id: 7, kode: "#KC-88225", nama: "Elkam", wa: "085611223344", tgl: "12 Februari 2026, 14:30 WIB", kurir: "J&T Reguler", alamat: "Jl. Bandulan No. 31, Malang", barang: "Kurma Cokelat", qty: 1, hargaSatuan: 125000, status: "Diproses", resi: "", foto: "images/kurma-kacang.jpg" },
  { id: 8, kode: "#KC-88226", nama: "Dakir", wa: "081255667788", tgl: "12 Februari 2026, 15:45 WIB", kurir: "JNE Reguler", alamat: "Jl. Galunggung No. 12, Malang", barang: "Kue Kacang", qty: 2, hargaSatuan: 125000, status: "Diproses", resi: "", foto: "images/kue-kacang-love.jpg" },
  { id: 9, kode: "#KC-88227", nama: "Sutris", wa: "085233445566", tgl: "13 Februari 2026, 08:50 WIB", kurir: "J&T Reguler", alamat: "Jl. Kawi Atas No. 7, Malang", barang: "Kastangel Keju", qty: 1, hargaSatuan: 125000, status: "Diproses", resi: "", foto: "images/kastangel-keju.jpg" },
  { id: 10, kode: "#KC-88228", nama: "Alexander", wa: "081776655443", tgl: "13 Februari 2026, 10:15 WIB", kurir: "SiCepat", alamat: "Jl. Dieng No. 50, Malang", barang: "Nastar Keju", qty: 5, hargaSatuan: 125000, status: "Diproses", resi: "", foto: "images/nastar-keju.jpg" },
  { id: 11, kode: "#KC-88229", nama: "Yani", wa: "081344556677", tgl: "13 Februari 2026, 12:40 WIB", kurir: "J&T Reguler", alamat: "Jl. Merjosari No. 19, Malang", barang: "Kastangel Keju", qty: 2, hargaSatuan: 125000, status: "Diproses", resi: "", foto: "images/kastangel-keju.jpg" },
  { id: 12, kode: "#KC-88230", nama: "Yanti", wa: "085899001122", tgl: "14 Februari 2026, 09:05 WIB", kurir: "JNE Reguler", alamat: "Jl. Sigura-gura No. 11, Malang", barang: "Kue Yaya", qty: 2, hargaSatuan: 125000, status: "Diproses", resi: "", foto: "images/kue-yaya.jpg" }
];

const pesananToko = JSON.parse(localStorage.getItem("hb_orders") || "null");
const userToko = JSON.parse(localStorage.getItem("hb_user") || "null");

if (pesananToko !== null && pesananToko.length !== undefined) {
  for (let i = 0; i < pesananToko.length; i++) {
    const pesananBaru = pesananToko[i];

    if (pesananBaru.id && String(pesananBaru.id).indexOf("ord-") === 0) {
      let itemPertama = null;

      if (pesananBaru.items && pesananBaru.items[0]) {
        itemPertama = pesananBaru.items[0];
      }

      let namaBarang = "Kastangel Keju";
      let qtyBarang = 1;
      let hargaBarang = 125000;
      let slugBarang = "kastangel-keju";

      if (itemPertama !== null) {
        if (itemPertama.name) {
          namaBarang = itemPertama.name;
        }
        if (itemPertama.qty) {
          qtyBarang = itemPertama.qty;
        }
        if (itemPertama.price) {
          hargaBarang = itemPertama.price;
        }
        if (itemPertama.slug) {
          slugBarang = itemPertama.slug;
        }
      }

      let namaPemesan = "Pelanggan Baru";
      let waPemesan = "081200000000";
      if (userToko !== null) {
        if (userToko.name) {
          namaPemesan = userToko.name;
        }
        if (userToko.phone) {
          waPemesan = userToko.phone;
        }
      }

      let statusToko = "Diproses";
      if (pesananBaru.status === "dikirim") {
        statusToko = "Dikirim";
      }

      const dataBaru = {
        id: 9000 + i,
        kode: pesananBaru.orderNo || "#KC-NEW",
        nama: namaPemesan,
        wa: waPemesan,
        tgl: pesananBaru.date || "Hari ini",
        kurir: "J&T Reguler",
        alamat: localStorage.getItem("hb_address") || "Kota Malang",
        barang: namaBarang,
        qty: qtyBarang,
        hargaSatuan: hargaBarang,
        status: statusToko,
        resi: "",
        foto: "images/" + slugBarang + ".jpg"
      };

      let daftarBaru = [dataBaru];
      for (let j = 0; j < pesananList.length; j++) {
        daftarBaru.push(pesananList[j]);
      }
      pesananList = daftarBaru;
    }
  }
}

let pesananFilterState = "Semua";
let pesananPage = 1;
let pendingResiOrderId = null;

function cycleFilterPesanan() {
  let daftarFilter = ["Semua", "Diproses", "Dikirim"];
  let posisi = 0;

  for (let i = 0; i < daftarFilter.length; i++) {
    if (daftarFilter[i] === pesananFilterState) {
      posisi = i;
    }
  }

  posisi = posisi + 1;
  if (posisi >= daftarFilter.length) {
    posisi = 0;
  }

  pesananFilterState = daftarFilter[posisi];

  let tombol = document.getElementById("btnFilterPesanan");
  if (tombol !== null) {
    if (pesananFilterState === "Semua") {
      tombol.textContent = "Filter";
    } else {
      tombol.textContent = "Filter: " + pesananFilterState;
    }
  }

  renderPesanan();
}

function renderPesanan() {
  let inputCari = document.getElementById("searchPesanan");
  let q = "";

  if (inputCari !== null) {
    q = inputCari.value.toLowerCase();
  }

  let hasil = [];

  for (let i = 0; i < pesananList.length; i++) {
    let pesanan = pesananList[i];
    let cocokCari = pesanan.nama.toLowerCase().indexOf(q) !== -1 || pesanan.barang.toLowerCase().indexOf(q) !== -1;
    let cocokFilter = pesananFilterState === "Semua" || pesanan.status === pesananFilterState;

    if (cocokCari && cocokFilter) {
      hasil.push(pesanan);
    }
  }

  let tbody = document.getElementById("tbodyPesanan");

  if (tbody !== null) {
    let html = "";

    for (let j = 0; j < hasil.length; j++) {
      const o = hasil[j];

      let selectProses = "";
      let selectDikirim = "";
      if (o.status === "Diproses") {
        selectProses = " selected";
      }
      if (o.status === "Dikirim") {
        selectDikirim = " selected";
      }

      html += "<tr>";
      html += "<td>" + o.nama + "</td>";
      html += "<td>" + o.barang + "</td>";
      html += "<td>" + o.qty + "X</td>";
      html += "<td>" + o.status + "</td>";
      html += "<td>";
      html += '<button class="eye-btn" onclick="openOrderDetail(' + o.id + ')" title="Lihat Detail Pesanan">';
      html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">';
      html += '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>';
      html += '<circle cx="12" cy="12" r="3"></circle>';
      html += "</svg>";
      html += "</button>";
      html += "</td>";
      html += "<td>";
      html += '<select class="status-select" onchange="handleOrderActionChange(' + o.id + ', this.value)">';
      html += '<option value="Diproses"' + selectProses + ">Proses</option>";
      html += '<option value="Dikirim"' + selectDikirim + ">Dikirim</option>";
      html += "</select>";
      html += "</td>";
      html += "</tr>";
    }

    tbody.innerHTML = html;
  }

  renderPagination("pagPesanan", pesananPage, "pesanan");
}

function openOrderDetail(id) {
  let pesanan = null;

  for (let i = 0; i < pesananList.length; i++) {
    if (pesananList[i].id === id) {
      pesanan = pesananList[i];
    }
  }

  if (pesanan === null) {
    return;
  }

  const subtotal = pesanan.qty * pesanan.hargaSatuan;
  const ongkir = 10000;
  const total = subtotal + ongkir;

  document.getElementById("detailKode").textContent = pesanan.kode;
  document.getElementById("detailStatusBadge").textContent = pesanan.status;
  document.getElementById("detailNama").textContent = pesanan.nama;
  document.getElementById("detailWa").textContent = pesanan.wa;
  document.getElementById("detailTgl").textContent = pesanan.tgl;
  document.getElementById("detailKurir").textContent = pesanan.kurir;
  document.getElementById("detailAlamat").textContent = pesanan.alamat;

  const gambarDetail = document.getElementById("detailImg");
  gambarDetail.onerror = function () {
    this.src = "images/kastangel-keju.jpg";
  };
  gambarDetail.src = pesanan.foto;

  document.getElementById("detailBarang").textContent = pesanan.barang;
  document.getElementById("detailQty").textContent = pesanan.qty + "X";
  document.getElementById("detailHargaSatuan").textContent = formatRupiah(pesanan.hargaSatuan);
  document.getElementById("detailSubtotal").textContent = formatRupiah(subtotal);
  document.getElementById("paySubtotal").textContent = formatRupiah(subtotal);
  document.getElementById("payTotal").textContent = formatRupiah(total);

  const barisResi = document.getElementById("detailResiRow");

  if (pesanan.resi) {
    barisResi.style.display = "block";
    document.getElementById("detailResiVal").textContent = pesanan.resi;
  } else {
    barisResi.style.display = "none";
  }

  document.getElementById("modalDetailPesanan").classList.add("show");
}

function handleOrderActionChange(id, newVal) {
  if (newVal === "Dikirim") {
    pendingResiOrderId = id;
    const inputResi = document.getElementById("inputNomorResi");
    const modalResi = document.getElementById("modalInputResi");
    if (inputResi !== null) {
      inputResi.value = "";
    }
    if (modalResi !== null) {
      modalResi.classList.add("show");
    }
    if (inputResi !== null) {
      inputResi.focus();
    }
  } else {
    for (let i = 0; i < pesananList.length; i++) {
      if (pesananList[i].id === id) {
        pesananList[i].status = "Diproses";
        pesananList[i].resi = "";
      }
    }
    renderPesanan();
  }
}

function cancelResiModal() {
  pendingResiOrderId = null;
  closeModal("modalInputResi");
  renderPesanan();
}

function confirmKirimResi() {
  const resi = document.getElementById("inputNomorResi").value.trim();

  if (resi === "") {
    alert("Harap masukkan nomor resi pengiriman terlebih dahulu.");
    return;
  }

  let kodeTarget = "";
  for (let i = 0; i < pesananList.length; i++) {
    if (pesananList[i].id === pendingResiOrderId) {
      pesananList[i].status = "Dikirim";
      pesananList[i].resi = resi;
      kodeTarget = pesananList[i].kode;
    }
  }

  const daftarOrderToko = JSON.parse(localStorage.getItem("hb_orders") || "null");
  if (daftarOrderToko !== null && daftarOrderToko.length !== undefined && kodeTarget !== "") {
    for (let k = 0; k < daftarOrderToko.length; k++) {
      if (daftarOrderToko[k].orderNo === kodeTarget) {
        daftarOrderToko[k].status = "dikirim";
        daftarOrderToko[k].resi = resi;
      }
    }
    localStorage.setItem("hb_orders", JSON.stringify(daftarOrderToko));
  }

  pendingResiOrderId = null;
  closeModal("modalInputResi");
  renderPesanan();
}

const penggunaList = [
  { id: 1, nama: "Yanto", email: "yanto@gmail.com", status: "Aktif" },
  { id: 2, nama: "Yanti", email: "yanti@gmail.com", status: "Aktif" },
  { id: 3, nama: "Andik", email: "andik@gmail.com", status: "Nonaktif" },
  { id: 4, nama: "Mira", email: "mira@gmail.com", status: "Aktif" },
  { id: 5, nama: "Diva", email: "diva@gmail.com", status: "Aktif" },
  { id: 6, nama: "Zara", email: "zara@gmail.com", status: "Nonaktif" },
  { id: 7, nama: "Chelsea", email: "chellaut@gmail.com", status: "Aktif" },
  { id: 8, nama: "Lia", email: "liadaud@gmail.com", status: "Aktif" },
  { id: 9, nama: "Toha", email: "toha@gmail.com", status: "Aktif" },
  { id: 10, nama: "Floren", email: "floren@gmail.com", status: "Nonaktif" }
];

let penggunaFilterState = "Semua";
let penggunaPage = 1;

function cycleFilterPengguna() {
  let daftarFilter = ["Semua", "Aktif", "Nonaktif"];
  let posisi = 0;

  for (let i = 0; i < daftarFilter.length; i++) {
    if (daftarFilter[i] === penggunaFilterState) {
      posisi = i;
    }
  }

  posisi = posisi + 1;
  if (posisi >= daftarFilter.length) {
    posisi = 0;
  }

  penggunaFilterState = daftarFilter[posisi];

  let tombol = document.getElementById("btnFilterPengguna");
  if (tombol !== null) {
    if (penggunaFilterState === "Semua") {
      tombol.textContent = "Filter";
    } else {
      tombol.textContent = "Filter: " + penggunaFilterState;
    }
  }

  renderPengguna();
}

function renderPengguna() {
  let inputCari = document.getElementById("searchPengguna");
  let q = "";

  if (inputCari !== null) {
    q = inputCari.value.toLowerCase();
  }

  let hasil = [];

  for (let i = 0; i < penggunaList.length; i++) {
    const pengguna = penggunaList[i];
    let cocokCari = pengguna.nama.toLowerCase().indexOf(q) !== -1 || pengguna.email.toLowerCase().indexOf(q) !== -1;
    let cocokFilter = penggunaFilterState === "Semua" || pengguna.status === penggunaFilterState;

    if (cocokCari && cocokFilter) {
      hasil.push(pengguna);
    }
  }

  let tbody = document.getElementById("tbodyPengguna");

  if (tbody !== null) {
    let html = "";

    for (let j = 0; j < hasil.length; j++) {
      const u = hasil[j];
      let kelasStatus = "status-nonaktif";
      if (u.status === "Aktif") {
        kelasStatus = "status-aktif";
      }

      html += "<tr>";
      html += "<td>" + u.nama + "</td>";
      html += "<td>" + u.email + "</td>";
      html += '<td class="' + kelasStatus + '">' + u.status + "</td>";
      html += "<td>";
      html += '<button class="dots-btn" onclick="toggleUserStatus(' + u.id + ')" title="Ubah Status Aktif/Nonaktif">...</button>';
      html += "</td>";
      html += "</tr>";
    }

    tbody.innerHTML = html;
  }

  const ringkasan = document.getElementById("penggunaSummary");
  if (ringkasan !== null) {
    ringkasan.textContent = "Menampilkan 1–" + hasil.length + " dari 25 pengguna";
  }

  renderPagination("pagPengguna", penggunaPage, "pengguna");
}

function toggleUserStatus(id) {
  for (let i = 0; i < penggunaList.length; i++) {
    if (penggunaList[i].id === id) {
      if (penggunaList[i].status === "Aktif") {
        penggunaList[i].status = "Nonaktif";
      } else {
        penggunaList[i].status = "Aktif";
      }
    }
  }
  renderPengguna();
}

const laporanData = [
  { nama: "Yanto", barang: "Kastengel Keju", jumlah: "2X", harga: 225000 },
  { nama: "Yanti", barang: "Kue Yaya", jumlah: "2X", harga: 225000 },
  { nama: "Andik", barang: "Nastar Keju", jumlah: "2X", harga: 225000 },
  { nama: "Mira", barang: "Kue Kacang", jumlah: "2X", harga: 225000 },
  { nama: "Diva", barang: "Lidah Kucing Keju", jumlah: "2X", harga: 225000 },
  { nama: "Zara", barang: "Cookies Cokelat", jumlah: "2X", harga: 225000 },
  { nama: "Chelsea", barang: "Kue Yaya Nanas", jumlah: "2X", harga: 225000 },
  { nama: "Lia", barang: "Pie Bulan", jumlah: "2X", harga: 225000 },
  { nama: "Toha", barang: "Kue Fifty Fifty", jumlah: "2X", harga: 225000 }
];

function renderLaporan() {
  let inputCari = document.getElementById("cariLaporan");
  let q = "";

  if (inputCari !== null) {
    q = inputCari.value.toLowerCase();
  }

  let hasil = [];

  for (let i = 0; i < laporanData.length; i++) {
    let laporan = laporanData[i];

    if (q === "" || q === "pesanan") {
      hasil.push(laporan);
    } else if (laporan.nama.toLowerCase().indexOf(q) !== -1 || laporan.barang.toLowerCase().indexOf(q) !== -1) {
      hasil.push(laporan);
    }
  }

  let tbody = document.getElementById("tbodyLaporan");

  if (tbody !== null) {
    let html = "";

    for (let j = 0; j < hasil.length; j++) {
      let r = hasil[j];

      html += "<tr>";
      html += "<td>" + r.nama + "</td>";
      html += "<td>" + r.barang + "</td>";
      html += "<td>" + r.jumlah + "</td>";
      html += "<td>Rp " + r.harga.toLocaleString("id-ID") + "</td>";
      html += "</tr>";
    }

    tbody.innerHTML = html;
  }
}

function setPeriodPill(btn, label) {
  const semuaPill = document.querySelectorAll(".pill-group:first-child .period-pill");

  for (let i = 0; i < semuaPill.length; i++) {
    semuaPill[i].classList.remove("active");
  }

  btn.classList.add("active");
}

function updatePeriodeLabel() {
  const tanggalDari = document.getElementById("tglDari").value;
  const tanggalSampai = document.getElementById("tglSampai").value;

  document.getElementById("periodeHeading").textContent =
    "Ringkasan Periode: " + tanggalDari + " – " + tanggalSampai;
}

function exportLaporanCSV() {
  const baris = [["Nama", "Nama Barang", "Jumlah", "Harga"]];

  for (let i = 0; i < laporanData.length; i++) {
    let laporan = laporanData[i];
    baris.push([laporan.nama, laporan.barang, laporan.jumlah, laporan.harga]);
  }

  baris.push(["TOTAL KESELURUHAN", "", "999+", 12450000]);

  let isiCsv = "";
  for (let j = 0; j < baris.length; j++) {
    isiCsv = isiCsv + baris[j].join(",") + "\n";
  }

  const tautan = document.createElement("a");
  tautan.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURI(isiCsv));
  tautan.setAttribute("download", "laporan-penjualan-hazel-bites.csv");
  document.body.appendChild(tautan);
  tautan.click();
  document.body.removeChild(tautan);
}

function renderPagination(containerId, currentPage, jenis) {
  const wadah = document.getElementById(containerId);

  if (wadah === null) {
    return;
  }

  let halamanSebelumnya = currentPage - 1;
  if (halamanSebelumnya < 1) {
    halamanSebelumnya = 1;
  }

  let halamanBerikutnya = currentPage + 1;
  if (halamanBerikutnya > 3) {
    halamanBerikutnya = 3;
  }

  let html = "";
  html += '<button class="page-circle" onclick="gantiHalaman(\'' + jenis + "', " + halamanSebelumnya + ')">&lt;</button>';

  for (let i = 1; i <= 3; i++) {
    let kelas = "page-circle";

    if (i === currentPage) {
      kelas = kelas + " active";
    }

    html += '<button class="' + kelas + '" onclick="gantiHalaman(\'' + jenis + "', " + i + ')">' + i + "</button>";
  }

  html += '<button class="page-circle" onclick="gantiHalaman(\'' + jenis + "', " + halamanBerikutnya + ')">&gt;</button>';

  wadah.innerHTML = html;
}

function gantiHalaman(jenis, halaman) {
  if (jenis === "produk") {
    produkPage = halaman;
    renderProduk();
  } else if (jenis === "pesanan") {
    pesananPage = halaman;
    renderPesanan();
  } else if (jenis === "pengguna") {
    penggunaPage = halaman;
    renderPengguna();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal !== null) {
    modal.classList.remove("show");
  }
}

function handleOverlayClick(event, modalId) {
  if (event.target && event.target.id === modalId) {
    closeModal(modalId);
  }
}

function handleResiOverlayClick(event) {
  if (event.target && event.target.id === "modalInputResi") {
    cancelResiModal();
  }
}

const inputResiEl = document.getElementById("inputNomorResi");
if (inputResiEl !== null) {
  inputResiEl.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      confirmKirimResi();
    }
  });
}

renderProduk();
renderPesanan();
renderPengguna();
renderLaporan();
