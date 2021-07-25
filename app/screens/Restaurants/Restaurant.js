import React, { useState , useEffect, useCallback, useRef} from 'react';
import {useFocusEffect} from "@react-navigation/native"
import { StyleSheet, Text, View, ScrollView, Dimensions,Alert } from 'react-native';
import Loading from "../../Components/Loading"
import CarouselImages from "../../Components/CarouselImages"
import { Rating , ListItem, Icon,Button} from "react-native-elements"
import Toast from "react-native-easy-toast"
//base de Datos 
import {firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import Map from "../../Components/Map"
import {map}from "lodash";
import ListReview from '../../Components/Restaurants/ListReview';


const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get("window").width;


export default function Restaurant(props) {

    const { navigation, route } = props;
    const { id, name} = route.params;
    // console.log("restaurant ID: ",route)
    const [restaurant, setRestaurant] = useState(null)
    
    const [rating, setRating] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false);
    const [userLogged, setUserLogged] = useState(false);
  
    const toastRef = useRef();


    navigation.setOptions({title:name})

    firebase.auth().onAuthStateChanged((user)=>{
        user ? setUserLogged(true) : setUserLogged(false);

    })

    useFocusEffect(
        useCallback(() => {
            db.collection("restaurants")
            .doc(id)
            .get()
            .then((res)=>{
                const data = res.data();
                data.id = res.id;
                setRestaurant(data);
                setRating(data.rating)
            })
    
        }, [])
    )

       


    const addFavorite = () =>{
        if(!userLogged)
        {
            toastRef.current.show("Necesitas estar logeado para usar esta funcion.")
        }else {
            const payload = {
                idUser: firebase.auth().currentUser.uid,
                idRestaurant : restaurant.id
            }
            db.collection("favorites")
            .add(payload)
            .then(()=>{
                setIsFavorite(true);
                toastRef.current.show("Restaurante agregado a favoritos.")
            })
            .catch(()=>{
                toastRef.current.show("Intentalo mas tarde.")
            })
        }
    }

    useEffect(() => {
        if(userLogged && restaurant)
        {
            //query post 
            db.collection("favorites")
            .where("idRestaurant", "==", restaurant.id)
            .where("idUser","==",firebase.auth().currentUser.uid)
            .get()
            .then((res)=>{
                if(res.docs.length === 1)
                {
                    setIsFavorite(true);
                }
            })
        }
   },[userLogged, restaurant]) 

    const removeFavorite = () =>{
        db.collection("favorites")
            .where("idRestaurant", "==", restaurant.id)
            .where("idUser","==",firebase.auth().currentUser.uid)
            .get()
            .then((res)=>{
                console.log(res)
                res.forEach((doc) => {
                    const idFavorite = doc.id;
                    
                    db.collection("favorites")
                        .doc(idFavorite)
                        .delete()
                        .then(()=>{
                            setIsFavorite(false);
                            toastRef.current.show("Restaurante removido de favoritos.")
                        })
                        .catch(()=>{
                            toastRef.current.show("Intentelo mas tarde.")
                        })
                });
            })
    }

    if(!restaurant) return <Loading isVisible={true} text="Cargando Restaurante"/>

    return (
        <ScrollView vertical style={styles.viewBody}>

            <View style={styles.viewFavorite}>
                    <Icon
                        type="material-community"
                        name={isFavorite ? "heart" : "heart-outline"}
                        onPress={isFavorite ? removeFavorite : addFavorite }
                        size={35}
                        color={isFavorite ? "#f00" : "#000"}
                        underlayColor="transparent"
                    />
            </View>

            <CarouselImages
                arrayImages = {restaurant.images}
                height={250}
                width = {screenWidth}
            />
            <TitleRestaurant
                name={restaurant.name}
                description={restaurant.description}
                telefono = {restaurant.telefono}
                tipo={restaurant.tipo}
                horario={restaurant.horario}
                rating={rating}
                userLogged={userLogged}
                createBy={restaurant.createBy}
                id={restaurant.id}
                restaurant = {restaurant}
                navigation={navigation}
            
            />
            <RestaurantInfo
                    location = {restaurant.location}
                    name = {restaurant.name}
                    address={restaurant.address}
                   
                /> 
               

                <ListReview 
                navigation = {navigation}
                idRestaurant = {restaurant.id}
                setRating={setRating} 
                />

               
            <Toast ref={toastRef} position="center" opacity={0.9} />


        </ScrollView>
    )
}

function TitleRestaurant(props){

    const { navigation,name, description, rating,telefono, tipo,horario,createBy,userLogged,id,restaurant  } = props;
    

    return(
        <View style={styles.viewRestaurantTitle}>
            <View style={{flexDirection:"row"}}>
                <Text style={styles.tipoRestaurant} >{tipo} </Text>
                <Text style={styles.numberRestaurat} >+51 {telefono}</Text>  
            </View>
            <Rating

                    imageSize = {30}
                    style={styles.rating}
                    readonly
                    //startingValue = {3.4}
                    startingValue = {parseFloat(rating)}
                />
                 <Text style={styles.nameRestaurant}>- {name} -</Text>
                 { userLogged===true ? (<MyRestaurant createBy={createBy} id={id} navigation={navigation} restaurant={restaurant} />) : (<Text></Text>)}
            <Text style= {styles.restaurantInfoTitle}>
                    Descripción del restaurante
                </Text>
            <Text style={styles.descriptionRestaurant}>
                {description}
            </Text>
            <Text style={styles.horario}>
                {horario}
            </Text>
           
        </View>
    )

}



function MyRestaurant(props){
    const {createBy,id,restaurant,navigation}= props;
    const [loading, setLoading] = useState(false)

    const Eliminar=()=>{
     setLoading(true)
        db.collection("restaurants")
        .doc(id)
        .delete()
        .then(()=>{
            navigation.navigate("restaurants")
            toastRef.current.show("Eliminando restaurante.")
            setLoading(false)
        })
        .catch(()=>{
            toastRef.current.show("Intentelo mas tarde.")
            navigation.navigate("restaurants")
            setLoading(false)
        })                 
}

    const EliminarRestaurant = () =>{
    Alert.alert(
        "Eliminar Restaurante",
        "Estas seguro de que quieres eliminar el Restaurante permanentemente?",
        [
            {
                text:"Cancelar",
                style:"cancel"
            },
            {
                text:"Eliminar",
                onPress: Eliminar
                
            }
        ],
        {cancelable: false}
    )   
    }

    const Modificar = () =>{
        navigation.navigate('update-restaurant',{restaurant})
    }


    if(loading) return <Loading isVisible={true} text="Eliminando Restaurante"/>
     if(createBy === firebase.auth().currentUser.uid)  
        {
            return (<View style={{flexDirection:"row"}}>
                <Button
                    title="Modificar"
                    containerStyle = {styles.btnContainer}
                    buttonStyle={styles.btn}
                    onPress={Modificar}
                />
                <Button
                    title="Eliminar Restaurant"
                    containerStyle = {styles.btnContainerEliminar}
                    buttonStyle={styles.btnEliminar}
                    onPress={ EliminarRestaurant}
                />
            </View>)
            
        }
        else {return (<View></View>)}
    
}

function RestaurantInfo(props)
    {
        const { location, name, address } = props;

        const listInfo = 
        [
            {
                text:address,
                iconName:"map-marker",
                iconType:"material-community",
                action:null,
            },
        ]


        return (
            <View style={styles.viewRestaurantInfo}>
                
                <Map location={location} name={name} height={100}/>
                {map(listInfo, (item, index)=> (  

                    <ListItem
                        key = {index}
                        title= { item.text }
                        leftIcon = {{
                            name:item.iconName,
                            type: item.iconType,
                            color:"#3494e6"
                        }}
                        containerStyle = {styles.containerlistItem}
                    />
                 ))
                }
            </View>
        )
        
    }



const styles = StyleSheet.create({
    viewBody:{
        flex:1,
        backgroundColor:"#fff"

    },
    viewRestaurantTitle:{
        padding:15,
    },
    tipoRestaurant:{
        fontSize:15,
        fontWeight:"bold",

    },
    numberRestaurat:{
        position:"absolute",
        right: 0,
        fontSize:15,
        fontWeight:"bold",
    },
    descriptionRestaurant:{
        marginTop:20,
        color:"grey"
    },
    nameRestaurant:{
        fontSize:28,
        textAlign:"center",  
        marginBottom:12,
    },
    rating:{
        marginTop:20,
        position:"relative",
        alignItems: "center",
        alignContent:"center",
        
    },
    viewRestaurantInfo:{
        margin:15,
        marginTop:3
    },
    restaurantInfoTitle:{
        fontSize:20,
        fontWeight:"bold",
        marginTop:15,
    },
    containerlistItem:{
        borderBottomColor:"#d8d8d8",
        borderBottomWidth:1

    },
    horario:{
        fontWeight:"bold"
    },
    viewFavorite:{
        position:"absolute",
        top:0,
        right:0,
        zIndex:2,
        backgroundColor:"#fff",
        borderBottomLeftRadius:100,
        paddingTop:5,
        paddingLeft:15


    },


    btnContainer:{
        
        marginTop:20,
        marginBottom:10,
        marginLeft:10,
        width:"45.5%"
    },
    btn:{
        backgroundColor: "#00a680"
    },
    btnContainerEliminar:{
        
        marginTop:20,
        marginBottom:10,
        marginLeft:10,
        width:"45.5%"
    },
    btnEliminar:{
        backgroundColor: "#e94057"
    }
})
