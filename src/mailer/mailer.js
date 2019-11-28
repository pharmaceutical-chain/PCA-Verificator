"use strict";

const bodyParser = require("body-parser");
const cors = require('cors')
const nodemailer = require("nodemailer");
const handlebars = require('handlebars');
const fs = require('fs');

module.exports = (express) => {
  const router = express.Router();

  // configure the Express middleware to accept CORS requests and parse request body into JSON
  // note: type of body will determinate the type of request header
  router.use(cors());
  router.use(bodyParser.json());

  ////////////////////////////////////////////////////////////////////////////////////////////////
  //  SEND MAIL ENDPOINT
  //
  // define a sendmail endpoint, which will send emails and response with the corresponding status
  router.post('', async (req, res, next) => {
    try {
      const data = req.body;
      await sendMail(data, (err, info) => {
        if (err) {
          console.log(err);
          res.status(400);
          res.send({ error: 'Failed to send email' });
        } else {
          console.log('Email has been sent');
          res.send(info);
        }
      });
    } catch (error) {
      return next(error);
    }
  });

  const sendMail = async (data, callback) => {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'otis58@ethereal.email',
        pass: 'V6PKchDW9U8D57r8gK'
      }
    });

    readHTMLFile(__dirname + '/template.html', async (err, html) => {
      const template = handlebars.compile(html);
      const templateCompiled = template(data);

      const mailOption = {
        from: data.isEmail ? `<${data.userContact}>` : '"PharmaChain Verificator" <pharmachain.verificator@gmail.com>',
        to: '"Admin" <otis58@ethereal.email>',
        subject: `REPORT @${data.reportYear} - PharmaChain Verificator`,
        text: `Retailer: ${data.retailerId}\nBatch: ${data.batchId}\nUser contact: ${data.userContact}\nContent: ${data.reportContent}`,
        html: templateCompiled
      }

      return await transporter.sendMail(mailOption, callback);
    });
  };

  const readHTMLFile = (path, callback) => {
    fs.readFile(path, { encoding: 'utf-8' }, (err, html) => {
      if (err) {
        throw err;
        callback(err);
      }
      else {
        callback(null, html);
      }
    });
  };

  return router;
}
