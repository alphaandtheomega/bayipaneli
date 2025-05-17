import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import db, {
  updateDbNameByUsername,
  getConnection,
  closeConnection,
} from "./db.js"; // Veritabanı bağlantısı ve fonksiyonları
import fs from "fs"; // File system modülünü ekledim

// .env dosyasını yükle
dotenv.config();

// __dirname değişkenini ESM için tanımla
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001; // Portu 3001 olarak değiştirdim

// Middleware
app.use(cors()); // CORS middleware eklendi
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Veritabanı bağlantısı kontrolü için middleware
app.use(async (req, res, next) => {
  // API isteklerini kontrol et
  if (
    req.path.startsWith("/api/") &&
    req.path !== "/api/login" &&
    req.path !== "/api/logout" &&
    req.path !== "/api/db-status"
  ) {
    try {
      // Bağlantıyı kontrol et ve gerekirse yeniden bağlan
      console.log(
        `[${new Date().toISOString()}] API isteği: ${req.method} ${req.path}`
      );

      // İstek bilgilerini ve veritabanı durumunu kontrol et
      req.db = await getConnection();

      if (!req.db) {
        console.error(
          `[${new Date().toISOString()}] Veritabanı bağlantısı bulunamadı: ${
            req.method
          } ${req.path}`
        );
        return res.status(503).json({
          message:
            "Veritabanı bağlantısı bulunamadı. Lütfen tekrar giriş yapın.",
          error: "NO_DB_CONNECTION",
        });
      }

      // Veritabanı bağlantı durumunu kontrol et
      try {
        // Test sorgusu ile bağlantıyı kontrol et
        const testResult = await req.db.query(
          "SELECT current_database() as current_db"
        );
        console.log(
          `[${new Date().toISOString()}] API isteği için bağlantı kontrolü (${
            req.path
          }): Bağlantılı veritabanı = ${testResult.rows[0].current_db}`
        );
      } catch (testError) {
        console.error(
          `[${new Date().toISOString()}] Veritabanı bağlantı testi başarısız:`,
          testError
        );
        return res.status(500).json({
          message:
            "Veritabanı bağlantısı test edilemedi. Lütfen tekrar giriş yapın.",
          error: "DB_TEST_FAILED",
        });
      }
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] Veritabanı bağlantısı kontrolü sırasında hata:`,
        error
      );
      return res.status(500).json({
        message: "Veritabanı bağlantısı sağlanamadı",
        error: error.message,
      });
    }
  }
  next();
});

// İl ve ilçeleri getiren endpoint
app.get("/api/cities", (req, res) => {
  try {
    const citiesData = fs.readFileSync(
      path.join(__dirname, "data", "cities.json"),
      "utf8"
    );
    const parsedData = JSON.parse(citiesData);
    res.status(200).json(parsedData);
  } catch (error) {
    console.error("İl ve ilçe verileri alınırken hata oluştu:", error);
    res
      .status(500)
      .json({ message: "İl ve ilçe verileri alınamadı: " + error.message });
  }
});
// Modül ekleme api
app.post("/api/moduller", async (req, res) => {
  const { modul_kodu, modul_adi, modul_aciklama } = req.body;

  try {
    const connection = req.db || (await getConnection());
    const newModul = await connection.query(
      'INSERT INTO moduller ("modul_kodu", "modul_adi", "modul_aciklama") VALUES ($1, $2, $3) RETURNING *',
      [modul_kodu, modul_adi, modul_aciklama]
    );
    res.status(201).json(newModul.rows[0]);
  } catch (error) {
    console.error("Modul kaydedilirken hata oluştu:", error);
    res.status(500).json({ message: "Modul kaydedilemedi: " + error.message });
  }
});
// test ekleme api
app.post("/api/test", async (req, res) => {
  const { items, paket_adi } = req.body;

  try {
    const connection = req.db || (await getConnection());
    // Array'i JSON string'e dönüştür
    const itemsJson = JSON.stringify(items);

    const newTest = await connection.query(
      'INSERT INTO test ("items", "paket_adi") VALUES ($1, $2) RETURNING *',
      [itemsJson, paket_adi]
    );
    res.status(201).json(newTest.rows[0]);
  } catch (error) {
    console.error("Test kaydedilirken hata oluştu:", error);
    res.status(500).json({ message: "Test kaydedilemedi: " + error.message });
  }
});

// Modül silme API
app.delete("/api/moduller/:id", async (req, res) => {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query(
      "DELETE FROM moduller WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Silinecek modül bulunamadı" });
    }

    res.status(200).json({
      message: "Modül başarıyla silindi",
      deletedModule: result.rows[0],
    });
  } catch (error) {
    console.error("Modül silinirken hata oluştu:", error);
    res.status(500).json({ message: "Modül silinemedi: " + error.message });
  }
});

// Modül listeme api
app.get("/api/moduller", async (req, res) => {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query(
      "SELECT * FROM moduller ORDER BY id ASC"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Modül bilgileri alınırken hata oluştu:", error);
    res
      .status(500)
      .json({ message: "Modül bilgileri alınamadı: " + error.message });
  }
});

//müşteri ekleme api
app.post("/api/musteriler", async (req, res) => {
  const {
    unvan,
    yetkili,
    eposta,
    il,
    ilce,
    vergi_dairesi,
    vergi_no,
    tel,
    cep_tel,
    adres,
  } = req.body;

  try {
    const connection = req.db || (await getConnection());
    const newMusteri = await connection.query(
      'INSERT INTO musteri ("unvan", "yetkili", "eposta", "il", "ilce", "vergi_dairesi", "vergi_no", "tel", "cep_tel", "adres") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [
        unvan,
        yetkili,
        eposta,
        il,
        ilce,
        vergi_dairesi,
        vergi_no,
        tel,
        cep_tel,
        adres,
      ]
    );
    res.status(201).json(newMusteri.rows[0]);
  } catch (error) {
    console.error("Müşteri kaydedilirken hata oluştu:", error);
    res
      .status(500)
      .json({ message: "Müşteri kaydedilemedi: " + error.message });
  }
});
// Basit bir test rotası
app.post("/api/bayiler", async (req, res) => {
  const {
    bayi_kodu,
    bayi_sifre,
    unvan,
    firma_sahibi,
    bayi_tipi,
    il,
    ilce,
    adres,
    eposta,
    telefon,
    cep_telefon,
    sorumlu_kisi,
    ust_bayi,
  } = req.body;

  if (!bayi_kodu || !bayi_sifre) {
    return res.status(400).json({ message: "Bayi kodu ve şifre gereklidir" });
  }

  try {
    const connection = req.db || (await getConnection());
    const newBayi = await connection.query(
      'INSERT INTO bayiler ("bayi_kodu", "bayi_sifre", "unvan", "firma_sahibi", "bayi_tipi", "il", "ilce", "adres", "eposta", "telefon", "cep_telefon", "sorumlu_kisi", "ust_bayi") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
      [
        bayi_kodu,
        bayi_sifre,
        unvan,
        firma_sahibi,
        bayi_tipi,
        il,
        ilce,
        adres,
        eposta,
        telefon,
        cep_telefon,
        sorumlu_kisi,
        ust_bayi,
      ]
    );
    res.status(201).json(newBayi.rows[0]);
  } catch (error) {
    console.error("Bayi kaydedilirken hata oluştu:", error);
    res.status(500).json({ message: "Bayi kaydedilemedi: " + error.message });
  }
});
// paket ekleme api
app.post("/api/paketler", async (req, res) => {
  const { items, paket_kodu, paket_adi, paket_aciklama } = req.body;

  try {
    const connection = req.db || (await getConnection());
    // Array'i JSON string'e dönüştür
    const itemsJson = JSON.stringify(items);

    const newTest = await connection.query(
      'INSERT INTO paketler ("paket_modul", "paket_kodu", "paket_adi", "paket_aciklama") VALUES ($1, $2, $3, $4) RETURNING *',
      [itemsJson, paket_kodu, paket_adi, paket_aciklama]
    );
    res.status(201).json(newTest.rows[0]);
  } catch (error) {
    console.error("Paket kaydedilirken hata oluştu:", error);
    res.status(500).json({ message: "Paket kaydedilemedi: " + error.message });
  }
});

// lisans ekleme api
app.post("/api/lisanslar", async (req, res) => {
  const {
    bayi_adi,
    musteri_adi,
    paket_adi,
    kullanici_sayisi,
    lisans_suresi,
    is_demo,
    items,
    lisans_kodu,
    yetkili,
    aktif,
    kilit,
  } = req.body;

  try {
    const connection = req.db || (await getConnection());
    // Array'i JSON string'e dönüştür
    const itemsJson = JSON.stringify(items);

    const newTest = await connection.query(
      'INSERT INTO lisans ("bayi_adi", "musteri_adi", "paket_adi", "kullanici_sayisi", "lisans_suresi","is_demo", "items", "lisans_kodu", "yetkili", "aktif", "kilit" ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [
        bayi_adi,
        musteri_adi,
        paket_adi,
        kullanici_sayisi,
        lisans_suresi,
        is_demo,
        itemsJson,
        lisans_kodu,
        yetkili,
        aktif,
        kilit,
      ]
    );
    res.status(201).json(newTest.rows[0]);
  } catch (error) {
    console.error("Lisans kaydedilirken hata oluştu:", error);
    res.status(500).json({ message: "Lisans kaydedilemedi: " + error.message });
  }
});
// lisans getirme api
app.get("/api/lisans", async (req, res) => {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query(
      "SELECT * FROM lisans ORDER BY id DESC"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Lisans alınırken hata oluştu:", error);
    res.status(500).json({ message: "Lisans alınamadı: " + error.message });
  }
});

// Lisansları filtreleme endpoint'i
app.get("/api/lisans/filter", async (req, res) => {
  try {
    console.log("Gelen lisans filtreleme parametreleri:", req.query);

    // Query parametrelerini al
    const { lisans, musteri, bayi, paket, il, aktiflik_durumu, lisans_tipi, yetkili } =
      req.query; // İl filtresini müşteri tablosu üzerinden yapmak için JOIN sorgusu kullanacağız
    let query;
    const queryParams = [];
    let paramIndex = 1;

    // İl filtresi varsa JOIN ile sorgu yapılandırma
    if (il) {
      query = `
        SELECT l.* 
        FROM lisans l
        LEFT JOIN musteri m ON l.musteri_adi = m.unvan
        WHERE 1=1
      `;

      query += ` AND m.il ILIKE $${paramIndex}`;
      queryParams.push(`%${il}%`);
      paramIndex++;
    } else {
      // İl filtresi yoksa basit sorgu
      query = "SELECT * FROM lisans WHERE 1=1";
    }

    // Diğer filtreleri ekleyelim
    if (lisans) {
      query += ` AND lisans_kodu ILIKE $${paramIndex}`;
      queryParams.push(`%${lisans}%`);
      paramIndex++;
    }

    if (musteri) {
      query += ` AND musteri_adi ILIKE $${paramIndex}`;
      queryParams.push(`%${musteri}%`);
      paramIndex++;
    }

    if (bayi) {
      query += ` AND bayi_adi ILIKE $${paramIndex}`;
      queryParams.push(`%${bayi}%`);
      paramIndex++;
    }

    if (paket) {
      query += ` AND paket_adi ILIKE $${paramIndex}`;
      queryParams.push(`%${paket}%`);
      paramIndex++;
    }

    if (yetkili) {
      query += ` AND yetkili ILIKE $${paramIndex}`;
      queryParams.push(`%${yetkili}%`);
      paramIndex++;
    }

    if (aktiflik_durumu) {
      query += ` AND aktif = $${paramIndex}`;
      queryParams.push(aktiflik_durumu === "true");
      paramIndex++;
    }

    if (lisans_tipi) {
      query += ` AND is_demo = $${paramIndex}`;
      queryParams.push(lisans_tipi === "demo");
      paramIndex++;
    }

    // Sonuçları sırala
    query += " ORDER BY id DESC";

    console.log("Oluşturulan lisans sorgusu:", query);
    console.log("Sorgu parametreleri:", queryParams);

    // Sorguyu çalıştır
    const connection = req.db || (await getConnection());
    const result = await connection.query(query, queryParams);


    
    console.log(
      `Filtreleme sonucunda ${result.rows.length} lisans kaydı bulundu`
    );

    
    // Sonuçları döndür
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Lisans filtreleme işlemi sırasında hata oluştu:", error);
    res.status(500).json({
      message: "Lisans filtreleme işlemi sırasında bir hata oluştu",
      error: error.message,
    });
  }
});

// Bayi ünvanları listeleme api
app.get("/api/bayiler/unvan", async (req, res) => {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query(
      "SELECT id, unvan FROM bayiler ORDER BY unvan"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Bayi ünvanları alınırken hata oluştu:", error);
    res
      .status(500)
      .json({ message: "Bayi ünvanları alınamadı: " + error.message });
  }
});
// Müşteri ünvanları listeleme api
app.get("/api/musteri/unvan", async (req, res) => {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query(
      "SELECT id, unvan FROM musteri ORDER BY unvan"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Müşteri ünvanları alınırken hata oluştu:", error);
    res
      .status(500)
      .json({ message: "Müşteri ünvanları alınamadı: " + error.message });
  }
});
// Paket adlarını listeleme api
app.get("/api/paket/paket_adi", async (req, res) => {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query(
      "SELECT id, paket_adi FROM paketler ORDER BY paket_adi"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Paket adları alınırken hata oluştu:", error);
    res
      .status(500)
      .json({ message: "Paket adları  alınamadı: " + error.message });
  }
});

// Paket listeme api
app.get("/api/paketler", async (req, res) => {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query(
      "SELECT * FROM paketler ORDER BY id DESC"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Paket bilgileri alınırken hata oluştu:", error);
    res
      .status(500)
      .json({ message: "Paket bilgileri alınamadı: " + error.message });
  }
});
// Bayi listeme api
app.get("/api/bayiler", async (req, res) => {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query(
      "SELECT * FROM bayiler ORDER BY id DESC"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Bayiler alınırken hata oluştu:", error);
    res.status(500).json({ message: "Bayiler alınamadı: " + error.message });
  }
});
//Bayileri idye göre getirme api
app.get("/api/bayiler/:id", async (req, res) => {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query(
      "SELECT * FROM bayiler WHERE id = $1",
      [req.params.id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("İlgi idye sahip bayi yok!:", error);
    res.status(500).json({ message: "Bayi alınamadı: " + error.message });
  }
});

//lisans idye göre getirme api
app.get("/api/lisans/:id", async (req, res) => {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query(
      "SELECT * FROM lisans WHERE id = $1",
      [req.params.id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("ilgili idye sahip lisans yok!:", error);
    res.status(500).json({ message: "lisans alınamadı: " + error.message });
  }
});
//Paketleri idye göre getirme api
app.get("/api/paketler/:id", async (req, res) => {
  try {
    const connection = req.db || (await getConnection());

    // Paketi çek
    const paketResult = await connection.query(
      "SELECT * FROM paketler WHERE id = $1",
      [req.params.id]
    );

    if (paketResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Bu ID'ye sahip paket bulunamadı" });
    }

    // Paketi doğrudan döndür
    res.status(200).json(paketResult.rows);
  } catch (error) {
    console.error("Paket alınırken hata oluştu:", error);
    res.status(500).json({ message: "Paket alınamadı: " + error.message });
  }
});

//Modülleri idye göre getirme api
app.get("/api/moduller/:id", async (req, res) => {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query(
      "SELECT * FROM moduller WHERE id = $1",
      [req.params.id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("modül idye sahip modül yok!:", error);
    res.status(500).json({ message: "Modül alınamadı: " + error.message });
  }
});
//Müşteri listeleme api
app.get("/api/musteriler", async (req, res) => {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query(
      "SELECT * FROM musteri ORDER BY id DESC"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Müşteriler alınırken hata oluştu:", error);
    res.status(500).json({ message: "Müşteriler alınamadı: " + error.message });
  }
});

//Müşterileri idye göre listeleme api
app.get("/api/musteriler/:id", async (req, res) => {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query(
      "SELECT * FROM musteri WHERE id = $1",
      [req.params.id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("İlgi idye sahip müşteri yok!:", error);
    res.status(500).json({ message: "Müşteri alınamadı: " + error.message });
  }
});

// Müşteri silme API
app.delete("/api/musteriler/:id", async (req, res) => {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query(
      "DELETE FROM musteri WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Silinecek müşteri bulunamadı" });
    }

    res.status(200).json({
      message: "Müşteri başarıyla silindi",
      deletedCustomer: result.rows[0],
    });
  } catch (error) {
    console.error("Müşteri silinirken hata oluştu:", error);
    res.status(500).json({ message: "Müşteri silinemedi: " + error.message });
  }
});
// Müşteri silme API
app.delete("/api/paketler/:id", async (req, res) => {
  try {
    const connection = req.db || (await getConnection());
    const result = await connection.query(
      "DELETE FROM paketler WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Silinecek paket bulunamadı" });
    }

    res.status(200).json({
      message: "Paket başarıyla silindi",
      deletedCustomer: result.rows[0],
    });
  } catch (error) {
    console.error("Paket silinirken hata oluştu:", error);
    res.status(500).json({ message: "Paket silinemedi: " + error.message });
  }
});

// Müşteri güncelleme API
app.put("/api/musteriler/:id", async (req, res) => {
  try {
    const {
      unvan,
      yetkili,
      eposta,
      il,
      ilce,
      vergi_dairesi,
      vergi_no,
      tel,
      cep_tel,
      adres,
    } = req.body;

    const connection = req.db || (await getConnection());
    const result = await connection.query(
      'UPDATE musteri SET "unvan" = $1, "yetkili" = $2, "eposta" = $3, "il" = $4, "ilce" = $5, "vergi_dairesi" = $6, "vergi_no" = $7, "tel" = $8, "cep_tel" = $9, "adres" = $10 WHERE id = $11 RETURNING *',
      [
        unvan,
        yetkili,
        eposta,
        il,
        ilce,
        vergi_dairesi,
        vergi_no,
        tel,
        cep_tel,
        adres,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Güncellenecek müşteri bulunamadı" });
    }

    res.status(200).json({
      message: "Müşteri başarıyla güncellendi",
      updatedCustomer: result.rows[0],
    });
  } catch (error) {
    console.error("Müşteri güncellenirken hata oluştu:", error);
    res
      .status(500)
      .json({ message: "Müşteri güncellenemedi: " + error.message });
  }
});

// Lisans güncelleme API
app.put("/api/lisansduzenle/:id", async (req, res) => {
  try {
    const {
      bayi_adi,
      musteri_adi,
      paket_adi,
      kullanici_sayisi,
      lisans_suresi,
      is_demo,
      items,
      lisans_kodu,
      yetkili,
      aktif,
      kilit,
    } = req.body;

    const connection = req.db || (await getConnection());
    const itemsJson = JSON.stringify(items);
    const result = await connection.query(
      'UPDATE lisans SET "bayi_adi" = $1, "musteri_adi" = $2, "paket_adi" = $3, "kullanici_sayisi" = $4, "lisans_suresi" = $5, "is_demo" = $6, "items" = $7, "lisans_kodu" = $8, "yetkili" = $9, "aktif" = $10, "kilit" = $11 WHERE id = $12 RETURNING *',
      [
        bayi_adi,
        musteri_adi,
        paket_adi,
        kullanici_sayisi,
        lisans_suresi,
        is_demo,
        itemsJson,
        lisans_kodu,
        yetkili,
        aktif,
        kilit,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Güncellenecek lisans bulunamadı" });
    }

    res.status(200).json({
      message: "Lisans başarıyla güncellendi",
      updatedCustomer: result.rows[0],
    });
  } catch (error) {
    console.error("Lisans güncellenirken hata oluştu:", error);
    res
      .status(500)
      .json({ message: "Lisans güncellenemedi: " + error.message });
  }
});

// Paket duzenle güncelleme API
app.put("/api/paketler/:id", async (req, res) => {
  try {
    const { paket_kodu, paket_adi, paket_aciklama, items } = req.body;

    // Array'i JSON string'e dönüştür
    const itemsJson = JSON.stringify(items);

    const connection = req.db || (await getConnection());
    const result = await connection.query(
      'UPDATE paketler SET "paket_kodu" = $1, "paket_adi" = $2, "paket_aciklama" = $3, "paket_modul" = $4 WHERE id = $5 RETURNING *',
      [paket_kodu, paket_adi, paket_aciklama, itemsJson, req.params.id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Güncellenecek paket bulunamadı" });
    }

    res.status(200).json({
      message: "Paket başarıyla güncellendi",
      updatedCustomer: result.rows[0],
    });
  } catch (error) {
    console.error("Paket güncellenirken hata oluştu:", error);
    res.status(500).json({ message: "Paket güncellenemedi: " + error.message });
  }
});
// Modül güncelleme API
app.put("/api/moduller/:id", async (req, res) => {
  try {
    const { modul_kodu, modul_adi, modul_aciklama } = req.body;

    const connection = req.db || (await getConnection());
    const result = await connection.query(
      'UPDATE moduller SET "modul_kodu" = $1, "modul_adi" = $2, "modul_aciklama" = $3 WHERE id = $4 RETURNING *',
      [modul_kodu, modul_adi, modul_aciklama, req.params.id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Güncellenecek modül bulunamadı" });
    }

    res.status(200).json({
      message: "Modül başarıyla güncellendi",
      updatedCustomer: result.rows[0],
    });
  } catch (error) {
    console.error("Modül güncellenirken hata oluştu:", error);
    res.status(500).json({ message: "Modül güncellenemedi: " + error.message });
  }
});
// Bayi güncelleme API
app.put("/api/bayiler/:id", async (req, res) => {
  try {
    const {
      bayi_kodu,
      bayi_sifre,
      unvan,
      firma_sahibi,
      bayi_tipi,
      il,
      ilce,
      adres,
      eposta,
      telefon,
      cep_telefon,
      sorumlu_kisi,
      ust_bayi,
    } = req.body;

    const connection = req.db || (await getConnection());
    const result = await connection.query(
      'UPDATE bayiler SET "bayi_kodu" = $1, "bayi_sifre" = $2, "unvan" = $3, "firma_sahibi" = $4, "bayi_tipi" = $5, "il" = $6, "ilce" = $7, "adres" = $8, "eposta" = $9, "telefon" = $10, "cep_telefon" = $11, "sorumlu_kisi" = $12, "ust_bayi" = $13 WHERE id = $14 RETURNING *',
      [
        bayi_kodu,
        bayi_sifre,
        unvan,
        firma_sahibi,
        bayi_tipi,
        il,
        ilce,
        adres,
        eposta,
        telefon,
        cep_telefon,
        sorumlu_kisi,
        ust_bayi,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Güncellenecek bayi bulunamadı" });
    }

    res.status(200).json({
      message: "Bayi başarıyla güncellendi",
      updatedCustomer: result.rows[0],
    });
  } catch (error) {
    console.error("Bayi güncellenirken hata oluştu:", error);
    res.status(500).json({ message: "Bayi güncellenemedi: " + error.message });
  }
});

// Bayileri filtreleme endpoint'i
app.get("/api/bayiler/filter", async (req, res) => {
  try {
    console.log("Gelen filtreleme parametreleri:", req.query);

    // Query parametrelerini al
    const { bayi_kodu, unvan, firma_sahibi } = req.query;

    // Dinamik sorgu oluşturma
    let query = "SELECT * FROM bayiler WHERE 1=1";
    const queryParams = [];
    let paramIndex = 1;

    if (bayi_kodu) {
      query += ` AND bayi_kodu ILIKE $${paramIndex}`;
      queryParams.push(`%${bayi_kodu}%`);
      paramIndex++;
    }

    if (unvan) {
      query += ` AND unvan ILIKE $${paramIndex}`;
      queryParams.push(`%${unvan}%`);
      paramIndex++;
    }

    if (firma_sahibi) {
      query += ` AND firma_sahibi ILIKE $${paramIndex}`;
      queryParams.push(`%${firma_sahibi}%`);
      paramIndex++;
    }

    // Sonuçları sırala
    query += " ORDER BY id DESC";

    console.log("Oluşturulan sorgu:", query);
    console.log("Sorgu parametreleri:", queryParams);

    // Sorguyu çalıştır
    const connection = req.db || (await getConnection());
    const result = await connection.query(query, queryParams);

    console.log(`Filtreleme sonucunda ${result.rows.length} kayıt bulundu`);

    // Sonuçları döndür
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Filtreleme işlemi sırasında hata oluştu:", error);
    res.status(500).json({
      message: "Filtreleme işlemi sırasında bir hata oluştu",
      error: error.message,
    });
  }
});

// Kullanıcı giriş endpoint'i
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Kullanıcı adı gereklidir" });
  }

  try {
    console.log(
      `[${new Date().toISOString()}] Kullanıcı giriş yapıyor: ${username}`
    );

    // Tüm veritabanı bağlantılarını sıfırla ve yeni bağlantı kur
    const updatedDb = await updateDbNameByUsername(username);

    console.log(
      `[${new Date().toISOString()}] ${username} kullanıcısı için veritabanı adı ayarlandı: ${
        process.env.DB_NAME
      }`
    );

    // Test sorgusu yap (bağlantıyı kontrol etmek için)
    try {
      const dbTest = await updatedDb.query(
        "SELECT current_database() as db_name"
      );
      console.log(
        `[${new Date().toISOString()}] Bağlantı testi başarılı, bağlı veritabanı: ${
          dbTest.rows[0].db_name
        }`
      );

      if (dbTest.rows[0].db_name !== process.env.DB_NAME) {
        console.error(
          `[${new Date().toISOString()}] UYARI: Bağlanılan veritabanı (${
            dbTest.rows[0].db_name
          }) beklenenden farklı (${process.env.DB_NAME})`
        );
      }
    } catch (testError) {
      console.error(
        `[${new Date().toISOString()}] Bağlantı testi başarısız:`,
        testError
      );
      throw new Error(
        "Veritabanı bağlantısı kontrolü başarısız: " + testError.message
      );
    }

    // Kullanıcı bilgilerini döndür
    res.status(200).json({
      message: "Veritabanı bağlantısı başarılı",
      user: {
        username: username,
      },
      database: process.env.DB_NAME,
    });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Veritabanı bağlantısı sırasında hata:`,
      error
    );
    res
      .status(500)
      .json({ message: "Veritabanı bağlantısı sağlanamadı: " + error.message });
  }
});

// Kullanıcı çıkış endpoint'i
app.post("/api/logout", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Kullanıcı adı gereklidir" });
  }

  try {
    console.log(
      `[${new Date().toISOString()}] Kullanıcı çıkış yapıyor: ${username}`
    );

    // Tüm veritabanı bağlantılarını resetle
    const { resetAllConnections } = await import("./db.js");
    await resetAllConnections();

    console.log(
      `[${new Date().toISOString()}] ${username} kullanıcısı için tüm veritabanı bağlantıları kapatıldı ve bellek temizlendi`
    );

    res.status(200).json({
      message: "Başarıyla çıkış yapıldı",
      success: true,
    });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Çıkış yapılırken hata oluştu:`,
      error
    );
    res.status(500).json({
      message: "Çıkış yapılamadı: " + error.message,
      success: false,
    });
  }
});

// Veritabanı durum kontrolü endpoint'i
app.get("/api/db-status", async (req, res) => {
  try {
    const connection = await getConnection();
    if (connection) {
      // Basit sorgu ile bağlantıyı test et
      await connection.query("SELECT 1");
      res.status(200).json({
        status: "connected",
        database: process.env.DB_NAME,
      });
    } else {
      res.status(200).json({
        status: "disconnected",
      });
    }
  } catch (error) {
    console.error("Veritabanı durum kontrolü sırasında hata:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// Lisans aktif durumunu değiştiren endpoint
app.put("/api/lisanslar/:id/toggle-aktif", async (req, res) => {
  try {
    const { id } = req.params;
    const { aktif } = req.body;

    const connection = req.db || (await getConnection());
    const result = await connection.query(
      'UPDATE lisans SET "aktif" = $1 WHERE id = $2 RETURNING *',
      [aktif, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Lisans bulunamadı" });
    }

    res.status(200).json({
      message: "Lisans aktif durumu başarıyla güncellendi",
      updatedLisans: result.rows[0],
    });
  } catch (error) {
    console.error("Lisans aktif durumu güncellenirken hata oluştu:", error);
    res.status(500).json({
      message: "Lisans aktif durumu güncellenemedi",
      error: error.message,
    });
  }
});

// Lisans kilit durumunu değiştiren endpoint
app.put("/api/lisanslar/:id/toggle-kilit", async (req, res) => {
  try {
    const { id } = req.params;
    const { kilit } = req.body;

    const connection = req.db || (await getConnection());
    const result = await connection.query(
      'UPDATE lisans SET "kilit" = $1 WHERE id = $2 RETURNING *',
      [kilit, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Lisans bulunamadı" });
    }

    res.status(200).json({
      message: "Lisans kilit durumu başarıyla güncellendi",
      updatedLisans: result.rows[0],
    });
  } catch (error) {
    console.error("Lisans kilit durumu güncellenirken hata oluştu:", error);
    res.status(500).json({
      message: "Lisans kilit durumu güncellenemedi",
      error: error.message,
    });
  }
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});

export default app;
