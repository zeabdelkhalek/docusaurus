/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import http from 'http';
import httpProxy from 'http-proxy';
import serveHandler from 'serve-handler';
import boxen from 'boxen';
import chalk from 'chalk';
import path from 'path';

import build from './build';
import {getCLIOptionHost, getCLIOptionPort} from './commandUtils';
import {loadContext} from '../server';
import {ServeCLIOptions} from '@docusaurus/types';

const defaultBaseUrl = '/';

export default async function serve(
  siteDir: string,
  cliOptions: ServeCLIOptions,
): Promise<void> {
  let dir = path.isAbsolute(cliOptions.dir)
    ? cliOptions.dir
    : path.join(siteDir, cliOptions.dir);

  if (cliOptions.build) {
    dir = await build(
      siteDir,
      {
        config: cliOptions.config,
        outDir: dir,
      },
      false,
    );
  }

  const host: string = getCLIOptionHost(cliOptions.host);
  const port: number | null = await getCLIOptionPort(cliOptions.port, host);

  if (port === null) {
    process.exit();
  }

  const {baseUrl} = await loadContext(siteDir, {
    customOutDir: cliOptions.dir,
    customConfigFilePath: cliOptions.config,
  });

  const servingUrl = `http://${cliOptions.host}:${cliOptions.port}`;
  const proxyServer = httpProxy.createProxyServer({
    target: `${servingUrl}${defaultBaseUrl}`,
  });
  const server = http.createServer((req, res) => {
    if (baseUrl !== defaultBaseUrl && req.url?.startsWith(baseUrl)) {
      req.url = req.url?.replace(baseUrl, defaultBaseUrl);

      return proxyServer.web(req, res);
    }

    return serveHandler(req, res, {
      cleanUrls: true,
      public: dir,
    });
  });

  console.log(
    boxen(
      `${chalk.green(
        `Serving "${cliOptions.dir}" directory at ${servingUrl}${baseUrl}`,
      )}`,
      {
        borderColor: 'green',
        padding: 1,
        margin: 1,
        align: 'center',
      },
    ),
  );
  server.listen(port);
}
