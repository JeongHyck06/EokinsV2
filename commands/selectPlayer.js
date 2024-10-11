const { SlashCommandBuilder } = require('discord.js');
const { teams, gameStatus } = require('../state');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('선택')
        .setDescription('주장이 플레이어를 팀에 추가합니다.')
        .addUserOption((option) => option.setName('플레이어').setDescription('팀에 추가할 플레이어를 선택하세요.').setRequired(true)),

    async execute(interaction) {
        const selectedPlayer = interaction.options.getUser('플레이어');
        const nickname = interaction.member.nickname || interaction.user.username;

        if (nickname !== teams.team1.captain && nickname !== teams.team2.captain) {
            await interaction.reply({ content: '주장만 팀원을 선택할 수 있습니다.', ephemeral: true });
            return;
        }

        if ((nickname === teams.team1.captain && gameStatus.currentPicker !== 'team1') || (nickname === teams.team2.captain && gameStatus.currentPicker !== 'team2')) {
            await interaction.reply({ content: '현재는 다른 주장 차례입니다.', ephemeral: true });
            return;
        }

        if (teams.team1.players.includes(selectedPlayer.username) || teams.team2.players.includes(selectedPlayer.username)) {
            await interaction.reply({ content: '이미 다른 팀에 배정된 플레이어입니다.', ephemeral: true });
            return;
        }

        if (nickname === teams.team1.captain) {
            teams.team1.players.push(selectedPlayer.username);
            gameStatus.currentPicker = 'team2';
        } else {
            teams.team2.players.push(selectedPlayer.username);
            gameStatus.currentPicker = 'team1';
        }

        await interaction.reply({ content: `${selectedPlayer.username}님이 ${gameStatus.currentPicker === 'team1' ? 'team2' : 'team1'}에 추가되었습니다!` });
    },
};
