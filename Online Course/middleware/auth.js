export default function (req, res, next) {
    if(!req.cookies.token) {
        req.flash('errorAddProducts', 'You must login first');
        res.redirect('/add');
        return;
    }
    next();
}