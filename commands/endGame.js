const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { positions } = require('../state');
const connectDB = require('../database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('게임종료')
        .setDescription('승리팀을 결정하고 팀 정보를 업로드합니다.')
        .addStringOption((option) => option.setName('승리팀').setDescription('승리한 팀을 선택하세요 (1팀 또는 2팀)').setRequired(true).addChoices({ name: '1팀', value: 'team1' }, { name: '2팀', value: 'team2' })),

    async execute(interaction) {
        const winningTeam = interaction.options.getString('승리팀');
        const losingTeam = winningTeam === 'team1' ? 'team2' : 'team1';
        const guild = interaction.guild;

        const db = await connectDB();
        const playerStats = db.collection('users');

        const updatePlayerStats = async (team, won) => {
            for (const [position, player] of Object.entries(positions[team])) {
                const member = guild.members.cache.find((m) => m.displayName === player);
                if (!member) continue;
                const userId = member.id;

                const playerRecord = await playerStats.findOne({ userId });
                const wins = won ? (playerRecord?.wins || 0) + 1 : playerRecord?.wins || 0;
                const losses = won ? playerRecord?.losses || 0 : (playerRecord?.losses || 0) + 1;
                const winRate = ((wins / (wins + losses)) * 100).toFixed(2);

                await playerStats.updateOne({ userId }, { $set: { userId, wins, losses, winRate } }, { upsert: true });
            }
        };

        try {
            await updatePlayerStats(winningTeam, true); // 승리 팀 업데이트
            await updatePlayerStats(losingTeam, false); // 패배 팀 업데이트

            await interaction.reply('게임 결과가 성공적으로 업데이트되었습니다!');
        } catch (error) {
            console.error('데이터베이스 업데이트 실패:', error);
            await interaction.reply('데이터 업데이트 중 오류가 발생했습니다.');
        }
    },
};
