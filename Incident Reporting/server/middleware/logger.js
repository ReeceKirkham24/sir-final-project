const logger = (req, res, next) => {
  console.log(req.method, res.originalUrl);
  next();
};

module.exports = logger