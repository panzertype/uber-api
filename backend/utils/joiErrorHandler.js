const {
  errorValidator,
} = require('../validators/errorValidator');

const joiErrorHandler = (error) => {
  const errorArr = [];
  const errorL = error;
  // eslint-disable-next-line prefer-const
  for (let error of errorL.details) {
    errorArr.push(error.message);
  }
  const sendableError = {
    message: errorArr.join('; '),
  };
  if (errorValidator(sendableError)) {
    return sendableError;
  } else {
    return false;
  }
};

module.exports = {
  joiErrorHandler,
};
