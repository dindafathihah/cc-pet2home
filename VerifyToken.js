var jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    var token = req.headers["x-access-token"];
    if (!token)
        return res.status(403).send({
            status: 403,
            success: false,
            message: "No token provided.",
            result: null,
        });

    jwt.verify(token, process.env.TOKEN_KEY, function(err, decoded) {
        if (err)
            return res.status(500).send({
                status: 500,
                success: false,
                message: "Failed to authenticate token.",
                result: null,
            });

        req.id_user = decoded.id_user;
        req.email = decoded.email;
        next();
    });
}

module.exports = verifyToken;