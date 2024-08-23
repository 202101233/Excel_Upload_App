const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const Author = require('../models/author');
const Book = require('../models/book');

const router = express.Router();

const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });

// Route to preview data
router.post('/preview', upload.single('file'), (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        const workbook = xlsx.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        // Send the data back to the frontend for preview
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
});

// Route to validate and save data
router.post('/validate-and-save', async (req, res) => {
    try {
        const data = req.body;

        for (const row of data) {
            const { AuthorName, AuthorEmail, AuthorDOB, BookName, ISBN } = row;

            // Basic validation
            if (!AuthorName || !AuthorEmail || !AuthorDOB || !BookName || !ISBN) {
                return res.status(400).send('Missing required fields.');
            }

            let author = await Author.findOne({ email: AuthorEmail });
            if (!author) {
                author = new Author({
                    name: AuthorName,
                    email: AuthorEmail,
                    dateOfBirth: new Date(AuthorDOB)
                });
                await author.save();
            }

            const book = new Book({
                name: BookName,
                isbnCode: ISBN,
                author: author._id
            });
            await book.save();
        }

        res.status(200).send('Data successfully saved.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
});

module.exports = router;