var logger = require("../logger");
/*
 * GET home page.
 */

exports.index = function(req, res){
	logger.logRequest(req);
	res.render('about', { title: 'CamPi.js' });
};