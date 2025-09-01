const express = require('express');
const router = express.Router();
const db = require('./db');
const crypto = require('crypto');

function getshorturl()    //userdefined function to genearte shorturl
{
    const shortId = crypto.randomBytes(4).toString('hex');
    return shortId;
};

router.post('/shorturls', async (req,res) => {
    const { url, validity, shortcode} = req.body;
    if(!url)
    {
        return res.status(400).json({message: "URL is required"});
    }
    try{
        let shorturl = getshorturl();
        while (await db.geturl(shorturl))
        {
            shorturl = getshorturl();
        }
        await db.saveurl({ url, shorturl, clickcount: 0 });
        res.status(201).json(
            { shortLink: `${req.protocol}://${req.get('host')}/${shorturl}`,
              expiry: new Date()
            });
    }
    catch(error){
       res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/shorturls/:shortid', async (req,res) => {
    const { shortid } = req.params;
    try{
        const dbrow = db.geturl(shortid);
        if(!dbrow)
        {
            return res.status(400).json({message: "Shortcode Not Found"});
        }
        return res.json({ url: dbrow.url, clickcount: dbrow.clickcount }
        );
    }
    catch(error)
    {
        return res.status(500).json({message: "Internal Server Error"});
    }

});



module.exports = router;
