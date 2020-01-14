const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(request, response) {
        const { latitude, longitude, techs } = request.query;

        const techsArray = parseStringAsArray(techs);

        const devs = await Dev.find({
            techs: {
                // Filtrar por tecnologias
                // https://docs.mongodb.com/manual/reference/operator/query/
                $in: techsArray,
            },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    // Buscar todos devs num raio 10km
                    $maxDistance: 10000,
                },
            },
        });       

        return response.json({ devs })
    }
}