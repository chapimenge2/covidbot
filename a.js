
const process = require('dotenv').config().parsed
const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const axios = require('axios')
var fs = require('fs');
var countries = require('./country');
var cron = require('node-cron');
var mongoose = require('mongoose');
const countryModel = require("./models/country")
const worldModel = require("./models/world")
const user = require("./models/user")

// Dictionary
var rev_country = require('./rev country')
var main = require("./main")
console.log("dsfsdf")

mongoose.connect('mongodb+srv://chapi:chapi@145121@cluster0-ctxg0.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', ()=>{
    dbconnected = false
    console.error.bind( console, 'connection error:' ) ;
});
db.once('open', function () {
  console.log("Connected");
});
mongoose.set('useFindAndModify', false);


async function updateWorld(todayDeaths) {
    try {
        console.log("Updating the world");

        const worldraw = await axios.get("https://coronavirus-19-api.herokuapp.com/all")
        
        
        const world_data = await worldraw.data
        world_data.last_update = new Date()

        if (todayDeaths !== -1){
            world_data.todayDeaths = todayDeaths;
        }
        try{
        	console.log("world is here")
          const virustracker = await axios.get("https://thevirustracker.com/free-api?global=stats")
          const virustrackerdat = await virustracker.data.results[0]
          world_data.cases = Math.max(world_data.cases, virustrackerdat.total_cases)
          world_data.deaths = Math.max(world_data.deaths, virustrackerdat.total_deaths)
          world_data.recovered = Math.max(world_data.recovered, virustrackerdat.total_recovered)
          world_data.todayDeaths = Math.max(todayDeaths, virustrackerdat.total_deaths)
          world_data.total_new_cases_today = virustrackerdat.total_new_cases_today
          world_data.total_active_cases = virustrackerdat.world_data 
          world_data.total_serious_cases = virustrackerdat.world_data
          world_data.last_update = new Date()
        }catch(errr){
          throw errr
        }
        worldModel.create( world_data, function(err, doc){
            if(err){
                console.log("Updating world error", err.message);
                return ;
            }
        })
        console.log("Done Updating world data");
        return ;
    } catch (error) {
        console.log("Error in Update world function", error.message);
        return ;
    }
}

async function updatecountry() {
    console.log("Updating Country ");
    try{
        const countryraw = await axios.get("https://coronavirus-19-api.herokuapp.com/countries")
        const countrydata = await countryraw.data
        var lengthOfCountry = countrydata.length
        var totalTodayDeath = 0 ;
        for (let i = 0; i < lengthOfCountry ; i++){
            try
              { 
                var countrNew = await axios.get("https://thevirustracker.com/free-api?countryTotal="+rev_country[countrydata[i].country.toLowerCase()])
                await console.log("done 2" ,countrydata[i].country.toLowerCase(),"=>", rev_country[countrydata[i].country.toLowerCase()])
                console.log(Math.max(countrNew.data.countrydata[0].total_cases, countrydata[i].cases))
                countrydata[i].cases =  await Math.max(countrNew.data.countrydata[0].total_cases, countrydata[i].cases)
                countrydata[i].todayCases = await  Math.max(countrNew.data.countrydata[0].total_new_cases_today, countrydata[i].todayCases)
                countrydata[i].deaths = await Math.max(countrNew.data.countrydata[0].total_deaths, countrydata[i].deaths)
                countrydata[i].todayDeaths = await Math.max(countrNew.data.countrydata[0].total_new_deaths_today, countrydata[i].todayDeaths)
                countrydata[i].active = await Math.max(countrNew.data.countrydata[0].total_active_cases, countrydata[i].active)
                countrydata[i].critical = await Math.max(countrNew.data.countrydata[0].total_serious_cases, countrydata[i].critical)
                  await console.log(countrNew.data.countrydata)
                countrydata[i].last_update = new Date()
              }
              catch(err){
                console.log("Error while comparing", err.message)
                // throw err
              }
            countryModel.findOneAndUpdate({ country: countrydata[i].country.toLowerCase() }, countrydata[i] , { upsert: true}, (err, doc)=>{
                if(err){
                    console.log("updating error");
                    console.log(err.message);
                    return ;
                }    
            })   
            totalTodayDeath += countrydata[i].todayDeaths;    
        }
        console.log("Today death is", totalTodayDeath);
        
        console.log("Done updating country");
        return totalTodayDeath;
    } catch(err){
        console.log(err.message);
        return -1; 
    }
}


async function bo() {
	// var deaths = await updatecountry() ;
    // await updateWorld(18909) ;
    worldModel.find({ },  (err, doc)=>{
                if(err){
                    console.log("updating error");
                    console.log(err.message);
                    return ;
                }    
                console.log("all docs are ", doc)
            })   
}

bo()