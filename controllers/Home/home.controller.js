const db = require('../../models/index');
const response = require('../../utils/resonses')

exports.createHome = async (req, res, next) => {
    const { workout_level, workout_title, workout_image, workout_description, video_url, duration } = req.body;
    try {
        const createhome = await db.home.create({
            workout_level: workout_level,
            workout_title: workout_title,
            workout_image: workout_image,
            workout_description: workout_description,
            video_url: video_url,
            duration: duration,
            is_favourite: false
        });

        response.onSuccess.message = 'Home Data Created';
        response.onSuccess.data = createhome;
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

exports.fetchHomeapi = async (req, res, next) => {

    const workout_level = req.body.workout_level;
    const loggedInUser = req;
    try {
        const find = await db.home.findAll({
            where: {
                workout_level: workout_level
            }
        })
        if (!find) {
            response.onError.message = "Workout level not found"
            res.status(500);
            res.send(response.onError);
            next();
        }

        const profiledetails = await db.User.findOne({
            where: {
                id: loggedInUser.loggedInUser.id
            }
        }); 

        var beginner;
        var intermediate;
        var advanced;

        beginner = await db.home.findAll({
            where: {
                workout_level: "Beginner",
                // is_favourite: false
            },
            order: [["createdAt", "DESC"]]
        })

        intermediate = await db.home.findAll({
            where: {
                workout_level: "Intermediate",
                // is_favourite: false
            },
            order: [["createdAt", "DESC"]]
        })

        advanced = await db.home.findAll({
            where: {
                workout_level: "Advanced",
                // is_favourite: false
            },
            order: [["createdAt", "DESC"]]
        })

        if (req.user) {
            for (i = 0; i < beginner.length; i++) {

                const Bookmark = await db.favourite.findOne({
                    where: {
                        user_id: req.userId,
                        workout_id: beginner[i].id
                    }
                })

                if (Bookmark) {
                    beginner[i].dataValues.Bookmark = true;
                }
                else {
                    beginner[i].dataValues.Bookmark = false;
                }
            }

            for (i = 0; i < intermediate.length; i++) {

                const Bookmark = await db.favourite.findOne({
                    where: {
                        user_id: req.userId,
                        workout_id: intermediate[i].id
                    }
                })

                if (Bookmark) {
                    intermediate[i].dataValues.Bookmark = true;
                }
                else {
                    intermediate[i].dataValues.Bookmark = false;
                }
            }

            for (i = 0; i < advanced.length; i++) {

                const Bookmark = await db.favourite.findOne({
                    where: {
                        user_id: req.userId,
                        workout_id: advanced[i].id
                    }
                })

                if (Bookmark) {
                    advanced[i].dataValues.Bookmark = true;
                }
                else {
                    advanced[i].dataValues.Bookmark = false;
                }
            }
        }

        response.onSuccess.message = "Home Page Details Fetched Successfully";
        response.onSuccess.data = {
            UserDetails: profiledetails,
            find: find
            
        }
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

exports.findOne = async (req, res) => {

    const { workout_id } = req.query;
    const loggedInUser = req;

    // try {
    const verify = await db.home.findOne({
        where: {
            id: workout_id,
        },
    });

    if (!verify) {
        response.onError.message = "Workout id not found"
        res.status(500);
        res.send(response.onError);
        next();
    }

    const Favorite = await db.favourite.findOne({
        where: {
            user_id: loggedInUser.loggedInUser.id,
            workout_id: workout_id,
            is_favourite: true
        }
    })
    if (Favorite) {
        verify.dataValues.Favorite = true;
    }
    else {
        verify.dataValues.Favorite = false;
    }

    response.onSuccess.message = "Fetched One Workout Details Successfully";
    response.onSuccess.data = verify;
    res.status(200);
    res.send(response.onSuccess);

    // } catch (error) {
    //     response.onError.message = "Workout id not found"
    //     res.status(500);
    //     res.send(response.onError);
    // }
}