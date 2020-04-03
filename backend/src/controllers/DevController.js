const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

// index, show, store, update, destroy

module.exports = {
    async index(request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
            // se não tiver valor no name, pega o valor do login e salva no name
            const { name = login, avatar_url, bio } = apiResponse.data;
        
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            })

            // Filtrar as conexões que estão no maximo 10km de distancia
            // e que o novo dev tenho pelo menos uma das tecnologias filtradas

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            )

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }        
    
        return response.json(dev);
    },

    async show(request, response) {
        const { github_username } = request.params;
        const dev = await Dev.findOne({ github_username });

        return response.json(dev);
    },

    async update(request, response) {
        const { github_username } = request.params;
        const { techs, latitude, longitude, ...rest } = request.body;

        const dev = await Dev.findOne({ github_username });

        if(!dev) {
            return response.status(404).json({ error: 'Dev not found!' });
        }

        rest.github_username = github_username;

        if (latitude && longitude) {
            var newLocation = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }
        }

        if (techs) {
            var techsArray = parseStringAsArray(techs);
        }

        const newDev = await Dev.updateOne({ github_username }, {
            location: (latitude && longitude) ? newLocation : dev.location,
            techs: techs ? techsArray : dev.techs,
            ...rest,
        });


        return response.json({
            modifiedCount: newDev.nModified,
            ok: newDev.ok
        });
    },

    async delete(request, response) {
        const { github_username } = request.params;

        let dev = await Dev.findOne({ github_username });

        if(!dev) {
            return response.status(404).json({ error: 'Dev not found!' });
        }

        await Dev.deleteOne({ github_username });

        return response.status(204).send();
    }
};