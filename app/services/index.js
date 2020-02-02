const TradeModel = require('../model/trade');
const UserModel = require('../model/user');
const AccountModel = require('../model/account')
const MongoDBHelper = require('../lib/MongoDBHelper');

class MainService {
        /**
     *
     * @param {*} logger Logger Object
     * @param {*} mongo mongo Object
     */
  constructor(logger, mongoclient) {
    this.logger = logger;
    this.user = new MongoDBHelper(mongoclient, UserModel);
    this.trade = new MongoDBHelper(mongoclient, TradeModel);
    this.account = new MongoDBHelper(mongoclient, AccountModel);
  }

  saveNewUsers(param){
    return this.user.save(param);
  };

  findByEmail(email){
    return this.user.getOne({email});
  };

  findByPhoneNo(phone_no){
    return this.user.getOne({phone_no});
  };

  createNewTrade(param){
    return this.trade.save(param);
  };


  getAllTrades(userId){
    return TradeModel.find({userId});
  };

  saveAccount(param){
    return this.account.save(param);
  }

  getAllAccount(userId){
    return this.account.get({userId});
  };
}

module.exports = MainService;