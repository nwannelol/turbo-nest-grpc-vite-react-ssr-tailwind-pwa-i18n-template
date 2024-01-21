import { Controller, Get, Req, Res, VERSION_NEUTRAL, Version } from '@nestjs/common';
import { AppService } from './app.service';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Response, Request } from 'express';
import App from "../../users-demo-frontend/src/App"
import React from 'react';
import { initialContentMap as initialContentMap } from './global/backend.settings';
  import { assetMap as assetMap } from './global/backend.settings';

@Controller()
export class AppController {
  initialContentMap = { ...initialContentMap, 'title': 'Welcome to demo Hello World!' }
  assetMap = { ...assetMap, initialContentMap: this.initialContentMap }

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('view-users')
  async getHelloWithSsr(@Req() req: Request, @Res() res: Response) {
    try {
      const assetMap = {
        ...this.assetMap,
        baseUrl: '/web',
        initialContentMap: {
          ...this.initialContentMap,
          'hello-message': this.appService.getHello(),
          initialLanguage: 'en-US',
          initialI18nStore: {},
        },
      };

      const entryPoint = [assetMap['main.js']];

      const { pipe, abort } = renderToPipeableStream(
        <StaticRouter location={req.url}>
          <App />
        </StaticRouter>,
        {
          bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
          bootstrapModules: entryPoint,
          onShellReady() {
            res.statusCode = 200;
            res.setHeader('Content-type', 'text/html');
            pipe(res);
          },
          onShellError() {
            res.statusCode = 500;
            res.send('<!doctype html><p>Loading...</p>');
          },
        }
      );

      // Add an event listener to handle client aborts
      req.once('aborted', () => {
        abort();
      });
    } catch (error) {
      // Handle errors gracefully
      console.error(error);
      res.status(500).send('<!doctype html><p>Error occurred during SSR</p>');
    }
  }
}
