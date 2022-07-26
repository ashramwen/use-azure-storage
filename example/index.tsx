import 'react-app-polyfill/ie11';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { useAzureStorage } from '../.';

const config = {
  account: process.env.AZURE_BLOB_ACCOUNT as string,
  token: process.env.AZURE_BLOB_TOKEN as string,
  container: process.env.AZURE_BLOB_CONTAINER as string,
};

const App = () => {
  const { uploadFiles } = useAzureStorage(config);
  return <div>123</div>;
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
