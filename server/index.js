const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const app = express()
const userRoute = require("./routes/users")
const sentimentRoute = require("./routes/sentiment")
const scraperRoute = require("./routes/scraper")
const csvRoute = require("./routes/csv")
const bodyParser = require('body-parser');
const cors = require('cors');
const installPythonLib = require('./installPythonLib');

installPythonLib();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req,res,next)=>{
    res.setHeader["Access-Control-Allow-Origin","*"]
    res.setHeader["Access-Control-Allow-Methods","*"]
    res.setHeader["Access-Control-Allow-Headers","*"]
});
app.use(cors());
app.use(express.json())


mongoose.set('strictQuery', true);
dotenv.config()
const port = process.env.PORT || 8800;
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=>{
    console.log('MongoDB is connected!')
})
.catch((err)=> console.log(err))

app.use("/api/users",userRoute)
app.use("/api/sentiment",sentimentRoute)
app.use("/api/scraper",scraperRoute)
app.use("/api/read",csvRoute)

app.listen(port,()=>console.log('Server is running'))


