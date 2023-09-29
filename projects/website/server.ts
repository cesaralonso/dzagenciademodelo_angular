import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

/* import { compression } from 'compression';
import { ssl } from 'express-ssl'; */

/* import { AppServerModule } from './src/projects/website'; */
import { AppServerModule } from './src/app/app.module.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';



const compression = require('compression');
/* var ssl = require('express-ssl'); */


// * NOTE :: leave this as require() since this file is built Dynamically from webpack
/* const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/website/server/main'); */
// Import module map for lazy loading
/* const provideModuleMap = require('@nguniversal/module-map-ngfactory-loader').provideModuleMap; */


var env;

if (process.env['ENVIRONMENT']) {
  env = process.env['ENVIRONMENT'];
} else {
  env = 'dev';
}


if (env === 'dev') {
  require('dotenv').config();
}

var originUrl = 'http://localhost:4000';
switch (env) {
  case 'prod':
      originUrl = 'https://dzagenciademodelos.com';
  break;
}


// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();


  /* server.use(ssl()); */
  // Gzip compression
  server.use(compression());
  server.use((req, res, next) => {
    // res.set('Cache-Control', 'no-cache');
    // 172800 two days
    res.set('Cache-Control', 'public, max-age=31536000');
    res.set('Access-Control-Allow-Origin', '*');
    return next();
  });


  const distFolder = join(process.cwd(), 'dist/website/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  /* server.engine('html', ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
      provideModuleMap(LAZY_MODULE_MAP)
    ]
  }));
 */

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    const config = {
      req,
      res,
      preboot: true,
      baseUrl: '/',
      requestUrl: req.originalUrl,
      originUrl: originUrl,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }]
    };
    res.render(indexHtml, config);
  });

  return server;
}

function run(): void {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

/* export * from './src/app/app.module.server'; */
export * from './src/main.server';
