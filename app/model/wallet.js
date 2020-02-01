const mongoose = require('mongoose');
const config = require('../config/settings');

const walletSchema = new mongoose.Schema(
  {
    userId: {
        type: Schema.Types.ObjectId, ref: config.mongo.collections.user,
    },
    type: {
        type: String,
        required: true,
      },
    amount: {
        type: Number,
        required: true
      },
    status: {
        type: String,
        trim: true
      },
    reason: {
        type: String,
        trim: true
      },
 
  },
  {
    timestamps: true
  }
);


const WalletModel = mongoose.model(config.mongo.collections.wallet, walletSchema);
module.exports = WalletModel;

