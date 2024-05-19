import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
    const authorizationHeader = event.node.req.headers['authorization'];

    if (!authorizationHeader)
        return {code: 400, message: "Authorization header must be provided"}

    const token = authorizationHeader.split(' ')[1];
    if (!token) {
        return { code: 400, message: "JWT must be provided" };
    }


    let expired = false;
    let response;

    // console.log(jwt.verify(token, process.env.jwttoken));

    try {
        // Проверяем и декодируем токен
        response = jwt.verify(token, process.env.jwttoken);
    } catch (err) {
        // Если ошибка связана с истечением срока действия токена
        if (err.name === 'TokenExpiredError') {
            expired = true;
        } else {
            // Если другая ошибка (например, неверный токен)
            return { code: 400, message: "Invalid token" };
        }
    }

    if (expired) {
        return {
            code: 401,
            message: "JWT token has expired!",
        };
    } else {
        return {
            code: 200,
            message: "Token is valid",
            data: response,
        };
    }
})