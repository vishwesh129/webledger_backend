const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).send("Please Login");
    }

    jwt.verify(token, process.env.JWT, function (err, decoded) {
        if (err) {
            return res.status(401).send({ "msg": "Invalid Token" });
        } else {
            // Attach user information to req.user
            req.user = {
                userID: decoded.userID, // Modify this based on your token structure
            };
            next();
        }
    });
}

module.exports = authenticate;

