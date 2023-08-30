const express = require('express');
const router = express.Router();
const response = require('../../utils/resonses');

const tokenVerification = require('../../middleware/verifytoken');
const uploadImage = require('../../middleware/uploadimageAws')

const profileController = require('../../controllers/profile/profile.controller');

router.post('/profile-edit',tokenVerification,profileController.editProfile);
router.get('/get-profile',tokenVerification,profileController.profileDetails);
router.post(
    "/upload-image", 
    uploadImage.single("photos"),
    async (req, res, next) => {
        let data = {}
        if(req.file) {
            data.image = req.file.location
        }  
   response.onSuccess.message = "Image Uploaded Successfully";
    response.onSuccess.data = data.image;
    res.status(200);
    res.send(response.onSuccess);
    }
)
router.post('/create-faq',tokenVerification, profileController.createFaq);
router.get('/fetch-faq',tokenVerification,profileController.fetchFaq)


module.exports = router