import apiService from '../services/apiService.js'

class apiController {
    async logoutUser(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await apiService.logout(refreshToken);

            res.clearCookie('refreshToken');

            return res.json(token)
        } catch (err) {
            next(err)
        }
    }

    async loginUser(req, res, next) {
        try {
            const { email, password } = req.body;

            const userData = await apiService.login(email, password)

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.json(userData)
        } catch (err) {
            next(err)
        }
    }

    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await apiService.refresh(refreshToken)

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.json(userData)
        } catch (err) {
            next(err)
        }
    }

    async registrationUser(req, res, next) {
        try {
            const userData = await apiService.registration(req.body)

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.json(userData)
        } catch (err) {
            next(err)
        }
    }

    async fileUpload(req, res, next) {
        try {
            const file = await apiService.saveFile(req.files.file)

            res.json(file)
        } catch (err) {
            next(err)
        }
    }

    async findUser (req, res, next) {
        try {
            const { id } = req.params
            if (!id) throw apiError.BadRequest('Id does not specified')
            
            const user = await apiService.findUser(id)
            
            res.json(user)
        } catch (err) {
            next(err)
        }
    }

    async fileDownload (req, res, next) {
        try {
            const file = await apiService.downloadFile(req);
            
            res.json(file)
        } catch (err) {
            next(err)
        }
    }

    async userUpdate (req, res, next) {
        try {
            if (!req.params.id) throw apiError.BadRequest('Id does not specified')

            const user = await apiService.userUpdate(req);
            
            res.json(user)
        } catch (err) {
            next(err)
        }
    }

    async userDelete (req, res, next) {
        try {
            const { id } = req.params
            if (!id) throw apiError.BadRequest('Id does not specified')
            
            const user = await apiService.delete(id)
            
            res.json(user)
        } catch (err) {
            next(err)
        }
    }
}

export default new apiController();
