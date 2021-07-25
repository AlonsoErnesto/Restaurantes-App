import React, {useRef} from 'react';
import {StyleSheet, View, ScrollView, Text, Image} from 'react-native';
import {Divider} from 'react-native-elements'
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-easy-toast"
import LoginForm from '../../Components/Account/LoginForm'
import LoginFacebook from "../../Components/Account/LoginFacebook";


export default function Login(){

    const toastRef = useRef();

    return(
        <ScrollView>
            <Image 
            source={require("../../../assets/logo2.jpg")}
            resizeMode="contain"
            style={styles.logo}
            />
            
            <View style={styles.viewContainer}>
            <Text style={styles.title}>RestaurantApp</Text>
                <LoginForm toastRef = {toastRef}/>
               <CreateAccount/>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.viewContainer}>
            <LoginFacebook toastRef={toastRef} />
            </View>
            <Toast  ref={toastRef} position="center" opacity ={0.9}/>
        </ScrollView>
    )
}


function CreateAccount(){

    const navigation =  useNavigation();


    return (
        <Text style={styles.textRegister}>
            Aun no tienes una cuenta? {" "}
            {/* entre las llaves es un espacio */}
            <Text onPress={()=>navigation.navigate("register")} style={styles.btnRegister}>Registrate</Text>
        </Text>
    )
}

const styles = StyleSheet.create({

    logo:{
        width:"100%",
        height:150,
        marginTop:20,
    },
    viewContainer:{
        
        marginRight:40,
        marginLeft:40,

    },
    textRegister:{
        textAlign:"center",
        marginTop:15,
        marginLeft:10,
        marginRight:10
    },
    btnRegister:{
        color:"#00a680",
        
        fontWeight:"bold"

    },
    divider:{
        backgroundColor: "#00a680",
        margin:25,
    },
    title:{
        marginTop:30,
        fontSize:48,
        fontFamily: "Cochin",
        textAlign:"center"
    }


})


















