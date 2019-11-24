const path = require('path');
const express = require('express');
const compression = require('compression');

const CONTEXT = `/${process.env.CONTEXT || 'pca-verificator-application'}`;
const PORT = process.env.PORT || 4200;

const app = express();

app.use(compression());
app.use(
  CONTEXT,
  express.static(
    path.resolve(__dirname, './dist/PCA-Verification')
  )
);
app.use(
  '/',
  express.static(
    path.resolve(__dirname, './dist/PCA-Verification')
  )
);
app.use(
  '/*',
  express.static(
    path.resolve(__dirname, './dist/PCA-Verification')
  )
);

app.listen(PORT, () =>
  console.log(`App running on http://localhost:${PORT}${CONTEXT}`)
);
