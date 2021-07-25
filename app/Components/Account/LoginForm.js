import React, {useState} from "react";
import {StyleSheet, View, Text } from "react-native"
import { Input, Icon, Button } from "react-native-elements"
import { isEmpty } from "lodash"
import { validateEmail } from "../../utils/validations"
import { useNavigation} from "@react-navigation/native"
import * as firebase from "firebase";
import Loading from "../Loading";



export default function LoginForm(props){


 const {toastRef} = props;   
const [showPassword, setShowPassword] = useState(false);
const [formData, setFormData] = useState(defaultFormValue())
const [loading, setLoading] = useState(false)
const navigation = useNavigation();

const onChange = (e,type) =>{
    // console.log(e.nativeEvent.text);
    // console.log(type);
    setFormData({...formData,[type]:e.nativeEvent.text})
}

const onSubmit = ()=>{
    if(isEmpty(formData.email) || isEmpty(formData.password)){
        toastRef.current.show("Todo los campos son obligatorios")
    }else if(!validateEmail(formData.email)){
        toastRef.current.show("El email o password es incorrecto")

    }else{
        // login function
        setLoading(true);
        firebase.auth()
        .signInWithEmailAndPassword(formData.email, formData.password)
        .then(()=>{
            setLoading(false);
            navigation.navigate("account")
        })
        .catch(()=>{
            setLoading(false);
            toastRef.current.show("Email o password incorrecto")
        })
    }
}

    return (
        <View style={styles.formContainer}> 
            <Input
            placeholder="Correo Electronico"
            containerStyle = {styles.inputForm}
            onChange = {(e)=> onChange(e,"email")}
            rightIcon = {
                <Icon
                    type="material-community"
                    name="at"
                    iconStyle={styles.iconRight}
                    
                />
            }
            />
            <Input
                placeholder="Password"
                containerStyle={styles.inputForm}
                password = {true}
                secureTextEntry={showPassword ? false : true}
                onChange = {(e)=>onChange(e,"password")}
                rightIcon = {
                    <Icon
                    type="material-community"
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    iconStyle={styles.iconRight}
                    onPress={() => setShowPassword(!showPassword)}
                        />
                }
            />

            <Button
                title="Iniciar Sesión"
                containerStyle = {styles.btnContainerLogin}
                buttonStyle={styles.btnLogin}
                onPress={onSubmit}
            />
        <Loading isVisible={loading} text="Iniciando Sesion"/>
        </View>
    )
}
function defaultFormValue(){
    return{
        email:"",
        password:""
    }

}



const styles = StyleSheet.create({
    formContainer: {
        flex:1,
        alignItems:"center",
        justifyContent: "center",
        marginTop: 30
    },
    inputForm:{
        width:"100%",
        marginTop:20
    },
    btnContainerLogin:{
        marginTop:20,
        width:"95%"
    },
    btnLogin:{
        backgroundColor: "#00a680"
    },
    iconRight:{
        color:"#c1c1c1"
    }
})




















