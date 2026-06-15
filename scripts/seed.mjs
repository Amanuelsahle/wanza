import { MongoClient } from "mongodb";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const INITIAL_PRODUCTS = [
  {
    title: "Solitude Wristwatch",
    category: "Accessories",
    price: 189.0,
    description:
      "Crafted with Japanese quartz movement, this watch strips away excessive clutter to offer absolute purity in timekeeping. Sandblasted titanium case and premium Italian tan leather straps ensure lifelong endurance.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600",
    stock: true,
  },
  {
    title: "Studio Acoustics Headset",
    category: "Electronics",
    price: 249.0,
    description:
      "Acoustically tuned workspace monitors featuring adaptive hybrid active noise cancellation (ANC). Handcrafted aluminum frames paired with custom ergonomic protein-leather memory foam cups.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600",
    stock: true,
  },
  {
    title: "Bifold Minimalist Wallet",
    category: "Accessories",
    price: 59.0,
    description:
      "Meticulously stitched full-grain crazy-horse leather built to age with an elegant custom patina. Standard sizing fits 8 cards comfortably along with dynamic bill folding security features.",
    image:
      "https://images.unsplash.com/photo-1627124118123-24d1858973b7?auto=format&fit=crop&q=80&w=600",
    stock: true,
  },
  {
    title: "Echo Sphere Desk Speaker",
    category: "Electronics",
    price: 119.0,
    description:
      "Sleek smart hub providing omnidirectional audio design powered by acoustic wood composites. Integrates perfectly with standard setups offering seamless Bluetooth 5.2 coverage.",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600",
    stock: true,
  },
  {
    title: "Concrete Desk Catch-All",
    category: "Lifestyle",
    price: 34.0,
    description:
      "Individually hand-poured geometric architectural stone dishware, layered with natural sealant protection. Perfect sorting tray for writing instruments, keys, coins, and everyday accessories.",
    image:
      "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=600",
    stock: true,
  },
  {
    title: "Haze Essential Diffuser",
    category: "Lifestyle",
    price: 45.0,
    description:
      "Ultrasound-powered micro-misting scent diffuser featuring raw basalt volcanic ceramic covers. Creates clean therapeutic space atmospheres safely with an automatic shut-off safety valve.",
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600",
    stock: true,
  },
];

function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), ".env.local");
    const contents = readFileSync(envPath, "utf8");
    for (const line of contents.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      process.env[key] = rest.join("=").trim();
    }
  } catch {
    // .env.local is optional if vars are already exported
  }
}

async function seed() {
  loadEnv();

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is required");
  }

  const dbName = process.env.MONGODB_DB ?? "wanza";
  const client = new MongoClient(uri);
  await client.connect();

  try {
    const db = client.db(dbName);
    const collection = db.collection("products");
    const count = await collection.countDocuments();

    if (count > 0) {
      console.log(`Skipped seeding: ${count} products already exist.`);
      return;
    }

    const now = new Date();
    const documents = INITIAL_PRODUCTS.map((product) => ({
      ...product,
      createdAt: now,
      updatedAt: now,
    }));

    const result = await collection.insertMany(documents);
    console.log(`Seeded ${result.insertedCount} products into ${dbName}.`);
  } finally {
    await client.close();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
