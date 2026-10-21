
export default function errorHandler(err, req, res, next) {
	console.error(err);
	if (res.headersSent) return next(err);
	const status = err.status || (err.code === 'ER_DUP_ENTRY' ? 409 : 500);
	res.status(status).json({ success: false, message: err.message || 'Internal Server Error' });
}

