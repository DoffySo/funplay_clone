import { register } from "~/server/controllers/auth";


export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    if (!body)
        return {code: 400, message: "Unexpected error!"}

    let result = {
        code: 400,
        message: "Undefined error"
    };

    result = register({
        username:body.username,
        email: body.email,
        password:body.password
    })

    return result
})