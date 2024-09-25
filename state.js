let positions = {
    top: [],
    mid: [],
    bot: [],
    support: [],
    jungle: [],
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

let emojiMap = {
    top: null,
    mid: null,
    support: null,
    jungle: null,
    ad: null,
};

module.exports = {
    positions,
    positionLocks,
    emojiMap,
    gameStatus,
};
