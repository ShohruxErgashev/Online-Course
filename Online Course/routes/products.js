import { Router } from "express";
const router = Router();
import Product from "../models/Product.js";
import authMiddlewere from "../middleware/auth.js";
import userMiddlewere from "../middleware/user.js";
import user from "../middleware/user.js";
import User from "../models/USer.js";

  router.get('/', async (req, res) => {
    const products = await Product.find().lean();

    res.render('home', {
      title: 'Apple shop',
      products: products.reverse(),
      userId: req.userId ? req.userId.toString() : null,
    });
  });

  router.get('/products', async (req, res) => {

    const user = req.userId ? req.userId.toString() : null;
    const myProducts = await Product.find({user}).populate('user').lean();

    res.render('products', {
      title: 'Products',
      isProducts: true,
      myProducts: myProducts,
    });
  });

  router.get('/add', (req, res) => {
    res.render('add', {
      title: 'Add',
      isAdd: true,
      errorAddProducts: req.flash("errorAddProducts"),
    });
  });

  router.post('/add-product', authMiddlewere, userMiddlewere, async (req, res) => {
    const {title, description, image, price} = req.body;
    if(!title || !description || !image || !price) {
      req.flash('errorAddProducts', 'All filds is required');
      res.redirect('/add');
      return;
    }

    await Product.create({...req.body, user: req.userId});
    res.redirect('/')
  });

  router.get('/product/:id', async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id).populate('user').lean();

    res.render('product', {
      product: product,
    });
  });

  router.get('/edit-product/:id', async (req,res) => {
    const id = req.params.id;
    const product = await Product.findById(id).populate('user').lean();

    res.render('edit-product', {
      product: product,
      errorEditProduct: req.flash('errorEditProduct'),
    });
  });

  router.post('/edit-product/:id', async (req, res) => {
    const {title, description, image, price} = req.body;
    const id = req.params.id;
    if(!title || !description || !image || !price) {
      req.flash('errorEditProduct', 'All filds is required');
      res.redirect(`/edit-product/${id}`);
    }

    await Product.findByIdAndUpdate(id, req.body, {new: true});
    res.redirect('/products');
  });

  export default router;