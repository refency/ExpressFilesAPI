import Router from 'express';
import api from '../controllers/api.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = new Router()

router.get('/logout', authMiddleware, api.logoutUser, function(req, res, next) {
    res.json({ msg: 'CORS is enabled' })
})
router.post('/signin', api.loginUser, function(req, res, next) {
    res.json({ msg: 'CORS is enabled' })
})
router.post('/signin/new_token', api.refreshToken, function(req, res, next) {
    res.json({ msg: 'CORS is enabled' })
})
router.post('/signup', api.registrationUser, function(req, res, next) {
    res.json({ msg: 'CORS is enabled' })
})

router.post('/file/upload', authMiddleware, api.fileUpload, function(req, res, next) {
    res.json({ msg: 'CORS is enabled' })
})
router.post('/file/download/:id', authMiddleware, api.fileDownload, function(req, res, next) {
    res.json({ msg: 'CORS is enabled' })
})
router.get('/user/:id', authMiddleware, api.findUser, function(req, res, next) {
    res.json({ msg: 'CORS is enabled' })
})
router.put('/user/update/:id', authMiddleware, api.userUpdate, function(req, res, next) {
    res.json({ msg: 'CORS is enabled' })
})
router.delete('/file/delete/:id', authMiddleware, api.userDelete, function(req, res, next) {
    res.json({ msg: 'CORS is enabled' })
})

export default router;
