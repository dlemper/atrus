const mustBe = require('mustbe');

module.exports = (config) => {
  config.routeHelpers((rh) => {
    // get the current user from the request object
    rh.getUser((req, cb) => {
      // return cb(err); if there is an error
      cb(null, req.user);
    });

    // what do we do when the user is not authorized?
    rh.notAuthorized((req, res, next) => {
      res.redirect('/login?msg=you are not authorized');
    });
  });

  config.activities((activities) => {
    // configure an activity with an authorization check
    activities.can('view thing', (identity, params, cb) => {
      const id = params.id;
      someLib.anotherThing(id, (err, thing) => {
        if (err) {
          return cb(err);
        }
        const hasThing = !!thing;
        return cb(null, hasThing);
      });
    });
  });
};
