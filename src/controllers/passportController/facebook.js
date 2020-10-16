import passport from 'passport';
import passportFacebook from 'passport-facebook';
import UserModal from '../../models/UserModel';
import { transErrors, transSuccess } from '../.././../lang/vi';

const FacebookStrategy = passportFacebook.Strategy;

/**
 * Valid user account type: facebook
 */

const initialPassportFacebook = () => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: '628853284660804',
        clientSecret: '8988aa9bb76d50a47968024cb67df8b7',
        callbackURL: 'https://localhost:8000/auth/facebook/callback',
        passReqToCallback: true,
        profileFields: ['email', 'gender', 'displayName'],
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const userExist = await UserModal.findByFacebookUid(profile.id);

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
            facebook: {
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

  passport.deserializeUser((id, done) => {
    UserModal.findUserById(id)
      .then((user) => {
        return done(null, user);
      })
      .catch((error) => {
        return done(error, null);
      });
  });
};

export default initialPassportFacebook;
