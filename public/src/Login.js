import { useRef,useEffect,useState} from "react";
import {useNavigate} from "react-router-dom"
import React from 'react'
import axios from './api/axios'
import './Register.css';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

const Login = () => {

    const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();

    const [user,setUser] = useState('');
    const [validName,setValidName] = useState(false);
    const [userFocus,setUserFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword,setValidPassword] = useState(false);
    const [passwordFocus,setPasswordFocus] = useState(false);

    const [errMessage, setErrMessage] = useState('');


    useEffect(()=>{
        const result = USER_REGEX.test(user);
        setValidName(result);
    },[user])

    useEffect(()=>{
        const result = PWD_REGEX.test(password);
        setValidPassword(result);
    },[password])

    useEffect(()=>{
        setErrMessage('');
    },[user,password])

    const handleSubmit= async(e)=>{
        e.preventDefault();
        const u = USER_REGEX.test(user);
        const p = PWD_REGEX.test(password);
        if(!u||!p){
            setErrMessage("Invalid Entry")
            return;
        }
        const newUser = {
            username: user,
            password: password
        }
        try{
            const {data} = await axios.post('api/users/login',newUser)
            localStorage.setItem('username',user)
            if (data.status===false){
                console.log('Post Failed')
            }
            navigate("/home")
        }
        catch(err){
        }
    }

  return (
    <Container className="page">
        <h1 className="brew_heading">The Brew Analysis</h1>
            <Container maxWidth="sm"
                className="card"
                // container
                // direction="row"
                // justifyContent="space-between"
            >
                <Grid className="section"
                    container
                    justifyContent="space-around"
                >
                <form onSubmit={handleSubmit}>
                        <h1>Login</h1>
                    <Grid item>
                        <label htmlFor="username">
                            Username: 
                        </label>
                    </Grid>
                    <Grid item>
                        <input
                            type="text"
                            id = "username"
                            className="input"
                            ref = {userRef}
                            autoComplete="off"
                            onChange={(e)=> setUser(e.target.value)}
                            required
                            onFocus={()=> setUserFocus(true)}
                            onBlur={()=> setUserFocus(false)}
                        />
                    </Grid>
                        <label htmlFor="password">
                            Password: 
                        </label>
                    <Grid item>
                        <input
                            type="password"
                            id = "password"
                            className="input"
                            onChange={(e)=> setPassword(e.target.value)}
                            value={password}
                            required
                            onFocus={()=> setPasswordFocus(true)}
                            onBlur={()=> setPasswordFocus(false)}
                        />
                    </Grid>
                    <Grid item>
                        <button className="signUp" disabled={!validName||!validPassword ? true : false}>Sign in</button>
                        <p>
                            Don't have an account yet?
                                Register
                                {/* router goes here */}
                        </p>
                    </Grid>
                    </form>
                </Grid>
            </Container>
    </Container>
  )
}

export default Login