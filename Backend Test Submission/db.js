const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, "urlshortener.db"));
db.serialize( () => {
    db.run(
        `CREATE TABLE IF NOT EXISTS urls(
        url TEXT NOT NULL,
        shortcode TEXT PRIMARY KEY,
        clickcount INTEGER DEFAULT 0)
    `);
});

function saveurl({ url, shortcode, clickcount })
{
    return new Promise( (resolve,reject) => {
        db.run(`INSERT INTO urls (url, shortcode, clickcount) VALUES (?, ?, ?)`, [url, shortcode, clickcount], function(err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });
};

function geturl( { shortid })
{
    return new Promise( (resolve,reject) => {
        db.get(`SELECT url, shortcode, clickcount FROM urls WHERE shortcode = ?`, [shortid], (err,row) => {
            if(err) reject(err);
            else resolve(row);
        });
    });
};

module.exports = { saveurl, geturl };