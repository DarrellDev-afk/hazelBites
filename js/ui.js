function apakahUserLogin() {
  if (ambilParameterURL("login") === "1") {
    localStorage.setItem("hb_login", "1");
    sessionStorage.setItem("hb_login", "1");
    return true;
  }

  if (localStorage.getItem("hb_login") === "1" || sessionStorage.getItem("hb_login") === "1") {
    return true;
  }

  if (window.name && window.name.indexOf('"hb_login":"1"') !== -1) {
    const sesi = JSON.parse(window.name);
    if (sesi && sesi.hb_login === "1") {
      sessionStorage.setItem("hb_login", "1");
      localStorage.setItem("hb_login", "1");
      if (sesi.hb_user) {
        localStorage.setItem("hb_user", JSON.stringify(sesi.hb_user));
      }
      return true;
    }
  }

  return false;
}

function jalankanRoutingHalaman() {
  const path = window.location.pathname;
  const bagian = path.split("/");
  const namaFile = bagian[bagian.length - 1] || "index.html";
  const query = window.location.search || "";
  const hash = window.location.hash || "";
  const sudahLogin = apakahUserLogin();

  if (document.body.classList.contains("is-guest")) {
    return;
  } else if (document.body.classList.contains("is-user")) {
    if (!sudahLogin) {
      if (namaFile === "homepage.html") {
        window.location.replace("index.html" + hash);
        return;
      }
      if (namaFile === "katalog.html") {
        window.location.replace("katalog-guest.html" + query);
        return;
      }
      if (namaFile === "produk.html") {
        window.location.replace("produk-guest.html" + query);
        return;
      }
      window.location.replace("login.html");
      return;
    }
  }
}

jalankanRoutingHalaman();

const tombolMenu = ambilElemen("[data-nav-toggle]");
const menuNav = ambilElemen("[data-nav]");

if (tombolMenu !== null && menuNav !== null) {
  tombolMenu.addEventListener("click", function () {
    menuNav.classList.toggle("open");

    if (menuNav.classList.contains("open")) {
      tombolMenu.setAttribute("aria-expanded", "true");
    } else {
      tombolMenu.setAttribute("aria-expanded", "false");
    }
  });

  const tautanMenu = menuNav.getElementsByTagName("a");
  for (let i = 0; i < tautanMenu.length; i++) {
    tautanMenu[i].addEventListener("click", function () {
      menuNav.classList.remove("open");
      tombolMenu.setAttribute("aria-expanded", "false");
    });
  }
}

const avatarNavbar = ambilElemen("[data-avatar]");
const dropdownProfil = ambilElemen("[data-dropdown]");

function tutupDropdownProfil() {
  if (dropdownProfil === null) {
    return;
  }
  if (dropdownProfil.hidden === false) {
    dropdownProfil.hidden = true;
    if (avatarNavbar !== null) {
      avatarNavbar.setAttribute("aria-expanded", "false");
    }
  }
}

if (avatarNavbar !== null && dropdownProfil !== null) {
  avatarNavbar.addEventListener("click", function (event) {
    event.stopPropagation();

    if (dropdownProfil.hidden === true) {
      dropdownProfil.hidden = false;
      avatarNavbar.setAttribute("aria-expanded", "true");
    } else {
      dropdownProfil.hidden = true;
      avatarNavbar.setAttribute("aria-expanded", "false");
    }
  });

  const tautanDropdown = dropdownProfil.querySelectorAll("a");
  tautanDropdown.forEach(function (tautan) {
    tautan.addEventListener("click", function (event) {
      event.stopPropagation();

      let href = this.getAttribute("href");
      tutupDropdownProfil();

      if (href === null || href === "#" || href.charAt(0) === "#") {
        event.preventDefault();
        const label = this.textContent.trim().toLowerCase();

        if (label.indexOf("riwayat") !== -1) {
          window.location.href = "riwayat.html";
        } else {
          window.location.href = "edit-profile.html";
        }
      }
    });
  });

  document.addEventListener("click", tutupDropdownProfil);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      tutupDropdownProfil();
    }
  });
}

const tombolKeranjang = ambilElemen("[data-cart]");

if (tombolKeranjang !== null && tombolKeranjang.tagName === "BUTTON") {
  tombolKeranjang.addEventListener("click", function () {
    window.location.href = "keranjang.html";
  });
}

const tombolKembali = ambilElemen("[data-back]");

if (tombolKembali !== null) {
  tombolKembali.addEventListener("click", function (event) {
    const tujuanDefault = tombolKembali.getAttribute("href");
    const halamanDetail = ambilElemen("[data-detail]");

    if (halamanDetail !== null && document.referrer) {
      if (document.referrer.indexOf("katalog-guest.html") !== -1) {
        event.preventDefault();
        window.location.href = "katalog-guest.html";
        return;
      }
      if (document.referrer.indexOf("katalog.html") !== -1) {
        event.preventDefault();
        window.location.href = "katalog.html";
        return;
      }
    }

    if (tujuanDefault !== null && tujuanDefault !== "" && tujuanDefault !== "#") {
      event.preventDefault();
      window.location.href = tujuanDefault;
    }
  });
}

const inputCari = ambilElemenId("search");
const formCari = ambilElemen("[data-search-form]");
const hasilKosong = ambilElemen("[data-no-result]");

if (inputCari !== null && formCari !== null) {
  const kartuProduk = ambilSemuaElemen(".product-card");

  function saringProduk() {
    let kataKunci = inputCari.value.trim().toLowerCase();
    let jumlahTerlihat = 0;

    kartuProduk.forEach(function (kartu) {
      let namaProduk = kartu.getAttribute("data-name");
      if (namaProduk === null) {
        namaProduk = "";
      }

      if (kataKunci === "" || namaProduk.indexOf(kataKunci) !== -1) {
        kartu.hidden = false;
        jumlahTerlihat += 1;
      } else {
        kartu.hidden = true;
      }
    });

    if (hasilKosong !== null) {
      if (kataKunci === "" || jumlahTerlihat > 0) {
        hasilKosong.hidden = true;
      } else {
        hasilKosong.hidden = false;
      }
    }
  }

  if (kartuProduk.length > 0) {
    const kataKunciURL = ambilParameterURL("q");
    if (kataKunciURL !== "") {
      inputCari.value = kataKunciURL;
      saringProduk();
    }
    inputCari.addEventListener("input", saringProduk);
  }

  formCari.addEventListener("submit", function (event) {
    event.preventDefault();
    let kataKunci = inputCari.value.trim();

    if (kartuProduk.length === 0) {
      let halamanKatalog = "katalog.html";
      if (document.body.classList.contains("is-guest")) {
        halamanKatalog = "katalog-guest.html";
      }

      if (kataKunci !== "") {
        window.location.href = halamanKatalog + "?q=" + encodeURIComponent(kataKunci);
      } else {
        window.location.href = halamanKatalog;
      }
      return;
    }

    saringProduk();

    const katalog = ambilElemenId("katalog");
    if (katalog !== null && kataKunci !== "") {
      katalog.scrollIntoView({ behavior: "smooth" });
    }
  });
}

const tautanNavigasi = ambilSemuaElemen(".nav a[href^='#']");

function sorotMenu() {
  const posisi = window.scrollY + 140;
  let hrefAktif = "";
  let offsetTerbesar = -1;

  for (let tautan of tautanNavigasi) {
    let href = tautan.getAttribute("href");
    const bagian = document.querySelector(href);

    if (bagian !== null && bagian.offsetTop <= posisi && bagian.offsetTop > offsetTerbesar) {
      offsetTerbesar = bagian.offsetTop;
      hrefAktif = href;
    }
  }

  tautanNavigasi.forEach(function (tautan) {
    const hrefMenu = tautan.getAttribute("href");
    if (hrefMenu === hrefAktif) {
      tautan.style.color = "var(--rose)";
    } else {
      tautan.style.color = "";
    }
  });
}

if (tautanNavigasi.length > 0) {
  window.addEventListener("scroll", sorotMenu);
  sorotMenu();
}

const tautanFooter = ambilSemuaElemen('.footer a[href="#"]');

tautanFooter.forEach(function (tautan) {
  tautan.addEventListener("click", function (event) {
    event.preventDefault();

    const isGuest = document.body.classList.contains("is-guest");
    const teks = this.textContent.trim().toLowerCase();
    const aria = this.getAttribute("aria-label");

    if (teks === "cara pemesanan") {
      if (isGuest) {
        window.location.href = "katalog-guest.html";
      } else {
        window.location.href = "katalog.html";
      }
    } else if (teks === "konfirmasi pembayaran") {
      if (isGuest) {
        tampilkanToast("Silakan login untuk konfirmasi pembayaran");
        setTimeout(function () {
          window.location.href = "login.html";
        }, 900);
      } else {
        window.location.href = "pembayaran.html";
      }
    } else if (teks === "cek status pesanan") {
      if (isGuest) {
        tampilkanToast("Silakan login untuk cek status pesanan");
        setTimeout(function () {
          window.location.href = "login.html";
        }, 900);
      } else {
        window.location.href = "riwayat.html";
      }
    } else if (aria !== null && aria !== "") {
      tampilkanToast("Membuka " + aria + " resmi Hazel Bites (@hazelbites)");
    } else {
      tampilkanToast("Halaman " + this.textContent.trim() + " Hazel Bites");
    }
  });
});
