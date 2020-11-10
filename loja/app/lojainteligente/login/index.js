module.exports = function(LojaInteligenteModule) {
	require('./login.controller.js')(LojaInteligenteModule);	// Login Controller
	require('./login.sass');									// Login Sass
};