const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://SmartRent:YCJh7TSCYO9hcMxf@smartrent.cb1ejny.mongodb.net/";

async function test() {
  console.log("🔄 Attempting to connect to MongoDB Atlas...");
  console.log("Connection string: mongodb+srv://SmartRent:****@smartrent.cb1ejny.mongodb.net/");
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("✅ SUCCESS! Connected to MongoDB Atlas!");
    
    // Test listing databases
    const databases = await client.db().admin().listDatabases();
    console.log(`📊 Available databases: ${databases.databases.map(db => db.name).join(', ')}`);
    
    await client.close();
    console.log("🔒 Connection closed.");
  } catch (err) {
    console.log("❌ FAILED to connect!");
    console.log("Error name:", err.name);
    console.log("Error message:", err.message);
    
    if (err.message.includes("Authentication")) {
      console.log("\n⚠️ This is an AUTHENTICATION error - wrong username/password");
    } else if (err.message.includes("ENOTFOUND") || err.message.includes("DNS")) {
      console.log("\n⚠️ This is a DNS error - can't find the server");
    } else if (err.message.includes("ECONNREFUSED")) {
      console.log("\n⚠️ This is a connection refused error - server not reachable");
    } else if (err.message.includes("timed out")) {
      console.log("\n⚠️ This is a timeout error - network is blocking the connection");
    }
  }
}

test();