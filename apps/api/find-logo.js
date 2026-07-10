import { mongo } from "mongoose";
const { MongoClient } = mongo;

const MONGO_URI = "mongodb+srv://autodhundigital_db_user:0p68lY7gbyKHCJuV@cluster0.qo9s5eo.mongodb.net/portfolio";

async function main() {
  console.log("🔌 Connecting to MongoDB...");
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db("portfolio");
  console.log("✅ Connected!\n");

  const collections = await db.listCollections().toArray();
  for (const col of collections) {
    const name = col.name;
    const docs = await db.collection(name).find({}).toArray();
    for (const doc of docs) {
      const str = JSON.stringify(doc);
      if (str.includes("res.cloudinary.com")) {
        const matches = str.match(/https:\/\/res\.cloudinary\.com\/[^\s"']+/g);
        if (matches && matches.length > 0) {
          console.log(`📍 Found Cloudinary URLs in collection "${name}":`);
          console.log(matches);
        }
      }
    }
  }

  await client.close();
}

main().catch(console.error);
