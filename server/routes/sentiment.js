const {spawn} = require('child_process');
const router = require("express").Router()


router.get('/analyze',(req, res)=>{
    const python = spawn('python3', ['sentiment.py'])
    let result = ''

    python.stdout.on('data',(data)=>{
        result+=data
    })

    python.on('close',(code)=>{
        res.send(result)
    })
})
module.exports = router