import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Middleware
  server.use(express.json());

  // API endpoints
  server.get('/api/vehicle/brands', (req, res) => {
    res.json(['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes']);
  });

  // Brand endpoints
  server.get('/api/brands', (req, res) => {
    res.json([
      { brandId: '1', brandName: 'Toyota' },
      { brandId: '2', brandName: 'Honda' },
      { brandId: '3', brandName: 'Ford' },
      { brandId: '4', brandName: 'BMW' },
      { brandId: '5', brandName: 'Mercedes' }
    ]);
  });

  server.post('/api/brands', (req, res) => {
    res.json({ brandId: '6', ...req.body });
  });

  // Model endpoints
  server.get('/api/models/by-brand/:brandId', (req, res) => {
    const brandId = req.params.brandId;
    const models: { [key: string]: any[] } = {
      '1': [{ modelId: '1', modelName: 'Camry', brandId: '1' }, { modelId: '2', modelName: 'Corolla', brandId: '1' }],
      '2': [{ modelId: '3', modelName: 'Civic', brandId: '2' }, { modelId: '4', modelName: 'Accord', brandId: '2' }],
      '3': [{ modelId: '5', modelName: 'Focus', brandId: '3' }, { modelId: '6', modelName: 'Mustang', brandId: '3' }],
      '4': [{ modelId: '7', modelName: 'X3', brandId: '4' }, { modelId: '8', modelName: 'X5', brandId: '4' }],
      '5': [{ modelId: '9', modelName: 'C-Class', brandId: '5' }, { modelId: '10', modelName: 'E-Class', brandId: '5' }]
    };
    res.json(models[brandId] || []);
  });

  server.post('/api/models', (req, res) => {
    res.json({ modelId: '11', ...req.body });
  });

  server.get('/api/vehicle/:id', (req, res) => {
    res.json({ id: req.params.id, brandId: '1', modelId: '1', vehicleName: 'My Vehicle' });
  });

  server.get('/api/vehicle', (req, res) => {
    res.json({
      totalCount: 0,
      page: 1,
      data: [],
      totalPages: 0,
      totalRecords: 0,
      pageSize: 10
    });
  });

  server.post('/api/vehicle', (req, res) => {
    res.json({ id: '1', ...req.body });
  });

  server.put('/api/vehicle/:id', (req, res) => {
    res.json({ id: req.params.id, ...req.body });
  });

  server.delete('/api/vehicle/:id', (req, res) => {
    res.status(204).send();
  });

  // Serve static files from /browser
  server.use(express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
