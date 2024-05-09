const fs = require('fs');

module.exports = (client) => {
    const eventFiles = fs.readdirSync(__dirname).filter(file => file !== 'index.js' && file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`./${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
};
