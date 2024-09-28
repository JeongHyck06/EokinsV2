const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { positions, gameStatus } = require('../state');
const { activeCollector } = require('./gameCreate'); // 수집기 참조

module.exports = {
    data: new SlashCommandBuilder().setName('초기화').setDescription('참여자 포지션을 모두 초기화합니다.'),

    async execute(interaction) {
        // 잠시 지연을 추가하여 collector가 완전히 종료될 시간을 확보
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2초 지연

        // 모든 포지션 초기화
        Object.keys(positions).forEach((role) => {
            positions[role] = [];
        });

        // 게임 세션 상태를 초기화
        gameStatus.gameSessionActive = false;

        // 기존의 활성화된 수집기가 있다면 종료
        if (activeCollector) {
            activeCollector.stop();
        }

        const nickname = interaction.member.nickname || interaction.user.username;

        const embed = new EmbedBuilder().setColor(0x0099ff).setTitle('포지션 초기화 완료').setDescription(`${nickname}님에 의해 모든 포지션이 초기화되었습니다.`).addFields({ name: '탑', value: '빈 자리', inline: true }, { name: '미드', value: '빈 자리', inline: true }, { name: '바텀', value: '빈 자리', inline: true }, { name: '서폿', value: '빈 자리', inline: true }, { name: '정글', value: '빈 자리', inline: true }).setTimestamp();

        await interaction.reply({
            embeds: [embed],
        });
    },
};
