
module.exports = function apiKeyAuth(req, res, next) {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return next(); // auth disabled if no API_KEY set

  const provided = req.header('x-api-key') || req.query.api_key;
  if (!provided || provided !== apiKey) {
    return res.status(401).json({ error: 'Unauthorized - invalid API key' });
  }
  next();
};
