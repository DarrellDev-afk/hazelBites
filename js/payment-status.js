if (ambilElemen("[data-pay-status-page]") !== null) {
  const strukTerakhir = JSON.parse(localStorage.getItem("hb_last_receipt") || "null");

  if (strukTerakhir !== null) {
    const orderInline = ambilElemen("[data-status-order-inline]");
    const orderText = ambilElemen("[data-status-order]");
    const metodeText = ambilElemen("[data-status-method]");
    const tanggalText = ambilElemen("[data-status-date]");
    const totalText = ambilElemen("[data-status-total]");

    if (orderInline !== null && strukTerakhir.orderId) {
      orderInline.textContent = strukTerakhir.orderId;
    }

    if (orderText !== null && strukTerakhir.orderId) {
      orderText.textContent = strukTerakhir.orderId;
    }

    if (metodeText !== null && strukTerakhir.method) {
      metodeText.textContent = strukTerakhir.method;
    }

    if (tanggalText !== null && strukTerakhir.date) {
      tanggalText.textContent = strukTerakhir.date;
    }

    if (totalText !== null && strukTerakhir.total) {
      totalText.textContent = strukTerakhir.total;
    }
  }
}
