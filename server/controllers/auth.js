import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import UserSchema from '@/server/models/UserSchema'
import Cookies from 'js-cookie'

const generatejwt = (_id, uid) => {
    const payload = {
        _id,
        uid
    };

    return jwt.sign(payload, process.env.jwttoken, {
        expiresIn: '24h',
    })
}

async function register(body) {
    try{
        const {username, email, password} = body;
        const candidate = await UserSchema.findOne({username});
        if (candidate) {
            return {
                code: 400,
                message: "User with this username already registered!"
            }
        }

        const hashedPassword = bcrypt.hashSync(password, 7);

        const user = new UserSchema({
            username: username,
            password: hashedPassword,
            email: email,
            registerDate: Date.now()
        })
        await user.save();

        return {
            code: 200,
            message: "Successful registered",
        }

    } catch(e) {
        console.error(e)
        return "err: "+e;
    }
}


async function login(body) {
    try {
        const {username, password} = body;
        const user = await UserSchema.findOne({username});
        if (!user) {
            return { code: 400, message: "User not found" };
        }
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return {
                code: 400,
                message: "Password is not correct"
            };
        }
        const token = generatejwt(user._id, user.uid);
        Cookies.set("token", token)

        return { code: 200, message: "Successful authorized!", token: token };

    } catch(e) {
        console.error(e)
        return "err: "+e;
    }
}


async function getjwtdata(token) {
    try {
        const token = Cookies.get("token");

        const user = jwt.verify(token, process.env.jwttoken);

        return {
            _id: user._id,
            uid: user.uid
        }
    } catch(e) {
        console.error(e)
        return "err: "+e;
    }
}

export {
    register,
    login,
    getjwtdata
}