import { login } from "~/server/controllers/auth";


export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    if (!body)
        return {code: 400, message: "Unexpected error!"}

    let result = {
        code: 400,
        message: "Undefined error"
    };

    result = login({
        username:body.username, 
        password:body.password
    })

    return result
})