async function testPost() {
  console.log("Sending POST request to http://localhost:3000/api/pengaduan...");
  try {
    const res = await fetch("http://localhost:3000/api/pengaduan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_tiket: `TKT-TEST-${Date.now()}`,
        nama_pelapor: "Gede Test HTTP",
        is_anonim: false,
        nomor_whatsapp: "081234567890",
        kategori_masalah: "PKL Liar",
        kronologi: "Ini adalah deskripsi kronologi laporan pengaduan uji coba sistem melalui HTTP.",
        latitude: "-8.114712",
        longitude: "115.090124",
        foto_bukti: null
      })
    });
    console.log("STATUS:", res.status);
    const data = await res.json();
    console.log("RESPONSE BODY:", data);
  } catch (error) {
    console.error("HTTP REQUEST FAILED:", error);
  }
}

testPost();
