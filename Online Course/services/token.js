import jwt from "jsonwebtoken";

const generateJWTToken = userId => {
    const acessToken = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '30d'});

    return acessToken;
};

export {generateJWTToken};

