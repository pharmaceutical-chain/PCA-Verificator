const path = require('path');
const express = require('express');
const compression = require('compression');
const mailer = require('./src/mailer/mailer')(express);

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
app.use('/sendreport', mailer);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`App running on http://localhost:${PORT}${CONTEXT}`)
});
