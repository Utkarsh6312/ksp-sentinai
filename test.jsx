import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import App from './src/App.jsx';

try {
  const html = renderToString(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );
  console.log("Rendered successfully. Length:", html.length);
} catch (e) {
  console.error("RENDERING FAILED:", e);
}
