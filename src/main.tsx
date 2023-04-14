import React from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import {HashRouter} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';
import 'rc-tooltip/assets/bootstrap.css';
import 'toastr/build/toastr.css';

import {routes} from '@/routes';
import {store} from '@/store';
import initIpcListeners from '@/electron/listeners';

import App from '@/components/App';

initIpcListeners();

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <HashRouter basename="/">
      <React.StrictMode>
        <App routes={routes} />
      </React.StrictMode>
    </HashRouter>
  </Provider>
);

postMessage({payload: 'removeLoading'}, '*');
