import * as jwt from 'jsonwebtoken'
require('dotenv').config()

export default async (request, response, next) => {
  const token = request.headers["x-auth-token"];
  if (!token) return response.status(401).send({ error: "No token provided!" });

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.tokenKey
    );
    response.locals.payload = decodedToken;
  } catch (err) {
    return response.status(401).send({ error: err.message });
  }
  next();
};