const mongoose = require('mongoose');
const config = require('../config/settings');
const { Schema } = require('mongoose')

const accountSchema = new mongoose.Schema(
  {
    userId: {
        type: Schema.Types.ObjectId, ref: config.mongo.collections.user,
    },
    account_name: {
        type: String,
        required: true,
      },
    account_number: {
        type: String,
        required: true,
    },
    bank_name: {
        type: String,
        required: true,
    },
    default: {
        type: Boolean,
        default: false
    },
 
  },
  {
    timestamps: true
  }
);


const AccountModel = mongoose.model(config.mongo.collections.account, accountSchema);
module.exports = AccountModel;

