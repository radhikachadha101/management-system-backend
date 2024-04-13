
const ErrorLog = require('../models/').ErrorLog;

const Methods = {};

Methods.errorLogging = async (req, err) => {
	let payload = {}
	if (req) {
		payload = {
			userId: req.user ? req.user.id : '',
			userEmail: req.user ? req.user.email : '',
			route: req.originalUrl ? req.originalUrl : '',
			requestPayload: JSON.stringify(req.body),
			// requestJSON: JSON.stringify(req),
			stackTrace: { "message": JSON.stringify(err.stack) }
		};
	} else {
		payload = {
			userId: '',
			userEmail: '',
			route: '',
			requestPayload: '',
			stackTrace: { "message": JSON.stringify(err.stack) }
		};
	}
	try {
		let result = await ErrorLog.create(payload);
		return result;
	}
	catch (error) {
		return error;
	}

};

Methods.findAll = async (req, res,next) => {
    try{
        var result= await ErrorLog.findAll();
        return res.send(result)
    }
    catch(error){
        next(error);
    }
}


module.exports = Methods