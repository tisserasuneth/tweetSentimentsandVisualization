const {spawn} = require('child_process');
const router = require("express").Router()


router.get('/analyze',(req, res)=>{
    const CSVName = req.query.file
    const python = spawn('python3', ['sentiment.py',CSVName])
    let result = ''

    python.stdout.on('data',(data)=>{
        result+=data
    })

    python.on('close',(code)=>{
        res.send(result)
    })
})
module.exports = router