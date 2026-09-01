import MatrixRain from "../MatrixRain";

export const metadata = {
  title: "Disclaimer, Legalitas & Privasi",
  description: "Sifat layanan, risk warning, konteks regulasi, dan kebijakan privasi DaryantoBot Pro di Indonesia.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 17, fontWeight: 900, color: "#00FF88", marginBottom: 10, letterSpacing: "0.02em" }}>{title}</h2>
      <div style={{ fontSize: 14.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.8 }}>{children}</div>
    </div>
  );
}

export default function LegalPage() {
  return (
    <main className="mx-root">
      <MatrixRain />
      <div className="mx-grid-bg" />

      <header className="mx-header">
        <div className="mx-header-inner">
          <a href="/" className="mx-logo" style={{ textDecoration: "none" }}>
            <span>DARYANTOBOT</span><span style={{ color: "#00FF88" }}>_PRO</span><span className="cursor" />
          </a>
          <a href="/" className="mx-btn-outline">← Kembali ke Beranda</a>
        </div>
      </header>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 20px 80px", fontFamily: "JetBrains Mono" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.3em", color: "rgba(0,255,136,0.7)" }}>LEGAL_NOTICE.TXT</div>
          <h1 style={{ marginTop: 10, fontWeight: 900, fontSize: "clamp(22px,5vw,30px)" }}>Disclaimer, Legalitas &amp; Privasi</h1>
          <div style={{ marginTop: 8, fontSize: 12.5, color: "rgba(255,255,255,0.62)" }}>Terakhir diperbarui: 29 Agustus 2026</div>
        </div>

        <div style={{ border: "1px solid rgba(255,180,0,0.35)", background: "rgba(255,180,0,0.06)", padding: 16, marginBottom: 32 }}>
          <div style={{ fontWeight: 900, fontSize: 13, color: "rgba(255,180,0,0.9)", marginBottom: 6, letterSpacing: "0.1em" }}>
            BACA SEBELUM MENGGUNAKAN LAYANAN INI
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.75 }}>
            Trading forex, emas, dan kripto mengandung risiko tinggi kehilangan modal. Sinyal &amp; indikator yang disediakan
            DaryantoBot Pro bersifat <b>informasional/edukatif</b>, <b>bukan jaminan profit</b>, dan <b>bukan nasihat keuangan
            personal</b>. Keputusan trading sepenuhnya ada di tangan kamu.
          </div>
        </div>

        <Section title="1. Sifat Layanan">
          DaryantoBot Pro adalah alat bantu analisa teknikal (Expert Advisor) yang menampilkan sinyal, level entry, stop loss,
          dan take profit berdasarkan struktur harga (BOS/CHoCH, order block, multi-timeframe, dsb). <b>Secara default, semua
          sinyal bersifat manual entry</b> — kamu sendiri yang menekan tombol buy/sell di platform trading kamu.
          <br /><br />
          Untuk tier <b>Premium dan VIP</b>, tersedia fitur opsional <b>auto-trade</b> yang <b>nonaktif secara default</b> dan
          harus diaktifkan secara sadar oleh pengguna di pengaturan EA. Kalau diaktifkan, EA akan membuka posisi trading
          secara otomatis sesuai parameter yang kamu tentukan sendiri (ukuran lot, tier sinyal minimum). Mengaktifkan
          auto-trade sepenuhnya pilihan &amp; tanggung jawab pengguna — DaryantoBot Pro tidak bertanggung jawab atas kerugian
          yang timbul dari posisi yang dibuka secara otomatis oleh fitur ini.
        </Section>

        <Section title="2. Bukan Broker &amp; Tidak Mengelola Dana Nasabah">
          DaryantoBot Pro <b>bukan pialang berjangka, bukan manajer investasi, dan tidak pernah menerima atau mengelola dana
          trading kamu</b>. Semua aktivitas jual-beli (buy/sell) terjadi di akun broker milik kamu sendiri, di platform broker
          pilihan kamu sendiri. Pembayaran yang kamu lakukan ke kami hanya untuk <b>lisensi penggunaan software/sinyal</b>,
          bukan modal trading.
        </Section>

        <Section title="3. Bukan Nasihat Keuangan">
          Seluruh konten, sinyal, skor, dan analisa di situs maupun EA ini disediakan untuk <b>tujuan informasi dan edukasi</b>,
          bukan rekomendasi atau nasihat keuangan yang dipersonalisasi. Kami bukan penasihat keuangan berlisensi. Sebelum
          mengambil keputusan trading, pertimbangkan profil risiko, kondisi keuangan pribadi, dan — kalau perlu — konsultasikan
          dengan penasihat keuangan atau profesional hukum yang berlisensi.
        </Section>

        <Section title="4. Risiko Trading">
          Trading instrumen leverage seperti forex, emas (XAU), dan aset kripto memiliki risiko kerugian yang signifikan dan
          bisa melebihi modal awal, tergantung leverage yang digunakan. Performa masa lalu (termasuk hasil backtest atau
          statistik win-rate yang ditampilkan) <b>tidak menjamin hasil yang sama di masa depan</b>. Hanya gunakan dana yang
          kamu siap kehilangan sepenuhnya.
        </Section>

        <Section title="5. Status Badan Usaha">
          DaryantoBot Pro saat ini dioperasikan sebagai <b>usaha perorangan</b> dan belum berbentuk badan hukum resmi
          (CV/PT). Kami transparan soal ini agar kamu bisa mempertimbangkan sendiri tingkat risiko sebelum menggunakan
          layanan. Kami sedang mengevaluasi pembentukan badan usaha resmi untuk pengembangan layanan ke depan.
        </Section>

        <Section title="6. Konteks Regulasi di Indonesia">
          Penyediaan nasihat/sinyal berbasis teknologi (Expert Advisor) di bidang perdagangan berjangka komoditi (termasuk
          forex &amp; emas) di Indonesia diatur antara lain oleh <b>Peraturan Bappebti No. 12 Tahun 2022</b>. Aset kripto
          (mis. BTC, ETH) berada di bawah pengawasan Otoritas Jasa Keuangan (OJK), bukan Bappebti. Pastikan broker yang kamu
          gunakan untuk trading forex/emas terdaftar &amp; berizin di Bappebti, dan untuk transaksi kripto menggunakan
          platform yang terdaftar/diawasi OJK. Pilihan dan tanggung jawab pemilihan broker/exchange sepenuhnya ada di tangan
          pengguna.
        </Section>

        <Section title="7. Lisensi &amp; Pembayaran">
          Lisensi yang kamu beli bersifat <b>1 key = 1 akun</b>, non-transferable, dan tunduk pada masa berlaku sesuai tier
          yang dipilih (Demo/Premium/VIP). Pembayaran yang sudah dikonfirmasi tidak dapat dikembalikan (non-refundable),
          kecuali ada kesalahan sistem yang terbukti dari pihak kami.
        </Section>

        <Section title="8. Batasan Tanggung Jawab">
          Sepanjang diizinkan oleh hukum yang berlaku, DaryantoBot Pro tidak bertanggung jawab atas kerugian finansial,
          langsung maupun tidak langsung, yang timbul dari penggunaan sinyal, indikator, atau informasi apa pun di situs
          dan EA ini — termasuk namun tidak terbatas pada kerugian akibat kesalahan eksekusi manual, gangguan koneksi/server
          broker, atau kondisi pasar ekstrem (slippage, gap, requote).
        </Section>

        <Section title="9. Perubahan Kebijakan">
          Dokumen ini dapat diperbarui sewaktu-waktu mengikuti perkembangan layanan maupun regulasi yang berlaku. Versi
          terbaru selalu tersedia di halaman ini.
        </Section>

        <div style={{ height: 1, background: "rgba(0,255,136,0.2)", margin: "36px 0" }} />

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.3em", color: "rgba(0,255,136,0.7)" }}>PRIVACY_POLICY.TXT</div>
          <h2 style={{ marginTop: 8, fontWeight: 900, fontSize: "clamp(18px,4vw,24px)" }}>Kebijakan Privasi</h2>
        </div>

        <Section title="10. Data Pribadi yang Kami Kumpulkan">
          Untuk menjalankan layanan, kami mengumpulkan beberapa data berikut:
          <ul style={{ marginTop: 10, paddingLeft: 20, lineHeight: 1.9 }}>
            <li><b>Email &amp; password</b> — untuk membuat akun &amp; login ke dashboard (diproses lewat Supabase Auth; password disimpan dalam bentuk ter-hash, bukan teks biasa).</li>
            <li><b>Nama &amp; email</b> — yang kamu isi saat proses checkout pembelian lisensi.</li>
            <li><b>ID akun broker</b> — kalau kamu mengikuti program klaim Premium gratis via partner broker.</li>
            <li><b>Bukti pembayaran/deposit (screenshot)</b> — yang kamu kirim ke Admin lewat Telegram untuk verifikasi.</li>
            <li><b>Data teknis dasar</b> — seperti alamat IP dan jenis perangkat/browser, yang otomatis tercatat oleh infrastruktur hosting (Vercel) sebagaimana lazimnya semua situs web.</li>
          </ul>
        </Section>

        <Section title="11. Untuk Apa Data Ini Dipakai">
          Data di atas kami gunakan untuk: autentikasi &amp; akses dashboard, verifikasi pembayaran dan aktivasi license
          key, mencegah penyalahgunaan lisensi (kebijakan 1 key = 1 akun), serta komunikasi dukungan pelanggan. Kami{" "}
          <b>tidak menjual atau menyewakan</b> data pribadi kamu ke pihak ketiga mana pun untuk tujuan pemasaran.
        </Section>

        <Section title="12. Berbagi Data dengan Pihak Ketiga">
          Data kamu diproses oleh penyedia layanan berikut, sebatas yang diperlukan untuk menjalankan sistem:
          <ul style={{ marginTop: 10, paddingLeft: 20, lineHeight: 1.9 }}>
            <li><b>Supabase</b> — penyimpanan akun &amp; database.</li>
            <li><b>Vercel</b> — hosting &amp; infrastruktur situs.</li>
            <li><b>Telegram</b> — kanal komunikasi verifikasi pembayaran &amp; dukungan; percakapan di Telegram tunduk pada kebijakan privasi Telegram sendiri, di luar kendali kami.</li>
          </ul>
          Kami tidak membagikan data kamu ke pihak lain di luar daftar ini tanpa persetujuan, kecuali diwajibkan oleh hukum.
        </Section>

        <Section title="13. Hak Kamu atas Data Pribadi">
          Sesuai UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi, kamu berhak untuk <b>mengakses, meminta koreksi,
          atau meminta penghapusan</b> data pribadimu yang kami simpan. Untuk mengajukan permintaan ini, hubungi Admin
          lewat Telegram di bawah. Data akun akan disimpan selama akun kamu aktif, dan akan dihapus dalam waktu wajar
          setelah permintaan penghapusan diterima dan diverifikasi.
        </Section>

        <Section title="14. Keamanan Data">
          Kami menggunakan layanan pihak ketiga (Supabase, Vercel) yang menerapkan praktik keamanan standar industri
          (enkripsi in-transit, password ter-hash, dsb). Meski begitu, tidak ada sistem yang 100% bebas risiko — kami
          tidak dapat menjamin keamanan absolut atas data yang kamu kirimkan.
        </Section>

        <Section title="15. Perubahan Kebijakan Privasi">
          Kebijakan privasi ini dapat diperbarui sewaktu-waktu mengikuti perkembangan layanan atau regulasi. Versi
          terbaru selalu tersedia di halaman ini.
        </Section>

        <div style={{ marginTop: 40, textAlign: "center", fontSize: 12.5, color: "rgba(255,255,255,0.62)" }}>
          Ada pertanyaan soal disclaimer ini?{" "}
          <a href="https://t.me/daryantobot" target="_blank" rel="noopener noreferrer" style={{ color: "#00FF88" }}>
            Chat Admin di Telegram →
          </a>
        </div>
      </div>
    </main>
  );
}
