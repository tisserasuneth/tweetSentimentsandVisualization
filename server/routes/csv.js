const {spawn} = require('child_process');
const router = require("express").Router()


router.get('/csv',(req,res)=>{
    const CSVName = req.query.file
    const python = spawn('python3', ['readCSV.py',CSVName])
    let result = ''
    python.stdout.on('data',(data)=>{
        result += data
    })
    python.on('close',(code)=>{
        res.send(result)
    })
    if(req.method === 'OPTIONS') {
        return res.status(200).json(({
            body: "OK"
        }))
    }

})
module.exports = router