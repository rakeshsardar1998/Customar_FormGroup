
var _dbConn = require('./dbConn');
module.exports = {
    getCurMysqlDateTime: function () {
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        // current month
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        // current year
        let year = date_ob.getFullYear();
        // current hours
        let hours = ("0" + (date_ob.getHours())).slice(-2);
        // current minutes
        let minutes = ("0" + (date_ob.getMinutes())).slice(-2);
        // current seconds
        let seconds = ("0" + (date_ob.getSeconds())).slice(-2);
        let cur_date_time = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
        return cur_date_time;
    },
    saveQuote: function (quote_data_req) {
        return new Promise(function (resolve, reject) {
            let quoteData = {};
            let entryDate = quote_data_req.entryDate;

            quoteData.custName = quote_data_req.custName;
            quoteData.custEmail = quote_data_req.custEmail;
            quoteData.custMobile = quote_data_req.custMob;
            quoteData.custDOB = quote_data_req.customerFormatDOB;
            quoteData.custSumAssured = quote_data_req.custSumAssured;
            quoteData.custTerm = quote_data_req.custTerm;
            quoteData.custGender = quote_data_req.customerGender;
            quoteData.custEmpStatus = quote_data_req.customerEmpStatus;
            quoteData.uniqueId = quote_data_req.uniqueId;
            quoteData.policy_type = 'TERMLIFE';
            let quoteJson = quoteData;
            let insert_status = false;
            // console.log('UniqueId : ------> ', quoteData.uniqueId);
            const CHK_SQL = `SELECT quoteId
            FROM quote_life
            WHERE quote_life.uniqueId=?
            LIMIT 1`;

            _dbConn.query(CHK_SQL, [quoteData.uniqueId], function (error, [chk_res], fields) {
                // console.log(this.sql);
                // console.log(chk_res);
                if (!error) {
                    if (typeof chk_res === 'undefined') {
                        insert_status = true;
                    }
                    else {
                        insert_status = false;
                    }

                    if (insert_status) {
                        // INSERT INTO CUSTOMER TABLE
                        CUSTOMER_SQL = `INSERT INTO
                        customers
                        SET
                        source_device=?,
                        source_type=?,
                        source_value=?,
                        cust_name=?,
                        cust_phone=?,
                        cust_email=?,
                        cust_dob=?,
                        cust_occupation=?,
                        created_on=?`;

                        _dbConn.query(CUSTOMER_SQL, ['DESKTOP', 'GIBL', 'GIBL', quoteData.custName, quoteData.custMobile, quoteData.custEmail, quoteData.custDOB, quoteData.custEmpStatus, entryDate], function (error, cust_res) {
                            // console.log(this.sql);
                            if (!error) {
                                if (cust_res.insertId > 0) {
                                    let created_by_cust_id = cust_res.insertId;
                                    const QUOTE_SQL = `INSERT INTO
                                        quotes
                                        SET
                                        policy_type=?,
                                        is_renewal=0,
                                        prev_claim=0,
                                        raw_json=?,
                                        cust_name=?,
                                        cust_email=?,
                                        cust_phone=?,
                                        created_on=?,
                                        cust_id=?,
                                        created_by=0`;

                                    _dbConn.query(QUOTE_SQL, [quoteData.policy_type, JSON.stringify(quote_data_req), quoteData.custName, quoteData.custEmail, quoteData.custMobile, entryDate, created_by_cust_id], function (error, quote_res) {
                                        if (!error) {
                                            if (quote_res.insertId > 0) {
                                                let quote_id = quote_res.insertId;

                                                QUOTE_INSERT_SQL = `INSERT INTO
                                                quote_life
                                                SET
                                                quoteId=?,
                                                uniqueId=?,
                                                custName=?,
                                                custEmail=?,
                                                custMobile=?,
                                                custDOB=?,
                                                custSumAssured=?,
                                                custTerm=?,
                                                custGender=?,
                                                custEmpStatus=?,
                                                entryDate=?,
                                                quoteJson=?`;

                                                _dbConn.query(QUOTE_INSERT_SQL, [quote_id, quoteData.uniqueId, quoteData.custName, quoteData.custEmail, quoteData.custMobile, quoteData.custDOB, quoteData.custSumAssured, quoteData.custTerm, quoteData.custGender, quoteData.custEmpStatus, entryDate, JSON.stringify(quote_data_req)], function (error, quote_res) {
                                                    if (!error) {
                                                        if (quote_res.insertId > 0) {
                                                            let response_arr = {};
                                                            response_arr = quote_id; resolve(response_arr);
                                                        }
                                                        else {
                                                            console.log(error);
                                                            reject(error);
                                                        }
                                                    } else {
                                                        console.log(error);
                                                        reject(error);
                                                    }
                                                });
                                            }
                                            else {
                                                console.log(error);
                                                reject(error);
                                            }
                                        }
                                        else {
                                            console.log(error);
                                            reject(error);
                                        }
                                    });
                                }
                                else {
                                    console.log(error);
                                    reject(error);
                                }
                            }
                            else {
                                console.log(error);
                                resolve("fail");
                            }
                        });
                    } else {
                        let res_data = { 'status': 'Success' };
                        reject(res_data);
                    }
                } else {
                    console.log(error);
                    reject(error);
                }
            });
        });
    },
    updateQuote: function (quote_data_req) {
        return new Promise(function (resolve, reject) {
            let quote_id = quote_data_req.quote_id;
            let providerId = quote_data_req.premiumJson.provider_id;
            let policy_type_id = quote_data_req.policy_type_id;
            let updated_on = quote_data_req.updateDate;

            const CHK_SQL = `UPDATE quote_life
            SET providerId=?,
            policyTypeId=?
            WHERE quote_life.quoteId=?`;

            _dbConn.query(CHK_SQL, [providerId, policy_type_id, quote_id], function (error, chk_res) {
                if (!error) {
                    const CHK_SQL = `UPDATE quotes
                    SET proposal_raw_json=?,
                    updated_on=?
                    WHERE quotes.quote_id=?`;

                    _dbConn.query(CHK_SQL, [JSON.stringify(quote_data_req), updated_on, quote_id], function (error, chk_res) {
                        // console.log(this.sql);
                        if (!error) {
                            const affectedRows = chk_res.affectedRows;
                            // DELETE BUYNOW LOG IF EXISTS
                            const DEL_SQL = `DELETE FROM
                            life_buynow_click_log
                            WHERE life_buynow_click_log.quote_id=?
                            AND life_buynow_click_log.provider_id=?`;

                            _dbConn.query(DEL_SQL, [quote_id, providerId], function (error, chk_res) {
                                if (!error) {
                                    const LOG_SQL = `INSERT INTO
                                    life_buynow_click_log
                                    SET life_buynow_click_log.quote_id=?,
                                    life_buynow_click_log.provider_id=?`;

                                    _dbConn.query(LOG_SQL, [quote_id, providerId], function (error, chk_res) {
                                        resolve(affectedRows);
                                    });
                                }
                            });
                        } else {
                            console.log('Error:: ', error);
                            reject(error);
                        }
                    });
                } else {
                    console.log('Error:: ', error);
                    reject(error);
                }
            });
        });
    },
    saveQuoteData: async function (quote_data_req) {
        let myObj = [];
        let curDateTime = await this.getCurMysqlDateTime();
        quote_data_req.entryDate = curDateTime;
        console.log('Time::', curDateTime);
        myObj = await this.saveQuote(quote_data_req);
        return myObj;
    },
    updateQuoteData: async function (quote_data_req) {
        let myObj = [];
        let curDateTime = await this.getCurMysqlDateTime();
        quote_data_req.updateDate = curDateTime;
        myObj = await this.updateQuote(quote_data_req);
        return myObj;
    }
}
