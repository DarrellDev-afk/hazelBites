const HARGA_UKURAN = {
  "350 Gram": 125000,
  "500 Gram": 175000,
  "750 Gram": 225000
};

const KERANJANG_AWAL = [
  { slug: "kue-nastar-original", name: "Kue Kacang", size: "350 Gram", qty: 1, price: 125000, checked: true },
  { slug: "cookies-cokelat", name: "Cookies Cokelat", size: "350 Gram", qty: 1, price: 125000, checked: true },
  { slug: "kue-kacang-cokelat", name: "Kue Kacang Cokelat", size: "500 Gram", qty: 1, price: 175000, checked: true },
  { slug: "kurma-kacang", name: "Kurma Kacang", size: "750 Gram", qty: 1, price: 225000, checked: true }
];

function ambilElemenId(id) {
  return document.getElementById(id);
}

function ambilElemenClass(namaClass) {
  return document.getElementsByClassName(namaClass);
}

function ambilElemenTag(namaTag) {
  return document.getElementsByTagName(namaTag);
}

function ambilElemen(selector) {
  return document.querySelector(selector);
}

function ambilSemuaElemen(selector) {
  return document.querySelectorAll(selector);
}

function formatRupiah(angka) {
  let nilai = Number(angka);

  if (isNaN(nilai)) {
    nilai = 0;
  }

  if (nilai < 0) {
    nilai = 0;
  }

  return "Rp " + nilai.toLocaleString("id-ID");
}

function escapeHtml(teks) {
  let hasil = "" + teks;
  hasil = hasil.split("&").join("&amp;");
  hasil = hasil.split("<").join("&lt;");
  hasil = hasil.split(">").join("&gt;");
  hasil = hasil.split('"').join("&quot;");
  hasil = hasil.split("'").join("&#39;");
  return hasil;
}

let timerToast = null;

function tampilkanToast(pesan) {
  const toast = ambilElemen("[data-toast]");
  if (toast === null) {
    return;
  }

  toast.textContent = pesan;
  toast.classList.add("show");

  if (timerToast !== null) {
    clearTimeout(timerToast);
  }

  timerToast = setTimeout(function () {
    toast.classList.remove("show");
  }, 2200);
}

function ambilKeranjang() {
  let data = localStorage.getItem("hb_cart");
  if (data === null) {
    return null;
  }
  return JSON.parse(data);
}

function simpanKeranjang(keranjang) {
  localStorage.setItem("hb_cart", JSON.stringify(keranjang));
}

function hitungJumlahKeranjang() {
  const keranjang = ambilKeranjang();
  if (keranjang === null) {
    return 0;
  }

  let jumlah = 0;

  for (let item of keranjang) {
    jumlah += item.qty;
  }
  return jumlah;
}

function perbaruiJumlahKeranjang() {
  const badge = ambilElemen("[data-cart-count]");
  if (badge === null) {
    return;
  }

  let jumlah = hitungJumlahKeranjang();
  if (jumlah > 99) {
    badge.textContent = "99+";
  } else {
    badge.textContent = "" + jumlah;
  }

  if (jumlah === 0) {
    badge.hidden = true;
  } else {
    badge.hidden = false;
  }
}

function salinObject(objectAsal) {
  let hasil = {
    slug: objectAsal.slug,
    name: objectAsal.name,
    size: objectAsal.size,
    qty: objectAsal.qty,
    price: objectAsal.price,
    checked: objectAsal.checked
  };
  return hasil;
}

function ambilDataUser() {
  let data = localStorage.getItem("hb_user");
  if (data === null) {
    return null;
  }
  return JSON.parse(data);
}

function simpanDataUser(user) {
  localStorage.setItem("hb_user", JSON.stringify(user));
}

function sinkronkanAvatarNavbar() {
  const avatar = ambilElemen("[data-avatar]");
  if (avatar === null) {
    return;
  }

  const daftarGambar = avatar.getElementsByTagName("img");
  if (daftarGambar.length === 0) {
    return;
  }

  const user = ambilDataUser();
  if (user !== null && user.avatar) {
    daftarGambar[0].src = user.avatar;
  }
}

function ambilParameterURL(nama) {
  let query = window.location.search;
  if (query.length < 2) {
    return "";
  }

  query = query.substring(1);
  const daftar = query.split("&");

  let hasilNilai = "";
  daftar.forEach(function (item) {
    const pasangan = item.split("=");
    if (pasangan[0] === nama) {
      let nilai = pasangan[1];
      if (typeof nilai === "undefined") {
        nilai = "";
      }
      hasilNilai = decodeURIComponent(nilai);
    }
  });

  return hasilNilai;
}

function ubahKeGram(ukuran) {
  if (!ukuran) {
    return "300g";
  }

  let hasil = ukuran.split(" ").join("");
  const kecil = hasil.toLowerCase();
  const posisi = kecil.indexOf("gram");

  if (posisi !== -1) {
    hasil = hasil.substring(0, posisi) + "g";
  }

  return hasil;
}

perbaruiJumlahKeranjang();
sinkronkanAvatarNavbar();
