const express = require('express');
const router = express.Router();
const pool = require('../db');

const retrieveBooksSql = 
    `SELECT
        book.id,
        book.author,
        book.title,
        book_type.type,
        book_sub_type.sub_type,
        book_location.location,
        book_language.language
    FROM book
    INNER JOIN book_type ON book.book_type_id = book_type.id
    INNER JOIN book_sub_type ON book.book_sub_type_id = book_sub_type.id
    INNER JOIN book_location ON book.book_location_id = book_location.id
    INNER JOIN book_language ON book.book_language_id = book_language.id`;

const getJson = sqlResult => {
    const jsonArr = [];

    const checkType = item => {
        if (item.constructor.name.toLowerCase() === 'array') {
            item.forEach(obj => {
                checkType(obj);
            });
        } else if (item.constructor.name.toLowerCase() === 'rowdatapacket') {
            jsonArr.push(item);
        }
    };

    checkType(sqlResult);
    return jsonArr;
};

// books home route (http://localhost:5000/books)
router.get('/', async (req, res) => {
    const sql = `${retrieveBooksSql} LIMIT 30;`;
        
    let err;
    const books = await pool.query(sql).catch(e => err = e);
    if (err) {
        res.render('books', { books: [], errorMsg: 'There was an error retrieving your books, please reload this page.' });
    } else {
        res.render('books', { books });
    }
});

router.get('/searchbooks', async (req, res) => {
    const s = pool.escape(`%${req.query.booksearch.trim()}%`);

    const sql = 
        `${retrieveBooksSql}
        WHERE book.author LIKE ${s} OR book.title LIKE ${s} OR book_type.type LIKE ${s} OR book_sub_type.sub_type LIKE ${s} OR book_language.language LIKE ${s} OR book_location.location LIKE ${s} ORDER BY book_type.type, book_sub_type.sub_type, book.author`;

    let err;
    const booksResult = await pool.query(sql).catch(e => err = e);
    const books = getJson(booksResult);

    if (err) {
        console.error('Sql error: ', err);
        res.render('books', { books: [], errorMsg: 'There was an error with that search term, please try that again.' });
    } else {
        res.render('books', { books });
    }
});

router.get('/getbookinfo', async (req, res) => {
    res.send('Inside the /getbookinfo route...');
});

router.get('/addbook', async (req, res) => {
    const sql = 
        `
        SELECT * FROM book_type;
        SELECT * FROM book_sub_type;
        SELECT * FROM book_language;
        SELECT * FROM book_location;
        `
    
    let err;
    const results = await pool.query(sql).catch(e => err = e);

    if (err) {
        console.error('Sql error: ', err);
        res.render('books', { books: [], errorMsg: 'There was an error, please try that action again.' });
    } else {
        const templateData = {
            types: results[0],
            sub_types: results[1],
            languages: results[2],
            locations: results[3]
        };
        res.render('addbook', templateData);
    }
});

router.post('/insertbook', async (req, res) => {
    const book = {
        author: req.body.author.trim(),
        title: req.body.title.trim(),
        book_type_id: req.body.type,
        book_sub_type_id: req.body.sub_type,
        book_language_id: req.body.language,
        book_location_id: req.body.location
    };

    let err;
    const sql = 'INSERT INTO book SET ?';
    const result = await pool.query(sql, book).catch(e => err = e);

    if (err) {
        console.error('Sql error: ', err);
        res.redirect('/books/addbook?success=0');
    } else {
        res.redirect('/books/addbook?success=1');
    }
});

router.get('/updatebook', async (req, res) => {
    res.send('Inside the /updatebook route...');
});

router.post('/updatebookbyid/:id', async (req, res) => {
    res.send('Inside the /updatebookbyid route...');
});

router.delete('/deletebook/:id', async (req, res) => {
    res.send('Inside the /deletebook route...');
});

module.exports = router;