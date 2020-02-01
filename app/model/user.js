const mongoose = require('mongoose');
const config = require('../config/settings');

const userSchema = new mongoose.Schema(
  {
    phone_no: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    fullname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      unique: true,
      required:true
    },
    // wallet: { 
    //   type: Schema.Types.ObjectId, ref: config.mongo.collections.wallet 
    // },
    // account: { 
    //   type: Schema.Types.ObjectId, ref: config.mongo.collections.user 
    // }
    
  },
  {
    timestamps: true
  }
);


const UserModel = mongoose.model(config.mongo.collections.user, userSchema);
module.exports = UserModel;

