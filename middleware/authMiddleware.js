const jwt = require("jsonwebtoken");

// Middleware to authenticate the token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded contains userId, role, groups, etc.
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Middleware to restrict by role (e.g., 'admin')
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: "Access denied. Insufficient role." });
    }
    next();
  };
};

// Middleware to restrict by group (if using group-based auth)
const requireGroup = (groupName) => {
  return (req, res, next) => {
    if (!req.user || !req.user.groups || !req.user.groups.includes(groupName)) {
      return res.status(403).json({ error: "Access denied. Group membership required." });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole,
  requireGroup
};
// Middleware to check if user has access to a group-based URL
function checkGroupAccess(req, res, next) {
    const group = req.user.groups;  // Assumed you have a logged-in user with group data
    const requestedUrl = req.originalUrl;  // The URL the user is trying to access
    
    // Fetch the group and check if the requested URL is assigned to that group
    db.query('SELECT assigned_url FROM groups WHERE name = ?', [group], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error fetching group data' });

        const groupUrl = result[0]?.assigned_url;
        if (groupUrl !== requestedUrl) {
            return res.status(403).json({ message: 'Access denied to this URL' });
        }

        next();
    });
}
