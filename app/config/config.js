require('custom-env').env(true);

const port = process.env.PORT;
const dbUrl = process.env.DATABASE_URL;
const jwtKey = process.env.JWT_KEY;
const user = process.env.USER;
const admin = process.env.ADMIN;
const userPassword = process.env.PASSWORD;
const adminPassword = process.env.ADMIN_PASSWORD;

const exportOut = {
  port,
  dbUrl,
  jwtKey,
  user,
  admin,
  userPassword,
  adminPassword,
};

module.exports = exportOut;
