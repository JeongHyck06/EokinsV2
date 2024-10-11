const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { teams, positions, gameStatus } = require('../state');
const connectDB = require('../database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('게임종료')
        .setDescription('승리팀을 결정하고 팀 정보를 저장합니다.')
        .addStringOption((option) => option.setName('승리팀').setDescription('승리한 팀을 선택하세요 (1팀 또는 2팀)').setRequired(true).addChoices({ name: '1팀', value: 'team1' }, { name: '2팀', value: 'team2' })),

    async execute(interaction) {
        await interaction.deferReply();

        const winningTeam = interaction.options.getString('승리팀');
        const losingTeam = winningTeam === 'team1' ? 'team2' : 'team1';
        const guild = interaction.guild;

        const db = await connectDB();
        const playerStats = db.collection('users');
        const gamesCollection = db.collection('games');

        const updatePlayerStats = async (won, players) => {
            for (const player of players) {
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

        const getTeamPlayers = (team) => {
            if (gameStatus.teamCreationMethod === 'captain') {
                return teams[team].players;
            } else if (gameStatus.teamCreationMethod === 'random') {
                return Object.values(positions[team]).filter((player) => player !== '빈 자리');
            }
            return [];
        };

        const saveGameResult = async () => {
            const gameData = {
                winningTeam: getTeamPlayers(winningTeam),
                losingTeam: getTeamPlayers(losingTeam),
                date: new Date(),
            };

            try {
                await gamesCollection.insertOne(gameData);
                console.log('게임 결과가 성공적으로 저장되었습니다.');
            } catch (error) {
                console.error('게임 결과 저장 실패:', error);
            }
        };

        try {
            await updatePlayerStats(winningTeam, true, getTeamPlayers(winningTeam)); // 승리 팀 업데이트
            await updatePlayerStats(losingTeam, false, getTeamPlayers(losingTeam)); // 패배 팀 업데이트
            await saveGameResult();

            await interaction.followUp('게임 결과가 성공적으로 업데이트되고 저장되었습니다!');
        } catch (error) {
            console.error('데이터베이스 업데이트 실패:', error);
            await interaction.followUp('데이터 업데이트 중 오류가 발생했습니다.');
        }
    },
};
