var rev_country = require('./rev country')
	const axios = require('axios')
async function name() {
	console.log("entered")
	const countryraw = await axios.get("https://coronavirus-19-api.herokuapp.com/countries")
	const countrydata = await countryraw.data
	var lengthOfCountry = countrydata.length
	var totalTodayDeath = 0 ;
	console.log("done")
	for (let i = 0; i < lengthOfCountry ; i++){
		  try
		{	
			var countrNew = await axios.get("https://thevirustracker.com/free-api?countryTotal="+rev_country[countrydata[i].country.toLowerCase()])
			await console.log("done 2" ,countrydata[i].country.toLowerCase(),"=>", rev_country[countrydata[i].country.toLowerCase()])
			countrydata[i].cases =  await Math.max(countrNew.data.countrydata.total_cases, countrydata[i].cases)
			countrydata[i].todayCases = await  Math.max(countrNew.data.countrydata.total_new_cases_today, countrydata[i].todayCases)
			countrydata[i].deaths = await Math.max(countrNew.data.countrydata.total_deaths, countrydata[i].deaths)
			countrydata[i].todayDeaths = await Math.max(countrNew.data.countrydata.total_new_deaths_today, countrydata[i].todayDeaths)
			countrydata[i].active = await Math.max(countrNew.data.countrydata.total_active_cases, countrydata[i].active)
			countrydata[i].critical = await Math.max(countrNew.data.countrydata.total_serious_cases, countrydata[i].critical)
			// await console.log(countrNew.data.countrydata)
		}
		catch(err){
		}
	    // countryModel.findOneAndUpdate({ country: countrydata[i].country.toLowerCase() }, countrydata[i] , { upsert: true}, (err, doc)=>{
	    //     if(err){
	    //         console.log("updating error");
	    //         console.log(err.message);
	    //         return ;
	    //     }    
	    // })   
	    totalTodayDeath += countrydata[i].todayDeaths;    
	}
}

name()