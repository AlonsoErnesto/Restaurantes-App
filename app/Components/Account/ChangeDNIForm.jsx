import React,{useState,useEffect} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {Input,Button,Divider,Label} from 'react-native-elements'

import { firebaseApp } from "../../utils/firebase"
import firebase from "firebase/app"
import "firebase/firestore"


const db = firebase.firestore(firebaseApp);

export default function ChangeDNIForm(props) {

    const { setShowModal } = props
    const [isLoading, setIsLoading] = useState(false)
    const [dni, setDni] = useState("")
    const [error, setError] = useState(null)

    const onSubmit = numero =>{
      if(!dni)
      {
          setError('Complete el campo.')
      }else if(dni.length <= 7)
      {
        setError('Debe de ingresar 8 digitos');
      }else{
        setError('');
        setIsLoading(true)
        const response =  fetch(`https://consulta.api-peru.com/api/dni/${numero}`,
        {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        
        }).then((response) => response.json())

        .then((responseJson) => {
            const dni = responseJson.data.numero;
            const nombre = responseJson.data.nombre_completo;
            const update = {
                phoneNumber : dni,
            }
            const updateNombre = {
                phoneNumber : nombre,
            }
            

        //CREAR COLLECTION INFOUSER 
            

      })
      .catch((error) => {
        setIsLoading(false)
        setError("DNI incorrecto.")
      });
      }
        
    }
    return (
        <View style={styles.view}>
            <Text style={{textAlign:"center",fontSize:22,fontWeight:"bold"}}>DNI</Text>
            <Divider style={{width:"90%",marginTop:10,marginBottom:20}}/>
          
            <Input
                placeholder="DNI"
                containerStyle={styles.input}
                label="Ingrese DNI :"
                labelStyle={{color:'#00a680'}}
                rightIcon = {{
                    type:"material-community",
                    name:"gender-non-binary",
                    color: "#c2c2c2"
                }}
                // defaultValue = {displayName || ""}
                onChange = {(e) => setDni(e.nativeEvent.text)}
                errorMessage = {error}
            />
            <Button
                title="Aceptar"
                containerStyle = {styles.btnContainer}
                buttonStyle = {styles.btn}
                 onPress={() =>onSubmit(dni)}
                //icon animation loading
                 loading={isLoading}
            />  
        </View>
    )
}

const styles = StyleSheet.create({
    view:{
        alignItems: "center",
        paddingTop: 10,
        paddingBottom:10,
    },
    input:{
        marginBottom:10,
    },
    btnContainer:{
        marginTop:20,
        width:"95%"
    },
    btn:{
        backgroundColor: "#00a680"
    }
})
