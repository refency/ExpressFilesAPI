import jwt from 'jsonwebtoken';
import models from '../../db/models';

const { Token } = models;

class TokenService {
    async generate (payload) {
        const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET_KEY, { expiresIn: '30m' })
        const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_KEY, { expiresIn: '5d' })

        return { accessToken, refreshToken }
    }

    async save (userId, refreshToken) {
        const tokenData = await Token.findOne({ where: { userId } })

        if (tokenData) {
            return tokenData.update({ refreshToken })
        }

        const token = await Token.create({ 
            userId: userId,
            refreshToken: refreshToken
        })

        return token
    }

    async delete (refreshToken) {
        await Token.update(
            { refreshToken: '' },
            { where: { refreshToken: refreshToken } }
        )

        return 'User was been login out'
    }

    validateAccessToken (token) {
        try {
            const userData = jwt.verify(token, process.env.ACCESS_SECRET_KEY);

            return userData
        } catch (err) {
            return null
        }
    }

    async validateRefreshToken (token) {
        try {
            const userData = jwt.verify(token, process.env.REFRESH_SECRET_KEY);

            return userData
        } catch (err) {
            return null
        }
    }

    async find (refreshToken) {
        const tokenData = await Token.findOne({ refreshToken: refreshToken })

        return tokenData
    }
}

export default new TokenService();
