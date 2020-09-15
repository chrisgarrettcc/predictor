console.log("added file")
const leagueForm = document.querySelector('#leagueForm')
const leagueSelect = document.querySelector('#league')
const fixtureContainer = document.querySelector('#fixture-table-container')
const gamesToSearch = document.querySelector('input')

leagueForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const leagueValue = leagueSelect.options[leagueSelect.selectedIndex].value;
    fetch('/fixtures?league=' + encodeURIComponent(leagueValue)).then((response) => {
        response.json().then((data) => {
            if (data.fixtures.length === 0) {
                fixtureContainer.textContent = 'No fixtures today for that competition';
            } else {
                const table = drawTable(data);
                fixtureContainer.innerHTML = table;
                data.fixtures.forEach(obj => {
                    getResults(obj.homeTeam.team_id);
                    getResults(obj.awayTeam.team_id);
                })
            }
        });
    })
    /*message1.textContent = 'Loading...'
    fetch('/weather?address=' +  encodeURIComponent(location)).then((response) => {
        response.json().then((data) => {
            message1.textContent = '';
            message2.textContent = '';
            if (data.errorMessage) {
                message1.textContent = data.errorMessage;
            } else {
                message1.textContent = data.location;
                message2.textContent = data.forecast
            }
            
            
        })
    })*/

})

const getResults = (team) => {
    let totalBTTS = 0;
    let matchesPlayed = 0;
    const games = gamesToSearch.value;
    fetch('/results?team=' + encodeURIComponent(team) + '&games=' + encodeURIComponent(games)).then((response) => {
        response.json().then((data) => {
            data.fixtures.forEach(obj => {
                if (obj.goalsHomeTeam != null) {
                    matchesPlayed++;
                }
                if (obj.goalsHomeTeam > 0 && obj.goalsAwayTeam > 0) {
                    totalBTTS++;
                }
            })
            const td = document.querySelector('#team' + team);
            let perc = (totalBTTS / matchesPlayed) * 100;
        
            td.innerHTML = totalBTTS + ' / ' + matchesPlayed + ' (' + perc.toFixed(0) + '%)';
            if (perc >49) {
                td.style.color = 'green';
                td.style.fontWeight = 'bold';
            }
        });
        
    })
    
    
}

const drawTable = (fixtures) => {

    let html = '<table id="fixture-table">';
    html += '<theader>';
    html += '<tr>';
    html += '<td></td>';
    html += '<td>Home</td>';
    html += '<td>BTTS</td>';
    html += '<td></td>';
    html += '<td>Away</td>';
    html += '<td></td>';
    html += '<td>BTTS</td>';
    html += '</tr>';

    fixtures.fixtures.forEach(obj => {

        html += '<tr>';
        html += '<td ><img src="' + obj.homeTeam.logo + '"/></td>';
        html += '<td >' + obj.homeTeam.team_name + '</td>';
        html += '<td id="team' + obj.homeTeam.team_id + '"></td>';
        html += '<td>V</td>';

        html += '<td >' + obj.awayTeam.team_name + '</td>';
        html += '<td><img src="' + obj.awayTeam.logo + '"/></td>';
        html += '<td id="team' + obj.awayTeam.team_id + '"></td>';
        html += '</tr>';

    });
    html += '</theader>';
    html += '</table>';
    return html;

}