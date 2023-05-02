const {spawn} = require('child_process');
const router = require("express").Router()


router.get('/scrape',(req, res)=>{
    const keywords = req.query.keywords
    const start = req.query.start
    const end = req.query.end
    const python = spawn('python3', ['scraper.py',keywords,start,end])
    let result =''

    python.stdout.on('data',(data)=>{
        result+=data.toString();
    })

    python.on('close',(code)=>{
        res.send(result)
    })
})
module.exports = router