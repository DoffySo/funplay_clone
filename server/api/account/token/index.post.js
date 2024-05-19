import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    if (!body)
        return {code: 400, message: "Unexpected error!"}

    let result = {
        code: 400,
        message: "Undefined error"
    };

    const token = body.token;


    return jwt.verify(token, process.env.jwttoken);
})