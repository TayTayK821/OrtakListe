// =====================================================================
// TÜM KİŞİSEL AYARLAR BURADA. Başka hiçbir dosyayı değiştirmene gerek yok.
// =====================================================================

export const CONFIG = {
  // Firebase Console > Project settings > General > "Your apps" > SDK setup
  // kısmından kopyala. Bu bilgiler GİZLİ DEĞİLDİR, repoya güvenle koyabilirsin
  // (Firestore Rules erişimi zaten kısıtlıyor — README'ye bak).
  firebase: {
    apiKey: "AIzaSyBLQvQlhCT-6I0yD16-DhKOEP2fOTiSnfI",
    authDomain: "ortakliste-4e358.firebaseapp.com",
    projectId: "ortakliste-4e358",
    storageBucket: "ortakliste-4e358.firebasestorage.app",
    messagingSenderId: "451961589853",
    appId: "1:451961589853:web:1a6d95dd6ed1f77a813db4",
    // measurementId (Analytics) kasıtlı olarak eklemedim, bu site onu kullanmıyor.
  },

  // Firebase Authentication'da oluşturduğun 2 hesabın e-postasını,
  // ekranda görünecek isimle eşleştir.
  people: {
    "tkayali06@hotmail.com": { key: "you", name: "Taylan" },
    "nurkocak04@icloud.com": { key: "partner", name: "Nur" },
  },

  // Hero ve boarding-pass rozetlerindeki şehir kodları.
  cities: { you: "ANK", partner: "WRO" },
};
