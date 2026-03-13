let tournament = {
    participants: [],
    maxParticipants: 8,
    rounds: []
};

function setupTournament() {
    const count = parseInt(document.getElementById('participantCount').value);

    if (isNaN(count) || count < 2 || count > 128) {
        alert('Anna luku 2:n ja 128:n välillä');
        return;
    }

    // Pyöristä seuraavan kahden potenssin ylöspäin
    tournament.maxParticipants = Math.pow(2, Math.ceil(Math.log2(count)));
    tournament.participants = Array(tournament.maxParticipants).fill('');

    renderTeamsInput();
    document.getElementById('teamsSection').classList.add('show');
    document.getElementById('bracketContainer').classList.remove('show');
    document.getElementById('winnerSection').classList.remove('show');
}

function renderTeamsInput() {
    const grid = document.getElementById('teamsGrid');
    grid.innerHTML = '';

    for (let i = 0; i < tournament.maxParticipants; i++) {
        const group = document.createElement('div');
        group.className = 'team-input-group';

        const label = document.createElement('label');
        label.textContent = `Joukkue/Osallistuja ${i + 1}`;

        const input = document.createElement('input');
        input.type = 'text';
        input.value = tournament.participants[i];
        input.placeholder = `Joukkue ${i + 1}`;
        input.onchange = (e) => {
            tournament.participants[i] = e.target.value.trim() || `Joukkue ${i + 1}`;
        };

        group.appendChild(label);
        group.appendChild(input);
        grid.appendChild(group);
    }
}

function startTournament() {
    // Tarkista että osallistujat on nimetty
    for (let i = 0; i < tournament.participants.length; i++) {
        if (!tournament.participants[i].trim()) {
            tournament.participants[i] = `Joukkue ${i + 1}`;
        }
    }

    // Luo turnaus
    tournament.rounds = [];
    let currentRound = [...tournament.participants];

    while (currentRound.length > 1) {
        const matchups = [];
        for (let i = 0; i < currentRound.length; i += 2) {
            matchups.push({
                team1: currentRound[i],
                team2: currentRound[i + 1],
                winner: null
            });
        }
        tournament.rounds.push(matchups);
        currentRound = matchups.map(m => m.winner || '');
    }

    renderBracket();
    document.getElementById('teamsSection').classList.remove('show');
    document.getElementById('bracketContainer').classList.add('show');
    document.getElementById('error').textContent = '';
}

function renderBracket() {
    const bracketDiv = document.getElementById('bracket');
    bracketDiv.innerHTML = '';

    tournament.rounds.forEach((round, roundIndex) => {
        const roundDiv = document.createElement('div');
        roundDiv.className = 'round';

        const roundTitle = document.createElement('div');
        roundTitle.className = 'round-title';

        if (roundIndex === tournament.rounds.length - 1) {
            roundTitle.textContent = ' FINAALI';
        } else {
            roundTitle.textContent = `Kierros ${roundIndex + 1}`;
        }

        roundDiv.appendChild(roundTitle);

        round.forEach((matchup, matchupIndex) => {
            const matchupDiv = document.createElement('div');
            matchupDiv.className = 'matchup';

            const team1Div = document.createElement('div');
            team1Div.className = 'team-option' + (matchup.winner === matchup.team1 ? ' selected' : '');
            if (!matchup.team1) team1Div.classList.add('empty-team');
            team1Div.textContent = matchup.team1 || '(Odottaa)';
            team1Div.onclick = () => selectWinner(roundIndex, matchupIndex, matchup.team1);

            const team2Div = document.createElement('div');
            team2Div.className = 'team-option' + (matchup.winner === matchup.team2 ? ' selected' : '');
            if (!matchup.team2) team2Div.classList.add('empty-team');
            team2Div.textContent = matchup.team2 || '(Odottaa)';
            team2Div.onclick = () => selectWinner(roundIndex, matchupIndex, matchup.team2);

            matchupDiv.appendChild(team1Div);
            matchupDiv.appendChild(team2Div);
            roundDiv.appendChild(matchupDiv);
        });

        bracketDiv.appendChild(roundDiv);
    });

    checkTournamentComplete();
}

function selectWinner(roundIndex, matchupIndex, winner) {
    tournament.rounds[roundIndex][matchupIndex].winner = winner;

    // Päivitä seuraavan kierroksen ottelu
    if (roundIndex + 1 < tournament.rounds.length) {
        const nextRoundMatchupIndex = Math.floor(matchupIndex / 2);
        const isTeam1 = matchupIndex % 2 === 0;

        if (isTeam1) {
            tournament.rounds[roundIndex + 1][nextRoundMatchupIndex].team1 = winner;
        } else {
            tournament.rounds[roundIndex + 1][nextRoundMatchupIndex].team2 = winner;
        }
    }

    renderBracket();
}

function checkTournamentComplete() {
    const finalRound = tournament.rounds[tournament.rounds.length - 1];
    if (finalRound[0].winner) {
        const winner = finalRound[0].winner;
        document.getElementById('winnerText').textContent = ` ${winner} on voittaja! `;
        document.getElementById('winnerSection').classList.add('show');
    }
}

function resetTournament() {
    tournament = {
        participants: [],
        maxParticipants: 8,
        rounds: []
    };
    document.getElementById('teamsSection').classList.remove('show');
    document.getElementById('bracketContainer').classList.remove('show');
    document.getElementById('winnerSection').classList.remove('show');
    document.getElementById('participantCount').value = '8';
}

// Alustus
setupTournament();
