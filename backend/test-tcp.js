const { MongoClient } = require('mongodb');

const uri = "mongodb://SmartRent:YCJh7TSCYO9hcMxf@smartrent.cb1ejny.mongodb.net:27017/?retryWrites=true&w=majority&ssl=true&authSource=admin";

async function test() {
  console.log("🔄 Testing TCP connection...");
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("✅ CONNECTED SUCCESSFULLY!");
    await client.close();
  } catch (err) {
    console.log("❌ Failed:", err.message);
  }
}

test();