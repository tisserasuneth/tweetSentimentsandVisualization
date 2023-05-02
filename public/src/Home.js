import React from 'react'
import './home.css'
import axios from './api/axios';
import Plot from 'react-plotly.js'
import {useRef,useState,useEffect} from "react"
import {useNavigate} from "react-router-dom"
import Nav from 'react-bootstrap/Nav'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { Table, TableHead, TableBody, TableRow, TableCell, Tab, Tabs } from '@mui/material';
import Select from "@mui/material/Select";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ReactMapGL, { Marker } from "react-map-gl";
import mapboxgl from 'mapbox-gl';
import RoomIcon from '@mui/icons-material/Room';
import ghost from '../../public/src/ghost.gif'
import loader from '../../public/src/loader.gif'
import flip from '../../public/src/flip.gif'

function Home() {
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_URL
  const userRef = useRef();
  const [keywords,setKeywords] = useState('');
  const [start,setStart] = useState('');
  const [end,setEnd] = useState('');
  let [data, setData] = useState([30,70]);
  const [tweets, setTweets] = useState([]);
  const [latitudes, setLatitudes] = useState([]);
  const [longitudes, setLongitudes] = useState([]);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [keyword, setKeyword] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTweets, setIsTweets] = useState(false);
  const [CSVName, setCSVName] = useState('budlight.csv');

  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("username")

  let recieved= ''
  let df =''
  let rawData = ''

  const [viewport, setViewport] = useState({
    width: "100%",
    height: "500px",
    latitude: 40,
    longitude: -74.5,
    zoom: 7,
  });

  
  useEffect(()=>{
    if(!isAuthenticated){
      navigate('/')
    }
  },[])

  const handleTabChange = (e, tabIndex) => {
    setCurrentTabIndex(tabIndex);
  }

  const handleLogOut = ()=>{
    localStorage.removeItem("username")
    window.location.reload(false);
  }
  const handleCSVName = (e) => {
    setCSVName(e.target.value)
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
    setIsLoading(true);
    console.log(CSVName)
    // axios.get('/api/sentiment/analyze', {
    //   params:{
    //     file:CSVName
    //   }
    // })
    console.log('yes')
    .then(response=>{
      // let recieved = response.data;
      // let positive = recieved["POSITIVE"];
      // let negative = recieved["NEGATIVE"];
      // setLatitudes(recieved["latitude"]);
      // setLongitudes(recieved["longitude"]);
      // readCSV();
      // setData([(negative/(positive+negative))*100,(positive/(positive+negative))*100]);
      // setIsTweets(true);
      // setKeyword(CSVName)
      // setCSVName('budlight.csv')
      console.log('okay')
      setIsLoading(false);
    })
    .catch(error => console.log(error));
  }
  const readCSV = () => {
    axios.get('/api/read/csv',{
      params:{
        file: CSVName
      }
    })
    .then(response=>{
      rawData = response.data
      rawData = rawData.split('\n')
      setTweets(rawData)
    })
    .catch(error => console.log(error));
  }

  return (
      <>
        {isLoading ? (
          <div className='loaderContainer'>
            <div className='loader'>
              <img src={ghost} alt='loader'/>
              <h2>Good things come to those who wait</h2>
              <h3>Your tweets are being analyzed!</h3>
              <img src={loader} alt='loader'/>
            </div> 
         </div>
        ) : (
        <>
          <Grid 
            container
            direction="row"
            className='top'
            justifyContent="space-between"
            alignItems="center"  
          >
            <h1 className='heading'>The Brew Analysis</h1>
            <Button className="logout" variant="contained" color='error' size="small" onClick={handleLogOut}>Logout</Button>
            <Nav className='line'>
          </Nav>

            <ReactMapGL
              className='map'
              {...viewport}
              mapboxApiAccessToken = {process.env.REACT_APP_MAPBOX_URL}
              onMove={evt => setViewport(evt.Viewport)}
              mapStyle='mapbox://styles/mapbox/streets-v12'
            >
              <div className='mapDiv'></div>
              {Array.from({length: latitudes.length-1}, (_, i) => (
                     <Marker longitude={longitudes[i]} latitude={latitudes[i]} offsetLeft={-20} offsetTop={-10}>
                     <RoomIcon className='RoomIcon'/>
                   </Marker>
              ))}
            </ReactMapGL>
            <p className='count'>Sentiment Count: {latitudes.length}</p>
          </Grid>
          <Grid className='plots'
              container
              direction="row"
              justifyContent="space-around"
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
        </Grid>   
        <Grid 
          className='sentiment'
          container
          direction="row"
          alignItems="left" 
        >
          <Grid item>
            <Tabs value={currentTabIndex} onChange={handleTabChange}>
              <Tab label='Scrape' />
              <Tab label='Existing Data' />
            </Tabs>
            {currentTabIndex === 0 && (
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
            )}
            {currentTabIndex === 1 && (
              <form className='form'>
                <label htmlFor="keywords">
                    <h3>Select Keyword</h3>
                    <p>Try out with existing data</p>
                    <p>Use dropdown menu below to select file</p>
                  </label>
                  <FormControl>
                    <Select className='selector' onChange={handleCSVName} defaultValue='budlight.csv'>
                      <MenuItem value="budlight.csv">Budlight</MenuItem>
                      <MenuItem value="coors.csv">Coors</MenuItem>
                      <MenuItem value="yuengling.csv">Yuengling</MenuItem>
                    </Select>
                  </FormControl>

              </form>
            )}
            <div className='buttons'>
                <Button  className='scrapeButton' variant="contained" color='success' size="small" onClick={()=> scrape(keywords)}>Scrape</Button>
                <Button className='analyzeButton' variant="contained" color='error' size="small" onClick={()=> analyze()}>Analyze</Button>
            </div>
            </Grid>
             
            <Grid item>
              <Card className='tweets'>
              {isTweets ? (
                   <Table className='table'>
                   <TableHead>
                     <TableRow>
                       <TableCell>
                        <h2>Tweets: {keyword}</h2>
                       </TableCell>
                     </TableRow>
                   </TableHead>
                   <TableBody>
                     {Array.from({length: tweets.length-1}, (_, i) => (
                       <TableRow key={i}>
                         <TableCell>{tweets[i]}</TableCell>
                       </TableRow>
                     ))}
                 </TableBody>
                 </Table>
              ) : (
                <div className='layerContainer'> 
                  <div className='layer'> 
                    <img src={flip} className='flip'/> 
                    <h2 className='layerText'>Click Analyze to display tweets</h2>
                  </div>
                </div>
              )}
              </Card>
            </Grid>
          </Grid>
          </>
        )}
      </>
  )
}
export default Home;