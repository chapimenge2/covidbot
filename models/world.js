var mongoose = require('mongoose');
var Schema = mongoose.Schema ;


var worldSchema = new Schema({
    cases: {
        type: Number,
        default: 0
    },
    deaths: {
        type: Number,
        default: 0
    },
    recovered: {
        type: Number,
        default: 0
    },
    total_new_cases_today: {
        type: Number , 
        default: 0
    },
    todayDeaths: {
        type: Number , 
        default: 0
    },
    total_active_cases: {
        type: Number , 
        default: 0
    },
    total_serious_cases: {
        type: Number , 
        default: 0
    },
    last_update: {
        type: Date,
        default: new Date()
    }
});

var world = mongoose.model("world", worldSchema) ;

module.exports = world ;