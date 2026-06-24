import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const products = [
  // ─── ABAYA ───────────────────────────────────────────────────
  {
    name: "Premium Black Abaya",
    category: "Abaya",
    description: "Luxurious black abaya crafted from premium chiffon with delicate lace trim. Effortlessly elegant and modest for everyday wear.",
    price: 3200,
    discountPrice: 2800,
    images: ["/abaya/abaya1.jpg", "/abaya/abaya2.jpg"],
    stock: 25,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black"],
  },
  {
    name: "Embroidered Abaya Set",
    category: "Abaya",
    description: "Beautifully embroidered abaya with matching hijab. Fine golden thread work on cuffs and hem makes it perfect for special occasions.",
    price: 4500,
    discountPrice: 3800,
    images: ["/abaya/abaya3.jpg", "/abaya/abaya4.jpg"],
    stock: 18,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy Blue"],
  },
  {
    name: "Modern Butterfly Abaya",
    category: "Abaya",
    description: "Contemporary butterfly-style open abaya in soft nida fabric. Lightweight and breathable — ideal for Pakistani summer.",
    price: 3800,
    discountPrice: 3200,
    images: ["/abaya/abaya5.jpg", "/abaya/abaya6.jpg"],
    stock: 30,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Black", "Dark Grey"],
  },
  {
    name: "Luxury Open Abaya",
    category: "Abaya",
    description: "Elegant open-front abaya with satin border detailing. A premium choice for weddings, eid celebrations and formal gatherings.",
    price: 5500,
    discountPrice: 4500,
    images: ["/abaya/abaya7.jpg", "/abaya/abaya8.jpg"],
    stock: 12,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Maroon"],
  },

  // ─── JUBBA ───────────────────────────────────────────────────
  {
    name: "Classic White Jubba",
    category: "Jubba",
    description: "Timeless white thobe crafted from premium Egyptian cotton. Offers unmatched comfort and breathability for prayers and daily wear.",
    price: 3500,
    discountPrice: 2800,
    images: ["/jubba/jubba1.jpg", "/jubba/jubba2.jpg"],
    stock: 40,
    sizes: ["S", "M", "L", "XL", "XXL", "3XL"],
    colors: ["White"],
  },
  {
    name: "Saudi Style Thobe",
    category: "Jubba",
    description: "Premium Saudi-inspired thobe with collarless design and fine stitching. Elegant for Jummah prayers and formal Islamic occasions.",
    price: 4200,
    discountPrice: 3500,
    images: ["/jubba/jubba3.jpg", "/jubba/jubba4.jpg"],
    stock: 22,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["White", "Cream", "Light Grey"],
  },
  {
    name: "Premium Cotton Jubba",
    category: "Jubba",
    description: "Soft cotton jubba with traditional Pakistani embroidery on the collar. Suitable for both casual wear and prayers.",
    price: 2800,
    discountPrice: null,
    images: ["/jubba/jubba5.jpg", "/jubba/jubba6.jpg"],
    stock: 35,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Off-White"],
  },
  {
    name: "Royal Embroidered Jubba",
    category: "Jubba",
    description: "Regal jubba featuring intricate hand embroidery on the chest panel. A distinguished choice for Eid, Nikah and special occasions.",
    price: 6500,
    discountPrice: 5500,
    images: ["/jubba/jubba2.jpg", "/jubba/jubba5.jpg"],
    stock: 10,
    sizes: ["M", "L", "XL"],
    colors: ["White", "Ivory"],
  },

  // ─── TOPI ────────────────────────────────────────────────────
  {
    name: "White Kufi Prayer Cap",
    category: "Topi",
    description: "Classic white cotton kufi cap — the most popular style across Pakistan. Comfortable, breathable and perfectly shaped.",
    price: 450,
    discountPrice: null,
    images: ["/PrayerCap/cap1.jpg"],
    stock: 100,
    sizes: ["Small", "Medium", "Large"],
    colors: ["White"],
  },
  {
    name: "Premium Mesh Topi",
    category: "Topi",
    description: "Breathable mesh topi ideal for warm weather. Keeps you cool during prayers while maintaining a clean traditional look.",
    price: 380,
    discountPrice: 320,
    images: ["/PrayerCap/topi2.jpg"],
    stock: 75,
    sizes: ["Small", "Medium", "Large", "XL"],
    colors: ["White", "Cream"],
  },
  {
    name: "Knitted Wool Topi",
    category: "Topi",
    description: "Warm knitted wool topi for winter prayers. Soft texture, snug fit and traditional styling for colder months.",
    price: 650,
    discountPrice: 550,
    images: ["/PrayerCap/topi3.jpg"],
    stock: 50,
    sizes: ["Medium", "Large"],
    colors: ["White", "Off-White", "Light Beige"],
  },

  // ─── TASBIH ──────────────────────────────────────────────────
  {
    name: "Crystal Tasbih 99 Beads",
    category: "Tasbih",
    description: "Beautiful crystal tasbih with 99 hand-polished beads. Each bead captures light beautifully, making dhikr a spiritually uplifting experience.",
    price: 1200,
    discountPrice: 950,
    images: ["/tasbih/tasbih1.jpg", "/tasbih/tasbih2.jpg"],
    stock: 45,
    sizes: [],
    colors: ["Crystal Clear", "Rose Crystal", "Amethyst"],
  },
  {
    name: "Natural Wooden Tasbih",
    category: "Tasbih",
    description: "Handcrafted wooden tasbih from natural rosewood. Warm texture, earthy scent and a timeless connection to tradition.",
    price: 750,
    discountPrice: null,
    images: ["/tasbih/tasbih3.jpg", "/tasbih/tasbih4.jpg"],
    stock: 60,
    sizes: [],
    colors: ["Rosewood Brown", "Dark Walnut"],
  },
  {
    name: "Pearl Tasbih Luxury",
    category: "Tasbih",
    description: "Premium pearl tasbih with sterling silver separator beads. An heirloom-quality gift for Hajj, Eid or any sacred occasion.",
    price: 2200,
    discountPrice: 1800,
    images: ["/tasbih/tasbih5.jpg", "/tasbih/tasbih6.jpg"],
    stock: 20,
    sizes: [],
    colors: ["White Pearl", "Cream Pearl"],
  },
  {
    name: "Elegant Counting Tasbih",
    category: "Tasbih",
    description: "Smooth matte tasbih with 33 beads for compact portability. Perfect for travel, pocket dhikr or gifting.",
    price: 850,
    discountPrice: 720,
    images: ["/tasbih/tasbih7.jpg", "/tasbih/tasbih8.jpg"],
    stock: 55,
    sizes: [],
    colors: ["Green", "Blue", "Black"],
  },

  // ─── JAINAMAZ ────────────────────────────────────────────────
  {
    name: "Classic Velvet Prayer Mat",
    category: "Jainamaz",
    description: "Soft velvet jainamaz with mosque arch design. Thick cushioning provides comfort during long prayers. Machine washable.",
    price: 1400,
    discountPrice: 1200,
    images: ["/jainamaz/jainamaz1.jpg", "/jainamaz/jainamaz2.jpg"],
    stock: 50,
    sizes: [],
    colors: ["Green", "Maroon", "Navy Blue"],
  },
  {
    name: "Premium Embroidered Jainamaz",
    category: "Jainamaz",
    description: "Richly embroidered prayer mat with Kaaba motif. High-density foam padding for ultimate comfort. A beautiful Eid gift.",
    price: 2500,
    discountPrice: 2000,
    images: ["/jainamaz/jainamaz3.jpg", "/jainamaz/jainamaz4.jpg"],
    stock: 30,
    sizes: [],
    colors: ["Maroon & Gold", "Green & Gold", "Blue & Gold"],
  },
  {
    name: "Travel Portable Prayer Mat",
    category: "Jainamaz",
    description: "Lightweight foldable jainamaz with carry pouch. Compact size makes it easy to carry in your bag for prayers anywhere.",
    price: 950,
    discountPrice: 800,
    images: ["/jainamaz/jainamaz5.jpg", "/jainamaz/jainamaz6.jpg"],
    stock: 80,
    sizes: [],
    colors: ["Beige", "Grey", "Blue"],
  },
  {
    name: "Luxury Musallah Set",
    category: "Jainamaz",
    description: "Complete musallah set with matching tasbih and Quran bookmark. Premium quality gift box included. Perfect for Ramadan and Eid.",
    price: 3500,
    discountPrice: 2800,
    images: ["/jainamaz/jainamaz7.jpg", "/jainamaz/jainamaz8.jpg"],
    stock: 15,
    sizes: [],
    colors: ["Maroon", "Emerald Green"],
  },

  // ─── FRAGRANCES ──────────────────────────────────────────────
  {
    name: "Oud Al Shams Attar",
    category: "Fragrances",
    description: "Rich and opulent oud attar with notes of saffron, amber and dark wood. Long-lasting alcohol-free fragrance, Halal certified.",
    price: 2200,
    discountPrice: 1800,
    images: ["/Fragrances1.jpg", "/fragrances/fragrances2.jpg"],
    stock: 35,
    sizes: ["3ml", "6ml", "12ml"],
    colors: [],
  },
  {
    name: "Rose Musk Attar",
    category: "Fragrances",
    description: "Delicate blend of Bulgarian rose and white musk. Light, feminine and perfect for daily wear. Alcohol-free and skin-friendly.",
    price: 1600,
    discountPrice: 1400,
    images: ["/fragrances/fragrances3.jpg", "/fragrances/fragrances4.jpg"],
    stock: 40,
    sizes: ["3ml", "6ml", "12ml"],
    colors: [],
  },
  {
    name: "Bukhoor Al Noor",
    category: "Fragrances",
    description: "Traditional bukhoor made from natural agarwood chips. Burn to fill your home with the sacred scent of the Arabian peninsula.",
    price: 1800,
    discountPrice: null,
    images: ["/fragrances/fragrances2.jpg", "/Fragrances1.jpg"],
    stock: 25,
    sizes: ["50g", "100g"],
    colors: [],
  },
  {
    name: "Amber Oud Collection",
    category: "Fragrances",
    description: "Warm amber meets aged oud in this exclusive Pakistani blend. Inspired by the grand mosques of Madinah. Alcohol-free.",
    price: 2800,
    discountPrice: 2400,
    images: ["/fragrances/fragrances4.jpg", "/fragrances/fragrances3.jpg"],
    stock: 20,
    sizes: ["6ml", "12ml", "24ml"],
    colors: [],
  },

  // ─── BOOKS ───────────────────────────────────────────────────
  {
    name: "Quran Majeed — Urdu Translation",
    category: "Books",
    description: "Complete Quran Majeed with clear Urdu translation by Maulana Fateh Muhammad Jalandhari. Large font, hardcover binding.",
    price: 950,
    discountPrice: 800,
    images: ["/books/book1.jpg", "/books/book2.jpg"],
    stock: 60,
    sizes: [],
    colors: ["Maroon", "Green", "Black"],
  },
  {
    name: "Sahih Al-Bukhari (2 Volumes)",
    category: "Books",
    description: "Complete Sahih Al-Bukhari in Urdu translation. Authentic hadith collection by Imam Bukhari, essential for every Muslim household.",
    price: 1800,
    discountPrice: 1500,
    images: ["/books/book3.jpg", "/books/book4.jpg"],
    stock: 30,
    sizes: [],
    colors: [],
  },
  {
    name: "Riyad us Saliheen",
    category: "Books",
    description: "Imam Nawawi's classic collection of Prophetic hadith for everyday Islamic guidance. Easy Urdu translation with Arabic text.",
    price: 750,
    discountPrice: null,
    images: ["/books/book5.jpg", "/books/book6.jpg"],
    stock: 45,
    sizes: [],
    colors: [],
  },
  {
    name: "Seerat-un-Nabi",
    category: "Books",
    description: "Comprehensive biography of Prophet Muhammad ﷺ by Shibli Nomani and Syed Sulaiman Nadwi. A must-read classic in Urdu literature.",
    price: 1200,
    discountPrice: 950,
    images: ["/books/book1.jpg", "/books/book3.jpg"],
    stock: 35,
    sizes: [],
    colors: [],
  },
  {
    name: "Fazail-e-Amal",
    category: "Books",
    description: "Virtues of Islamic practice — widely read compendium of hadith on prayer, Quran recitation, tableegh and dhikr. Urdu edition.",
    price: 650,
    discountPrice: null,
    images: ["/books/book2.jpg", "/books/book4.jpg"],
    stock: 55,
    sizes: [],
    colors: [],
  },
  {
    name: "Islamic Parenting Guide",
    category: "Books",
    description: "Practical Urdu guide on raising children with Islamic values in the modern world. Based on Quran, Sunnah and contemporary research.",
    price: 850,
    discountPrice: 700,
    images: ["/books/book5.jpg", "/books/book6.jpg"],
    stock: 28,
    sizes: [],
    colors: [],
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected.");

    await Product.deleteMany({});
    console.log("Old products cleared.");

    const inserted = await Product.insertMany(products);
    console.log(`\n✓ ${inserted.length} products seeded successfully!\n`);

    const counts = {};
    inserted.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    Object.entries(counts).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} products`);
    });

    console.log("\nDone. Restart your backend to see changes.");
  } catch (err) {
    console.error("Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
