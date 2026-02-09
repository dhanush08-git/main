if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError=require('./utils/ExpressError.js');
const listingRouter=require('./routes/listing.js');
const reviewRouter=require('./routes/review.js');
const userRouter=require('./routes/User.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./Models/User.js');



        

const port = 3000;


const dbURL=process.env.ATLASDB_URL;

main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log('Failed to connect to MongoDB', err);
});

async function main() {
    await mongoose.connect(dbURL);
}

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());   
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const sessionOptions = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    console.log(res.locals.success);
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    console.log(res.locals.currentUser);
    next();
});


app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use('/listings',listingRouter);
app.use('/listings/:id/reviews',reviewRouter);
app.use('/users',userRouter);


app.get("/privacy", (req, res) => {
  res.render("privacy.ejs");
});



app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);   // prevents double response
    }

    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("Error.ejs", { message });
});






app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});