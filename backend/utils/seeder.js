// Run `npm run seed` to populate the database with demo products, categories,
// and an admin account for quick testing. All prices are in INR (₹).
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');

const categoryNames = [
  'Smartphones',
  'Laptops',
  'Headphones',
  'Home Appliances',
  'Fashion',
  'Bags',
  'Watches',
];

const demoProducts = [
  // ---- Smartphones ----
  {
    name: 'iPhone 14',
    brand: 'Apple',
    description: 'A15 Bionic chip, dual-camera system, and Ceramic Shield front — reliable all-round performance.',
    price: 65999,
    category: 'Smartphones',
    stock: 18,
    rating: 4.7,
    featured: true,
    image: 'https://picsum.photos/seed/iphone-14/800/800',
  },
  {
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    description: 'Titanium design, A17 Pro chip, and a 48MP main camera for pro-level photography.',
    price: 89999,
    category: 'Smartphones',
    stock: 10,
    rating: 4.8,
    featured: true,
    image: 'https://picsum.photos/seed/iphone-15-pro/800/800',
  },
  {
    name: 'Samsung Galaxy S23',
    brand: 'Samsung',
    description: 'Snapdragon 8 Gen 2 performance with a stunning Dynamic AMOLED display.',
    price: 59999,
    category: 'Smartphones',
    stock: 22,
    rating: 4.6,
    featured: false,
    image: 'https://picsum.photos/seed/samsung-galaxy-s23/800/800',
  },
  {
    name: 'Samsung Galaxy M14',
    brand: 'Samsung',
    description: 'Massive 6000mAh battery and a 50MP triple camera at a budget-friendly price.',
    price: 20999,
    category: 'Smartphones',
    stock: 35,
    rating: 4.3,
    featured: false,
    image: 'https://picsum.photos/seed/samsung-galaxy-m14/800/800',
  },
  {
    name: 'OnePlus Nord CE 3',
    brand: 'OnePlus',
    description: '5G-ready mid-ranger with 67W fast charging and a smooth 120Hz display.',
    price: 27999,
    category: 'Smartphones',
    stock: 28,
    rating: 4.4,
    featured: false,
    image: 'https://picsum.photos/seed/oneplus-nord-ce-3/800/800',
  },

  // ---- Laptops ----
  {
    name: 'ASUS VivoBook 15',
    brand: 'ASUS',
    description: 'Intel Core i5, 16GB RAM and a slim design — perfect for students and everyday work.',
    price: 52990,
    category: 'Laptops',
    stock: 15,
    rating: 4.4,
    featured: true,
    image: 'https://picsum.photos/seed/asus-vivobook-15/800/800',
  },
  {
    name: 'HP Pavilion 14',
    brand: 'HP',
    description: 'Compact and light with a crisp micro-edge display, built for productivity on the go.',
    price: 61990,
    category: 'Laptops',
    stock: 12,
    rating: 4.5,
    featured: false,
    image: 'https://picsum.photos/seed/hp-pavilion-14/800/800',
  },
  {
    name: 'Lenovo IdeaPad Slim 3',
    brand: 'Lenovo',
    description: 'Ryzen 5 processor with a full-HD display — solid value for everyday computing.',
    price: 45990,
    category: 'Laptops',
    stock: 20,
    rating: 4.3,
    featured: false,
    image: 'https://picsum.photos/seed/lenovo-ideapad-slim-3/800/800',
  },
  {
    name: 'Apple MacBook Air M2',
    brand: 'Apple',
    description: 'Fanless M2 chip, all-day battery life, and a stunning Liquid Retina display.',
    price: 114900,
    category: 'Laptops',
    stock: 8,
    rating: 4.9,
    featured: true,
    image: 'https://picsum.photos/seed/apple-macbook-air-m2/800/800',
  },
  {
    name: 'Dell Inspiron 15',
    brand: 'Dell',
    description: 'Reliable everyday laptop with a spacious display and long-lasting battery.',
    price: 48990,
    category: 'Laptops',
    stock: 17,
    rating: 4.2,
    featured: false,
    image: 'https://picsum.photos/seed/dell-inspiron-15/800/800',
  },

  // ---- Headphones ----
  {
    name: 'boAt Rockerz 450',
    brand: 'boAt',
    description: 'Over-ear Bluetooth headphones with 15-hour battery life and punchy bass.',
    price: 1499,
    category: 'Headphones',
    stock: 60,
    rating: 4.2,
    featured: false,
    image: 'https://picsum.photos/seed/boat-rockerz-450/800/800',
  },
  {
    name: 'Sony WH-CH520',
    brand: 'Sony',
    description: 'Lightweight wireless headphones with up to 50 hours of playback.',
    price: 4490,
    category: 'Headphones',
    stock: 35,
    rating: 4.5,
    featured: true,
    image: 'https://picsum.photos/seed/sony-wh-ch520/800/800',
  },
  {
    name: 'JBL Tune 760NC',
    brand: 'JBL',
    description: 'Active noise cancelling headphones with JBL Pure Bass sound.',
    price: 5999,
    category: 'Headphones',
    stock: 25,
    rating: 4.6,
    featured: false,
    image: 'https://picsum.photos/seed/jbl-tune-760nc/800/800',
  },
  {
    name: 'boAt Airdopes 141',
    brand: 'boAt',
    description: 'True wireless earbuds with 42 hours of total playback and ENx tech.',
    price: 1299,
    category: 'Headphones',
    stock: 70,
    rating: 4.1,
    featured: false,
    image: 'https://picsum.photos/seed/boat-airdopes-141/800/800',
  },

  // ---- Home Appliances ----
  {
    name: 'Philips Mixer Grinder 750W',
    brand: 'Philips',
    description: 'Powerful 750W motor with 3 jars — built for everyday Indian kitchens.',
    price: 3495,
    category: 'Home Appliances',
    stock: 30,
    rating: 4.4,
    featured: false,
    image: 'https://picsum.photos/seed/philips-mixer-grinder-750w/800/800',
  },
  {
    name: 'Prestige Induction Cooktop',
    brand: 'Prestige',
    description: 'Energy-efficient induction cooktop with 8 preset menus.',
    price: 2199,
    category: 'Home Appliances',
    stock: 40,
    rating: 4.3,
    featured: false,
    image: 'https://picsum.photos/seed/prestige-induction-cooktop/800/800',
  },
  {
    name: 'Havells Room Heater',
    brand: 'Havells',
    description: 'Compact fan heater with adjustable thermostat for quick winter warmth.',
    price: 1899,
    category: 'Home Appliances',
    stock: 25,
    rating: 4.1,
    featured: false,
    image: 'https://picsum.photos/seed/havells-room-heater/800/800',
  },
  {
    name: 'LG 7kg Front Load Washing Machine',
    brand: 'LG',
    description: '6 Motion DD technology for a gentle yet thorough wash, with low noise operation.',
    price: 29990,
    category: 'Home Appliances',
    stock: 9,
    rating: 4.6,
    featured: true,
    image: 'https://picsum.photos/seed/lg-7kg-front-load-washing-machine/800/800',
  },
  {
    name: 'Voltas 1.5 Ton Split AC',
    brand: 'Voltas',
    description: '5-star rated split AC with fast cooling and copper condenser coils.',
    price: 34990,
    category: 'Home Appliances',
    stock: 11,
    rating: 4.5,
    featured: false,
    image: 'https://picsum.photos/seed/voltas-1-5-ton-split-ac/800/800',
  },

  // ---- Fashion ----
  {
    name: "Levi's Men's Slim Fit Jeans",
    brand: "Levi's",
    description: 'Classic five-pocket slim fit jeans in durable stretch denim.',
    price: 2299,
    category: 'Fashion',
    stock: 45,
    rating: 4.4,
    featured: false,
    image: 'https://picsum.photos/seed/levi-s-men-s-slim-fit-jeans/800/800',
  },
  {
    name: "Roadster Men's Cotton T-Shirt",
    brand: 'Roadster',
    description: 'Breathable, everyday cotton crew-neck t-shirt in a relaxed fit.',
    price: 599,
    category: 'Fashion',
    stock: 90,
    rating: 4.2,
    featured: false,
    image: 'https://picsum.photos/seed/roadster-men-s-cotton-t-shirt/800/800',
  },
  {
    name: "Biba Women's Printed Kurta",
    brand: 'Biba',
    description: 'Elegant printed kurta in soft cotton fabric, perfect for daily wear.',
    price: 1299,
    category: 'Fashion',
    stock: 38,
    rating: 4.5,
    featured: true,
    image: 'https://picsum.photos/seed/biba-women-s-printed-kurta/800/800',
  },
  {
    name: "Puma Men's Running Shoes",
    brand: 'Puma',
    description: 'Lightweight running shoes with cushioned soles for all-day comfort.',
    price: 2999,
    category: 'Fashion',
    stock: 33,
    rating: 4.5,
    featured: false,
    image: 'https://picsum.photos/seed/puma-men-s-running-shoes/800/800',
  },

  // ---- Bags ----
  {
    name: 'American Tourister Backpack',
    brand: 'American Tourister',
    description: 'Spacious laptop backpack with padded straps and multiple compartments.',
    price: 1599,
    category: 'Bags',
    stock: 42,
    rating: 4.3,
    featured: false,
    image: 'https://picsum.photos/seed/american-tourister-backpack/800/800',
  },
  {
    name: 'Wildcraft Travel Duffel Bag',
    brand: 'Wildcraft',
    description: 'Durable 55L duffel bag built for weekend trips and travel.',
    price: 1899,
    category: 'Bags',
    stock: 26,
    rating: 4.4,
    featured: false,
    image: 'https://picsum.photos/seed/wildcraft-travel-duffel-bag/800/800',
  },
  {
    name: 'Fastrack Sling Bag',
    brand: 'Fastrack',
    description: 'Compact unisex sling bag, perfect for daily essentials on the move.',
    price: 899,
    category: 'Bags',
    stock: 50,
    rating: 4.1,
    featured: false,
    image: 'https://picsum.photos/seed/fastrack-sling-bag/800/800',
  },

  // ---- Watches ----
  {
    name: 'Noise ColorFit Pro 4 Smartwatch',
    brand: 'Noise',
    description: 'AMOLED display smartwatch with Bluetooth calling and 100+ sports modes.',
    price: 2999,
    category: 'Watches',
    stock: 55,
    rating: 4.3,
    featured: true,
    image: 'https://picsum.photos/seed/noise-colorfit-pro-4-smartwatch/800/800',
  },
  {
    name: 'Fire-Boltt Ninja Smartwatch',
    brand: 'Fire-Boltt',
    description: 'Budget-friendly smartwatch with SpO2 monitoring and long battery backup.',
    price: 1799,
    category: 'Watches',
    stock: 65,
    rating: 4.0,
    featured: false,
    image: 'https://picsum.photos/seed/fire-boltt-ninja-smartwatch/800/800',
  },
  {
    name: "Titan Analog Men's Watch",
    brand: 'Titan',
    description: 'Classic analog wristwatch with a stainless steel case and leather strap.',
    price: 3495,
    category: 'Watches',
    stock: 30,
    rating: 4.6,
    featured: false,
    image: 'https://picsum.photos/seed/titan-analog-men-s-watch/800/800',
  },
  {
    name: 'Apple Watch SE',
    brand: 'Apple',
    description: 'Advanced health features with crash detection and a bright Retina display.',
    price: 29900,
    category: 'Watches',
    stock: 14,
    rating: 4.8,
    featured: true,
    image: 'https://picsum.photos/seed/apple-watch-se/800/800',
  },
];

const seed = async () => {
  await connectDB();

  await Product.deleteMany();
  await Category.deleteMany();
  console.log('Existing products and categories cleared');

  let admin = await User.findOne({ email: 'admin@shopstream.com' });
  if (!admin) {
    admin = await User.create({
      name: 'Admin',
      email: 'admin@shopstream.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Demo admin created -> admin@shopstream.com / admin123');
  }

  await Category.insertMany(categoryNames.map((name) => ({ name })));
  console.log(`${categoryNames.length} categories inserted`);

  const productsWithOwner = demoProducts.map((p) => ({ ...p, createdBy: admin._id }));
  await Product.insertMany(productsWithOwner);
  console.log(`${productsWithOwner.length} demo products inserted (INR pricing)`);

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
