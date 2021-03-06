import Auth from '../utility';
import validator from '../middlewares/validator';
import model from '../models';

class Users {
  static Model() {
    return new model.Model('users');
  }

  /**
  * @description Creates new user account
  * @param {object} req request object
  * @param {object} res response object
  * @returns {object}  JSON response
  */
  static async signUp(req, res) {
    const { error } = validator.signupValidator(req.body);
    if (error) {
      return res.status(400).json({
        status: 400,
        error: error.details[0].message,
      });
    }
    const {
      first_name, last_name, email, password,
    } = req.body;
    const hashedP = Auth.hash(password);
    const columns = 'first_name, last_name, email, password';
    const values = `'${first_name}', '${last_name}', '${email}', '${hashedP}'`;
    const clause = 'RETURNING id, first_name, last_name, email, is_admin';

    try {
      const data = await Users.Model().insert(columns, values, clause);
      const { id, is_admin, created_on } = data[0];
      const token = Auth.generateToken({
        id, email, first_name, last_name, is_admin, created_on,
      });

      res.setHeader('Authorization', `Bearer ${token}`);

      return res.status(201).json({
        status: 201,
        data: {
          token, id, email, first_name, last_name, is_admin,
        },
      });
    } catch (err) {
      if (err.routine === '_bt_check_unique') {
        return res.status(409).json({
          status: 409, error: 'Already registered with this email! Please use another email',
        });
      }
      return res.status(500).json({
        status: 500, error: 'Internal server error',
      });
    }
  }

  static async signIn(req, res) {
    
    const { error } = validator.signinValidator(req.body);
    if (error) {
      return res.status(400).json({
        status: 400,
        error: error.details[0].message,
      });
    }
    const { email, password } = req.body;
    const columns = 'id, email, password, is_admin';
    const clause = `WHERE email='${email}'`;
    
    
    try {
      const data = await Users.Model().select(columns, clause);
      if (!data[0]) {
        return res.status(401).json({
          status: 401,
          error: 'Unauthorized access!',
        });
      }
      console.log(data[0].password);
      if (!Auth.compare(password, data[0].password)) {
        return res.status(401).json({
          status: 401,
          error: 'Unauthorized access!',
        });
      }
      const {
        id, email, first_name, last_name, is_admin, created_on,
      } = data[0];
      const payload = {
        id,
        email,
        first_name,
        last_name,
        is_admin,
        created_on,
      };
      const token = Auth.generateToken({ ...payload });
      res.setHeader('Authorization', `Bearer ${token}`);
      return res.status(200).json({
        status: 200,
        data: {
          token,
          id,
          email,
          first_name,
          last_name,
          is_admin,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: 500,
        error: 'Internal server error',
      });
    }
  }
}


module.exports = Users;
