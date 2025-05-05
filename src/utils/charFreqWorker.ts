// Web Worker for character frequency calculation
self.onmessage = (event) => {
  const text = event.data;
  const frequencies: { [key: string]: number } = {};
  const maxCharsToProcess = 50000;
  const processedText = text.slice(0, maxCharsToProcess);

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

  self.postMessage(frequencyArray);
};
