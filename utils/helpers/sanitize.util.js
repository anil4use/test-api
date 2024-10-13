async function sanitizedUserData(userData) {
  const sanitizedData = { ...userData._doc };
  delete sanitizedData.password;
  delete sanitizedData._id;
  delete sanitizedData.verificationToken;
  delete sanitizedData.verificationTokenExpires;
  delete sanitizedData.stripeAccountId, 
  delete sanitizedData.__v;
  return sanitizedData;
}

module.exports = {
  sanitizedUserData,
};
