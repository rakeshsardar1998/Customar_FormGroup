
var express = require('express');
var request = require('request');
var router = express.Router();

router.post("/api/getPremium/:provideId?", (req, res, next) => {
    request.post({
        headers: { 'content-type': 'application/json' },
        url: req.body.serviceUrl,
        form: req.body
    }, (error, response, body) => {
        if (error)
            res.status(200).json({ error: error });

        try {
            res.status(200).send(JSON.parse(body));
        } catch (e) {
            res.status(200).send(body);
        }
    });
});

router.post("/api/getProposal/:provideId?", (req, res, next) => {
    if (req.params.provideId == undefined)
        res.status(404).json({ error: 'Invalid request' });

    request.post({
        headers: { 'content-type': 'application/json' },
        //strictSSL: false,
        url: req.body.serviceUrl,
        form: req.body
    }, (error, response, body) => {
        if (error)
            res.status(200).json({ error: error });

        try {
            res.status(200).send(JSON.parse(body));
        } catch (e) {
            res.status(200).send(body);
        }
    });

});

router.post("/api/", (req, res, next) => {
    request.post({
        headers: { 'content-type': 'application/json' },
        //strictSSL: false,
        url: req.body.serviceUrl,
        form: req.body
    }, (error, response, body) => {
        if (error)
            res.status(200).json({ error: error });

        try {
            res.status(200).send(JSON.parse(body));
        } catch (e) {
            res.status(200).send(body);
        }
    });

});

module.exports = router;