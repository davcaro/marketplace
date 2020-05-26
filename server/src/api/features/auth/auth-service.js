const sgMail = require('@sendgrid/mail');
const config = require('../../../config');
const authDAL = require('./auth-dal');
const AppError = require('../../utils/app-error');

const createUser = async body => {
  const { email } = body;
  const userExists = (await authDAL.count(email)) > 0;

  if (userExists) {
    throw new AppError(409, 'User already registered');
  }

  try {
    const user = await authDAL.create(body);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      location: user.location
    };
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const checkUserExists = async email => {
  const userExists = (await authDAL.count(email)) > 0;

  if (userExists) {
    throw new AppError(409, 'User already registered');
  }

  return userExists;
};

const readLocation = async locationId => {
  let location;

  try {
    location = await authDAL.findLocationById(locationId);
  } catch (e) {
    throw new AppError(500, e.message);
  }

  if (!location) {
    throw new AppError(404, 'Location not found');
  }

  return location;
};

const sendWelcomeMail = async user => {
  const { name, email } = user;

  sgMail.setApiKey(config.ENV.MAIL.apiKey);

  const msg = {
    from: config.ENV.MAIL.fromEmail,
    templateId: config.ENV.MAIL.templates.welcome,
    personalizations: [
      {
        name,
        to: email,
        dynamicTemplateData: { user_name: name }
      }
    ]
  };

  return sgMail.send(msg).then(
    () => {},
    reason => {
      let error = reason.message;

      if (reason.response.body.errors) {
        error = reason.response.body.errors[0].message;
      }

      throw new AppError(500, error);
    }
  );
};

module.exports = {
  createUser,
  checkUserExists,
  readLocation,
  sendWelcomeMail
};
