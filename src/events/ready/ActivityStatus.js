module.exports = (client) => {
    const {ActivityType} = require('discord.js');
    
    client.user.setActivity({
        name: 'Work in progress',
        type: ActivityType.Playing,
    });
};