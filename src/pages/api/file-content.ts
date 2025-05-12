import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, Db } from 'mongodb';

// --- Configuration ---
// IMPORTANT: Ensure your MongoDB Atlas IP whitelist allows access from Vercel or your deployment environment.
// For local development, your current IP should be whitelisted.
const uri = process.env.MONGODB_URI || "mongodb+srv://jengerred:hbcsSekwUgyjsSej@cluster0.y0d8i5k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = process.env.MONGODB_DB_NAME || "arrayTutorialDB";
const collectionName = "textDocuments";
const documentName = "wap.txt";
// --- End Configuration ---

type Data = {
  content?: string;
  error?: string;
  message?: string;
};

// Cache the client connection
let client: MongoClient | null = null;
let db: Db | null = null;

async function connectToDatabase() {
  if (client && db) { // If client and db are cached
    try {
      // Check if the connection is still alive using a ping command
      await client.db(dbName).command({ ping: 1 });
      // console.log('Using existing and live database connection');
      return { client, db };
    } catch (e) {
      // console.warn('Cached MongoDB connection ping failed, creating a new one.', e);
      // Connection might have been closed or become unresponsive.
      // Attempt to close the old client before creating a new one.
      if (client) {
        await client.close().catch(closeError => console.warn('Failed to close old client', closeError));
      }
      client = null;
      db = null;
    }
  }

  // console.log('Creating new database connection');
  const newClient = new MongoClient(uri);
  await newClient.connect();
  const newDb = newClient.db(dbName);

  // Cache them
  client = newClient;
  db = newDb;

  return { client, db };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    try {
      const { db: database } = await connectToDatabase();
      const collection = database.collection(collectionName);

      console.log(`[API] Attempting to find document: ${documentName}`);
      const fileDocument = await collection.findOne({ name: documentName });

      if (fileDocument && typeof fileDocument.content === 'string') {
        // Log the length of the content string *before* sending it
        console.log(`[API] Document found. Content length from DB: ${fileDocument.content.length}`);

        // For debugging, let's log the last 100 characters from the DB content
        const tailFromDB = fileDocument.content.slice(-100);
        console.log(`[API] Tail of content from DB: \"...${tailFromDB}\"`);

        res.status(200).json({ content: fileDocument.content as string });
      } else {
        console.log(`[API] Document '${documentName}' not found or content field is missing/not a string.`);
        res.status(404).json({ error: `Document '${documentName}' not found or content is missing.` });
      }
    } catch (error) {
      console.error('[API] Error fetching file content:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ error: 'Failed to fetch file content.', message: errorMessage });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
