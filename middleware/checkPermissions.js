module.exports = function checkPermissions(requiredPermission) {
    return (req, res, next) => {
        if (req.user.role === 'admin') {
            return next(); // Admin has all permissions
        }

        const userPermissions = Array.isArray(req.user.permissions)
            ? req.user.permissions
            : JSON.parse(req.user.permissions || '[]');

        if (!userPermissions.includes(requiredPermission)) {
            return res.status(403).json({ error: 'Access denied: insufficient permissions' });
        }

        next();
    };
};
