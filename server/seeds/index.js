/* eslint-disable no-plusplus */

const faker = require('faker/locale/es');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const bcrypt = require('bcrypt');

const getAvatar = (avatars, index) => {
  if (avatars.length === 0) {
    return null;
  }

  let idx = index;
  while (idx >= avatars.length) {
    idx -= avatars.length;
  }

  return avatars[idx];
};

const getUsers = count => {
  // Read all avatars filenames
  const avatarsSrc = path.join(__dirname, '/images/avatars');
  const avatars = fs.readdirSync(avatarsSrc);

  // Generate fake users
  const users = [];

  for (let i = 0; i < count; i++) {
    users.push({
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.exampleEmail(),
      password: bcrypt.hashSync(faker.internet.password(), 10),
      avatar: getAvatar(avatars, i),
      admin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  return users;
};

const copyUserAvatars = () => {
  const avatarsSrc = path.join(__dirname, '/images/avatars');
  const avatarsDest = path.join(__dirname, '/../public/uploads/avatars');

  // Copy avatars to public folder
  return fse.copySync(avatarsSrc, avatarsDest);
};

const copyItemImages = () => {
  const imagesSrc = path.join(__dirname, '/images/items');
  const imagesDest = path.join(__dirname, '/../public/uploads/items');

  // Copy images to public folder
  return fse.copySync(imagesSrc, imagesDest);
};

module.exports = {
  getUsers,
  copyUserAvatars,
  copyItemImages
};
