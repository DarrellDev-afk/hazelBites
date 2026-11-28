const halamanUlasan = ambilElemen("[data-review-page]");

function pasangRatingBintang(grup) {
  const semuaBintang = grup.querySelectorAll("[data-star-val]");

  for (let i = 0; i < semuaBintang.length; i++) {
    semuaBintang[i].addEventListener("click", function () {
      let nilai = parseInt(this.getAttribute("data-star-val"), 10);
      if (isNaN(nilai)) {
        nilai = 5;
      }

      const grupIni = this.parentNode;
      grupIni.setAttribute("data-rating-val", "" + nilai);

      const bintangGrup = grupIni.querySelectorAll("[data-star-val]");

      for (let j = 0; j < bintangGrup.length; j++) {
        let nilaiBintang = parseInt(bintangGrup[j].getAttribute("data-star-val"), 10);
        if (isNaN(nilaiBintang)) {
          nilaiBintang = 0;
        }

        if (nilaiBintang <= nilai) {
          bintangGrup[j].classList.add("is-active");
        } else {
          bintangGrup[j].classList.remove("is-active");
        }
      }
    });
  }
}

if (halamanUlasan !== null) {

  const slugUlasan = ambilParameterURL("p");
  const qtyUlasan = ambilParameterURL("qty");
  const ukuranUlasan = ambilParameterURL("size");

  if (slugUlasan !== "" && typeof daftarProduk !== "undefined") {
    let produkUlasan = null;

    for (let i = 0; i < daftarProduk.length; i++) {
      if (daftarProduk[i].slug === slugUlasan) {
        produkUlasan = daftarProduk[i];
      }
    }

    if (produkUlasan !== null) {
      const gambarUlasan = ambilElemen("[data-rev-img]");
      const namaUlasan = ambilElemen("[data-rev-name]");
      const metaUlasan = ambilElemen("[data-rev-meta]");

      if (gambarUlasan !== null) {
        gambarUlasan.src = "images/" + produkUlasan.slug + ".jpg";
        gambarUlasan.alt = produkUlasan.name;
      }

      if (namaUlasan !== null) {
        namaUlasan.textContent = produkUlasan.name;
      }

      if (metaUlasan !== null && (ukuranUlasan !== "" || qtyUlasan !== "")) {
        let ukuranTampil = "300g";
        if (ukuranUlasan !== "") {
          ukuranTampil = ukuranUlasan;
        }

        let qtyTampil = "1";
        if (qtyUlasan !== "") {
          qtyTampil = qtyUlasan;
        }

        metaUlasan.textContent = "Toples " + ukuranTampil + " - Dibeli " + qtyTampil + "x";
      }
    }
  }

  const semuaGrupRating = ambilSemuaElemen("[data-rating-group]");

  for (let j = 0; j < semuaGrupRating.length; j++) {
    pasangRatingBintang(semuaGrupRating[j]);
  }

  const inputFotoUlasan = ambilSemuaElemen("[data-review-photo]");

  for (let k = 0; k < inputFotoUlasan.length; k++) {
    inputFotoUlasan[k].addEventListener("change", function () {
      let file = null;

      if (this.files && this.files[0]) {
        file = this.files[0];
      }

      if (file === null) {
        return;
      }

      const slot = this.parentNode;
      const gambar = slot.querySelector("img");
      const tombolPlus = slot.querySelector(".review-photo-plus");
      const pembaca = new FileReader();

      pembaca.onload = function (event) {
        if (gambar !== null) {
          gambar.src = event.target.result;
          gambar.hidden = false;
        }

        if (tombolPlus !== null) {
          tombolPlus.hidden = true;
        }
      };

      pembaca.readAsDataURL(file);
    });
  }

  const formUlasan = ambilElemen("[data-review-form]");

  if (formUlasan !== null) {
    formUlasan.addEventListener("submit", function (event) {
      event.preventDefault();

      tampilkanToast("Terima kasih! Ulasan Anda berhasil dikirim.");

      setTimeout(function () {
        window.location.href = "riwayat.html";
      }, 1200);
    });
  }
}
