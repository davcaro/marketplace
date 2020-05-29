const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');
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

const createPasswordReset = async email => {
  // Check user exists
  let user;

  try {
    user = await authDAL.findByEmail(email);
  } catch (e) {
    throw new AppError(500, e.message);
  }

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  // Delete previous tokens
  try {
    await authDAL.deletePasswordResets(user.id);
  } catch (e) {
    throw new AppError(500, e.message);
  }

  // Create password reset
  let token;

  try {
    token = crypto.randomBytes(20).toString('hex');
    await authDAL.createPasswordReset(user.id, token);
  } catch (e) {
    throw new AppError(500, e.message);
  }

  // Send email
  sgMail.setApiKey(config.ENV.MAIL.apiKey);

  const msg = {
    from: config.ENV.MAIL.fromEmail,
    templateId: config.ENV.MAIL.templates.reset_password,
    personalizations: [
      {
        name: user.name,
        to: email,
        dynamicTemplateData: {
          userId: user.id,
          token
        }
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

const resetPassword = async (userId, token, password) => {
  // Check if token is valid
  let passwordReset;

  try {
    passwordReset = await authDAL.findPasswordReset(userId, token);
  } catch (e) {
    throw new AppError(500, e.message);
  }

  let tokenIsValid = false;
  if (passwordReset) {
    tokenIsValid = await passwordReset.isValidToken(token);
  }

  if (!passwordReset || !tokenIsValid) {
    throw new AppError(401, 'Expired or invalid token');
  }

  // Update user's password
  try {
    await authDAL.updateUserPassword(userId, password);
  } catch (e) {
    throw new AppError(500, e.message);
  }

  // Delete token
  try {
    await authDAL.deletePasswordResets(userId);
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
  createPasswordReset,
  resetPassword,
  checkUserExists,
  readLocation,
  sendWelcomeMail
};
