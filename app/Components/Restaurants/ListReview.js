import React, {useState, useEffect, useCallback} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {Button, Avatar, Rating} from "react-native-elements"
import { useFocusEffect } from "@react-navigation/native"
import {map} from "lodash";

//base
import {firebaseApp} from "../../utils/firebase"
import firebase from "firebase/app";
import "firebase/firestore";


const db = firebase.firestore(firebaseApp);


export default function ListReview(props) {


    const { navigation, idRestaurant, setRating } = props;
    const [userLogged, setUserLogged] = useState(false);
    const [reviews, setReviews] = useState([])

    // console.log(reviews);

    firebase.auth().onAuthStateChanged((user)=>{
        user ? setUserLogged(true) : setUserLogged(false);
    })

    
    useEffect(() => {
        
       
            db.collection("reviews")
            .where("idRestaurant","==" , idRestaurant )
            .get()
            .then((res)=>{
    
                const resultReview = [];
                res.forEach((doc) => {
                    const data = doc.data();
                    data.id = doc.id;
                    resultReview.push(data)
                });
                setReviews(resultReview);
            })
        
       
    }, [reviews])

   
    
    return (
        <View> 
            {userLogged ? (
                <Button
                    buttonStyle={styles.btnAddReview}
                    titleStyle = {styles.btnTitleAddReview}
                    title="Escribe una opinion"
                    icon={{
                        type:"material-community",
                        name:"square-edit-outline",
                        color:"#3494e6"
                    }}
                    onPress={()=> navigation.navigate("add-review-restaurant",{
                        idRestaurant : idRestaurant,
                    })}
                />
            ):(
                <View>
                    <Text 
                        style={{textAlign:"center", color:"#00a680", padding:20}}  
                        onPress={() => navigation.navigate("login") }
                        >
                            Para escribir un comentario, es necesario estar registrado. {" "}
                            <Text style={{fontWeight:"bold"}}>Inicia Sesion</Text>
                            </Text>
                </View>
            )}

                {map(reviews, (review, index)=>(
                    <Review
                        key = {index}
                        review = {review}
                    />
                ))}

        </View>
    )
}

function Review(props){
    
    const { title, review, rating, createAt, avatarUser,nameUser } = props.review;
    const createReview = new Date(createAt.seconds * 1000);


    // console.log(props);
    return(
        <View style={styles.viewReview}>
            <View style={ styles.viewImageAvatar} >
                <Avatar
                    size="large"
                    rounded
                    containerStyle={styles.imageAvatarUser}
                    source = {avatarUser ? { uri:avatarUser } : require("../../../assets/avatar.jpg")}
                />
            </View>
            <View style={styles.viewInfo}>
                <Text style={styles.reviewTitle} >{nameUser}</Text>
                <Text style={styles.reviewDescription} >{title} - {review}</Text>
                <Rating
                    imageSize = {15}
                    startingValue={rating}
                    readonly
                />
                <Text style={styles.reviewHour}>
                  {createReview.getHours()}:
                     {createReview.getMinutes() < 10 ? "0" : ""} 
                     {createReview.getMinutes()}
                </Text>
                <Text style={styles.reviewData}>
                     {createReview.getDate()}/ 
                     {createReview.getMonth() + 1}/{createReview.getFullYear()} 
                    
                 </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    btnAddReview:{
        backgroundColor: "transparent"
    },
    btnTitleAddReview:{
        color:"#3494e6"
    },
    viewReview:{
        flexDirection:"row",
        padding:10,
        paddingBottom:20,
        borderBottomColor: "#e3e3e3",
        borderBottomWidth:1
    },
    viewImageAvatar:{
        marginRight:15
    },
    imageAvatarUser:{
        width:50,
        height:50
    },
    viewInfo:{  
        flex:1,
        alignItems:"flex-start"
    },
    reviewTitle:{
        fontWeight:"bold",

    },
    reviewDescription:{
        paddingTop:2,
        color:"grey",
        marginBottom:5
    },reviewData:{
        marginTop:5,
        color:"grey",
        fontSize:12,
        position:"absolute",
        right:0,
        bottom:0
    },
    reviewHour:{
        marginTop:5,
        color:"grey",
        fontSize:12,
        position:"absolute",
        right:0,
        bottom:15
    }
})
