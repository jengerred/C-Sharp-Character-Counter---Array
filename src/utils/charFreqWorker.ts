// Web Worker for character frequency calculation
// import DOMPurify from 'dompurify'; // Temporarily commented out for debugging
self.onmessage = (event) => {
  const rawText = event.data;
  // const sanitizedFileContent = DOMPurify.sanitize(rawText); // Temporarily commented out
  const sanitizedFileContent = rawText; // Send raw text for now
  const frequencies: { [key: string]: number } = {};
  const maxCharsToProcess = 50000;
  const processedText = sanitizedFileContent.slice(0, maxCharsToProcess);

  for (const char of processedText) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }

  const frequencyArray = Object.entries(frequencies)
    .map(([character, frequency]) => ({
      character,
      asciiCode: character.charCodeAt(0),
      frequency
    }))
    .sort((a, b) => a.asciiCode - b.asciiCode)
    .slice(0, 500);

  self.postMessage({ sanitizedFileContent, calculatedFrequencies: frequencyArray });
};
