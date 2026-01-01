const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 4200;

// Check if 'browser' folder exists (Angular 17+ style) or standard dist
const distPath1 = path.join(__dirname, 'dist', 'vehicle-management-frontend', 'browser');
const distPath2 = path.join(__dirname, 'dist', 'vehicle-management-frontend');

const distFolder = fs.existsSync(distPath1) ? distPath1 : distPath2;

if (fs.existsSync(distFolder)) {
  console.log(`Serving from: ${distFolder}`);
  app.use(express.static(distFolder));
  app.get('*', (req, res) => res.sendFile(path.join(distFolder, 'index.html')));
} else {
  console.error(`ERROR: Build folder not found at ${distFolder}`);
  app.get('/', (req, res) => res.send(
    '<h1>Build not found</h1><p>Run <code>npm run build</code> first.</p>'
  ));
}

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));