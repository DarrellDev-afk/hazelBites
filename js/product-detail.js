const halamanDetail = ambilElemen("[data-detail]");

if (halamanDetail !== null && typeof daftarProduk !== "undefined") {
  const tamuHalaman = document.body.classList.contains("is-guest");
  const alamatDetail = halamanDetail.getAttribute("data-detail-page");
  const slugDetail = ambilParameterURL("p");
  let produkDetail = null;

  for (let i = 0; i < daftarProduk.length; i++) {
    if (daftarProduk[i].slug === slugDetail) {
      produkDetail = daftarProduk[i];
    }
  }

  if (produkDetail === null) {
    produkDetail = daftarProduk[0];
  }

  let hargaAktif = produkDetail.price;
  let jumlahBeli = 1;

  document.title = produkDetail.name + " - Hazel Bites";

  const elemenNama = ambilElemen("[data-d-name]");
  const elemenHarga = ambilElemen("[data-d-price]");
  const elemenUlasan = ambilElemen("[data-d-reviews]");
  const elemenDeskripsi = ambilElemen("[data-d-desc]");
  const elemenKomposisi = ambilElemen("[data-d-comp]");
  const elemenAlergen = ambilElemen("[data-d-allergen]");
  const elemenSimpan = ambilElemen("[data-d-storage]");

  if (elemenNama !== null) {
    elemenNama.textContent = produkDetail.name;
  }
  if (elemenHarga !== null) {
    elemenHarga.textContent = formatRupiah(hargaAktif);
  }
  if (elemenUlasan !== null) {
    elemenUlasan.textContent = "(" + produkDetail.reviews + " ulasan)";
  }
  if (elemenDeskripsi !== null) {
    elemenDeskripsi.textContent = produkDetail.desc;
  }
  if (elemenKomposisi !== null) {
    elemenKomposisi.textContent = produkDetail.comp;
  }
  if (elemenAlergen !== null) {
    elemenAlergen.textContent = produkDetail.allergen;
  }
  if (elemenSimpan !== null) {
    elemenSimpan.textContent = produkDetail.storage;
  }

  const gambarUtama = ambilElemen("[data-d-img]");
  if (gambarUtama !== null) {
    gambarUtama.src = "images/" + produkDetail.slug + ".jpg";
    gambarUtama.alt = produkDetail.name;
  }

  const gambarKecil = ambilSemuaElemen("[data-d-thumb]");
  for (let j = 0; j < gambarKecil.length; j++) {
    if (gambarUtama !== null) {
      gambarKecil[j].src = gambarUtama.src;
    }
    gambarKecil[j].alt = "";
  }

  const tombolThumb = ambilSemuaElemen(".thumb");
  for (let k = 0; k < tombolThumb.length; k++) {
    tombolThumb[k].addEventListener("click", function () {
      for (let t = 0; t < tombolThumb.length; t++) {
        tombolThumb[t].classList.remove("is-active");
      }
      this.classList.add("is-active");

      const gambarDiTombol = this.querySelector("img");
      if (gambarDiTombol !== null && gambarUtama !== null) {
        gambarUtama.src = gambarDiTombol.src;
      }
    });
  }

  const tombolUkuran = ambilSemuaElemen(".size");

  for (let m = 0; m < tombolUkuran.length; m++) {
    tombolUkuran[m].addEventListener("click", function () {
      for (let u = 0; u < tombolUkuran.length; u++) {
        tombolUkuran[u].classList.remove("is-active");
        tombolUkuran[u].setAttribute("aria-checked", "false");
      }

      this.classList.add("is-active");
      this.setAttribute("aria-checked", "true");

      const ukuranDipilih = this.getAttribute("data-size");
      const hargaUkuran = HARGA_UKURAN[ukuranDipilih];

      if (hargaUkuran) {
        hargaAktif = hargaUkuran;
      } else {
        hargaAktif = produkDetail.price;
      }

      const hargaTampil = ambilElemen("[data-d-price]");
      if (hargaTampil !== null) {
        hargaTampil.textContent = formatRupiah(hargaAktif);
      }
    });
  }

  const elemenQty = ambilElemen("[data-qty]");

  function aturJumlah(nilai) {
    jumlahBeli = nilai;

    if (jumlahBeli < 1) {
      jumlahBeli = 1;
    }
    if (jumlahBeli > 99) {
      jumlahBeli = 99;
    }

    if (elemenQty !== null) {
      elemenQty.textContent = "" + jumlahBeli;
    }
  }

  const tombolKurangQty = ambilElemen("[data-qty-minus]");
  const tombolTambahQty = ambilElemen("[data-qty-plus]");

  if (tombolKurangQty !== null) {
    tombolKurangQty.addEventListener("click", function () {
      aturJumlah(jumlahBeli - 1);
    });
  }

  if (tombolTambahQty !== null) {
    tombolTambahQty.addEventListener("click", function () {
      aturJumlah(jumlahBeli + 1);
    });
  }

  function mintaLogin() {
    tampilkanToast("Silakan login terlebih dahulu");
    setTimeout(function () {
      window.location.href = "login.html";
    }, 1100);
  }

  function tambahKeKeranjang() {
    const ukuranAktif = document.querySelector(".size.is-active");
    let ukuran = "350 Gram";

    if (ukuranAktif !== null) {
      ukuran = ukuranAktif.getAttribute("data-size");
    }

    let keranjang = ambilKeranjang();

    if (keranjang === null) {
      keranjang = [];
      for (let i = 0; i < KERANJANG_AWAL.length; i++) {
        keranjang.push(salinObject(KERANJANG_AWAL[i]));
      }
    }

    let itemSama = null;
    for (let j = 0; j < keranjang.length; j++) {
      if (keranjang[j].slug === produkDetail.slug && keranjang[j].size === ukuran) {
        itemSama = keranjang[j];
      }
    }

    if (itemSama !== null) {
      itemSama.qty = itemSama.qty + jumlahBeli;
      itemSama.checked = true;
    } else {
      keranjang.push({
        slug: produkDetail.slug,
        name: produkDetail.name,
        size: ukuran,
        qty: jumlahBeli,
        price: hargaAktif,
        checked: true
      });
    }

    simpanKeranjang(keranjang);
    perbaruiJumlahKeranjang();
    tampilkanToast(jumlahBeli + " × " + produkDetail.name + " (" + ukuran + ") masuk keranjang");
  }

  const tombolTambahKeranjang = ambilElemen("[data-add-cart]");

  if (tombolTambahKeranjang !== null) {
    tombolTambahKeranjang.addEventListener("click", function () {
      if (tamuHalaman) {
        mintaLogin();
      } else {
        tambahKeKeranjang();
      }
    });
  }

  const tombolBeliSekarang = ambilElemen("[data-checkout]");

  if (tombolBeliSekarang !== null) {
    tombolBeliSekarang.addEventListener("click", function () {
      if (tamuHalaman) {
        mintaLogin();
        return;
      }

      const ukuranAktif = document.querySelector(".size.is-active");
      let ukuran = "350 Gram";

      if (ukuranAktif !== null) {
        ukuran = ukuranAktif.getAttribute("data-size");
      }

      const dataCheckout = {
        items: [
          {
            slug: produkDetail.slug,
            name: produkDetail.name,
            size: ukuran,
            qty: jumlahBeli,
            price: hargaAktif
          }
        ],
        discount: 0
      };

      localStorage.setItem("hb_checkout", JSON.stringify(dataCheckout));
      window.location.href = "checkout.html";
    });
  }

  const wadahRekomendasi = ambilElemen("[data-reco]");

  if (wadahRekomendasi !== null) {
    let htmlRekomendasi = "";
    let jumlahRekomendasi = 0;
    const produkSiap = ["pia-bulan", "nastar-keju", "kue-mpit", "kurma-kacang", "kastangel-keju", "lidah-kucing-keju"];

    for (let n = 0; n < daftarProduk.length; n++) {
      if (daftarProduk[n].slug === produkDetail.slug) {
        continue;
      }

      if (jumlahRekomendasi >= 8) {
        break;
      }

      const produkLain = daftarProduk[n];
      let siapStok = false;

      for (let s = 0; s < produkSiap.length; s++) {
        if (produkSiap[s] === produkLain.slug) {
          siapStok = true;
        }
      }

      let badge = "PRE ORDER";
      if (siapStok) {
        badge = "READY STOCK";
      }

      let bintang = "";
      for (let b = 0; b < 5; b++) {
        bintang += '<svg class="star" aria-hidden="true"><use href="#i-star"/></svg>';
      }

      htmlRekomendasi += '<a class="product-card" href="' + alamatDetail + '?p=' + produkLain.slug + '" data-name="' + produkLain.name.toLowerCase() + '">';
      htmlRekomendasi += '  <img class="product-img" src="images/' + produkLain.slug + '.jpg" alt="' + produkLain.name + '">';
      htmlRekomendasi += '  <h3 class="product-name">' + produkLain.name + '</h3>';
      htmlRekomendasi += '  <p class="product-price">' + formatRupiah(produkLain.price) + '</p>';
      htmlRekomendasi += '  <div class="product-foot"><span class="badge">' + badge + '</span><div class="stars">' + bintang + '</div></div>';
      htmlRekomendasi += '</a>';

      jumlahRekomendasi = jumlahRekomendasi + 1;
    }

    wadahRekomendasi.innerHTML = htmlRekomendasi;
  }
}
