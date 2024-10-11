const { SlashCommandBuilder } = require('discord.js');
const { teams, gameStatus } = require('../state');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('주장등록')
        .setDescription('주장을 등록하고 팀을 선택합니다.')
        .addStringOption((option) => option.setName('팀').setDescription('주장을 등록할 팀을 선택하세요 (team1 또는 team2)').setRequired(true)),

    async execute(interaction) {
        const selectedTeam = interaction.options.getString('팀');
        const nickname = interaction.member.nickname || interaction.user.username;

        if (selectedTeam !== 'team1' && selectedTeam !== 'team2') {
            await interaction.reply({ content: '올바른 팀을 선택하세요 (team1 또는 team2).', ephemeral: true });
            return;
        }

        teams[selectedTeam].captain = nickname;

        gameStatus.gameLock = true;
        gameStatus.teamCreationMethod = 'captin';

        await interaction.reply({ content: `${nickname}님이 ${selectedTeam} 팀의 주장으로 등록되었습니다. 이제 /게임생성 및 /팀섞기 명령어를 사용할 수 없습니다.` });
    },
};
