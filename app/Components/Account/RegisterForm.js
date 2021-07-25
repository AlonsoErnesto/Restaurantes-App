import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import { Input, Icon, Button } from 'react-native-elements'
//lodash
import {size,isEmpty} from 'lodash';

import { validateEmail } from "../../utils/validations"
import Loading from '../Loading';

import * as firebase from "firebase";
import { useNavigation } from '@react-navigation/native'

export default function RegisterForm(props){
    // los toats necesitan hobligatorio los props
   const { toastRef } = props

    const [ showPassword,setshowPassword ] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false)
    const [formData, setFormData] = useState(defaultFormValue())
    const [loading, setLoading] = useState(false)
    const navigation= useNavigation();


   const onSubmit = () =>{

    if(isEmpty(formData.email) || isEmpty(formData.password) || isEmpty(formData.repeatPassword))
        {
            toastRef.current.show("Todos los campos son obligatorios")

        }else if( !validateEmail(formData.email) ){
           toastRef.current.show("El email es incorrecto")  
        }else if(formData.password !== formData.repeatPassword)
        {
            toastRef.current.show("Password no coinciden");
        }else if(size(formData.password) < 6){
            toastRef.current.show("Password debe de tener mas de 6 caracteres")
        }else {
            setLoading(true);
            firebase
            .auth()
            .createUserWithEmailAndPassword(formData.email, formData.password)
            .then(res =>{
                setLoading(false);
                navigation.navigate("account");
            }).catch(err => {
                setLoading(false);
                toastRef.current.show("El E-mail ya esta en uso")
            })
        }
    }

   const onChange = (e , type) => {
    //    FUNCION PARA RECIBIR DATOS DE LOS INPUTS
        // console.log(type)
        // console.log(e.nativeEvent)
        // setFormData({[type]:e.nativeEvent})
        setFormData({...formData, [type]:e.nativeEvent.text}) //todos los datos recevidos
   }

    return(
        <View style={styles.container}>
            <Input
            placeholder="Correo Electronico"
            containerStyle={styles.inputForm}
            // POR CADA INPUT EL ONCHANGE RECOGE LOS DATOS 
            onChange={(e)=>onChange(e,"email")}
            rightIcon={
                <Icon type="material-community" name="at" iconStyle={styles.iconRight} />
            }
            />
            <Input
            placeholder="Password"
            containerStyle={styles.inputForm}
            onChange={(e)=>onChange(e,"password")}
            // type password 
            password={true}
            secureTextEntry = {showPassword ? false : true}
            rightIcon = {
                <Icon type="material-community" name={showPassword ? "eye-outline" : "eye-off-outline"} iconStyle={styles.iconRight} onPress={()=>setshowPassword(!showPassword)} />
            }
            />
            <Input
            placeholder="Repetir password"
            containerStyle={styles.inputForm}
            onChange={(e)=>onChange(e,"repeatPassword")}
            password={true}
            secureTextEntry = {showRepeatPassword ? false : true}
            rightIcon = {
                <Icon type="material-community" name={showRepeatPassword ? "eye-outline" : "eye-off-outline"} iconStyle={styles.iconRight} onPress={()=>setShowRepeatPassword(!showRepeatPassword)} />
            } 
            />
            <Button
                title="Unirse"
                containerStyle={styles.btnContainerRegister}
                buttonStyle={styles.btnRegister}
                onPress={onSubmit}
            />
            <Loading
                isVisible={loading} 
                text="Creando cuenta"
            />
        </View>
    )
}


function defaultFormValue(){
    return {  
        email:"",
        password:"",
        repeatPassword:"",
    }
}




const styles = StyleSheet.create({
    
    container:{
        // flex:1,
        // alignItems:"center",
        // justifyContent: "center",
        marginTop:30,
    },
    inputForm:{  
        width:"100%",
        marginTop:20,
    },
    btnContainerRegister:{  
        marginTop:20,
        width:"95%"
    },
    btnRegister:{
        backgroundColor: "#00a680",

    },
    iconRight:{
        color: "#c1c1c1"
    }

})