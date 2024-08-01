
var express = require('express');
var request = require('request');
var router = express.Router();

router.post("/api/getPremium/:provideId?", (req, res, next) => {
	if (req.method === 'POST') {
      console.log("Node Working");
      let ApiURL = req.body.custAge;

      let premium_arr ={};
      premium_arr['annual_premium']   ='';
      premium_arr['monthly_premium']   ='';
      premium_arr['quarterly_premium']   ='';
      premium_arr['half_yearly_premium']   ='';
      premium_arr['net_premium']   ='';
      premium_arr['total_premium']   ='';
      premium_arr['gst']   =18;
      premium_arr['product_type']   ='aegon';
      premium_arr['product_name']   ='aegon';
      premium_arr['variant_code']   ='aegon';
      premium_arr['db_type']   ='Aegon Term Insurance'
      // premium_arr['company_logo']   ='webp/aegon_logo.webp';
			premium_arr['company_logo']   ='aegon_logo.png';
			premium_arr['company_name']   ='Aegon';
      premium_arr['provider_id']   =32;
      premium_arr['policy_type_id']   =14;
      premium_arr['sum_assured']   =req.body.custSumAssured;
      premium_arr['term_age']   =req.body.custTerm;
      premium_arr['cover_upto']   =parseInt(req.body.custTerm)+parseInt(req.body.custAge);
      // let randomNo    =Math.random() * (100 - 90) + 90;
      premium_arr['claim_settled']   =98.55;
      premium_arr['premium_group']   =0;
			premium_arr['premium_show']   =1;
      let result_arr  =[];
      result_arr.push(premium_arr);
      res.json(result_arr);
	}
});

module.exports = router;
