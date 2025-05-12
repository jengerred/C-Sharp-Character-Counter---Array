import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  content?: string;
  error?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log('[API_SIMPLE] Request received to /api/file-content'); // New log

  if (req.method === 'GET') {
    const testContent = "This is a simple test from the API. If you see this, the route is working.";
    console.log('[API_SIMPLE] Sending hardcoded test content.'); // New log
    res.status(200).json({ content: testContent });
  } else {
    console.log(`[API_SIMPLE] Method ${req.method} not allowed.`); // New log
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
