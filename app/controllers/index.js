/**
 * Created by Adeyinka Micheal
 */
 
 // imported modules
 const Response = require('../lib/response_manager');
 const HttpStatus = require('../constants/http_status');
 const config = require('../config/settings');
 const uuid = require('uuid/v4')
 const bcrypt = require('bcrypt');

 // Get all categories
 const allCategoryData = require('../config/config')

 class MainController {
    /**
         * Class Constructor
         *
         * @param logger - winston logger
         * @param mainService
     */
    constructor(logger, mainService) {
        this.logger = logger;
        this.mainService = mainService;
    }

    async createNewUsers(req, res){
        // check if all required parameters were passed
        const { password, email, phone_no, fullname } = req.body;

        if (!password || !email || !fullname || !phone_no) {
            return Response.failure(res, { message: 'Error!! pls provide password, Email ,fields, phone_no, fullname' }, HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = this.hashPassword(password);
        const params = {
            fullname,
            email,
            password: hashedPassword,
            phone_no,
            userId: uuid()
        };
        try {
            const emailCheck = await this.mainService.findByEmail(email);
            const phoneCheck = await this.mainService.findByPhoneNo(phone_no);
            if(phoneCheck !== null){
                return Response.failure(res, {
                    message: 'phone already exist for the user'
                  }, HttpStatus.BAD_REQUEST)
            }

            if(emailCheck !== null){
                return Response.failure(res, {
                    message: 'email already exist for the user'
                  }, HttpStatus.BAD_REQUEST)
            };
           const resp = await this.mainService.saveNewUsers(params);
            return Response.success(res, {
                message: 'Users created successfully',
                response: resp
              }, HttpStatus.CREATED)
        } catch(e){
            console.log('error creating users', e);
            return Response.failure(res, {
                message: 'Internal server Error',
              }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async logUsersIn(req, res){
        const { email, password } = req.body;
        
        // check if required parameters are passed
        if (!password || !email) {
          return Response.failure(res, { message: 'Error!! pls provide password, Email ,fields' }, HttpStatus.BAD_REQUEST);
        };

        try {
            const emailCheck = await this.mainService.findByEmail(email)
            if (emailCheck === null){
                return Response.failure(res, {
                    message: 'Email does not exist',
                }, HttpStatus.BAD_REQUEST)
            }
            const hash = emailCheck.password;
            if(bcrypt.compareSync(password, hash)) {
                return Response.success(res, {
                message: 'User successfully logged in',
                response: emailCheck,
                }, HttpStatus.OK)
            } else {
                return Response.failure(res, {
                message: 'Invalid password',
                }, HttpStatus.BAD_REQUEST)
            }
        } catch(e){
            return Response.failure(res, {
                message: 'Internal server Error',
              }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

      /**
     * this method hashes the decrypted password
     *
     * @param params
     */
    hashPassword(password) {
        let hash = bcrypt.hashSync(password, config.mongo.salt_value);
        return hash;
    }

    getAllCategories(req, res){
        let allCategories = [];
        for (let cat in allCategoryData){
            allCategories.push(cat);
        }
        return Response.success(res, {
            message: 'All categories gotten successfully',
            response: allCategories,
            }, HttpStatus.OK)
    };

    getSubCategories(req, res){
        const { category } = req.query;
        
        // check if required parameters are passed
        if (!category) {
          return Response.failure(res, { message: 'Error!! pls provide category in query' }, HttpStatus.BAD_REQUEST);
        };

        let subCategories = [];
        for (let cat in allCategoryData){
            if(category === cat){
                subCategories.push(allCategoryData[cat]);
            }
        }
        if(subCategories.length === 0){
            return Response.failure(res, { message: "Category doesn't exist" }, HttpStatus.BAD_REQUEST);
        }
        return Response.success(res, {
            message: 'All subcategories gotten successfully',
            response: subCategories,
            }, HttpStatus.OK)
    }

    async startATrade(req, res){
        // check if all required parameters were passed
        const { userId, category, subcategory, amount } = req.body;

        if (!userId || !category || !subcategory || !amount) {
            return Response.failure(res, { message: 'Error!! pls provide, userId, category, subcategory, amount' }, HttpStatus.BAD_REQUEST);
        };

        const param = {
            userId, category, subcategory, amount,
            trade_id: uuid()
        };
        try {
           const resp = await this.mainService.createNewTrade(param);
            return Response.success(res, {
                message: 'Trade created successfully',
                response: resp
              }, HttpStatus.CREATED)
        } catch(e){
            console.log('error creating users', e);
            return Response.failure(res, {
                message: 'Internal server Error',
              }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllTrade(req, res){
        const { userId } = req.query;

        if (!userId) {
            return Response.failure(res, { message: 'Error!! pls provide userId in the query' }, HttpStatus.BAD_REQUEST);
        };

        try {
            const resp = await this.mainService.getAllTrades(userId);
             return Response.success(res, {
                 message: 'Trade gotten successfully',
                 response: resp
               }, HttpStatus.OK)
         } catch(e){
             console.log('error geting trades', e);
             return Response.failure(res, {
                 message: 'Internal server Error',
               }, HttpStatus.INTERNAL_SERVER_ERROR);
         }
    }

    rateCalculator(req, res){
          // check if all required parameters were passed
        const { category, subcategory, amount } = req.body;

        if (!category || !subcategory || !amount) {
            return Response.failure(res, { message: 'Error!! pls provide, userId, category, subcategory' }, HttpStatus.BAD_REQUEST);
        };

        let finalAmount;
        for (let cat in allCategoryData){
            if(category === cat){
                for (let sub of allCategoryData[cat]){
                    if(sub.name === subcategory){
                        finalAmount = amount * Number(sub.rate)
                    }
                }
            }
        }
        return Response.success(res, {
            message: 'Final rate amount',
            response: finalAmount
          }, HttpStatus.OK)
    }

    async addAccount(req, res){
        // check if all required parameters were passed
        const { account_name, account_number, bank_name, userId } = req.body;

        if (!account_name || !account_number || !bank_name || !userId) {
            return Response.failure(res, { message: 'Error!! pls provide, userId, category, subcategory' }, HttpStatus.BAD_REQUEST);
        };

        const param = {
            userId, account_name, account_number, bank_name
        };
        try {
           const resp = await this.mainService.saveAccount(param);
            return Response.success(res, {
                message: 'Account created successfully',
                response: resp
              }, HttpStatus.CREATED)
        } catch(e){
            console.log('error creating account', e);
            return Response.failure(res, {
                message: 'Internal server Error',
              }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAccount(req, res){
        const { userId } = req.query;

        if (!userId) {
            return Response.failure(res, { message: 'Error!! pls provide userId in the query' }, HttpStatus.BAD_REQUEST);
        };

        try {
            const resp = await this.mainService.getAllAccount(userId);
             return Response.success(res, {
                 message: 'Account gotten successfully',
                 response: resp
               }, HttpStatus.OK)
         } catch(e){
             console.log('error getting account', e);
             return Response.failure(res, {
                 message: 'Internal server Error',
               }, HttpStatus.INTERNAL_SERVER_ERROR);
         }
    }

  }
 
  module.exports = MainController;
