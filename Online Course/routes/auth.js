import { Router } from "express";
const router = Router();
import User from "../models/USer.js";
import bcrypt from "bcrypt";
import { generateJWTToken } from "../services/token.js";
import dont from "../middleware/dont.js";

router.get('/login', dont, (req, res) => {
    res.render('login', {
        title: 'Login',
        isLogin: true,
        loginError: req.flash("loginError"),
    });
});

router.get('/register', dont, (req, res) => {
    if (req.cookies.token) {
        res.redirect('/');
        return;
    }
    res.render('register', {
        title: 'Register',
        isRegister: true,
        registerError: req.flash("registerError"),
    });
});


//-------------------------------------------------------------------------------------------------------------------------------------------------------

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});


router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        req.flash('loginError', 'All filds is required');
        res.redirect('/login');
        return;
    }

    const existUser = await User.findOne({email});
    if(!existUser) {
        req.flash('loginError', 'Email not faund');
        res.redirect('/login');
        return;
    }

    const isPassEqual = await bcrypt.compare(password, existUser.password);
    if(!isPassEqual) {
        req.flash('loginError', 'Password not faund');
        res.redirect('/login');
        return;
    }
    
    const token = generateJWTToken(existUser._id);
    res.cookie('token', token, {httpOnly: true, secure: true});
    res.redirect('/');
});





router.post('/register', async (req, res) => {
    const {firstname, lastname, email, password} = req.body;

    if(!firstname || !lastname || !email || !password) {
        req.flash('registerError', 'All filds is required');
        res.redirect('/register');
        return;
    }

    const condedate = await User.findOne({email});
    if(condedate) {
        req.flash('registerError', 'Email already registered');
        res.redirect('/register');
        return;
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const userData = {
        firstName: firstname,
        lastName: lastname,
        email: email,
        password: hashedPass,
    };
    const user = await User.create(userData);
    const token = generateJWTToken(user._id);
    res.cookie('token', token, {httpOnly: true, secure: true}); 
    res.redirect('/');
});

export default router;