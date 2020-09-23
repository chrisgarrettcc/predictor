const request = require('postman-request');




const results = (team,games, callback) => {
    const url = 'https://v2.api-football.com/fixtures/team/' + team + '/last/' + games;
    request({
        url : url,
        json : true,
        headers : {
            'X-RapidAPI-Key': '2a1d0223df3a69d1abc45e99e0607634'
        }
    }, (error, {body}) => {
        
        if (error) {
            callback('Unable to connect to predictor service', undefined)
        } else if (body.error) {
            callback('Could not find fixtues', undefined)
        } else {
            console.log(body.api.fixtures)
            callback(undefined, body.api.fixtures);
        }
    })
}

const fixtures = (league, callback) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2,'0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    if (league == 'all') {
        var url = 'https://v2.api-football.com/fixtures/date/' + today + '?timezone=Europe/London';
    } else {
        var url = 'https://v2.api-football.com/fixtures/league/' + league + '/' + today;
    }
    
    request({
        url : url,
        json : true,
        headers : {
            'X-RapidAPI-Key': '2a1d0223df3a69d1abc45e99e0607634'
        }
    }, (error, {body}) => {
        
        if (error) {
            callback('Unable to connect to predictor service', undefined)
        } else if (body.error) {
            callback('Could not find fixtues', undefined)
        } else {
            console.log(body.api.fixtures)
            callback(undefined, body.api.fixtures);
        }
    })
}


const currentLeagues = (callback) => {
    const url = 'https://v2.api-football.com/leagues/current';
    request( {
        url ,
        json : true,
        headers: {
            'X-RapidAPI-Key': '2a1d0223df3a69d1abc45e99e0607634'
          }
    }, (error, {body}) => {
        
        if (error) {
            callback('Unable to connect to predictor service', undefined)
        } else if (body.error) {
            callback('Could not find leagues', undefined)
        } else {
            leagueArr = [];
            body.api.leagues.forEach(obj => {
                var o = {};
                o.id = obj.league_id;
                o.country = obj.country;
                o.name = obj.name;
                leagueArr.push(o);

            });
            leagueArr.sort(compare);
            callback(undefined, leagueArr)
        }
    })
}

function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const bandA = a.country.toUpperCase();
    const bandB = b.country.toUpperCase();
  
    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  }

module.exports = {
    currentLeagues : currentLeagues,
    fixtues : fixtures,
    results : results
}