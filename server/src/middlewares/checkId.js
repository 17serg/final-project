module.exports = (req, res, next) => {
  const { id } = req.params;
  if (Number.isNaN(+id)) {
    return res.status(400).json({ message: 'Put id number' });
  }
  res.locals.id = id;
  return next();
};
