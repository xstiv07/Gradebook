module.exports = function (app, express) {
	//get an instance of the express router
	var apiRouter = express.Router();

	//public routes
	require('./publicRoutes')(apiRouter);

	//middleware that is responsible for protecting all routes
	require('./authRoutes')(apiRouter);

	//user routes
	require('./userRoutes')(apiRouter);

	//class routes
	require('./classRoutes')(apiRouter);

	return apiRouter;
};