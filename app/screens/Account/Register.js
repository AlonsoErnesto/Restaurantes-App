import React, {useRef} from 'react';
import { StyleSheet, View, Text,Image } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

//toast
import Toast from 'react-native-easy-toast';

//paquete para el keyboar no tape los inputs
import RegisterForm from '../../Components/Account/RegisterForm'



export default function Register(){

    const toastRef = useRef();
    console.log("")
    return(
        <KeyboardAwareScrollView>
            <Image
            source={require("../../../assets/logo2.jpg")}
            resizeMode="contain"
            style={styles.logo}
            />
            <View  style={styles.viewForm}>
               
                    <RegisterForm 
                     toastRef={toastRef}
                    />
                
            </View>
           <Toast ref={toastRef} position="center" opacity={0.9}/>
        </KeyboardAwareScrollView>
    )
}




const styles = StyleSheet.create({
    logo:{  
        width:"100%",
        height:250,
        marginTop: 20,
    },
    viewForm:{  
        marginRight:40,
        marginLeft:40
    }
})

