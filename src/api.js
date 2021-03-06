const router = require('express').Router();
const utils = require('./utils');

router.use((req, res, next) => {
  const key = req.query.key;
  if (!key || key === 'null') {
    const error = new Error("User key missing");
    error.status = 403;
    return next(error);
  }
  // Allow the bootstrap key
  if (key === req.app.get('bootstrapKey')) {
    req.user = { id: 0, name: 'Bootstrap user' };
    return next();
  }
  req.db.UserModel.findOne({ key })
    .then(data => {
      if (!data) {
        const error = new Error("User not found");
        error.status = 403;
        return next(error);
      }
      req.user = data;
      next();
    })
    .catch(err => next(err));
});

router.get('/data', (req, res, next) => {
  Promise.all([req.db.UserModel.find(), req.db.OffenceModel.find()])
    .then(([users, offences]) => res.json({ userID: req.user.id, users, offences }))
    .catch(err => next(err));
});

router.post('/users/', (req, res, next) => {
  if (!req.body.name || !req.body.imageURL) {
    const error = new Error("User can not be empty");
    error.status = 400;
    return next(error);
  }

  utils.randomString()
    .then(key => {
      return (new req.db.UserModel({
        id: randomID(),
        name: req.body.name,
        imageURL: req.body.imageURL,
        points: 0,
        offences: [],
        admin: false,
        key
      })).save();
    })
    .then(data => res.json(data))
    .catch(err => next(err));
});

router.patch('/users/:userID', (req, res, next) => {
  req.db.UserModel.findOne({ id: req.params.userID })
    .then(user => {
      user.imageURL = req.body.imageURL;
      user.name = req.body.name;
      return user.save()
    })
    .then(data => res.json(data))
    .catch(err => next(err));
});

router.post('/users/:userID/checkIn', (req, res, next) => {
  req.db.UserModel.findOne({ id: req.params.userID })
    .then(user => {
      const hours = Math.max(0, (new Date()).getHours() - 9);
      if (user.checkIns.length === 0 && hours > 0) {
        let latePenalty = -10 * hours;
        user.offences.push({
          id: randomID(),
          description: 'Automatic Lateness Penalty',
          points: latePenalty,
          submitter: 'CLPC Lateness Bot'
        });
        user.points += latePenalty;
      }
      if (!user.checkIns.some(ci => ci.pubName === req.body.pubName)) {
        user.checkIns.push({ pubName: req.body.pubName });
      }
      return user.save()
    })
    .then(data => res.json(data))
    .catch(err => next(err));
});

router.delete('/users/:userID/checkIn/:pubName', (req, res, next) => {
  req.db.UserModel.findOne({ id: req.params.userID })
    .then(user => {
      user.checkIns = user.checkIns.filter(ci => ci.pubName !== req.params.pubName);
      return user.save()
    })
    .then(data => res.json(data))
    .catch(err => next(err));
});

router.post('/users/:userID/offences', (req, res, next) => {
  if (!req.body.offenceID) {
    const error = new Error("OffenceID can not be empty");
    error.status = 400;
    return next(error);
  }

  Promise.all([
      req.db.UserModel.findOne({ id: req.params.userID }),
      req.db.OffenceModel.findOne({ id: req.body.offenceID })
    ])
    .then(([user, offence]) => {
      user.offences.push({
        id: randomID(),
        description: offence.description,
        points: offence.points,
        submitter: req.user.name
      });
      user.points += offence.points;

      return user.save();
    })
    .then(data => res.json(data))
    .catch(err => next(err));
});

router.delete('/users/:userID/offences/:userOffenceID', (req, res, next) => {
  req.db.UserModel.findOne({ id: req.params.userID })
    .then(user => {
      const userOffence = user.offences.find(o => o.id == req.params.userOffenceID);
      user.points -= userOffence.points;
      userOffence.remove();

      return user.save()
    })
    .then(data => res.json(data))
    .catch(err => next(err));
});

router.post('/offences/', (req, res, next) => {
  if (!req.body.description || !req.body.points) {
    const error = new Error("Offence can not be empty");
    error.status = 400;
    return next(error);
  }

  const offence = new req.db.OffenceModel({
    id: randomID(),
    description: req.body.description,
    points: req.body.points,
  });

  return offence.save()
    .then(data => res.json(data))
    .catch(err => next(err));
});

router.patch('/offences/:offenceID', (req, res, next) => {
  req.db.OffenceModel.findOne({ id: req.params.offenceID })
    .then(offence => {
      offence.description = req.body.description;
      offence.points = req.body.points;

      return offence.save()
    })
    .then(data => res.json(data))
    .catch(err => next(err));
});

module.exports = router;

function randomID() {
  return Math.round(Math.random() * 10000000000);
}
