import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const filePath = path.join(process.cwd(), 'public', 'wap.txt');
      const fileContent = await fs.promises.readFile(filePath, 'utf8');

      // Minimal frequency calculation
      const frequencies: { [key: string]: number } = {};
      const processedText = fileContent.slice(0, 10000);

      for (const char of processedText) {
        frequencies[char] = (frequencies[char] || 0) + 1;
      }

      const frequencyArray = Object.entries(frequencies)
        .map(([character, frequency]) => ({
          character,
          asciiCode: character.charCodeAt(0),
          frequency
        }))
        .slice(0, 100); // Limit to first 100 unique characters

      res.status(200).json({ frequencies: frequencyArray });
    } catch (error) {
      res.status(500).json({ error: 'File processing failed' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
