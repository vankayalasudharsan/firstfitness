const db = require('../../models/index');
const response = require('../../utils/resonses')

exports.createDiet = async (req, res, next) => {
    const { description, img_url } = req.body;
    try {
        const creatediet = await db.diet.create({
            description: description,
            img_url: img_url
        });

        response.onSuccess.message = 'Diet Data Created';
        response.onSuccess.data = creatediet;
        res.status(200);
        res.send(response.onSuccess);
        next();

    } catch (e) {
        response.onError.message = "Something Went Wrong";
        res.status(500);
        res.send(response.onError);
        console.log(e);
    }
};

exports.fetchDiet = async (req, res, next) => {

    try {
        const find = await db.diet.findAll()

        response.onSuccess.message = "Diet Page Details Fetched Successfully";
        response.onSuccess.data = find
        res.status(200);
        res.send(response.onSuccess);
        next();

    } catch (e) {
        response.onError.message = "Something Went Wrong";
        res.status(500);
        res.send(response.onError);
        console.log(e);
    }
}