/*
 * Copyright 2019 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import React, { StrictMode } from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory, Router } from '@americanexpress/one-app-router';
import { setModuleMap } from 'holocron';

import { initializeClientStore, loadPrerenderScripts, moveHelmetScripts } from './prerender';
import createRoutes from '../universal/routes';
import match from '../universal/utils/matchPromisified';


export default async function initClient() {
  try {
    // eslint-disable-next-line no-underscore-dangle
    setModuleMap(global.__CLIENT_HOLOCRON_MODULE_MAP__);
    moveHelmetScripts();

    const store = initializeClientStore();
    const history = browserHistory;
    const routes = createRoutes(store);

    await loadPrerenderScripts(store.getState());

    const { redirectLocation, renderProps } = await match({ history, routes });

    if (redirectLocation) {
      // FIXME: redirectLocation has pathname, query object, etc; need to format the URL better
      // TODO: would `browserHistory.push(redirectLocation);` and render below, but app stalls
      window.location.replace(redirectLocation.pathname);
      return;
    }

    /* eslint-disable react/jsx-props-no-spreading */
    const App = () => (
      <StrictMode>
        <Provider store={store}>
          <Router {...renderProps} />
        </Provider>
      </StrictMode>
    );
    /* eslint-enable react/jsx-props-no-spreading */

    hydrate(
      <App />,
      document.getElementById('root')
    );
    [...document.getElementsByClassName('ssr-css')]
      .forEach((style) => style.remove());

    // eslint-disable-next-line no-underscore-dangle
    delete global.__INITIAL_STATE__;
    document.getElementById('initial-state').remove();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    // TODO add renderError
  }
}
