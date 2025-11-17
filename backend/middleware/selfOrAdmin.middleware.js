export const selfOrAdmin = (req, res, next) => {
  if (req.user.userId !== req.params.userId && req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};
