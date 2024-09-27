let positions = {
    top: [],
    mid: [],
    bot: [],
    support: [],
    jungle: [],
    team1: {
        top: '빈 자리',
        mid: '빈 자리',
        bot: '빈 자리',
        support: '빈 자리',
        jungle: '빈 자리',
    },
    team2: {
        top: '빈 자리',
        mid: '빈 자리',
        bot: '빈 자리',
        support: '빈 자리',
        jungle: '빈 자리',
    },
};

let positionLocks = {
    top: false,
    mid: false,
    bot: false,
    support: false,
    jungle: false,
};

let gameStatus = {
    gameSessionActive: false,
};

module.exports = {
    positions,
    positionLocks,
    gameStatus,
};
