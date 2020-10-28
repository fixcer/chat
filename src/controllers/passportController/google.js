import passport from 'passport';
import passportGoogle from 'passport-google-oauth';
import UserModal from '../../models/UserModel';
import ChatGroupModel from '../../models/ChatGroupModel';
import { transErrors, transSuccess } from '../.././../lang/vi';

const GoogleStrategy = passportGoogle.OAuth2Strategy;

/**
 * Valid user account type: google
 */

const initialPassportGoogle = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID:
          '120470867515-cm2q9tdm5ep7qg34oaal7rpj0rmn3koi.apps.googleusercontent.com',
        clientSecret: 'uXqqs3vdoYKSe2M1KU5w-GoQ',
        callbackURL: 'https://localhost:8000/auth/google/callback',
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const userExist = await UserModal.findByGoogleUid(profile.id);

          if (userExist) {
            return done(
              null,
              userExist,
              req.flash(
                'success',
                transSuccess.login_success(userExist.username)
              )
            );
          }

          const newUser = {
            username: profile.displayName,
            gender: profile.gender,
            local: { isActive: true },
            google: {
              uid: profile.id,
              token: accessToken,
              email: profile.emails[0].value,
            },
          };

          const createUser = await UserModal.createNew(newUser);

          return done(
            null,
            createUser,
            req.flash(
              'success',
              transSuccess.login_success(createUser.username)
            )
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

export default initialPassportGoogle;
