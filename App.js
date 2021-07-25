import React, {useEffect} from 'react';
import { YellowBox } from 'react-native'
import Navigation from "./app/navigations/Navigation"
import { firebaseApp } from './app/utils/firebase'
import * as firebase from "firebase";


//error build con firebase y react-native
import {decode, encode} from "base-64"


YellowBox.ignoreWarnings(["Setting a timer", "Possible Unhandled","It appears","YellowBox","Animated","Can't perform", "Cannot update"])

if(!global.btoa) global.btoa = encode;
if(!global.atob) global.atob = decode;


export default function App() {

  //Comprabacion de conexion a FireB
  // en caso de que estemos logeados retornara el usuario caso contrario no
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user)=>{
      console.log(user);
    });
    
  }, [])



  return <Navigation/>;
}

