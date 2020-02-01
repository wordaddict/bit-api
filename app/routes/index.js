/**
 * Created by Adeyinka Micheal
 */

const routes = ((server, serviceLocator) => {
    const mainController = serviceLocator.get('mainController');

    // Base application
    server.get({
        path: '/',
        name: 'app health check',
        version: '1.0.0'
      }, (req, res) => res.send('Welcome to the Bit API'));

      server.post({
        path: '/signup',
        name: 'Create new users',
        version: '1.0.0'
      }, (req, res) => mainController.createNewUsers(req, res));

      server.post({
        path: '/login',
        name: 'log users in',
        version: '1.0.0'
      }, (req, res) => mainController.logUsersIn(req, res));

      server.post({
        path: '/trade',
        name: 'start trading',
        version: '1.0.0'
      }, (req, res) => mainController.startATrade(req, res));
      
      server.get({
        path: '/categories',
        name: 'Get categories',
        version: '1.0.0'
      }, (req, res) => mainController.getAllCategories(req, res));

      server.get({
        path: '/sub_categories',
        name: 'Get subcategories',
        version: '1.0.0'
      }, (req, res) => mainController.getSubCategories(req, res));

      server.get({
        path: '/all_trade',
        name: 'get trades',
        version: '1.0.0'
      }, (req, res) => mainController.getAllTrade(req, res));

      server.post({
        path: '/rate_calculator',
        name: 'get trades',
        version: '1.0.0'
      }, (req, res) => mainController.rateCalculator(req, res));

      server.post({
        path: '/bank_account',
        name: 'Add bank details',
        version: '1.0.0'
      }, (req, res) => mainController.addAccount(req, res));

      server.get({
        path: '/get_bank_account',
        name: 'get bank details',
        version: '1.0.0'
      }, (req, res) => mainController.getAccount(req, res));

      
});


module.exports = routes;