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

        // 주장만 선택 가능
        if (nickname !== teams.team1.captain && nickname !== teams.team2.captain) {
            await interaction.reply({ content: '주장만 팀원을 선택할 수 있습니다.', ephemeral: true });
            return;
        }

        // 차례에 맞는 주장만 선택 가능
        if ((nickname === teams.team1.captain && gameStatus.currentPicker !== 'team1') || (nickname === teams.team2.captain && gameStatus.currentPicker !== 'team2')) {
            await interaction.reply({ content: '현재는 다른 주장 차례입니다.', ephemeral: true });
            return;
        }

        // 이미 선택된 플레이어인지 확인
        if (teams.team1.players.includes(selectedPlayer.username) || teams.team2.players.includes(selectedPlayer.username)) {
            await interaction.reply({ content: '이미 다른 팀에 배정된 플레이어입니다.', ephemeral: true });
            return;
        }

        // 현재 주장 차례에 맞게 팀에 플레이어 추가
        if (nickname === teams.team1.captain) {
            teams.team1.players.push(selectedPlayer.username);
            gameStatus.currentPicker = 'team2'; // 다음 차례는 team2 주장
        } else {
            teams.team2.players.push(selectedPlayer.username);
            gameStatus.currentPicker = 'team1'; // 다음 차례는 team1 주장
        }

        await interaction.reply({ content: `${selectedPlayer.username}님이 ${gameStatus.currentPicker === 'team1' ? 'team2' : 'team1'}에 추가되었습니다!` });
    },
};
