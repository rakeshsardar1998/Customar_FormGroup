
var express = require('express');
var request = require('request');
var router = express.Router();

router.post("/api/getPremium/:provideId?", (req, res, next) => {
	if (req.method === 'POST') {
        if( req.params.provideId ) {
            let ApiURL = req.body.serviceUrl;
            console.log(`BHARTI AXA PREMIUM CALLED::${ApiURL}`);
            request.post({
                headers: {'content-type': 'application/json'},
                url: ApiURL,
                form: req.body
            }, function(error, response, body) {
                if( !error ) {
                    console.log(`BHARTI AXA PREMIUM RESPONED`);
                    res.status(200).send(body);
                } else {
                    console.log(`BHARTI AXA PREMIUM PROPOSAL RESPONED ERROR`);
                    let tempData    ={error:error};
                    res.status(200).json(tempData);
                }
            });
        } else {
            let tempData    ={error:'Invalid request'};
            res.status(404).json(tempData);
        }        
	} else {
        let tempData    ={error:'Invalid request'};
        res.status(404).json(tempData);
    }
});

module.exports = router;
