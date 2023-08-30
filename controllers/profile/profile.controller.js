const db = require('../../models/index');
const response = require('../../utils/resonses')

exports.profileDetails = async (req, res) => {
  const loggedInUser = req;
  try {
    const UserDeatils = await db.User.findOne({
      where: {
        id: loggedInUser.loggedInUser.id
      }
    })
    response.onSuccess.message = "Profile Details Fetched Successfully"
    response.onSuccess.data = UserDeatils;
    res.status(200);
    res.send(response.onSuccess);
  } catch (e) {
    response.onError.message = "Something Went Wrong";
    res.status(500);
    res.send(response.onError);
    console.log(e);
  }
}

exports.editProfile = async (req, res) => {
  const requestDetails = req.body;
  const loggedInUser = req;
  try {
    const updateProfile = await db.User.update(requestDetails, { where: { id: loggedInUser.loggedInUser.id } });
    response.onSuccess.message = "Profile Updated Successfully"
    response.onSuccess.data = requestDetails;
    res.status(200);
    res.send(response.onSuccess);
  } catch (e) {
    response.onError.message = "Something Went Wrong";
    res.status(500);
    res.send(response.onError);
    console.log(e);
  }
}

exports.createFaq = async (req, res, next) => {
  const { question, answer } = req.body;
  try {
    const createfaq = await db.faq.create({
      question: question,
      answer: answer
    })
    response.onSuccess.message = 'FAQ Data Created';
    response.onSuccess.data = createfaq;
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

exports.fetchFaq = async (req, res, next) => {

  try {
    const find = await db.faq.findAll()

    response.onSuccess.message = "FAQ Details Fetched Successfully";
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