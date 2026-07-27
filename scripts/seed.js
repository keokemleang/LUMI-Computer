import { db } from "../src/lib/db";
import { getAdminAuth } from "../src/lib/firebase-admin";

// ----- Helpers -----
const j = v => JSON.stringify(v);
const img = (seed, w = 800, h = 600) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
const catImg = slug => `/placeholders/${slug}.svg`;

// Credentials now live entirely in Firebase Authentication. If the Admin SDK
// is configured (FIREBASE_* env vars set), this creates the demo accounts
// there too; otherwise it just seeds the app-side profile/role rows and you
// register these emails through the app to activate them.
async function seedUser({
  email,
  name,
  role,
  password
}) {
  const adminAuth = await getAdminAuth();
  if (adminAuth) {
    try {
      await adminAuth.createUser({
        email,
        password,
        displayName: name
      });
    } catch (e) {
      if (e?.errorInfo?.code !== "auth/email-already-exists") throw e;
    }
  } else {
    console.warn(`[seed] Firebase Admin not configured — skipping auth account for ${email}`);
  }
  await db.user.create({
    data: {
      email,
      name,
      role
    }
  });
}

async function main() {
  console.log("Seeding LUMI Computer database...");

  // Clean
  await db.contactMessage.deleteMany();
  await db.newsletterSub.deleteMany();
  await db.order.deleteMany();
  await db.review.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();
  await db.user.deleteMany();

  // Admin + demo customer user
  await seedUser({
    email: "admin@lumicomputer.com",
    name: "LUMI Computer Admin",
    role: "admin",
    password: "Admin123!"
  });
  await seedUser({
    email: "customer@example.com",
    name: "Sam Customer",
    role: "customer",
    password: "Customer123!"
  });

  // ----- Categories -----
  const categories = [{
    slug: "cpu",
    name: "CPUs",
    description: "Desktop processors from AMD and Intel — from budget builds to flagship gaming rigs.",
    icon: "Cpu",
    featured: true
  }, {
    slug: "gpu",
    name: "Graphics Cards",
    description: "Gaming and workstation graphics cards for every resolution and budget.",
    icon: "MonitorSmartphone",
    featured: true
  }, {
    slug: "motherboards",
    name: "Motherboards",
    description: "AM5, AM4, and LGA1700 motherboards in ATX, mATX, and ITX form factors.",
    icon: "CircuitBoard",
    featured: true
  }, {
    slug: "memory",
    name: "Memory",
    description: "DDR4 and DDR5 desktop memory kits, from everyday builds to high-frequency overclocking.",
    icon: "MemoryStick",
    featured: true
  }, {
    slug: "storage",
    name: "Storage",
    description: "NVMe SSDs, SATA SSDs, and hard drives for every capacity need.",
    icon: "HardDrive",
    featured: true
  }, {
    slug: "power-supplies",
    name: "Power Supplies",
    description: "80 PLUS certified ATX power supplies from 550W to 1200W.",
    icon: "Zap",
    featured: true
  }, {
    slug: "cases-cooling",
    name: "Cases & Cooling",
    description: "PC cases, air coolers, AIO liquid coolers, and case fans.",
    icon: "Fan",
    featured: false
  }, {
    slug: "laptops",
    name: "Laptops",
    description: "Gaming and productivity laptops, ready to ship.",
    icon: "Laptop",
    featured: true
  }, {
    slug: "monitors",
    name: "Monitors",
    description: "Gaming and productivity monitors — 1080p to 4K, high refresh rate to color-accurate.",
    icon: "Monitor",
    featured: false
  }, {
    slug: "peripherals",
    name: "Peripherals",
    description: "Keyboards, mice, headsets, and other desk accessories.",
    icon: "Keyboard",
    featured: false
  }];
  const catMap = {};
  for (const c of categories) {
    const created = await db.category.create({
      data: {
        ...c,
        image: catImg(c.slug)
      }
    });
    catMap[c.slug] = created.id;
  }

  // ----- Products -----
  const products = [{
    slug: "amd-ryzen-7-7800x3d",
    name: "AMD Ryzen 7 7800X3D",
    brand: "AMD",
    shortDesc: "8-core gaming CPU with 3D V-Cache for class-leading frame rates.",
    description: "The Ryzen 7 7800X3D pairs 8 Zen 4 cores with AMD's 3D V-Cache technology, delivering the best gaming performance in the Ryzen 7000 lineup. Socket AM5, unlocked for memory overclocking.",
    price: 449.0,
    compareAt: 499.0,
    sku: "CPU-AMD-7800X3D",
    stock: 34,
    images: j([img("ryzen-7800x3d-1"), img("ryzen-7800x3d-2")]),
    category: "cpu",
    specs: j([{
      label: "Cores / Threads",
      value: "8 / 16"
    }, {
      label: "Socket",
      value: "AM5"
    }, {
      label: "Base / Boost Clock",
      value: "4.2 GHz / 5.0 GHz"
    }, {
      label: "TDP",
      value: "120W"
    }, {
      label: "Cache",
      value: "96MB L3 (3D V-Cache)"
    }]),
    featured: true,
    rating: 4.9,
    reviewCount: 412
  }, {
    slug: "intel-core-i7-14700k",
    name: "Intel Core i7-14700K",
    brand: "Intel",
    shortDesc: "20-core hybrid CPU for gaming and heavy multitasking.",
    description: "The Core i7-14700K combines 8 Performance-cores and 12 Efficient-cores for strong gaming and productivity performance. Unlocked for overclocking on Z690/Z790 boards.",
    price: 409.0,
    sku: "CPU-INT-14700K",
    stock: 41,
    images: j([img("i7-14700k-1"), img("i7-14700k-2")]),
    category: "cpu",
    specs: j([{
      label: "Cores / Threads",
      value: "20 / 28"
    }, {
      label: "Socket",
      value: "LGA1700"
    }, {
      label: "Max Turbo",
      value: "5.6 GHz"
    }, {
      label: "TDP",
      value: "125W (253W max)"
    }]),
    featured: true,
    rating: 4.7,
    reviewCount: 268
  }, {
    slug: "amd-ryzen-5-7600",
    name: "AMD Ryzen 5 7600",
    brand: "AMD",
    shortDesc: "6-core mainstream CPU with excellent price-to-performance.",
    description: "The Ryzen 5 7600 offers strong 1080p/1440p gaming performance and efficient power draw. A great starting point for an AM5 build.",
    price: 189.0,
    compareAt: 219.0,
    sku: "CPU-AMD-7600",
    stock: 76,
    images: j([img("ryzen-7600-1")]),
    category: "cpu",
    specs: j([{
      label: "Cores / Threads",
      value: "6 / 12"
    }, {
      label: "Socket",
      value: "AM5"
    }, {
      label: "Base / Boost Clock",
      value: "3.8 GHz / 5.1 GHz"
    }, {
      label: "TDP",
      value: "65W"
    }]),
    featured: false,
    rating: 4.6,
    reviewCount: 145
  }, {
    slug: "nvidia-rtx-4070-super",
    name: "NVIDIA GeForce RTX 4070 SUPER",
    brand: "NVIDIA",
    shortDesc: "12GB graphics card for high frame rate 1440p gaming.",
    description: "The RTX 4070 SUPER delivers excellent 1440p and entry 4K performance with DLSS 3 frame generation and ray tracing support. 12GB GDDR6X memory.",
    price: 599.0,
    sku: "GPU-NV-4070S",
    stock: 22,
    images: j([img("rtx4070s-1"), img("rtx4070s-2")]),
    category: "gpu",
    specs: j([{
      label: "Memory",
      value: "12GB GDDR6X"
    }, {
      label: "CUDA Cores",
      value: "7168"
    }, {
      label: "Boost Clock",
      value: "2.48 GHz"
    }, {
      label: "TDP",
      value: "220W"
    }, {
      label: "Outputs",
      value: "3x DP 1.4a, 1x HDMI 2.1"
    }]),
    featured: true,
    rating: 4.8,
    reviewCount: 187
  }, {
    slug: "amd-rx-7800-xt",
    name: "AMD Radeon RX 7800 XT",
    brand: "AMD",
    shortDesc: "16GB graphics card built for 1440p high-refresh gaming.",
    description: "The RX 7800 XT offers 16GB of VRAM and strong rasterization performance, making it a great choice for 1440p and high-refresh 1080p gaming.",
    price: 549.0,
    compareAt: 579.0,
    sku: "GPU-AMD-7800XT",
    stock: 18,
    images: j([img("rx7800xt-1"), img("rx7800xt-2")]),
    category: "gpu",
    specs: j([{
      label: "Memory",
      value: "16GB GDDR6"
    }, {
      label: "Stream Processors",
      value: "3840"
    }, {
      label: "Boost Clock",
      value: "2.43 GHz"
    }, {
      label: "TDP",
      value: "263W"
    }]),
    featured: true,
    rating: 4.7,
    reviewCount: 133
  }, {
    slug: "nvidia-rtx-4090",
    name: "NVIDIA GeForce RTX 4090",
    brand: "NVIDIA",
    shortDesc: "24GB flagship graphics card for 4K and content creation.",
    description: "The RTX 4090 is NVIDIA's flagship consumer GPU — 24GB of GDDR6X memory and massive compute power for 4K gaming, ray tracing, and creative workloads.",
    price: 1599.0,
    sku: "GPU-NV-4090",
    stock: 7,
    images: j([img("rtx4090-1"), img("rtx4090-2")]),
    category: "gpu",
    specs: j([{
      label: "Memory",
      value: "24GB GDDR6X"
    }, {
      label: "CUDA Cores",
      value: "16384"
    }, {
      label: "Boost Clock",
      value: "2.52 GHz"
    }, {
      label: "TDP",
      value: "450W"
    }]),
    featured: true,
    rating: 4.9,
    reviewCount: 96
  }, {
    slug: "asus-rog-strix-b650e-f",
    name: "ASUS ROG Strix B650E-F Gaming WiFi",
    brand: "ASUS",
    shortDesc: "AM5 ATX motherboard with PCIe 5.0 and WiFi 6E.",
    description: "A full-featured AM5 ATX board with PCIe 5.0 for both GPU and NVMe slots, robust VRM for high-core-count Ryzen CPUs, and built-in WiFi 6E.",
    price: 279.0,
    sku: "MB-ASUS-B650EF",
    stock: 29,
    images: j([img("b650e-f-1"), img("b650e-f-2")]),
    category: "motherboards",
    specs: j([{
      label: "Socket",
      value: "AM5"
    }, {
      label: "Chipset",
      value: "B650E"
    }, {
      label: "Form Factor",
      value: "ATX"
    }, {
      label: "Memory Support",
      value: "DDR5, up to 128GB"
    }, {
      label: "PCIe",
      value: "PCIe 5.0 x16 + M.2"
    }]),
    featured: true,
    rating: 4.7,
    reviewCount: 88
  }, {
    slug: "msi-pro-z790-a",
    name: "MSI PRO Z790-A WiFi",
    brand: "MSI",
    shortDesc: "LGA1700 ATX motherboard for 12th/13th/14th Gen Intel CPUs.",
    description: "A reliable Z790 ATX motherboard supporting DDR5 memory, PCIe 5.0, and WiFi 6E — built for Intel's latest Core CPUs.",
    price: 219.0,
    sku: "MB-MSI-Z790A",
    stock: 33,
    images: j([img("z790a-1")]),
    category: "motherboards",
    specs: j([{
      label: "Socket",
      value: "LGA1700"
    }, {
      label: "Chipset",
      value: "Z790"
    }, {
      label: "Form Factor",
      value: "ATX"
    }, {
      label: "Memory Support",
      value: "DDR5, up to 192GB"
    }]),
    featured: false,
    rating: 4.6,
    reviewCount: 61
  }, {
    slug: "gskill-trident-z5-32gb-ddr5-6000",
    name: "G.Skill Trident Z5 32GB (2x16GB) DDR5-6000",
    brand: "G.Skill",
    shortDesc: "High-frequency DDR5 kit tuned for AMD and Intel platforms.",
    description: "A 32GB dual-channel DDR5-6000 kit with tight CL30 timings — the sweet spot for Ryzen 7000 and Intel 12th/13th/14th Gen builds.",
    price: 109.0,
    compareAt: 129.0,
    sku: "RAM-GSK-32-6000",
    stock: 64,
    images: j([img("tridentz5-1"), img("tridentz5-2")]),
    category: "memory",
    specs: j([{
      label: "Capacity",
      value: "32GB (2x16GB)"
    }, {
      label: "Speed",
      value: "DDR5-6000"
    }, {
      label: "Timings",
      value: "CL30-38-38-96"
    }, {
      label: "Voltage",
      value: "1.35V"
    }]),
    featured: true,
    rating: 4.8,
    reviewCount: 221
  }, {
    slug: "corsair-vengeance-16gb-ddr4-3600",
    name: "Corsair Vengeance LPX 16GB (2x8GB) DDR4-3600",
    brand: "Corsair",
    shortDesc: "Reliable DDR4 kit for AM4 and older Intel platforms.",
    description: "A well-tuned 16GB DDR4-3600 kit with low-profile heatspreaders — a solid, affordable choice for existing DDR4 platforms.",
    price: 42.0,
    sku: "RAM-COR-16-3600",
    stock: 130,
    images: j([img("vengeance-1")]),
    category: "memory",
    specs: j([{
      label: "Capacity",
      value: "16GB (2x8GB)"
    }, {
      label: "Speed",
      value: "DDR4-3600"
    }, {
      label: "Timings",
      value: "CL18-22-22-42"
    }]),
    featured: false,
    rating: 4.6,
    reviewCount: 356
  }, {
    slug: "samsung-990-pro-2tb",
    name: "Samsung 990 PRO 2TB NVMe SSD",
    brand: "Samsung",
    shortDesc: "PCIe 4.0 NVMe SSD with class-leading read/write speeds.",
    description: "The 990 PRO delivers up to 7,450 MB/s sequential read speeds, making it one of the fastest PCIe 4.0 drives available — ideal for gaming and content creation.",
    price: 149.0,
    compareAt: 179.0,
    sku: "SSD-SAM-990P-2TB",
    stock: 58,
    images: j([img("990pro-1"), img("990pro-2")]),
    category: "storage",
    specs: j([{
      label: "Capacity",
      value: "2TB"
    }, {
      label: "Interface",
      value: "PCIe 4.0 x4 NVMe"
    }, {
      label: "Sequential Read",
      value: "7,450 MB/s"
    }, {
      label: "Sequential Write",
      value: "6,900 MB/s"
    }]),
    featured: true,
    rating: 4.9,
    reviewCount: 298
  }, {
    slug: "wd-black-sn850x-1tb",
    name: "WD_BLACK SN850X 1TB NVMe SSD",
    brand: "Western Digital",
    shortDesc: "Gaming-focused PCIe 4.0 SSD with Game Mode 2.0.",
    description: "Optimized for gaming with fast load times and sustained performance under heavy read/write workloads. 1TB capacity, PCIe Gen4.",
    price: 79.0,
    sku: "SSD-WD-SN850X-1TB",
    stock: 91,
    images: j([img("sn850x-1")]),
    category: "storage",
    specs: j([{
      label: "Capacity",
      value: "1TB"
    }, {
      label: "Interface",
      value: "PCIe 4.0 x4 NVMe"
    }, {
      label: "Sequential Read",
      value: "7,300 MB/s"
    }]),
    featured: false,
    rating: 4.7,
    reviewCount: 174
  }, {
    slug: "seagate-barracuda-4tb",
    name: "Seagate BarraCuda 4TB HDD",
    brand: "Seagate",
    shortDesc: "High-capacity 3.5\" hard drive for bulk storage.",
    description: "A dependable 4TB 7200 RPM hard drive for mass storage, backups, and media libraries at a low cost per gigabyte.",
    price: 89.0,
    sku: "HDD-SEA-BC-4TB",
    stock: 47,
    images: j([img("barracuda-1")]),
    category: "storage",
    specs: j([{
      label: "Capacity",
      value: "4TB"
    }, {
      label: "Interface",
      value: "SATA III"
    }, {
      label: "RPM",
      value: "7200"
    }]),
    featured: false,
    rating: 4.4,
    reviewCount: 112
  }, {
    slug: "corsair-rm850x",
    name: "Corsair RM850x 850W 80+ Gold",
    brand: "Corsair",
    shortDesc: "Fully modular 850W power supply, 80 PLUS Gold certified.",
    description: "The RM850x delivers clean, stable power with a fully modular cable design and near-silent Zero RPM fan mode under light loads.",
    price: 139.0,
    compareAt: 159.0,
    sku: "PSU-COR-RM850X",
    stock: 39,
    images: j([img("rm850x-1"), img("rm850x-2")]),
    category: "power-supplies",
    specs: j([{
      label: "Wattage",
      value: "850W"
    }, {
      label: "Efficiency",
      value: "80 PLUS Gold"
    }, {
      label: "Modularity",
      value: "Fully modular"
    }, {
      label: "Warranty",
      value: "10 years"
    }]),
    featured: true,
    rating: 4.9,
    reviewCount: 267
  }, {
    slug: "evga-supernova-650-gt",
    name: "EVGA SuperNOVA 650 GT 80+ Gold",
    brand: "EVGA",
    shortDesc: "Compact 650W fully modular power supply.",
    description: "A compact and efficient 650W PSU well suited for mid-range builds, with fully modular cabling and 80 PLUS Gold efficiency.",
    price: 79.0,
    sku: "PSU-EVGA-650GT",
    stock: 52,
    images: j([img("supernova650-1")]),
    category: "power-supplies",
    specs: j([{
      label: "Wattage",
      value: "650W"
    }, {
      label: "Efficiency",
      value: "80 PLUS Gold"
    }, {
      label: "Modularity",
      value: "Fully modular"
    }]),
    featured: false,
    rating: 4.6,
    reviewCount: 143
  }, {
    slug: "nzxt-h5-flow",
    name: "NZXT H5 Flow",
    brand: "NZXT",
    shortDesc: "Airflow-focused mid-tower ATX case with mesh front panel.",
    description: "The H5 Flow prioritizes airflow with a perforated front panel, clean cable management, and room for up to a 360mm radiator.",
    price: 94.0,
    sku: "CASE-NZXT-H5F",
    stock: 44,
    images: j([img("h5flow-1"), img("h5flow-2")]),
    category: "cases-cooling",
    specs: j([{
      label: "Form Factor",
      value: "Mid-Tower ATX"
    }, {
      label: "Max GPU Length",
      value: "365mm"
    }, {
      label: "Radiator Support",
      value: "Up to 360mm"
    }]),
    featured: true,
    rating: 4.7,
    reviewCount: 198
  }, {
    slug: "noctua-nh-d15",
    name: "Noctua NH-D15",
    brand: "Noctua",
    shortDesc: "Dual-tower air cooler for high-TDP CPUs.",
    description: "The NH-D15 is a benchmark dual-tower air cooler, delivering near-AIO cooling performance with legendary Noctua reliability and near-silent fans.",
    price: 109.0,
    sku: "COOL-NOC-ND15",
    stock: 37,
    images: j([img("nhd15-1")]),
    category: "cases-cooling",
    specs: j([{
      label: "Type",
      value: "Dual-tower air cooler"
    }, {
      label: "Fans",
      value: "2x NF-A15 140mm"
    }, {
      label: "TDP Rating",
      value: "~250W"
    }]),
    featured: false,
    rating: 4.9,
    reviewCount: 302
  }, {
    slug: "corsair-h100i-elite",
    name: "Corsair iCUE H100i Elite Capellix",
    brand: "Corsair",
    shortDesc: "240mm AIO liquid cooler with RGB fans.",
    description: "A 240mm all-in-one liquid cooler with Capellix RGB LEDs and iCUE software control, delivering strong thermal performance in a compact radiator size.",
    price: 129.0,
    sku: "COOL-COR-H100IE",
    stock: 41,
    images: j([img("h100ielite-1")]),
    category: "cases-cooling",
    specs: j([{
      label: "Radiator Size",
      value: "240mm"
    }, {
      label: "Fans",
      value: "2x ML120 RGB"
    }]),
    featured: false,
    rating: 4.6,
    reviewCount: 121
  }, {
    slug: "asus-rog-zephyrus-g14",
    name: "ASUS ROG Zephyrus G14",
    brand: "ASUS",
    shortDesc: "14\" gaming laptop with Ryzen 9 and RTX 4060.",
    description: "The Zephyrus G14 packs a Ryzen 9 CPU and RTX 4060 GPU into a compact 14-inch chassis with a 165Hz QHD display — powerful enough for gaming and content creation on the go.",
    price: 1699.0,
    compareAt: 1899.0,
    sku: "LAP-ASUS-G14",
    stock: 16,
    images: j([img("zephyrusg14-1"), img("zephyrusg14-2")]),
    category: "laptops",
    specs: j([{
      label: "CPU",
      value: "AMD Ryzen 9 8945HS"
    }, {
      label: "GPU",
      value: "NVIDIA RTX 4060 8GB"
    }, {
      label: "Display",
      value: "14\" QHD 165Hz"
    }, {
      label: "RAM",
      value: "32GB DDR5"
    }, {
      label: "Storage",
      value: "1TB NVMe SSD"
    }]),
    featured: true,
    rating: 4.8,
    reviewCount: 154
  }, {
    slug: "lenovo-legion-pro-5",
    name: "Lenovo Legion Pro 5",
    brand: "Lenovo",
    shortDesc: "16\" gaming laptop with Core i7 and RTX 4070.",
    description: "The Legion Pro 5 balances raw performance and value, with a Core i7 CPU, RTX 4070 GPU, and a 16-inch 165Hz display built for serious gaming.",
    price: 1549.0,
    sku: "LAP-LEN-LP5",
    stock: 12,
    images: j([img("legionpro5-1"), img("legionpro5-2")]),
    category: "laptops",
    specs: j([{
      label: "CPU",
      value: "Intel Core i7-13700HX"
    }, {
      label: "GPU",
      value: "NVIDIA RTX 4070 8GB"
    }, {
      label: "Display",
      value: "16\" WQXGA 165Hz"
    }, {
      label: "RAM",
      value: "16GB DDR5"
    }, {
      label: "Storage",
      value: "1TB NVMe SSD"
    }]),
    featured: true,
    rating: 4.7,
    reviewCount: 109
  }, {
    slug: "dell-xps-13",
    name: "Dell XPS 13",
    brand: "Dell",
    shortDesc: "Ultra-portable productivity laptop with a stunning display.",
    description: "The XPS 13 pairs a compact, premium chassis with a bright InfinityEdge display — a favorite for professionals who want power without the bulk.",
    price: 1199.0,
    sku: "LAP-DELL-XPS13",
    stock: 21,
    images: j([img("xps13-1")]),
    category: "laptops",
    specs: j([{
      label: "CPU",
      value: "Intel Core i7-1355U"
    }, {
      label: "Display",
      value: "13.4\" FHD+"
    }, {
      label: "RAM",
      value: "16GB LPDDR5"
    }, {
      label: "Storage",
      value: "512GB NVMe SSD"
    }]),
    featured: false,
    rating: 4.6,
    reviewCount: 87
  }, {
    slug: "lg-ultragear-27gp850",
    name: "LG UltraGear 27GP850-B",
    brand: "LG",
    shortDesc: "27\" QHD 165Hz Nano IPS gaming monitor.",
    description: "A 27-inch QHD Nano IPS panel with a 165Hz refresh rate and 1ms response time — sharp, fast, and color-accurate for gaming and creative work.",
    price: 329.0,
    compareAt: 379.0,
    sku: "MON-LG-27GP850",
    stock: 26,
    images: j([img("ultragear27-1")]),
    category: "monitors",
    specs: j([{
      label: "Size",
      value: "27\""
    }, {
      label: "Resolution",
      value: "2560x1440"
    }, {
      label: "Refresh Rate",
      value: "165Hz"
    }, {
      label: "Panel",
      value: "Nano IPS"
    }]),
    featured: true,
    rating: 4.8,
    reviewCount: 176
  }, {
    slug: "logitech-g-pro-x-superlight",
    name: "Logitech G Pro X Superlight 2",
    brand: "Logitech",
    shortDesc: "Ultra-lightweight wireless gaming mouse.",
    description: "At under 60g, the Pro X Superlight 2 pairs a HERO 2 sensor with an ultra-light shell for competitive gaming — used by esports pros.",
    price: 159.0,
    sku: "PER-LOG-GPXS2",
    stock: 68,
    images: j([img("gprox2-1")]),
    category: "peripherals",
    specs: j([{
      label: "Weight",
      value: "60g"
    }, {
      label: "Sensor",
      value: "HERO 2, 32,000 DPI"
    }, {
      label: "Connection",
      value: "LIGHTSPEED wireless"
    }]),
    featured: false,
    rating: 4.9,
    reviewCount: 231
  }, {
    slug: "keychron-k8-pro",
    name: "Keychron K8 Pro",
    brand: "Keychron",
    shortDesc: "Wireless mechanical keyboard with hot-swappable switches.",
    description: "A tenkeyless mechanical keyboard with QMK/VIA support, hot-swappable switches, and Bluetooth or wired connectivity — for gaming and typing alike.",
    price: 99.0,
    sku: "PER-KEY-K8PRO",
    stock: 54,
    images: j([img("k8pro-1")]),
    category: "peripherals",
    specs: j([{
      label: "Layout",
      value: "TKL (87-key)"
    }, {
      label: "Switches",
      value: "Hot-swappable"
    }, {
      label: "Connection",
      value: "Bluetooth 5.1 / USB-C"
    }]),
    featured: false,
    rating: 4.7,
    reviewCount: 142
  }];
  for (const p of products) {
    const {
      category,
      ...rest
    } = p;
    await db.product.create({
      data: {
        ...rest,
        images: j([catImg(category)]),
        categoryId: catMap[category]
      }
    });
  }

  // ----- Reviews -----
  const reviewData = [{
    productSlug: "amd-ryzen-7-7800x3d",
    author: "John M.",
    rating: 5,
    comment: "Best gaming CPU I've owned. Huge frame rate jump over my old 5600X."
  }, {
    productSlug: "amd-ryzen-7-7800x3d",
    author: "Sara K.",
    rating: 5,
    comment: "Runs cool for how much performance it puts out. Great with a decent air cooler."
  }, {
    productSlug: "nvidia-rtx-4070-super",
    author: "Mike T.",
    rating: 5,
    comment: "Perfect for 1440p ultra settings. DLSS makes ray tracing viable too."
  }, {
    productSlug: "samsung-990-pro-2tb",
    author: "Lina P.",
    rating: 5,
    comment: "Blazing fast, runs cool even under sustained writes."
  }, {
    productSlug: "asus-rog-zephyrus-g14",
    author: "Chris D.",
    rating: 5,
    comment: "Small, light, and surprisingly powerful. Battery life is solid for a gaming laptop."
  }, {
    productSlug: "corsair-rm850x",
    author: "Amir R.",
    rating: 5,
    comment: "Dead silent under normal load. Cable quality is excellent."
  }, {
    productSlug: "gskill-trident-z5-32gb-ddr5-6000",
    author: "Nina B.",
    rating: 4,
    comment: "Hits rated speed with EXPO enabled, no issues on my B650 board."
  }];
  for (const r of reviewData) {
    const product = await db.product.findUnique({
      where: {
        slug: r.productSlug
      }
    });
    if (!product) continue;
    await db.review.create({
      data: {
        author: r.author,
        rating: r.rating,
        comment: r.comment,
        productId: product.id
      }
    });
  }

  // ----- Orders -----
  await db.order.create({
    data: {
      orderNo: "KLC-2024-1001",
      userEmail: "customer@example.com",
      userName: "Sam Customer",
      total: 1699.0,
      status: "delivered",
      items: j([{
        name: "ASUS ROG Zephyrus G14",
        qty: 1,
        price: 1699.0
      }])
    }
  });
  await db.order.create({
    data: {
      orderNo: "KLC-2024-1002",
      userEmail: "customer@example.com",
      userName: "Sam Customer",
      total: 598.0,
      status: "shipped",
      items: j([{
        name: "AMD Ryzen 7 7800X3D",
        qty: 1,
        price: 449.0
      }, {
        name: "G.Skill Trident Z5 32GB DDR5-6000",
        qty: 1,
        price: 109.0
      }])
    }
  });
  await db.order.create({
    data: {
      orderNo: "KLC-2024-1003",
      userEmail: "customer@example.com",
      userName: "Sam Customer",
      total: 149.0,
      status: "processing",
      items: j([{
        name: "Samsung 990 PRO 2TB NVMe SSD",
        qty: 1,
        price: 149.0
      }])
    }
  });
  console.log("Seed complete.");
}
main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await db.$disconnect();
});
