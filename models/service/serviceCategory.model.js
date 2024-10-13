const mongoose = require('mongoose');
const serviceCategorySchema = new mongoose.Schema({
    serviceCategoryId: {
        type: String,
        trim :true,
        unique:true,
    },
    name : {
        type: String,
        trim :true,
    },
    image:{
        type:String,
        trim:true,
    },
    isActive: {
        type: Boolean,
        default :true
    },
    status: {
        type: String,
        trim: true,
        default: "pending",
      },
},
{ timestamps: true }
)
module.exports = mongoose.model("ServiceCategory",serviceCategorySchema)