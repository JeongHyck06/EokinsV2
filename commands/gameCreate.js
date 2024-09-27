const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js');
const { positions, positionLocks, gameStatus } = require('../state');

module.exports = {
    data: new SlashCommandBuilder().setName('게임생성').setDescription('참가자 모집 및 포지션 선택'),

    async execute(interaction) {
        if (gameStatus.gameSessionActive) {
            await interaction.reply({ content: '게임 생성이 이미 진행 중입니다.', ephemeral: true });
            return;
        }

        gameStatus.gameSessionActive = true;

        const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('top').setLabel('탑').setStyle(ButtonStyle.Primary), new ButtonBuilder().setCustomId('jungle').setLabel('정글').setStyle(ButtonStyle.Primary), new ButtonBuilder().setCustomId('mid').setLabel('미드').setStyle(ButtonStyle.Primary), new ButtonBuilder().setCustomId('bot').setLabel('바텀').setStyle(ButtonStyle.Primary), new ButtonBuilder().setCustomId('support').setLabel('서폿').setStyle(ButtonStyle.Primary));

        await interaction.reply({
            content: '포지션을 선택해주세요 (5명씩 팀 구성이 됩니다):',
            components: [row],
        });

        const MAX_PLAYERS = 10;
        let playerCount = 0;

        const collector = interaction.channel.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 300000,
        });

        collector.on('collect', async (i) => {
            const position = i.customId;
            const nickname = i.member.displayName;

            if (positionLocks[position]) {
                await i.reply({ content: `${position} 포지션은 현재 처리 중입니다. 잠시 후 다시 시도해주세요.`, ephemeral: true });
                return;
            }

            positionLocks[position] = true;

            Object.keys(positions).forEach((role) => {
                // team1, team2는 포지션이 아니므로 제외
                if (role !== 'team1' && role !== 'team2') {
                    const index = positions[role].indexOf(nickname);
                    if (index > -1) {
                        positions[role].splice(index, 1);
                    }
                }
            });

            positions[position].push(nickname);
            playerCount = Object.values(positions).flat().length;

            await i.reply(`${nickname}님이 ${position} 포지션을 선택했습니다!`);

            positionLocks[position] = false;

            if (playerCount >= MAX_PLAYERS) {
                collector.stop();
            }
        });

        collector.on('end', async () => {
            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle('포지션 선택 완료')
                .addFields({ name: '탑', value: positions.top.join(', ') || '빈 자리', inline: true }, { name: '미드', value: positions.mid.join(', ') || '빈 자리', inline: true }, { name: '바텀', value: positions.bot.join(', ') || '빈 자리', inline: true }, { name: '서폿', value: positions.support.join(', ') || '빈 자리', inline: true }, { name: '정글', value: positions.jungle.join(', ') || '빈 자리', inline: true })
                .setTimestamp();

            await interaction.followUp({
                embeds: [embed],
            });
        });
    },
};
