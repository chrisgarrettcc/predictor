const path = require('path');
const express = require('express')
const hbs = require('hbs');
const predictor = require('./utils/predictor');

const app = express();

const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handelbars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    predictor.currentLeagues((error, leagues) => {
        if (error) {
            return res.send({
                errorMessage: error
            });
        }
        
        res.render('index', {
            title: 'Predictor',
            name: 'Chris Garrett',
            leagues : leagues
        })
        

    })
    
})
app.get('/fixtures', (req, res) => {
   
    if (!req.query.league) {
        return res.send({
            errorMessgae: 'You must provide a league'
        });
    }
    let league = req.query.league;
    predictor.fixtues(league , (error, fixtures) => {
        if (error) {
            return res.send({
                errorMessage: error
            });
        }
        
        res.send({
            fixtures: fixtures
        })
        

    })

})

app.get('/results', (req, res) => {
    
    if (!req.query.team) {
        return res.send({
            errorMessgae: 'You must provide a team'
        });
    }
    let games = req.query.games;
    let team = req.query.team;
    console.log("games= " + games);
    if (games == null || games == undefined || games == '') {
        games = 10;
    }
    predictor.results(team, games , (error, results) => {
        if (error) {
            return res.send({
                errorMessage: error
            });
        }
       
        res.send({
            fixtures: results
        })
        

    })

})

app.get('*', (req, res) => {
    res.render('404', {
        title: 'Error',
        message: 'Page not found!',
        name: 'Chris Garrett'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
});