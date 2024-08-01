
var _dbConn = require('./dbConn');
module.exports = {
    getCustomerAge: function(quote_data_req){
        return new Promise(function(resolve, reject){
            if(quote_data_req.customerGender!=''){
                let genderVal   =quote_data_req.customerGender.toLowerCase();
                if( genderVal=='f' ){
                    let custGivenAge    =quote_data_req.custAge;
                    let relaxAge    =parseInt(custGivenAge)-5;
                    if( relaxAge<18 ){
                        relaxAge    =18;
                    }
                    resolve(relaxAge);
                }
                else{
                    resolve(quote_data_req.custAge);
                }
            }
            else{
                reject("Invalid gender");
            }
        });
    },
    getMaxBandDeatils: function(quote_data_req){
        return new Promise(function(resolve, reject){
            let sumAssured  =quote_data_req.custSumAssured;
            const BAND_SQL    =`SELECT * FROM
			      life_max_band
            WHERE ? BETWEEN premium_min AND premium_max
            LIMIT 1`;

            _dbConn.query(BAND_SQL, [sumAssured] , function (error, [band_rows], fields) {
                if(!error) {
                    let bandId  =band_rows.band_id;
                    if( bandId>0 ){
                        resolve(band_rows);
                    }
                }else{
                    reject(error);
                }
            });
        })
    },
    getFactorDetails: function(){
        return new Promise(function(resolve, reject){
            let FACTOR_SQL    ="SELECT * FROM "+
            "life_max_premium_factor WHERE 1";
            _dbConn.query(FACTOR_SQL,[],function(error,factor_rows){
                if(!error) {
                    let factor_details  ={};
                    factor_rows.forEach(function(frow) {
                        factor_details[frow['factor_type']] =frow['factor_value'];
                    });
                    resolve(factor_details);
                }else{
                    reject(error);
                }
            });
        });
    },
    calculatePremium: function(quote_data_req){
        return new Promise(function(resolve, reject){
            if( quote_data_req.band_details.band_id>0 ){

                let paymentType ='Regular Pay';
                let age =quote_data_req.custAge;
                let smoker  =quote_data_req.customerSmoker;
                let gender  ='M';
                let term    =quote_data_req.custTerm;
                let band  =quote_data_req.band_details.band_id;
                let sumAssured  =parseInt(quote_data_req.custSumAssured);
                let provideId   =quote_data_req.provideId;
                let cover_upto  =parseInt(term)+parseInt(age);
                let productName ='STP';

                if( sumAssured>=5000000
                && sumAssured<=19900000 ){
                    if( cover_upto<=75 ){
                        productName ='OTP';
                    }
                }
                const PREMIUM_SQL =`SELECT
                life_max_premium.*,
                gibl_term_life_policy_types.policyName AS dbTypeName,
                gibl_term_life_policy_types.policyType AS dbTypeCode
                FROM
                life_max_premium
                INNER JOIN gibl_term_life_policy_types ON life_max_premium.dbType=gibl_term_life_policy_types.policyTypeId
                WHERE
                life_max_premium.productName=?
                AND life_max_premium.paymentType=?
                AND life_max_premium.age=?
                AND life_max_premium.smoker=?
                AND life_max_premium.gender=?
                AND life_max_premium.term=?
                AND life_max_premium.band=?`;

                _dbConn.query(PREMIUM_SQL,[productName,paymentType,age,smoker,gender,term,band],function(premium_error,prem_rows){
                    // console.log(this.sql);
                    if(!premium_error) {
                        let result_arr  =[];

                        prem_rows.forEach(function(prow,index) {
                            let premiumId   =prow['premiumId'];
                            let premiumVal =prow['premium'];
                            if( premiumId>0 && premiumVal>0 ){
                                let premiumValue    =parseInt(prow['premium']);
                                let actualPremium   =sumAssured*(premiumValue/100000);
                                let monthlyfactor   =parseFloat(quote_data_req.factor_details.Monthly);
                                let quarterlyfactor   =parseFloat(quote_data_req.factor_details.Quarterly);
                                let Half_Yearlyfactor   =parseFloat(quote_data_req.factor_details.Half_Yearly);
                                let annualfactor   =parseFloat(quote_data_req.factor_details.Annual);

                                let premium_arr ={};
                                premium_arr['annual_premium']   =Math.round(parseFloat(actualPremium*annualfactor));
                                premium_arr['monthly_premium']   =Math.round(parseFloat(actualPremium*monthlyfactor));
                                premium_arr['quarterly_premium']   =Math.round(parseFloat(actualPremium*quarterlyfactor));
                                premium_arr['half_yearly_premium']   =Math.round(parseFloat(actualPremium*Half_Yearlyfactor));
                                premium_arr['net_premium']   =premium_arr['annual_premium'];
                                premium_arr['total_premium']   =Math.round(premium_arr['net_premium']*1.18);
                                premium_arr['gst']   =18;
                                premium_arr['product_type']   ='ntp';
                                premium_arr['product_name']   ='ntp';
                                premium_arr['variant_code']   =prow['dbTypeCode'];
                                premium_arr['db_type']   =prow['dbTypeName'];
                                premium_arr['company_logo']   ='max_life.png';
                                premium_arr['provider_id']   =quote_data_req.provideId;
                                premium_arr['sum_assured']   =sumAssured;
                                premium_arr['term_age']   =term;
                                premium_arr['policy_type_id']   =prow['dbType'];
                                premium_arr['cover_upto']   =parseInt(term)+parseInt(quote_data_req.custRealAge);

                                let randomNo    =Math.random() * (100 - 90) + 90;
                                premium_arr['claim_settled']   =98.74;
                                premium_arr['provider_id']   =provideId;
                                result_arr.push(premium_arr);
                            }
                            else{
                                reject("Invalid data");
                            }
                        });
                        resolve(result_arr);
                    }
                    else{
                        console.log(premium_error);
                        reject(premium_error);
                    }
                });
            }
        });
    },
    getRegularPremium: async function(quote_data_req){
        let myObj   ={};
        myObj['age_details'] =await this.getCustomerAge(quote_data_req);
        quote_data_req.custRealAge  =quote_data_req.custAge;
        quote_data_req.custAge  =myObj['age_details'];

        myObj['band_details'] =await this.getMaxBandDeatils(quote_data_req);
        quote_data_req.band_details  =myObj['band_details'];
        let remainder   =parseInt(quote_data_req.custSumAssured)%100000;
        if( remainder>0 ){
            let sumVal  =parseInt(quote_data_req.custSumAssured)-remainder;
            quote_data_req.custSumAssured   =sumVal;
        }

        myObj['premium_factor'] =await this.getFactorDetails(quote_data_req);
        quote_data_req.factor_details   =myObj['premium_factor'];

        myObj['premium_details'] =await this.calculatePremium(quote_data_req);
        quote_data_req.premium_details  =myObj['premium_details'];
        quote_data_req.premium_details.company_logo ='max_life.png';

        let prem_response   =[];
        myObj['premium_details'].forEach(function(prow,index) {
            prem_response.push(prow);
        });
        return prem_response;
    }
}
