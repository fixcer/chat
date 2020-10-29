import passport from 'passport';
import passportLocal from 'passport-local';
import UserModal from '../../models/UserModel';
import ChatGroupModel from '../../models/ChatGroupModel';
import { transErrors, transSuccess } from '../.././../lang/vi';

const LocalStrategy = passportLocal.Strategy;

/**
 * Valid user account type: local
 */

const initialPassportLocal = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const userExist = await UserModal.findByEmail(email);

          if (!userExist) {
            return done(
              null,
              false,
              req.flash('errors', transErrors.login_failed)
            );
          }

          if (!userExist.local.isActive) {
            return done(
              null,
              false,
              req('errors', transErrors.account_not_active)
            );
          }

          const checkPassword = await userExist.comparePassword(password);

          if (!checkPassword) {
            return done(
              null,
              false,
              req.flash('errors', transErrors.login_failed)
            );
          }

          return done(
            null,
            userExist,
            req.flash('success', transSuccess.login_success(userExist.username))
          );
        } catch (error) {
          console.log(error);
          return done(
            null,
            false,
            req.flash('errors', transErrors.server_error)
          );
        }
      }
    )
  );

  // Save userId to session
  passport.serializeUser((userExist, done) => {
    done(null, userExist._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await UserModal.findUserByIdForSessionToUse(id);
      let chatGroupIds = await ChatGroupModel.getChatGroupIdByUser(user._id);

      user = user.toObject();
      user.chatGroupIds = chatGroupIds;
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  });
};

export default initialPassportLocal;
