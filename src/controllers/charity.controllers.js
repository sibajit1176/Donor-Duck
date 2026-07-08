const charityService = require('../services/charity.service')

const registercharityControler = async (req, res, next) => {
    try {
        const charity = await charityService.registercharityService({
            userId: req.user.id,
            ...req.body
        })
        res.status(201).send(charity)
    } catch (error) {
        next(error)
    }
}

const getcharityprofileController = async (req, res, next) => {
    try {

        const charity = await charityService.getCharityProfileService(req.user.id)
        res.status(200).send(charity)
    } catch (error) {
        next(error)
    }
}

const editcharityprofileController = async (req, res, next) => {
    try {

        const charity = await charityService.editCharityProfileService({
            userId: req.user.id,
            ...req.body
        })
        res.status(200).send(charity)
    } catch (error) {
        next(error)
    }
}

const deletecharityprofileController = async (req, res, next) => {
    try {
        const charity = await charityService.deleteCharityProfileService(req.user.id)
        res.status(200).send(charity)
    } catch (error) {
        next(error)
    }
}
module.exports = {
    registercharityControler,
    getcharityprofileController,
    editcharityprofileController,
    deletecharityprofileController
}