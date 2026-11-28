const ALERGEN_PRODUK = "Alergen: Mengandung gluten (terigu), telur, susu, dan produk olahan turunannya.";
const SARAN_SIMPAN = "Saran Penyimpanan: Simpan di tempat yang sejuk, kering, dan tertutup rapat agar kerenyahan kue tetap terjaga.";
const BAHAN_DASAR = "Tepung terigu, mentega (butter), margarin, gula halus, kuning telur, susu bubuk, ";

const daftarProduk = [
  {
    slug: "kue-fifty-fifty",
    name: "Kue Fifty Fifty",
    price: 125000,
    reviews: 333,
    desc: "Kue kering mentega bertekstur renyah lumer dengan balutan dua rasa—setengah cokelat hitam dan setengah cokelat putih yang manis pas, lengkap dengan hiasan garis cokelat cantik. Pas untuk camilan harian maupun hantaran spesial.",
    comp: "Tepung terigu, mentega (butter), margarin, gula halus, kuning telur, susu bubuk, tepung maizena, cokelat hitam batang (dark compound chocolate), cokelat putih batang (white compound chocolate), vanili, dan garam.",
    allergen: ALERGEN_PRODUK,
    storage: SARAN_SIMPAN
  },
  {
    slug: "cookies-cokelat",
    name: "Cookies Cokelat",
    price: 125000,
    reviews: 128,
    desc: "Cookies renyah di luar dan lembut di dalam, dipenuhi chocolate chips pilihan. Cocok untuk camilan harian maupun parcel.",
    comp: BAHAN_DASAR + "cokelat batang, chocolate chips, vanili, dan garam.",
    allergen: ALERGEN_PRODUK,
    storage: SARAN_SIMPAN
  },
  {
    slug: "kue-kacang-love",
    name: "Kue Kacang Love",
    price: 125000,
    reviews: 96,
    desc: "Kue kacang berbentuk hati dengan taburan wijen, gurih dan manis seimbang. Pas untuk hantaran spesial.",
    comp: BAHAN_DASAR + "kacang tanah sangrai, wijen, vanili, dan garam.",
    allergen: ALERGEN_PRODUK,
    storage: SARAN_SIMPAN
  },
  {
    slug: "pia-bulan",
    name: "Pia Bulan",
    price: 125000,
    reviews: 210,
    desc: "Kue pia berwarna keemasan dengan tekstur lembut dan isian manis. Teman yang pas untuk menikmati teh hangat.",
    comp: BAHAN_DASAR + "isian kacang hijau/pasta manis, minyak nabati, vanili, dan garam.",
    allergen: ALERGEN_PRODUK,
    storage: SARAN_SIMPAN
  },
  {
    slug: "nastar-keju",
    name: "Nastar Keju",
    price: 125000,
    reviews: 187,
    desc: "Nastar lembut yang meleleh di mulut dengan taburan keju parut yang gurih.",
    comp: BAHAN_DASAR + "selai nanas homemade, keju cheddar parut, vanili, dan garam.",
    allergen: ALERGEN_PRODUK,
    storage: SARAN_SIMPAN
  },
  {
    slug: "kue-kacang-cokelat",
    name: "Kue Kacang Cokelat",
    price: 125000,
    reviews: 74,
    desc: "Kue kacang berpadu cokelat pekat dengan kacang mede utuh di atasnya. Renyah dan kaya rasa.",
    comp: BAHAN_DASAR + "kacang mede, bubuk kakao, cokelat batang, vanili, dan garam.",
    allergen: ALERGEN_PRODUK,
    storage: SARAN_SIMPAN
  },
  {
    slug: "kue-mpit",
    name: "Kue Mpit",
    price: 125000,
    reviews: 59,
    desc: "Kue semprit lembut bertekstur mentega dengan hiasan kismis di tengahnya. Klasik dan selalu dirindukan.",
    comp: BAHAN_DASAR + "tepung maizena, kismis, vanili, dan garam.",
    allergen: ALERGEN_PRODUK,
    storage: SARAN_SIMPAN
  },
  {
    slug: "kurma-kacang",
    name: "Kurma Kacang",
    price: 125000,
    reviews: 142,
    desc: "Kurma pilihan berbalut cokelat dengan taburan kacang renyah. Manis alami yang pas untuk hantaran.",
    comp: "Kurma pilihan, cokelat batang (compound chocolate), kacang tanah cincang, dan kertas cup.",
    allergen: ALERGEN_PRODUK,
    storage: SARAN_SIMPAN
  },
  {
    slug: "kue-yaya",
    name: "Kue Yaya",
    price: 125000,
    reviews: 88,
    desc: "Kue renyah bertabur parutan keju dengan selai buah merah di tengahnya. Manis, gurih, dan cantik di toples.",
    comp: BAHAN_DASAR + "keju parut, selai stroberi, vanili, dan garam.",
    allergen: ALERGEN_PRODUK,
    storage: SARAN_SIMPAN
  },
  {
    slug: "kue-nastar-original",
    name: "Kue Nastar Original",
    price: 125000,
    reviews: 164,
    desc: "Nastar klasik berbentuk bulat dengan isian selai nanas homemade, lembut dan harum mentega.",
    comp: BAHAN_DASAR + "selai nanas homemade, vanili, dan garam.",
    allergen: ALERGEN_PRODUK,
    storage: SARAN_SIMPAN
  },
  {
    slug: "kastangel-keju",
    name: "Kastangel Keju",
    price: 125000,
    reviews: 175,
    desc: "Kastangel dengan keju parut melimpah, renyah dan gurih. Favorit untuk hantaran hari besar.",
    comp: BAHAN_DASAR + "keju edam/cheddar parut, tepung maizena, vanili, dan garam.",
    allergen: ALERGEN_PRODUK,
    storage: SARAN_SIMPAN
  },
  {
    slug: "lidah-kucing-keju",
    name: "Lidah Kucing Keju",
    price: 125000,
    reviews: 83,
    desc: "Kue lidah kucing tipis nan renyah dengan taburan keju. Ringan dan mudah bikin ketagihan.",
    comp: "Tepung terigu, mentega (butter), gula halus, putih telur, susu bubuk, keju parut, vanili, dan garam.",
    allergen: ALERGEN_PRODUK,
    storage: SARAN_SIMPAN
  }
];
