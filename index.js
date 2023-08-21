import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import methodOverride from 'method-override';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import flash from 'connect-flash';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { Users } from './models/User.js'
import { Blogs } from './models/Blog.js';

dotenv.config();

const app = express();
const PORT = 3000;
const URI = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;

mongoose.connect(URI, {useNewUrlParser: true});


app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(flash());
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
}));

const authMiddleware = (req, res, next ) => {
    const token = req.cookies.token;
  
    if(!token) {
        req.flash('message', 'Login or register to access your blog page')
        return res.redirect('/login');
    }
  
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch(error) {
        req.flash('message', 'Login or register to access your blog page')
        return res.redirect('/login');
    }
}

const checkPost = async (req, res, next ) => {

    const blog = await Blogs.findOne({_id: req.params.id});
    
    if (blog.userId.toString() === req.userId){
        next();
    } else {
        return res.redirect('/');
    }
}

app.get('/', authMiddleware, async (req,res) => {
    try {
        const blogs = await Blogs.find({userId: req.userId});
        res.render('index.ejs', { blogs });
    } catch(error) {
        console.log(error.message)
    }
});

app.get('/login', (req,res) => {
    const message = req.flash('message');
    res.render('login-page.ejs', { message: message });
});

app.post('/login', async (req,res) => {
    try {
        const { username, password } = req.body;
        
        const user = await Users.findOne( { Username:username } );
    
        if(!user) {
            req.flash('message', 'Incorrect credentials!')
            return res.redirect('/login');
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.Password);
    
        if(!isPasswordValid) {
            req.flash('message', 'Incorrect credentials!')
            return res.redirect('/login');
        }
    
        const token = jwt.sign({ userId: user._id}, jwtSecret );
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/');
    
      } catch (error) {
        console.log(error);
      }
});

app.get('/logout', (req,res) => {
    res.clearCookie('token');
    res.redirect('/login');
})

app.get('/posts/:id', authMiddleware, checkPost, async (req,res) => {
    try {
        const blog = await Blogs.findOne({_id: req.params.id});
        res.render('post.ejs', { blog });
    } catch(error) {
        console.log(error.message);
    }
});

app.get('/add-post', authMiddleware, (req,res) => {
    res.render('add-post.ejs');
});

app.post('/create-post', authMiddleware, async (req,res) => {
    try {
        const newBlog = new Blogs({
            title: req.body.title,
            description: req.body.description,
            userId: req.userId,
        });
        Blogs.create(newBlog);
        await new Promise(resolve => setTimeout(resolve, 300));
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }
});

app.post('/register', async (req,res) => {
    try {
        const password = req.body.password;
        const hashedPassword = bcrypt.hashSync(password, 10);

        const checkUsername = await Users.findOne({Username: req.body.username});
        if (checkUsername) {
            req.flash('message', 'Username already exists');
            return res.redirect('/login');
        }

        const newUser = new Users({
            Username: req.body.username,
            Password: hashedPassword,
        });
        await Users.create(newUser);
        await new Promise(resolve => setTimeout(resolve, 300));
        req.flash('message', 'Username has been successfully created!');
        return res.redirect('/login');
    } catch(error) {
        console.log(error.message)
    }
});

app.delete('/delete-post/:id', authMiddleware, checkPost, async (req,res) => {
    try {
        await Blogs.deleteOne( { _id: req.params.id } );
        await new Promise(resolve => setTimeout(resolve, 300));
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }
});

// app.delete('/delete-all', async (req,res) => {
//     try {
//         await Blogs.deleteMany( {} );
//         await new Promise(resolve => setTimeout(resolve, 300));
//         res.redirect('/');
//     } catch (error) {
//         console.log(error.message);
//     }
// });

app.put('/edit-post/:id', authMiddleware, checkPost, async (req,res) => {
    try {
        const editedBlog = {
            title: req.body.title,
            description: req.body.description,
        }
        await Blogs.updateOne( { _id: req.params.id }, editedBlog);
        await new Promise(resolve => setTimeout(resolve, 300));
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }
});

app.listen(PORT, () => {
    console.log(`All good in PORT ${PORT}`);
});

