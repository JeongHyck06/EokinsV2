const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { positions } = require('../state');

module.exports = {
    data: new SlashCommandBuilder().setName('초기화').setDescription('참여자 포지션을 모두 초기화합니다.'),

    async execute(interaction) {
        Object.keys(positions).forEach((role) => {
            positions[role] = [];
        });

        const nickname = interaction.member.nickname || interaction.user.username;

        const embed = new EmbedBuilder().setColor(0x0099ff).setTitle('포지션 초기화 완료').setDescription(`${nickname}님에 의해 모든 포지션이 초기화되었습니다.`).addFields({ name: '탑', value: '빈 자리', inline: true }, { name: '미드', value: '빈 자리', inline: true }, { name: '바텀', value: '빈 자리', inline: true }, { name: '서폿', value: '빈 자리', inline: true }, { name: '정글', value: '빈 자리', inline: true }).setTimestamp();

        await interaction.reply({
            embeds: [embed],
        });
    },
};
