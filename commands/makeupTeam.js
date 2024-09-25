const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { positions } = require('../state');

module.exports = {
    data: new SlashCommandBuilder().setName('팀섞기').setDescription('포지션별로 랜덤하게 팀을 나눕니다.'),

    async execute(interaction) {
        const isEmpty = Object.values(positions).every((pos) => pos.length === 0);

        if (isEmpty) {
            await interaction.reply('아무도 없군..');
            return;
        }

        const team1 = { top: '빈 자리', mid: '빈 자리', bot: '빈 자리', support: '빈 자리', jungle: '빈 자리' };
        const team2 = { top: '빈 자리', mid: '빈 자리', bot: '빈 자리', support: '빈 자리', jungle: '빈 자리' };

        Object.keys(positions).forEach((role) => {
            const players = positions[role];
            if (players.length > 0) {
                const shuffled = players.sort(() => Math.random() - 0.5);

                if (shuffled[0]) team1[role] = shuffled[0];
                if (shuffled[1]) team2[role] = shuffled[1];
            }
        });

        const guild = interaction.guild;
        const topEmoji = guild.emojis.cache.find((emoji) => emoji.name === 'top');
        const midEmoji = guild.emojis.cache.find((emoji) => emoji.name === 'mid');
        const botEmoji = guild.emojis.cache.find((emoji) => emoji.name === 'ad');
        const supportEmoji = guild.emojis.cache.find((emoji) => emoji.name === 'sup');
        const jungleEmoji = guild.emojis.cache.find((emoji) => emoji.name === 'jg');

        const team1Embed = new EmbedBuilder()
            .setColor(0x1abc9c)
            .setTitle('1팀')
            .addFields({ name: `${topEmoji} 탑`, value: `${team1.top}`, inline: false }, { name: `${jungleEmoji} 정글`, value: `${team1.jungle}`, inline: false }, { name: `${midEmoji} 미드`, value: `${team1.mid}`, inline: false }, { name: `${botEmoji} 원딜`, value: `${team1.bot}`, inline: false }, { name: `${supportEmoji} 서폿`, value: `${team1.support}`, inline: false });

        const team2Embed = new EmbedBuilder()
            .setColor(0xe74c3c)
            .setTitle('2팀')
            .addFields({ name: `${topEmoji} 탑`, value: `${team2.top}`, inline: false }, { name: `${jungleEmoji} 정글`, value: `${team2.jungle}`, inline: false }, { name: `${midEmoji} 미드`, value: `${team2.mid}`, inline: false }, { name: `${botEmoji} 원딜`, value: `${team2.bot}`, inline: false }, { name: `${supportEmoji} 서폿`, value: `${team2.support}`, inline: false });

        await interaction.reply({
            content: '팀이 랜덤으로 섞였습니다',
            embeds: [team1Embed, team2Embed],
        });
    },
};
