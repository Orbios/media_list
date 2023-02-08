import React from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';

import 'bootstrap/dist/css/bootstrap.css';
import 'toastr/build/toastr.css';

import {store} from '@/store';
import initIpcListeners from '@/electron/listeners';

import App from '@/components/App';

import '@/styles/index.scss';

initIpcListeners();

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);

postMessage({payload: 'removeLoading'}, '*');
