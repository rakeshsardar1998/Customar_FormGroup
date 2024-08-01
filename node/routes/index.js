
var express = require('express');
var router = express.Router();

var _dbConn = require('./modules/dbConn');

// var imagemin = require('imagemin');
// var imageminWebp = require('imagemin-webp');

// IMPORT FILE WRITE PACKAGE
var _fileObj = require("fs");
var _commonModule = require('./modules/commonModule');
var logDir = 'write_logs/';

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', function (req, res, next) {
  res.send('gggg');
});

router.post('/api/saveLifeQuote/', function (req, res, next) {
  if (req.method === 'POST') {
    let quote_data_req = req.body;
    let write_text = JSON.stringify(quote_data_req);
    let CurrentDate = new Date();
    let date_year = CurrentDate.getFullYear();
    let date_month = CurrentDate.getMonth() + 1;
    date_month = String("00" + date_month).slice(-2);
    let date_day = CurrentDate.getDate();
    let cur_date_str = date_year + "-" + date_month + "-" + date_day;
    dir_path = logDir + "/" + cur_date_str;

    var quoteBuffer = Buffer.from(write_text);
    if (!_fileObj.existsSync('write_logs')) {
      _fileObj.mkdirSync('write_logs');
    }

    _fileObj.writeFile("write_logs/quoteRequest.txt", quoteBuffer, (err) => {
      if (err) console.log(err);
      console.log("Life quote file write.");
    });

    _commonModule.saveQuoteData(quote_data_req)
      .then((resultQuote) => {
        console.log('Quote id:', resultQuote)
        res.json(resultQuote);
      })
      .catch((err) => {
        let tempData = {};
        console.log(err)
        res.status(200).json(tempData);
      });
  }
});

router.post('/api/resolveData', function (req, res, next) {
  if (req.method === 'POST') {
    console.log("Successfully Written to File post.");
    let res_data = { 'status': 'Success' };
    res.status(200).json(res_data);
  }
});

router.post('/api/updateLifeQuote/', function (req, res, next) {
  if (req.method === 'POST') {
    let quote_data_req = req.body;
    _commonModule.updateQuoteData(quote_data_req)
      .then((resultQuote) => {
        res.status(200).json(resultQuote);
      })
      .catch((err) => {
        let tempData = {};
        res.status(200).json(tempData);
      })
  }
});

router.post('/api/getQuoteDetails/', function (req, res, next) {
  if (req.method === 'POST') {
    let quote_data_req = req.body;
    // res.status(200).json(quote_data_req.quoteId);
    _commonModule.getQuoteData(quote_data_req)
      .then((resultQuote) => {
        res.status(200).json(resultQuote);
      })
      .catch((err) => {
        let tempData = {};
        res.status(200).json(tempData);
      })
  }
});

// router.get('/api/webp', function (req, res, next) {
//   (async () => {
//     const files = await imagemin(['convert_images/company_logo/*.{jpg,png}'], {
//       destination: 'convert_images/company_logo/webp',
//       plugins: [
//         imageminWebp({ quality: 100 })
//       ]
//     });
//     console.log(files);
//   })();
//   res.send('Success');
// });

module.exports = router;
