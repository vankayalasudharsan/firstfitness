const db = require('../../models/index');
const response = require('../../utils/resonses')

exports.favourite = async (req, res, next) => {

    const workout_id = req.body.workout_id;
    const loggedInUser = req;

    const check = await db.favourite.findOne({
        where: {
            workout_id: workout_id,
            user_id: loggedInUser.loggedInUser.id,
            is_favourite: true,
        },
    });

    if (check) {

        const deleteFavorite = await check.update({
            is_favourite: false
        });

        response.onSuccess.message = "Removed From Favourites Successfully!";
        response.onSuccess.data = deleteFavorite;
        res.status(200);
        res.send(response.onSuccess);
        next();

    } else {
        const favourite = await db.favourite.create({
            user_id: loggedInUser.loggedInUser.id,
            workout_id: workout_id,
            is_favourite: true
        });

        if (!favourite) {
            response.onError.message = "Unable to Add it to Favourites", "Or Already in Favourites"
            res.status(500);
            res.send(response.onError);
            next();
        }

        response.onSuccess.message = "Added To Favourites Successfully!";
        response.onSuccess.data = favourite;
        res.status(200);
        res.send(response.onSuccess);
        next();

    }
};

exports.listFavorite = async (req, res, next) => {

    var data = [];
    const loggedInUser = req;

    const findUser = await db.User.findOne({
        where: {
            id: loggedInUser.loggedInUser.id,
        }
    });
    if (!findUser) {
        response.onError.message = "User Not Found!"
        res.status(500);
        res.send(response.onError);
        next();
    }

    data = await db.favourite.findAll({
        where: {
            user_id: loggedInUser.loggedInUser.id,
            is_favourite: true,
        }
    });

    for (let i = 0; i < data.length; i++) {
        const element = data[i];

        const fetchfavourite = await db.home.findOne({
            where: {
                id: element.workout_id
            }
        });

        element.dataValues.Favourite_details = fetchfavourite
    }

    // for (i = 0; i < data.length; i++) {

    //     const Favourite = await db.favourite.findOne({
    //         where: {
    //             user_id: loggedInUser.loggedInUser.id,
    //             workout_id: data[i].id,
    //             is_favourite: false
    //         }
    //     })
    //     if (Favourite) {
    //         data[i].dataValues.Favourite = false;
    //     }
    //     else {
    //         data[i].dataValues.Favourite = true;
    //     }
    // }

    response.onSuccess.message = "Successfully Fetched Favorites List!";
    response.onSuccess.data = data;
    res.status(200);
    res.send(response.onSuccess);
    next();
}