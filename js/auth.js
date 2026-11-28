function simpanSesiLogin(userBaru) {
  sessionStorage.setItem("hb_login", "1");
  localStorage.setItem("hb_login", "1");

  if (userBaru !== null) {
    localStorage.setItem("hb_user", JSON.stringify(userBaru));
    sessionStorage.setItem("hb_user", JSON.stringify(userBaru));
  }

  const dataSesi = {
    hb_login: "1",
    hb_user: userBaru
  };
  window.name = JSON.stringify(dataSesi);
}

function buatUrlTujuan(namaHalaman) {
  const lokasi = window.location.href;
  const tanpaHash = lokasi.split("#")[0];
  const tanpaQuery = tanpaHash.split("?")[0];
  const posisiSlash = tanpaQuery.lastIndexOf("/");

  if (posisiSlash !== -1) {
    return tanpaQuery.substring(0, posisiSlash + 1) + namaHalaman;
  }
  return namaHalaman;
}

function pindahKeHalaman(namaHalaman) {
  const urlLengkap = buatUrlTujuan(namaHalaman);
  window.location.href = urlLengkap;
}

const formAuth = ambilElemen("[data-auth-form]");

if (formAuth !== null) {

  const tombolPassword = ambilElemenClass("auth-toggle-pass");

  for (let i = 0; i < tombolPassword.length; i++) {
    tombolPassword[i].addEventListener("click", function () {
      const input = this.parentElement.querySelector("input");
      if (input === null) {
        return;
      }

      if (input.type === "password") {
        input.type = "text";
        this.textContent = "Sembunyikan";
        this.setAttribute("aria-label", "Sembunyikan password");
      } else {
        input.type = "password";
        this.textContent = "Lihat";
        this.setAttribute("aria-label", "Tampilkan password");
      }
    });
  }

  formAuth.addEventListener("submit", function (event) {
    event.preventDefault();

    const mode = formAuth.getAttribute("data-auth-form");
    let inputEmail = null;
    let inputPassword = null;
    let inputNama = null;

    if (mode === "register") {
      inputNama = ambilElemenId("reg-name");
      inputEmail = ambilElemenId("reg-email");
      inputPassword = ambilElemenId("reg-password");
    } else {
      inputEmail = ambilElemenId("login-email");
      inputPassword = ambilElemenId("login-password");
    }

    let email = "";
    let password = "";
    let nama = "";

    if (inputEmail !== null) {
      email = inputEmail.value.trim();
    }
    if (inputPassword !== null) {
      password = inputPassword.value.trim();
    }
    if (inputNama !== null) {
      nama = inputNama.value.trim();
    }

    if (mode === "login" && email.toLowerCase() === "admin@gmail.com" && password === "admin") {
      localStorage.setItem("hb_admin_session", "1");
      localStorage.setItem("hb_admin_email", "admin@gmail.com");
      sessionStorage.setItem("hb_admin_session", "1");
      window.name = JSON.stringify({
        hb_admin_session: "1",
        hb_admin_email: "admin@gmail.com"
      });

      tampilkanToast("Login berhasil! Mengalihkan...");
      setTimeout(function () {
        pindahKeHalaman("admin.html?admin=1");
      }, 500);
      return;
    }

    if (mode === "register" && nama === "") {
      tampilkanToast("Nama lengkap wajib diisi");
      if (inputNama !== null) {
        inputNama.focus();
      }
      return;
    }

    if (email === "" || email.indexOf("@") === -1) {
      tampilkanToast("Masukkan alamat email yang valid");
      if (inputEmail !== null) {
        inputEmail.focus();
      }
      return;
    }

    if (password === "" || password.length < 4) {
      tampilkanToast("Password minimal 4 karakter");
      if (inputPassword !== null) {
        inputPassword.focus();
      }
      return;
    }

    const userBaru = {
      name: nama,
      email: email
    };

    if (nama === "") {
      userBaru.name = email.split("@")[0];
    }

    simpanSesiLogin(userBaru);

    if (mode === "register") {
      tampilkanToast("Pendaftaran berhasil! Mengalihkan...");
    } else {
      tampilkanToast("Login berhasil! Mengalihkan...");
    }

    setTimeout(function () {
      pindahKeHalaman("homepage.html?login=1");
    }, 500);
  });
}

const tombolLogin = ambilElemen("[data-login]");

if (tombolLogin !== null) {
  tombolLogin.addEventListener("click", function () {
    simpanSesiLogin(null);
  });
}

const wadahAuth = ambilElemen(".auth-card-img");

if (wadahAuth !== null) {
  const slideAuth = wadahAuth.querySelectorAll(".auth-slide");
  const titikAuth = wadahAuth.querySelectorAll(".dot");

  if (slideAuth.length > 1) {
    let indeksAuth = 0;
    let timerAuth = null;

    function tampilkanSlideAuth(indeks) {

      slideAuth.forEach(function (slide, i) {
        if (i === indeks) {
          slide.classList.add("active");
        } else {
          slide.classList.remove("active");
        }
      });

      titikAuth.forEach(function (titik, j) {
        if (j === indeks) {
          titik.classList.add("active");
        } else {
          titik.classList.remove("active");
        }
      });

      indeksAuth = indeks;
    }

    function slideAuthBerikutnya() {
      let indeksBaru = indeksAuth + 1;
      if (indeksBaru >= slideAuth.length) {
        indeksBaru = 0;
      }
      tampilkanSlideAuth(indeksBaru);
    }

    function mulaiSliderAuth() {
      if (timerAuth !== null) {
        clearInterval(timerAuth);
      }
      timerAuth = setInterval(slideAuthBerikutnya, 4000);
    }

    titikAuth.forEach(function (titik) {
      titik.addEventListener("click", function () {
        const indeksTujuan = parseInt(this.getAttribute("data-index"), 10);
        if (isNaN(indeksTujuan) === false) {
          tampilkanSlideAuth(indeksTujuan);
          mulaiSliderAuth();
        }
      });
    });

    wadahAuth.addEventListener("mouseenter", function () {
      if (timerAuth !== null) {
        clearInterval(timerAuth);
      }
    });

    wadahAuth.addEventListener("mouseleave", mulaiSliderAuth);

    mulaiSliderAuth();
  }
}
