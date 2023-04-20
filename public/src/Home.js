import React from 'react'
import './home.css'
import axios from './api/axios';
import Plot from 'react-plotly.js'
import {useRef,useState,useEffect} from "react"
import {useNavigate} from "react-router-dom"
import Nav from 'react-bootstrap/Nav'
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';

//make map with pins for positive and negative
//use mapbox

function Home() {

  const userRef = useRef();
  const [keywords,setKeywords] = useState('');
  const [start,setStart] = useState('');
  const [end,setEnd] = useState('');
  let [data, setData] = useState([]);

  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("username")

  const date = new Date()

  let avg= ''
  let df =''

  useEffect(()=>{
    if(!isAuthenticated){
      navigate('/')
    }
  },[])

  const handleLogOut = ()=>{
    localStorage.removeItem("username")
    window.location.reload(false);

  }

  const scrape = async (e) => {
    axios.get('/api/scraper/scrape',{
      params:{
        keywords: keywords,
        start: start,
        end: end
      }
    })
    .then(response=>{
      console.log(response.data)
      df = response.data
    })
    .catch(error => console.log(error));
  }
  const analyze = () => {
    axios.get('/api/sentiment/analyze')
    .then(response=>{
      avg = response.data
      // avg= avg.map(str=>(parseFloat(str))*100)
      // setData(avg)
      avg = avg.split(',')
      let positive = avg[0].match((/\d+/))
      let negative = avg[1].match((/\d+/))
      positive = positive ? parseInt(positive[0], 10) : null
      negative = negative ? parseInt(negative[0], 10) : null
      setData([(negative/(positive+negative))*100,(positive/(positive+negative))*100])
    })
    .catch(error => console.log(error));
  }

  return (
      <>
          <Grid 
            container
            direction="row"
            className='top'
            justifyContent="space-between"
            alignItems="center"  
          >
            <h1 className='heading'>Plots</h1>
            <Button className="logout" variant="contained" color='error' size="small" onClick={handleLogOut}>Logout</Button>
            <Nav className='line'>
          </Nav>
         </Grid>
          <Grid className='plots'
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"   
          > 
          <Grid item>
              <Plot
                data={[
                  {
                  values: data,
                  labels: ['Negative', 'Positive'],
                  type: 'pie',
                  marker: {
                    colors: ['#FF4136', '#0074D9']
                  },
                  }
                ]}
                layout={{
                  title: 'Average Sentiments',
                  autosize: true,
                }}
                useResizeHandler = {true}
                style={{width: "100%", height: "100%"}}
                />
          </Grid>
          <Grid item>
              <Plot
                data={[
                  {
                  x: ['Negative','Positive'],
                  y: data,
                  type: 'bar', 
                  marker: {
                    color: ['#FF4136', '#0074D9']
                  },
                  }
                ]}
                  layout={ {
                    title: 'Average Sentiments', 
                    autosize: true,
                  }}
                  useResizeHandler = {true}
                  style={{width: "100%", height: "100%"}}
                />
           </Grid>
           <Grid item>
              {/* <Plot
                data={[
                  {
                  x: ['Negative','Neutral','Positive'],
                  y: [0.28283238001167776*100, 0.44383696019649505*100, 0.2733306474983692*100],
                  type: 'scatter', 
                  marker: {
                    color: ['#FF4136', '#0074D9', '#2ECC40']
                  }}
                ]}
                layout={{
                  title: 'Scatter for time',
                  autosize: true,
                }}
                useResizeHandler = {true}
                style={{width: "100%", height: "100%"}}
              /> */}
           </Grid>
           <Divider/>
        </Grid>   
        <Grid 
          className='sentiment'
          container
          direction="row"
          alignItems="left" 
        >
          <Grid item>
            <form className='form'>
            <div>
              <label htmlFor="keywords">
                <h3>Enter Keywords below: </h3>
                <p>Separate each keyword with a comma (,)</p>
                <p>Example: budlight, coors, beer</p>
              </label>
              <input
                type="text"
                id = "keywords"
                className='keywords'
                ref = {userRef}
                autoComplete="off"
                onChange={(e)=> setKeywords(e.target.value)}
                required
              />
            </div>
              <label htmlFor="start">Start date:</label>
              <input type="date" id="start"
                className='date'
                value= {start}
                min="2010-01-01" max="2023-12-31"
                onChange={(e)=> setStart(e.target.value)}
                />
              <label htmlFor="end">End date:</label>
              <input type="date" id="end"
                className='date'
                value={end}
                min="2010-01-01" max="2050-12-31"
                onChange={(e)=> setEnd(e.target.value)}
                />
            </form>
            </Grid>
             
            <Grid item>
              <Card className='tweets'>
                
              </Card>
            </Grid>
          </Grid>
            <div className='buttons'>
                <Button  className='scrapeButton' variant="contained" color='success' size="small" onClick={()=> scrape(keywords)}>Scrape</Button>
                <Button className='analyzeButton' variant="contained" color='error' size="small" onClick={()=> analyze()}>Analyze</Button>
            </div>
      </>
  )
}

export default Home;