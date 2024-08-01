
var express = require('express');
var request = require('request');
var router = express.Router();

router.post("/api/getRegularQuote/:provideId?", (req, res, next) => {
	if (req.method === 'POST') {
        if( req.params.provideId ) {
            let ApiURL = req.body.serviceUrl;
            console.log(`ICICI PRUDENTIAL PREMIUM CALLED::${ApiURL}`);
            request.post({
                headers: {'content-type': 'application/json'},
				//strictSSL: false,
                url: ApiURL,
                form: req.body
            }, function(error, response, body) {
                if( !error ) {
                    console.log(`ICICI PRUDENTIAL PROPOSAL RESPONED`);
                    res.status(200).send(body);
                } else {
                    console.log(`ICICI PRUDENTIAL PROPOSAL RESPONED ERROR`);
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

router.post("/api/getProposal/:provideId?", (req, res, next) => {
	if (req.method === 'POST') {
        if( req.params.provideId ) {
            let ApiURL = req.body.serviceUrl;
            console.log(`ICICI PRUDENTIAL PROPOSAL CALLED::${ApiURL}`);
            request.post({
                headers: {'content-type': 'application/json'},
				//strictSSL: false,
                url: ApiURL,
                form: req.body
            }, function(error, response, body) {
        		if( !error ) {
                    console.log(`ICICI PRUDENTIAL PROPOSAL RESPONED`);
        			res.status(200).send(body);
        		} else {
                    console.log(`ICICI PRUDENTIAL PROPOSAL RESPONED ERROR`);
        			let tempData    ={error:error};
        			res.status(200).json(tempData);
        		}
            });
        } else {
            let tempData    ={error:'Invalid request'};
            res.status(404).json(tempData);
        }  
	}
});

module.exports = router;
