const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 4200;
const distFolder = path.join(__dirname, 'dist', 'vehicle-management-frontend');

if (fs.existsSync(distFolder)) {
  app.use(express.static(distFolder));
  app.get('*', (req, res) => res.sendFile(path.join(distFolder, 'index.html')));
} else {
  app.get('/', (req, res) => res.send(
    'Build not found. Run "npm run build" then start this server.'
  ));
}

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));