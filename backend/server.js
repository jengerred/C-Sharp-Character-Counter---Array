const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 7777;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the directory containing the text file
app.use('/api/FileProcessing', express.static(path.join(__dirname, '../array-tutorial/public')));

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
