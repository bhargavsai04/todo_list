/* eslint-disable indent */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
const { request, response } = require('express');
const express = require('express');
const app = express();
const csrf = require('tiny-csrf');

const { Todo, User } = require('./models');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const passport = require('passport');
const connectEnsureLogin = require('connect-ensure-login');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const flash = require('connect-flash');

app.use(express.urlencoded({ extended: false }));
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.use(flash());
const user = require('./models/user');

app.use(bodyParser.json());
app.use(cookieParser('ssh!!!! some secret string'));
app.use(csrf('this_should_be_32_character_long', ['POST', 'PUT', 'DELETE']));

app.use(session({
  secret: "few things are private",
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

passport.use(new LocalStrategy({
  usernameField: 'email',
  password: 'password',
}, async (username, password, done) => {
  try {
    const user = await User.findOne({
      where: {
        email: username,
      }
    });
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Invalid Password" });
    }
  } catch (error) {
    console.error(error);
    return done(null, false, { message: "Register First" });
  }
}));

passport.serializeUser((user, done) => {
  console.log("Serializing user in session", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => {
      done(null, user);
    })
    .catch(error => {
      done(error, null);
    });
});

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  if (req.user) {
    res.redirect('/todos');
  } else {
    res.render('index', {
      title: 'To-do List',
      csrfToken: req.csrfToken(),
    });
  }
});

app.get('/todos', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const loggedInUser = req.user.id;
  const allTodos = await Todo.getTodos(loggedInUser);
  const overdue = await Todo.overdue(loggedInUser);
  const dueToday = await Todo.dueToday(loggedInUser);
  const dueLater = await Todo.dueLater(loggedInUser);
  const completedItems = await Todo.completedItems(loggedInUser);

  if (req.accepts('html')) {
    res.render('todos', {
      allTodos, overdue, dueToday, dueLater, completedItems,
      csrfToken: req.csrfToken(),
    });
  } else {
    res.json({ allTodos, overdue, dueToday, dueLater });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/signup', (req, res) => {
  res.render('signup', {
    title: 'Sign Up',
    csrfToken: req.csrfToken(),
  });
});

app.post('/users', async (req, res) => {
  if (!req.body.firstName || !req.body.email || !req.body.password) {
    req.flash("error", "All fields are required");
    return res.redirect("/signup");
  }

  const encryptedPassword = await bcrypt.hash(req.body.password, saltRounds);

  try {
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: encryptedPassword,
    });
    req.login(user, (err) => {
      if (err) {
        console.log(err);
        res.redirect("/");
      }
      res.redirect('/todos');
    });

  } catch (error) {
    console.log(error);
    req.flash("error", error.errors[0].message);
    res.redirect("/signup");
  }
});

app.get('/login', (req, res) => {
  res.render('login', {
    title: "Login",
    csrfToken: req.csrfToken(),
  });
});

app.post('/session', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true,
}), (req, res) => {
  console.log(req.user);
  res.redirect('/todos');
});

app.get('/signout', (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

app.post('/todos', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  if (!req.body.title || !req.body.dueDate) {
    req.flash("error", "Title and Date are required");
    res.redirect("/todos");
  }

  try {
    const todo = await Todo.addTodo({
      title: req.body.title,
      dueDate: req.body.dueDate,
      userId: req.user.id,
    });
    return res.redirect('/todos');
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

app.put('/todos/:id', async (req, res) => {
  const todo = await Todo.findByPk(req.params.id);
  try {
    const upTodo = await todo.setCompletionStatus(req.body.completed);
    return res.json(upTodo);
  } catch (error) {
    return res.status(422).json(error);
  }
});

app.delete('/todos/:id', connectEnsureLogin.ensureLoggedIn(), async function (req, res) {
  console.log('We have to delete a Todo with ID: ', req.params.id);

  const deleteFlag = await Todo.destroy({ where: { id: req.params.id, userId: req.user.id, } });
  if (deleteFlag === 0) {
    return res.send(false);
  } else {
    res.send(true);
  }
});

module.exports = app;
