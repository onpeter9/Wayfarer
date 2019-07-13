import joi from '@hapi/joi';

module.exports = {
  /**
   * @description Validates all fields in signup request body
   * @param {user} object
   */
  signupValidator(user) {
    const schema = joi.object().keys({
      email: joi
        .string()
        .trim()
        .email()
        .required()
        .error(
          () => 'Please enter a valid email address. Example 0: "darkseid@apocalypse.com"',
        ),
      first_name: joi
        .string()
        .trim()
        .regex(/^[A-Z]+$/)
        .uppercase()
        .required()
        .error(() => 'first name will only consist of alphabets'),
      last_name: joi
        .string()
        .trim()
        .regex(/^[A-Z]+$/)
        .uppercase()
        .required()
        .error(() => 'last name will only consist of alphabets'),
      password: joi
        .string()
        .trim()
        .regex(/^(?=.*\d)(?=.*[a-zA-Z])(?!.*[\W_\x7B-\xFF]).{6,25}$/)
        .required()
        .error(
          () => `Your Password must be between 6-25 characters long lowercase alphabets or including at least 1 uppercase, and 1 digit Eg: People12`,
        ),
      confirmPassword: joi
        .any()
        .valid(joi.ref('password'))
        .required()
        .options({ language: { any: { allowOnly: 'Password and confirm password must match' } } }),
    });

    return joi.validate(user, schema);
  },
};
