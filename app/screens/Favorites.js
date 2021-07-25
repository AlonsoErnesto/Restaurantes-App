import React, {useState, useRef, useCallback} from 'react';
import {StyleSheet, View,Text, FlatList, ActivityIndicator, TouchableOpacity, Alert} from "react-native";
import { Image, Icon, Button }   from "react-native-elements";
import { useFocusEffect} from "@react-navigation/native";
import Loading from '../Components/Loading';
import {size} from "lodash"
import Toast from "react-native-easy-toast"
//DB
import {firebaseApp} from "../utils/firebase";
import firebase from "firebase";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function Favorites (props){

    const { navigation } = props;
    
    const [restaurants, setRestaurants] = useState(null);
    const [userLogged, setUserLogged] = useState(false);
    const [isLoading, setisLoading] = useState(false);
    const [reloadData, setReloadData] = useState(false);
    const toastRef = useRef()

    console.log(restaurants);

    firebase.auth().onAuthStateChanged((user)=>{
        user ? setUserLogged(true) : setUserLogged(false);

    })

    useFocusEffect(
        useCallback(()=>{
            if(userLogged)
            {
                const idUser = firebase.auth().currentUser.uid;
                db.collection("favorites")
                .where("idUser","==",idUser)
                .get()
                .then((res)=>{
                    const idRestaurantsArray = [];
                    res.forEach((doc) => {
                    idRestaurantsArray.push(doc.data().idRestaurant)
                });

                getDataRestaurants(idRestaurantsArray).then((res)=>{
                    const restaurants = [];
                    res.forEach((doc)=>{
                        const restaurant = doc.data();
                        restaurant.id = doc.id;
                        restaurants.push(restaurant)
                    })
                    setRestaurants(restaurants)
                })
              })
            }
            setReloadData(false);
        },[ userLogged, reloadData ])
    )

       


        const getDataRestaurants =(idRestaurantsArray) =>{
            const arrayRestaurants = [];
            idRestaurantsArray.forEach((idRestaurant)=>{
                const result = db.collection("restaurants").doc(idRestaurant).get();
                arrayRestaurants.push(result);
            })
            return Promise.all(arrayRestaurants)
        }

        if(!userLogged)
        {
            return <UserNotLogged navigation={navigation}/>
        }

        if(!restaurants){  
            return <Loading isVisible={true} text="Cargando restaurantes favoritos..." />
        }else if(restaurants?.length === 0)
        {
            return <NotFoundRestaurants/>;
        }


    return( 
        <View style={styles.viewBodydy}>
            {restaurants ? (
                <FlatList
                    data={restaurants}
                    renderItem={(restaurant)=>
                        <Restaurant 
                        toastRef={toastRef} 
                            restaurant={restaurant} 
                            setisLoading={setisLoading}
                            setReloadData={setReloadData}
                            navigation={navigation}
                            />
                    }

                    keyExtractor = {(item, index)=> index.toString()}
                />
            ):(
                <View style={styles.loaderRestaurants}>
                    <ActivityIndicator size="large" />
                    <Text style={{textAlign:"center"}}>Cargndo restaurantes</Text>
                </View>
            )}
            <Toast ref = {toastRef} position ="center" opacity={0.9}/>
            <Loading  text="Restaurante Eliminado" isVisible={isLoading}/>
        </View>
    )
}

function NotFoundRestaurants()
{
    return(
        <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
            <Icon type="material-community" name="alert-outline" size={50} />
            <Text style={{fontSize:20, textAlign:"center"}}> 
                No tienes restaurantes agregados como favoritos.
            </Text>
        </View>
    )
}




function UserNotLogged(props){

    const {navigation} = props;

    return(
        <View style={{flex:1, alignItems:"center", justifyContent: "center"}}>
            <Icon
                type="material-community"
                name="alert-outline"
                size={50}
            />
            <Text style={{fontSize:20,fontWeight:"bold", textAlign:"center"}}>
                Necesitas estar Logeado para ver esta seccion.
            </Text>
            <Button  
                title="Login"
                containerStyle={{marginTop:20, width:"80%"}}
                buttonStyle={{backgroundColor:"#00a680"}}
                onPress={()=> navigation.navigate("login") }
            />
        </View>
    )

}


function Restaurant(props){

    const { restaurant, toastRef,setisLoading,setReloadData, navigation } = props;
    const { id, name, images } = restaurant.item;

    const confirmRemoveFavorite = () => {
        
        Alert.alert(
            "Eliminar Restaurante de favorito", 
            "Estas seguro de que quieres eleminar este restaurante favorito?",
            [
                {
                    text:"Cancelar",
                    style:"cancel"
                },
                {
                    text:"Eliminar",
                    onPress:RemoveFavorite
                }
            ],
            {cancelable:false}
        )
    }

    const RemoveFavorite = () =>
        {
            setisLoading(true);
            db.collection("favorites")
            .where("idRestaurant","==", id)
            .where("idUser","==", firebase.auth().currentUser.uid)
            .get()
            .then((res)=>{
                res.forEach((doc)=>{
                    const idFavorite = doc.id;
                    console.log('fase2')
                    db.collection("favorites")
                    .doc(idFavorite)
                    .delete()
                    .then(()=>{
                        setisLoading(false);
                        setReloadData(true);
                        toastRef.current.show("Restaurante eliminado de favoritos..")
                    }).catch(()=>{
                        setisLoading(false)
                        toastRef.current.show("Intentelo mas tarde");
                    })
                })
            })

        }

    return(  
        <View style = {styles.restaurant}>
            {/* navigation necesita el id para renderizar el screen seleccionado */}
            <TouchableOpacity onPress={()=> navigation.navigate("restaurants",{screen:"restaurant", params: {id:id}}) }>
                <Image 
                    resizeMode = "cover"
                    style={styles.image}
                    PlaceholderContent = {<ActivityIndicator color="#fff" />}
                    source= { 
                        images[0]
                        ? {uri:images[0]} : require("../../assets/avatar.jpg")
                     }
                />
                <View style={styles.info}>
                    <Text style={styles.name}>{name}</Text>
                    <Icon 
                        type="material-community" 
                        name="heart" 
                        color="#f00" 
                        containerStyle={styles.favorite} 
                        onPress={confirmRemoveFavorite}
                        underlayColor="transparent"

                        />
                </View>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    viewBodydy:{
        flex:1,
        backgroundColor: "#f2f2f2"
    },
    loaderRestaurants:{
        marginTop:10,
        marginBottom:10
    },
    restaurant:{
        margin:10
    },
    image:
    {  
        width:"100%",
        height:180

    },
    info:{
        flex:1,
        alignItems:"center",
        justifyContent: "space-between",
        flexDirection:"row",
        paddingLeft:20,
        paddingRight:20,
        paddingTop:10,
        paddingBottom:10,
        marginTop:-30,
        backgroundColor:"#fff"
    },
    name:{
        fontWeight:"bold",
        fontSize:30
    },
    favorite:{
        marginTop:-35,
        backgroundColor: "#fff",
        padding:15,
        borderRadius: 100
    }
    
})






