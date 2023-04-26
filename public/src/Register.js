import { useRef,useEffect,useState} from "react";
import {useNavigate} from "react-router-dom"
import {faCheck,faTimes,faInfoCircle} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import React from 'react'
import axios from './api/axios'
import './Register.css';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register = () => {

    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();

    const [user,setUser] = useState('');
    const [validName,setValidName] = useState(false);
    const [userFocus,setUserFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword,setValidPassword] = useState(false);
    const [passwordFocus,setPasswordFocus] = useState(false);

    const [matchPassword,setMatchPassword] = useState('');
    const [validMatch,setValidMatch] = useState(false);
    const [matchFocus,setMatchFocus] = useState(false);

    const [errMessage, setErrMessage] = useState('');


    useEffect(()=>{
        const result = USER_REGEX.test(user);
        setValidName(result);
    },[user])

    useEffect(()=>{
        const result = PWD_REGEX.test(password);
        setValidPassword(result);
        const match = password === matchPassword;
        setValidMatch(match);
    },[password,matchPassword])

    useEffect(()=>{
        setErrMessage('');
    },[user,password,matchPassword])

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
            const {data} = await axios.post('api/users/register',newUser)
            localStorage.setItem('username',user)
            if (data.status===false){
                console.log('Post Failed')
            }
            navigate("/home")
        }
        catch(err){
        }
    }
    const handleLoginNav = () =>{
        navigate("/login")
    }

  return (
    <Container className="page">
        <h1 className="brew_heading">The Brew Analysis</h1>
            <Container maxWidth="sm"
                className="card"
            >
                <Grid className="section"
                    container
                    justifyContent="space-around"
                >
                    <p ref={errRef} className={errMessage ? "errmessage" :
                    "offscreen"} aria-live ="assertive">{errMessage} </p>
                    <form onSubmit={handleSubmit}>
                        <h1>Register</h1>
                    <Grid item>
                        <label htmlFor="username">
                            Username: 
                            <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
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
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={()=> setUserFocus(true)}
                            onBlur={()=> setUserFocus(false)}
                        />
                        <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>
                    </Grid>
                        <label htmlFor="password">
                            Password: 
                            <FontAwesomeIcon icon={faCheck} className={validPassword ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPassword || !password ? "hide" : "invalid"} />
                        </label>
                    <Grid item>
                        <input
                            type="password"
                            id = "password"
                            className="input"
                            onChange={(e)=> setPassword(e.target.value)}
                            value={password}
                            required
                            aria-invalid={validPassword ? "false" : "true"}
                            aria-describedby="passwordNote"
                            onFocus={()=> setPasswordFocus(true)}
                            onBlur={()=> setPasswordFocus(false)}
                        />
                        <p id="pwdnote" className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                        8 to 24 characters.<br />
                                        Must include uppercase and lowercase letters, a number and a special character.<br />
                                        Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>
                    </Grid>
                    <Grid item>
                        <label htmlFor="confirm_password">
                            Confirm Password: 
                        </label>
                    </Grid>
                    <Grid item>
                        <input
                            type="password"
                            id = "confirm_password"
                            className="input"
                            autoComplete="off"
                            onChange={(e)=> setMatchPassword(e.target.value)}
                            value={matchPassword}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmNote"
                            onFocus={()=> setMatchFocus(true)}
                            onBlur={()=> setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                                Must match the first password input field.
                        </p>
                    </Grid>
                    <Grid item>
                        <button className="signUp" disabled={!validName||!validPassword||!validMatch ? true : false}>Sign Up</button>
                        <p>
                            Already Registered? <button className='loginNav' onClick={handleLoginNav}>Login</button>
                        </p>
                    </Grid>
                    </form>
                </Grid>
            </Container>
    </Container>
  )
}

export default Register
