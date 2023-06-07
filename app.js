////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DATABASE INTEGRATION
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // use mysql database
const mysql = require('mysql');

    // create connection for mysql
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'vacations'
});

    // connecting with mysql
connection.connect();

    // use session for saving the state of user
const session = require('express-session');






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// STARTING EXPRESS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // require express server for running app
const express = require('express');

    // save express method function in app
const app = express();

    // path for joining other directories folder files
const path = require('path');

    // analyzing the body values
const parser = require('body-parser');
app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());

    // use for saving secure passwords
const bcrypt = require('bcrypt');
const saltRounds = 10;

    // initialize an ejs variable
const ejs = 'ejs';

    // url localhost:3000
const port = 3000;

    // setting template engine as ejs
app.set('view engine', ejs);

    // use path for joining other directories folder files
app.use(express.static(path.join(__dirname, 'public')));

    // use session management
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // 1 min = 60000 ms = 60 s
    // 1*2 = 2 min = 120000 ms = 120 s
    cookie: { maxAge: 120000 }
}))






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPRESS PATHING LOCATIONS PAGES
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // route for home page
app.get('/', (req, res) => {
        // for header
    const navArray = [
        { nav: 'Packages', link: 'packages' },
        { nav: 'Cart', link: 'cart' },
        { nav: 'Contact', link: 'contact' }
    ];
        // check if the user is logged in
    if (req.session.loggedIn) {
            // show home page as logged in
        res.render('index', {
            title: 'Home', nav: navArray, navButton: 'Sign Out', linkButton: 'signout',
            heading: 'Hi ' + req.session.name + '! ',
            paragraph: 'Explore with the top services in the World, providing long-term gaurantee.',
            button: 'Explore',
            buttonLink: 'packages',
            img: 'hero.jpg',
        })
    } else {
            // show home page as logged out
        res.render('index', {
            title: 'Home', nav: navArray, navButton: 'Sign In', linkButton: 'signin',
            heading: 'Fly more, enjoy more.',
            paragraph: 'Explore with the top services in the World, providing long-term gaurantee.',
            button: 'Explore',
            buttonLink: 'packages',
            img: 'hero.jpg',
        })
    }
});






    // route for packages page
app.get('/packages', (req, res) => {
        // for header
    const navArray = [
        { nav: 'Followed', link: 'followed' },
        { nav: 'Cart', link: 'cart' },
        { nav: 'Contact', link: 'contact' }
    ];
        // check if the user is logged in
    if (req.session.loggedIn) {
            // call query
        connection.query('SELECT * FROM `packages`', (err, result) => {
            if (err) {
                throw err;
            } else {
                connection.query("SELECT * FROM `user` WHERE `email`='" + req.session.email + "'", (err2, result2) => {
                    if (err2) {
                        throw err2;
                    } else {
                        res.render('packages', {
                            title: 'Packages', nav: navArray, navButton: 'Sign Out', linkButton: 'signout',
                            heading: 'Our Packages.',
                            buttonFollow: 'Follow',
                            buttonCart: 'Add Cart',
                            data: result,
                            dataUser: result2
                        })
                    } 
                })
            }
        });
    } else {
        res.redirect('/signin');
    }
});






    // route for followed page
app.get('/followed', (req, res) => {
        // for header
    const navArray = [
        { nav: 'Packages', link: 'packages' },
        { nav: 'Cart', link: 'cart' },
        { nav: 'Contact', link: 'contact' }
    ];
        // check if the user is logged in
    if (req.session.loggedIn) {
            // call query
        connection.query('SELECT * FROM `user` WHERE `email`="' + req.session.email + '"', (err, result) => {
            req.gettingId = result[0].id;
            if (err) {
                throw err;
            } else {
                connection.query('SELECT `user`.`name`, `user`.`email`, `packages`.`title`, `packages`.`price` FROM `status` INNER JOIN `user` ON `status`.`uid`=`user`.`id` INNER JOIN `packages` ON `status`.`pid`=`packages`.`id` WHERE `user`.`id`="' + req.gettingId + '"', (err2, result2) => {
                    if (err2) {
                        throw err2;
                    } else {
                        res.render('followed', {
                            title: 'Followed', nav: navArray, navButton: 'Sign Out', linkButton: 'signout',
                            heading: 'Followed',
                            data: result2
                        })
                    }
                })
            }
        });
    } else {
        res.redirect('/signin');
    }
});






    // route for cart page
app.get('/cart', (req, res) => {
        // for header
    const navArray = [
        { nav: 'Packages', link: 'packages' },
        { nav: 'Cart', link: 'cart' },
        { nav: 'Contact', link: 'contact' }
    ];
        // check if the user is logged in
    if (req.session.loggedIn) {
            // call query
        connection.query('SELECT * FROM `user` WHERE `email`="' + req.session.email + '"', (err, result) => {
            req.gettingId = result[0].id;
            if (err) {
                throw err;
            } else {
                connection.query('SELECT `user`.`name`, `user`.`email`, `packages`.`title`, `packages`.`price`, `cart`.`id`, `cart`.`qty` FROM `cart` INNER JOIN `user` ON `cart`.`uid`=`user`.`id` INNER JOIN `packages` ON `cart`.`pid`=`packages`.`id` WHERE `user`.`id`="' + req.gettingId + '"', (err2, result2) => {
                    if (err2) {
                        throw err2;
                    } else {
                        res.render('cart', {
                            title: 'Cart', nav: navArray, navButton: 'Sign Out', linkButton: 'signout',
                            heading: 'Cart',
                            data: result2
                        })
                    }
                })
            }
        });
    } else {
        res.redirect('/signin');
    }
});






    // route for contact page
app.get('/contact', (req, res) => {
        // for header
    const navArray = [
        { nav: 'Packages', link: 'packages' },
        { nav: 'Cart', link: 'cart' },
        { nav: 'Contact', link: 'contact' }
    ];
        // check if the user is logged in
    if (req.session.loggedIn) {
            // show contact page as logged in
        res.render('contact', {
            title: 'Contact', nav: navArray, navButton: 'Sign Out', linkButton: 'signout',
            heading: 'Contact us.',
            paragraph: 'Explore with the top services in the World, providing long-term gaurantee.',
            button: 'Connect',
            buttonLink: 'mailto:abc@123.com',
            img: 'contact.jpg',
        })
    } else {
            // show contact page as logged out
        res.render('contact', {
            title: 'Contact', nav: navArray, navButton: 'Sign In', linkButton: 'signin',
            heading: 'Contact us.',
            paragraph: 'Explore with the top services in the World, providing long-term gaurantee.',
            button: 'Connect',
            buttonLink: 'mailto:abc@123.com',
            img: 'contact.jpg',
        })
    }
});






    // route for sign in page
app.get('/signin', (req, res) => {
        // for header
    const navArray = [
        { nav: 'Packages', link: 'packages' },
        { nav: 'Cart', link: 'cart' },
        { nav: 'Contact', link: 'contact' }
    ];
        // check if the user is not logged in
    if (!(req.session.loggedIn)) {
        res.render('signin', {
            title: 'Sign In', nav: navArray, navButton: 'Sign In', linkButton: 'signin',
            message: '',
            heading: 'Sign in to your account.'
        })
    } else {
        res.redirect('/');
    }
})






    // route for sign up page
app.get('/signup', (req, res) => {
        // for header
    const navArray = [
        { nav: 'Packages', link: 'packages' },
        { nav: 'Cart', link: 'cart' },
        { nav: 'Contact', link: 'contact' }
    ];
        // check if the user is not logged in
    if (!(req.session.loggedIn)) {
        res.render('signup', {
            title: 'Sign Up', nav: navArray, navButton: 'Sign In', linkButton: 'signin',
            message: '',
            heading: 'Sign up for your account.'
        })
    } else {
        res.redirect('/');
    }
})






    // route for checkout page
app.get('/checkout', (req, res) => {
        // for header
    const navArray = [
        { nav: 'Packages', link: 'packages' },
        { nav: 'Cart', link: 'cart' },
        { nav: 'Contact', link: 'contact' }
    ];
        // check if the user is logged in
    if (req.session.loggedIn) {
            // show checkout page as logged in
        res.render('checkout', {
            title: 'Checkout', nav: navArray, navButton: 'Sign Out', linkButton: 'signout',
            heading: 'Checkout here.',
            message: ''
        })
    } else {
            // show checout page as logged out
        res.redirect('/signin');
    }
});





    // route for sign out page
app.get('/signout', (req, res) => {
    req.session.loggedIn = false;
    res.redirect('/')
})






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPRESS PATHING LOCATIONS INPUTS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // input the signup data
app.post('/accountup', async (req, res) => {
        // for header
    const navArray = [
        { nav: 'Packages', link: 'packages' },
        { nav: 'Cart', link: 'cart' },
        { nav: 'Contact', link: 'contact' }
    ];
        // storing input states
    if (req.method == 'POST') {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const encryptedPassword = await bcrypt.hash(password, saltRounds);
            // check if any input is empty
        if ((name.length <= 0) || (email.length <= 0) || (password.length <= 0)) {
            res.redirect('signup');
        } else {
                // call query
            connection.query("INSERT INTO `user`(`name`, `email`, `password`) VALUES ('" + name + "', '" + email + "', '" + encryptedPassword + "')", (err, result) => {
                if (err) {
                        // throw err;
                    res.render('signup', {
                        title: 'Sign Up', nav: navArray, navButton: 'Sign In', linkButton: 'signin',
                        message: 'Email already exist! Try another one.',
                        heading: 'Sign up for your account.'
                    })
                } else {
                    res.render('signin', {
                        title: 'Sign In', nav: navArray, navButton: 'Sign In', linkButton: 'signin',
                        message: 'Account Created Successfully!',
                        heading: 'Sign in to your account.'
                    })
                }
            });
        }
    } else {
        res.send('failed');
    }
})






    // input the signin data
app.post('/accountin', (req, res) => {
    req.session.loggedIn = false;
        // for header
    const navArray = [
        { nav: 'Packages', link: 'packages' },
        { nav: 'Cart', link: 'cart' },
        { nav: 'Contact', link: 'contact' }
    ];
        // storing input states
    if (req.method == 'POST') {
        const email = req.body.email;
        const password = req.body.password;
            // check if any input is empty
        if ((email.length <= 0) || (password.length <= 0)) {
            res.redirect('signin');
        } else {
                // call query
            connection.query("SELECT * FROM `user` WHERE `email`='" + email + "'", async (err, result) => {
                if (err) {
                    throw err;
                }
                    // if account is registered
                if (result.length > 0) {
                    const comparison = await bcrypt.compare(password, result[0].password);
                    if(comparison) {
                        req.session.loggedIn = true;
                        req.session.name = result[0].name;
				        req.session.email = email;
                        res.redirect('/');
                    } else {
                        res.render('signin', {
                            title: 'Sign In', nav: navArray, navButton: 'Sign In', linkButton: 'signin',
                            message: 'Make sure, you type correct password.',
                            heading: 'Sign in to your account.'
                        })
                    }
                } else {
                    res.render('signin', {
                        title: 'Sign In', nav: navArray, navButton: 'Sign In', linkButton: 'signin',
                        message: 'This account is not registered.',
                        heading: 'Sign in to your account.'
                    })
                }
            });
        }
    } else {
        res.send('failed');
    }
})






    // getting follow packages
app.post('/followPackages', (req, res) => {
    if (req.method == 'POST') {
        const userid = req.body.userid;
        const packageNumber = req.body.packageNumber;
            // check if any input is empty
        if ((packageNumber.length <= 0) || (userid.length <= 0)) {
            res.redirect('/packages');
        } else {
            connection.query("INSERT INTO `status`(`uid`, `pid`) VALUES ('" + userid + "', '" + packageNumber + "')", (err, result) => {
                if (err) {
                    throw err;
                } else {
                    res.redirect('/packages')
                }
            });
        }
    }
})





    // remove cart
app.post('/cart/remove/:id', (req, res) => {
    const {id} = req.params;

        // check if the user is logged in
    if (req.session.loggedIn) {
            // call query
        connection.query('DELETE FROM `cart` WHERE `cart`.`id`="'+ id +'"', (err, result) => {
            if (err) {
                throw err;
            } else {
                res.redirect('/cart')
            }
        });
    } else {
        res.redirect('/signin');
    }
})






    // getting add cart
app.post('/addCart', (req, res) => {
    if (req.method == 'POST') {
        const userid = req.body.userid;
        const packageQuant = req.body.packageQuant;
        const packageAdd = req.body.packageAdd;
            // check if any input is empty
        if (packageQuant.length <= 0) {
            res.redirect('/packages');
        } else {
                // call query
            connection.query("INSERT INTO `cart`(`uid`, `pid`, `qty`) VALUES ('" + userid + "', '" + packageAdd + "', '" + packageQuant + "')", (err, result) => {
                if (err) {
                    throw err;
                } else {
                    res.redirect('/packages')
                }
            });
        }
    }
})






    // getting order confirmation
app.post('/confirm', (req, res) => {
        // for header
    const navArray = [
        { nav: 'Packages', link: 'packages' },
        { nav: 'Cart', link: 'cart' },
        { nav: 'Contact', link: 'contact' }
    ];
    if (req.method == 'POST') {
        const bankAccount = req.body.bankAccount;
        const expireDate = req.body.expireDate;
            // check if any input is empty
        if ((bankAccount.length < 16) || (expireDate.length <= 0) || (bankAccount.length > 16)) {
            res.render('checkout', {
                title: 'Checkout', nav: navArray, navButton: 'Sign Out', linkButton: 'signout',
                heading: 'Checkout here.',
                message: 'Make sure, the inputs must filled!'
            })
        } else {
            res.render('checkout', {
                title: 'Checkout', nav: navArray, navButton: 'Sign Out', linkButton: 'signout',
                heading: 'Checkout here.',
                message: 'Your package is placed Successfully!'
            })
        }
    }
})






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPRESS RUNNING PORT SERVER 3000
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // runs after compilation
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
