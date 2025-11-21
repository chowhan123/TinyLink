const validUrl = require('valid-url');

const validateUrl = (url) => {
  return validUrl.isUri(url);
};

const validateCode = (code) => {
  const codeRegex = /^[A-Za-z0-9]{6,8}$/;
  return codeRegex.test(code);
};

const generateRandomCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

module.exports = { validateUrl, validateCode, generateRandomCode };