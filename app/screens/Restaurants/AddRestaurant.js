import React, {useState, useRef} from "react";
import { StyleSheet, View, Text} from "react-native"
import { Icon } from "react-native-elements";
import Toast from "react-native-easy-toast";
import Loading from "../../Components/Loading"
import AddRestaurantForm from "../../Components/Restaurants/AddRestaurantForm";




export default function AddRestaurant(props){

    const { navigation } = props;
    const [isLoading, setIsLoading] = useState(false)
    const toastRef = useRef();


    return(
        <View>
           <AddRestaurantForm toastRef={toastRef} setIsLoading={setIsLoading} navigation={navigation}/>
           <Toast ref={toastRef} position="center" opacity={0.9} />
           <Loading isVisible={isLoading} text="Creando restaurante..." />
        </View>
    )
}


const styles = StyleSheet.create({})
























