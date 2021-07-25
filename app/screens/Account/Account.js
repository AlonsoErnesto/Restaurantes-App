import React, { useState,useEffect } from 'react';

//impor firebase
import * as firebase from "firebase";
//import el componente usuario logueado y usuario no logeado
import UserGuest from "./UserGuest";
import UserLogged from "./UserLogged"
import Loading from "../../Components/Loading"


export default function Account (){  
    
    const [ login, setLogin ] = useState(null);

    useEffect(()=>{
        firebase.auth().onAuthStateChanged((user)=>{
            
            !user ? setLogin(false) : setLogin(true);

        })
    },[])

   if(login===null)return <Loading isVisible={true} text="Cargando..." />

    //return login ? <UserGuest/> :  <UserLogged/>;
    return login ? <UserLogged/> :  <UserGuest/>;
}




