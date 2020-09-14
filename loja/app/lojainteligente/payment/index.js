module.exports = function(LojaInteligenteModule) {
	require('./payment.controller.js')(LojaInteligenteModule);	// Payment Controller
	require('./payment.directives.js')(LojaInteligenteModule);	// Payment Directives
	require('./payment.filters.js')(LojaInteligenteModule);		// Payment Filters
	require('./payment.sass');									// Payment Sass
	require('./payment.services.js')(LojaInteligenteModule);	// Payment Services
    require('./payment.routes.js')(LojaInteligenteModule);      // Payment Routes
    require('./ticket.controller.js')(LojaInteligenteModule);	// Ticket Controller
};
