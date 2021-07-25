import React,{useState,useEffect,useCallback} from 'react'
import { StyleSheet, Text, View,FlatList } from 'react-native'

import { useFocusEffect } from '@react-navigation/native';
import {FireSQL} from 'firesql'
import { ListItem, Icon,Divider} from 'react-native-elements'
import firebase from 'firebase/app';
import { useNavigation } from "@react-navigation/native";

const fireSQL = new FireSQL(firebase.firestore(), {includeId:"id"})

export default function ChangeMyRestaurants(props) {

    const {setShowModal} = props;
        const navigation =  useNavigation();
    // const idUser = firebase.auth().currentUser.uid;
    const userId = firebase.auth().currentUser.uid;
   
    const [misRestaurantes, setMisRestaurantes] = useState([])

        console.log(misRestaurantes)

  

    useFocusEffect(
        useCallback(()=>{
            
        fireSQL.query(`SELECT * FROM restaurants WHERE createBy = '${userId}'`)
        .then((res)=>{
            console.log(res)
            setMisRestaurantes(res);
        }).catch((err)=>{
            // console.log(err)
        })
    },[misRestaurantes]))

    return (
        <View>
            <Text style={{fontWeight:"bold",textAlign:"center",fontSize:22}}>Mis restaurantes</Text>
            <Divider style={{marginTop:10,marginBottom:10,backgroundColor:"#3494e6"}}/>
            {misRestaurantes.length === 0 ? (
                <Text style={{textAlign:"center",marginTop:10}}>Sin restaurantes</Text>
            ):(
                <FlatList
                    data = {misRestaurantes}
                    renderItem={(restaurant)=> <Restaurant restaurant={restaurant} 
                     navigation={navigation} setShowModal={setShowModal}
                    />}
                    keyExtractor = {(item,index)=> index.toString()}
                
                />
            )}
        </View>
    )
}


function Restaurant(props)
{
    const { navigation, restaurant,setShowModal} = props;
    const { name, id, images } = restaurant.item

    const renderItem = () => {
        setShowModal(false)
        navigation.navigate("restaurants", {screen:"restaurant", params:{id, name} })
    }

    return(
        <ListItem
            title={name}
            leftAvatar={{
                source:images[0] ? {uri:images[0]} : require("../../../assets/avatar.jpg")
            }}
            rightIcon = {<Icon type="material-community" name="chevron-right" />}
            onPress={renderItem}
        />
    )
}

const styles = StyleSheet.create({})
