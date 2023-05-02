import axios from 'axios';

export default axios.create({
    baseURL: 'https://tweetsentimentsandvisualization-production.up.railway.app/'
});