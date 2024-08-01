
var express = require('express');
var request = require('request');
var router = express.Router();

router.post("/api/getPremium/:provideId?", (req, res, next) => {
	if (req.method === 'POST') {
        const ApiURL = req.body.serviceUrl;
    	console.log('EDELWEISS TOKIO CALLED::', ApiURL);
        request.post({
            headers: {'content-type': 'application/json'},
            url: ApiURL,
            form: req.body
        }, function(error, response, body) {
            console.log('EDELWEISS TOKIO RESPONED::', ApiURL);
            res.send(body);
        });
	}
});
module.exports = router;

