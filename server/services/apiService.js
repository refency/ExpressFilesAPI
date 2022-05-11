import fs from 'fs';
import models from '../../db/models';
import bcrypt from 'bcrypt';
import tokenService  from './tokenService';
import userDTO from '../dtos/userDTO';
import apiError from '../exceptions/apiError';
import * as path from 'path';

const { User, Token, Image } = models;

class apiService {
    async registration (req) {
        let registeredUser = await User.findOne({ where: { email: req.email}})

        if (registeredUser) throw apiError.BadRequest(`User with login: ${registeredUser.email} is already registered!`)

        if (!req.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})$/)) {
            throw apiError.BadRequest('Email must be correctly!')
        }

        if (!req.password.match(/^(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
            throw apiError.BadRequest('Password is too weak, it must have: 8 or more symbols and have at least one letter of upper and lower case')
        }

        const user = await User.create({
            email: req.email,
            password: await bcrypt.hash(req.password, 3),
            firstName: req.firstName,
            lastName: req.lastName
        })

        const userDto = new userDTO(user)
        const tokens = await tokenService.generate({...userDto})
        await tokenService.save(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }


    async login (email, password) {
        const user = await User.findOne({ where: { email } })

        if (!user) throw apiError.BadRequest('Incorrect login')
        console.log('chlen')

        const isPasswordsEqual = await bcrypt.compare(password, user.password)

        if (!isPasswordsEqual) throw apiError.BadRequest(`Passwords don't match`)

        const userDto = new userDTO(user);
        const tokens = await tokenService.generate({...userDto});
        await tokenService.save(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }

    async logout (refreshToken) {
        const token = await tokenService.delete(refreshToken);
        
        return token;
    }

    async refresh (refreshToken) {
        if (!refreshToken) throw apiError.UnauthorizedError();

        const userData = await tokenService.validateRefreshToken(refreshToken);
        const token = await tokenService.find(refreshToken);

        if (!userData || !token) throw apiError.UnauthorizedError();

        const user = await User.findOne({ where: { email: userData.email } })
        const userDto = new userDTO(user);
        const tokens = await tokenService.generate({...userDto});
        await tokenService.save(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }
        
    async findUser (id) {
        const user = await User.findOne({ where: { id } })

        return user
    }

    async saveFile (file) {
        const fileData = await Image.create({
            name: file.name.split('.')[0],
            extension: file.name.split('.')[1],
            data: file.data,
            mimetype: file.mimetype,
            size: file.size       
        })

        return fileData
    }

    async downloadFile (req) {
        const { id } = req.params
        if (!id) throw apiError.BadRequest('Id does not specified')

        const image = await Image.findOne({ where: { id } })
        if (!image) throw apiError.BadRequest('Image does not exist or id is incorrect')

        const { email } = req.body
        let user = await User.findOne({ where: { email } })
        if (!user) throw apiError.BadRequest('User does not exist or email is incorrect')

        const filePath = path.resolve('server/files', `${user.firstName}_${user.lastName}_${image.name}.pdf`);
        fs.createWriteStream(filePath).write(image.data)

        await User.update({
            image: `${user.firstName}_${user.lastName}_${image.name}.pdf`,
            pdf: fs.readFileSync(filePath)
        }, {
            where: { id: user.id }
        })

        return 'File is created'
    }

    async userUpdate (req, file) {
        await User.update({
            password: await bcrypt.hash(req.body.password, 3),
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }, {
            where: { id: req.params.id }
        })

        return 'User was updated'
    }

    async delete (id) {
        const user = await User.findOne({ where: { id } })

        if (!user) throw apiError.BadRequest(`File by id: ${id} does not exist`)

        await Token.destroy({ where: { userId: id } })
        await user.destroy();

        return `User by id: ${id} was been deleted`
    }
}

export default new apiService();
