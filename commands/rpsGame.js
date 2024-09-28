const { SlashCommandBuilder } = require('discord.js');
const { teams, rpsResult, gameStatus } = require('../state');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('가위바위보')
        .setDescription('두 주장끼리 가위바위보를 합니다.')
        .addStringOption((option) => option.setName('선택').setDescription('가위, 바위, 보 중 하나를 선택하세요.').setRequired(true)),

    async execute(interaction) {
        const choice = interaction.options.getString('선택').toLowerCase();
        const nickname = interaction.member.nickname || interaction.user.username;

        if (nickname === teams.team1.captain) {
            rpsResult.team1Move = choice;
        } else if (nickname === teams.team2.captain) {
            rpsResult.team2Move = choice;
        } else {
            await interaction.reply({ content: '주장만 가위바위보를 할 수 있습니다.', ephemeral: true });
            return;
        }

        // 가위바위보 결과를 체크
        if (rpsResult.team1Move && rpsResult.team2Move) {
            const result = determineWinner(rpsResult.team1Move, rpsResult.team2Move);

            if (result === 'team1') {
                rpsResult.winner = 'team1';
                gameStatus.currentPicker = 'team1';
            } else if (result === 'team2') {
                rpsResult.winner = 'team2';
                gameStatus.currentPicker = 'team2';
            } else {
                await interaction.reply({ content: '무승부입니다. 다시 시도해주세요.', ephemeral: true });
                return;
            }

            await interaction.reply({ content: `${rpsResult.winner} 팀의 주장이 이겼습니다! 이긴 주장부터 플레이어를 선택할 수 있습니다.` });
        } else {
            await interaction.reply({ content: `${nickname}님이 ${choice}를 선택했습니다. 상대 주장도 선택할 때까지 기다려주세요.`, ephemeral: true });
        }
    },
};

function determineWinner(move1, move2) {
    if (move1 === move2) return 'draw';
    if ((move1 === '가위' && move2 === '보') || (move1 === '바위' && move2 === '가위') || (move1 === '보' && move2 === '바위')) {
        return 'team1';
    }
    return 'team2';
}
