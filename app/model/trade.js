const mongoose = require('mongoose');
const config = require('../config/settings');
const { Schema } = require('mongoose')

const tradeSchema = new mongoose.Schema(
  {
    userId: {
        type: Schema.Types.ObjectId, ref: config.mongo.collections.user,
    },
    trade_id: {
        type: String,
        required: true,
      },
    status: {
        type: String,
        required: true,
        default: 'pending',
        enum: ['pending', 'Reject', 'Accept']
    },
    amount: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    subcategory: {
        type: String,
        required: true,
    },
  },
  {
    timestamps: true
  }
);


const TradeModel = mongoose.model(config.mongo.collections.trade, tradeSchema);
module.exports = TradeModel;

