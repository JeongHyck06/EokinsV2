const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./database');

dotenv.config();
const token = process.env.DISCORD_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if (!command.data || !command.execute) {
        console.error(`Command in ${filePath} is missing "data" or "execute" property.`);
        continue;
    }

    client.commands.set(command.data.name, command);
}

// 봇이 서버에 추가될 때만 이모지를 업로드 (이미 업로드된 경우 제외)
client.on('guildCreate', async (guild) => {
    console.log(`새로운 서버에 초대되었습니다: ${guild.name}`);

    const iconPath = path.join(__dirname, '아이콘');
    const icons = ['top.png', 'mid.png', 'jg.png', 'sup.png', 'ad.png'];
    const emojiNames = ['top', 'mid', 'jg', 'sup', 'ad'];

    try {
        for (let i = 0; i < icons.length; i++) {
            const existingEmoji = guild.emojis.cache.find((emoji) => emoji.name === emojiNames[i]);

            if (!existingEmoji) {
                const iconFilePath = path.join(iconPath, icons[i]);
                const imageBuffer = fs.readFileSync(iconFilePath);

                const emoji = await guild.emojis.create({
                    attachment: imageBuffer,
                    name: emojiNames[i],
                });

                console.log(`이모지 ${emoji.name}가 성공적으로 업로드되었습니다: ${emoji.id}`);
            } else {
                console.log(`이미 이모지 ${emojiNames[i]}가 존재합니다: ${existingEmoji.id}`);
            }
        }
    } catch (error) {
        console.error('이모지 업로드 중 오류 발생:', error);
    }
});

client.once(Events.ClientReady, async (c) => {
    console.log(`Logged in as ${c.user.tag}`);

    try {
        const db = await connectDB();
        console.log('Discord 봇이 준비된 후 MongoDB에 연결되었습니다.');
    } catch (error) {
        console.error('MongoDB 연결 실패:', error);
    }

    const guilds = client.guilds.cache.map((guild) => guild.id);

    guilds.forEach(async (guildId) => {
        const guild = client.guilds.cache.get(guildId);

        if (guild) {
            try {
                await guild.commands.set(client.commands.map((command) => command.data.toJSON()));
                console.log(`서버 ${guild.name}에 전용 명령어가 성공적으로 등록되었습니다.`);
            } catch (error) {
                console.error(`서버 ${guild.name}에 명령어 등록 중 오류 발생:`, error);
            }
        } else {
            console.error(`서버를 찾을 수 없습니다. 서버 ID: ${guildId}`);
        }
    });
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: '명령을 실행하는 중 오류가 발생했습니다.', ephemeral: true });
    }
});

client.login(token);
