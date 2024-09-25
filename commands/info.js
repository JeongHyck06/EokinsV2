const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { positions } = require('../state');
module.exports = {
    data: new SlashCommandBuilder().setName('참여정보').setDescription('현재 참여중인 플레이어들과 팀 정보를 보여줍니다.'),

    async execute(interaction) {
        const guild = interaction.guild;
        const topEmoji = guild.emojis.cache.find((emoji) => emoji.name === 'top');
        const midEmoji = guild.emojis.cache.find((emoji) => emoji.name === 'mid');
        const botEmoji = guild.emojis.cache.find((emoji) => emoji.name === 'ad');
        const supportEmoji = guild.emojis.cache.find((emoji) => emoji.name === 'sup');
        const jungleEmoji = guild.emojis.cache.find((emoji) => emoji.name === 'jg');
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('현재 참여중인 플레이어들')
            .addFields({ name: `${topEmoji} 탑`, value: positions.top.join(', ') || '없음', inline: false }, { name: `${jungleEmoji} 정글`, value: positions.jungle.join(', ') || '없음', inline: false }, { name: `${midEmoji} 미드`, value: positions.mid.join(', ') || '없음', inline: false }, { name: `${botEmoji} 바텀`, value: positions.bot.join(', ') || '없음', inline: false }, { name: `${supportEmoji} 서폿`, value: positions.support.join(', ') || '없음', inline: false })

            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
        });
    },
};
