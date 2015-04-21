module.exports = function (app, express) {
	//get an instance of the express router
	var apiRouter = express.Router();

	require('./publicRoutes')(apiRouter);

	//middleware that is responsible for protecting all following routes
	require('./authRoutes')(apiRouter);

	require('./userRoutes')(apiRouter);

	require('./classRoutes')(apiRouter);

	require('./assignmentRoutes')(apiRouter);

	return apiRouter;
};