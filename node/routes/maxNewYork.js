var express = require('express');
var request = require('request');
var router = express.Router();

// IMPORT MODULE FILE
var _maxnyModule = require('./modules/maxNyModule');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource max');
});

router.post('/api/getMaxRegularQuote/:provideId?', function(req, res, next) {
    if (req.method === 'POST') {
        let quote_data_req = req.body;
        quote_data_req.provideId    =req.params.provideId;
        _maxnyModule.getRegularPremium(quote_data_req)
        .then((resultPremium)=>{
            res.json(resultPremium);
        })
        .catch((err)=>{
            let tempData    ={};
            console.log(err);
            res.status(404).json(tempData);
        })
    }
});

router.post("/api/getPremium/:provideId?", (req, res, next) => {
	if (req.method === 'POST') {
      let ApiURL = req.body.serviceUrl;
      // res.send(req.body);
      request.post({
          headers: {'content-type': 'application/json'},
          url: ApiURL,
          form: req.body
      }, function(error, response, body) {
          if( !error ) {
            res.send(body);
          } else {
            let tempData    ={};
            res.status(404).json(tempData);
          }
      });
	}
});

module.exports = router;
