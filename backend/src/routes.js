const { Router } = require('express');
const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');

const routes = Router();

routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);

routes.get('/devs/:github_username', DevController.show);
routes.put('/devs/:github_username', DevController.update);
routes.delete('/devs/:github_username', DevController.delete);

routes.get('/search', SearchController.index); // buscar devs sobre a linguagem e o raio de 10 km

module.exports = routes;