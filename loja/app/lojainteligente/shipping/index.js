module.exports = function(LojaInteligenteModule) {
	require('./shipping.controller.js')(LojaInteligenteModule);	// Shipping Controller
	require('./shipping.sass');									// Shipping Sass
    require('./shipping.routes.js')(LojaInteligenteModule); // Shipping Routes
};
