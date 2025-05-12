// insertWap.js
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// --- Configuration ---
const uri = "mongodb+srv://jengerred:hbcsSekwUgyjsSej@cluster0.y0d8i5k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Password included directly
const dbName = "arrayTutorialDB";
const collectionName = "textDocuments"; 
const filePath = "/Users/jennifergerred/Downloads/wap.txt";
const documentName = "wap.txt"; 
const documentDescription = "War and Peace by Leo Tolstoy";
// --- End Configuration ---

async function main() {
    const client = new MongoClient(uri);

    try {
        console.log("Connecting to MongoDB Atlas...");
        await client.connect();
        console.log("Connected successfully to server");

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        console.log(`Reading file content from: ${filePath}`);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        console.log(`File read successfully. Content length: ${fileContent.length} characters.`);

        const documentToInsert = {
            name: documentName,
            content: fileContent,
            description: documentDescription,
            insertedAt: new Date()
        };

        console.log(`Attempting to insert document into ${dbName}.${collectionName}...`);
        
        const deleteResult = await collection.deleteOne({ name: documentName });
        if (deleteResult.deletedCount > 0) {
            console.log(`Removed existing document with name '${documentName}'.`);
        }

        const insertResult = await collection.insertOne(documentToInsert);
        console.log(`New document inserted with _id: ${insertResult.insertedId}`);
        console.log("--- Document Preview (first 200 chars of content) ---");
        console.log(documentToInsert.content.substring(0, 200) + "...");
        console.log("---------------------------------------------------");


    } catch (err) {
        console.error("An error occurred:", err);
    } finally {
        console.log("Closing connection...");
        await client.close();
        console.log("Connection closed.");
    }
}

main().catch(console.error);
