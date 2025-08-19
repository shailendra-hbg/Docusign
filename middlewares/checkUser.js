function checkUser(req, res, next) {
    const allowedsecretKey = "12345";

    const secretKey =
        req.headers['secretkey'] ||
        req.query?.secretKey ||
        req.body?.secretKey;

    if (!secretKey || secretKey === 'undefined') {
        return res.status(401).json({ error: "User ID is required" });
    }

    if (secretKey !== allowedsecretKey) {
        return res.status(403).json({ error: "Access denied" });
    }

    next(); 
}

module.exports = checkUser;
