module.exports = function checkPermissions(requiredPermission) {
  return (req, res, next) => {
    const user = req.user; // Assume you attach user info during auth (JWT or session)

    // ✅ Full access if super admin
    if (user.super_admin === true) {
      return next();
    }

    // ✅ Otherwise check permission
    const permissions = Array.isArray(user.permissions)
      ? user.permissions
      : JSON.parse(user.permissions || '[]');

    if (!permissions.includes(requiredPermission)) {
      return res.status(403).json({ error: 'Access denied: insufficient permissions' });
    }

    next();
  };
};
