import React,{useState, useEffect,useRef} from "react";
import { StyleSheet, View, ScrollView, Alert, Dimensions,Text} from "react-native";
import { Icon, Avatar,Image,Input,Button,CheckBox } from "react-native-elements";
import * as ImagePicker from "expo-image-picker"
import * as Permissions from "expo-permissions"
import * as Location from "expo-location"
import {map,size, filter } from "lodash";
import Modal from "../Modal"
import MapView from "react-native-maps"
import  uuid from "random-uuid-v4"
import Loading from "../../Components/Loading"
import Toast from "react-native-easy-toast"
//firebase
import { firebaseApp } from "../../utils/firebase"
import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/storage"
import { RadioButton } from 'react-native-paper';

const widthScreen = Dimensions.get("window").width;
const db = firebase.firestore(firebaseApp);
//dependera el ancho de la pantalla
export default function UpdateRestaurant(props){

    // props por el route.params, esto dependera en el navigator.navigate('update',{restaurant})
    
    const { navigation,route} = props;
    const toastRef = useRef();

    const { restaurant} = route.params;
    // console.log(restaurant)
    const [isLoading, setIsLoading] = useState(false)
    const [checked, setChecked] = useState(restaurant.tipo);
    const [horario, setHorario] = useState(restaurant.horario)
  
    const [restaurantName, setRestaurantName] = useState(restaurant.name);
    const [restaurantAddress, setRestaurantAddress] = useState(restaurant.address)
    const [restaurantDescription, setRestaurantDescription] = useState(restaurant.description)
    const [restaurantTelefono, setRestaurantTelefono] = useState(restaurant.telefono)
    const [imagesSelected, setImagesSelected] = useState(restaurant.images)

    const [isVisibleMap, setIsVisibleMap] = useState(false)
    const [locationRestaurant, setLocationRestaurant] = useState(restaurant.location)
   
    // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",restaurant,"Sdsdsds")

    const addRestaurant = ()=>{
       
        if(!restaurantName || !restaurantAddress || !restaurantDescription)
        {
            toastRef.current.show("Todos los campos del formulrio son hobligatorios.")
        }else if(setRestaurantDescription.length > 255){
            toastRef.current.show("La descripción de Restaurante tiene como máximo 255 caracteres.")
        }else if(size(imagesSelected) === 0)
        {
            toastRef.current.show("El restaurante tiene que tener como minimo, una foto.")
        }else if(!locationRestaurant)
        {
            toastRef.current.show("Tiene que localizar el retaurante en el mapa.")
        }else if(!restaurantTelefono || restaurantTelefono.length < 9 || restaurantTelefono.length > 9)
        {   
            toastRef.current.show("Ingrese su número telefonico correctamente.")
        }else{
         
            setIsLoading(true);
           
            uploadImageStorage().then((response)=>{
               
                db.collection("restaurants").doc(restaurant.id)
                .set({
                    name: restaurantName,
                    address:restaurantAddress,
                    description: restaurantDescription,
                    location:locationRestaurant,
                    images:response,
                    telefono:restaurantTelefono,
                    tipo:checked,
                    horario:horario,
                    rating: restaurant.rating,
                    ratingTotal:restaurant.ratingTotal,
                    quantityVoting:restaurant.quantityVoting,
                    createAt:restaurant.createAt,
                    createByName:firebase.auth().currentUser.displayName,
                    // El id del usuario quien cre este restaurante
                    createBy:firebase.auth().currentUser.uid,
                })
                .then((ok)=>{
                    console.log("ok");
                    setIsLoading(false);
                    navigation.navigate("restaurants")
                })
                .catch((err)=>{
                    setIsLoading(false);
                    console.log(err);
                    toastRef.current.show("Error al modificar el restaurante, intentelo mas tarde.")
                })
            });
            
        }
    }   


    const uploadImageStorage = async () =>{
        
        const imageBlob = [];
        console.log(imageBlob);
        await Promise.all(  
            map(imagesSelected, async (image)=>{
                const res = await fetch(image);
                const blob = await res.blob();
                const ref = firebase.storage().ref("restaurants").child(uuid());
                await ref.put(blob).then(async(result)=>{
                    await firebase
                    .storage()
                    .ref(`restaurants/${result.metadata.name}`)
                    .getDownloadURL()
                    .then((photoURL)=>{
                       imageBlob.push(photoURL)
                    })     
                })
            })
        )
        return imageBlob;
        
    }   
    if(isLoading) return <Loading isVisible={true} text="Modificando Restaurante"/>
    return(
        <ScrollView style={styles.scrollView}> 
        
        <Toast ref={toastRef} position="center" opacity={0.9} />
        <ImageRestaurant imageRestaurant={imagesSelected[0]} />
        
            <FormAdd
            isLoading={isLoading}
            restaurant = {restaurant}
                setRestaurantName={setRestaurantName}
                setRestaurantAddress={setRestaurantAddress}
                setRestaurantDescription={setRestaurantDescription }
                setIsVisibleMap={setIsVisibleMap}
                locationRestaurant={locationRestaurant}
                setRestaurantTelefono={setRestaurantTelefono}
                setChecked={setChecked}
                setHorario={setHorario}
                checked={checked}

            />
            <UploadImage 
                toastRef={toastRef} 
                imagesSelected={imagesSelected} 
                setImagesSelected={setImagesSelected}
              
            />
            <Button
                title="Crear Restaurante"
                onPress = {addRestaurant}
                buttonStyle={styles.btnAddRestaurant}

            />
            <Map  
                isVisibleMap={isVisibleMap} 
                setIsVisibleMap={setIsVisibleMap} 
                setLocationRestaurant={setLocationRestaurant} 
                toastRef={toastRef}
                />
        </ScrollView>
    )
}
function ImageRestaurant(props){
    const {imageRestaurant} = props;
    return(
        <View style={styles.viewPhoto}>
             <Image
                source={imageRestaurant ? {uri:imageRestaurant} : require("../../../assets/NoImg.png")}
                style={{width:widthScreen,height:200}}
             />
        </View>
    )
}

function FormAdd(props){
    
    
    const {
        setRestaurantDescription,
        setRestaurantAddress, 
        setRestaurantName,
        setRestaurantTelefono,
        setIsVisibleMap,
        setChecked,
        checked,
        setHorario,
        isLoading,
        locationRestaurant,restaurant} = props;
       
        const { name,telefono,horario,description,tipo,address,location,images } = restaurant
    
    return(
        
        <View style={styles.viewForm}>
             
            <Input
                placeholder="Nombre del restaurante"
                containerStyle={styles.input}
                defaultValue = {name || ""}
                onChange = {(e) => setRestaurantName(e.nativeEvent.text)}
            />
           <View style={{flexDirection:'row'}}>
                <Input
                        placeholder="Número telefónico"
                        containerStyle={styles.inputTelefono}
                        defaultValue = {telefono||""}
                        onChange = {(e) => setRestaurantTelefono(e.nativeEvent.text)}
                    />
                    <Input
                        placeholder="Horario"
                        containerStyle={styles.inputHorario}
                        defaultValue={horario || ""}
                        onChange = {(e) => setHorario(e.nativeEvent.text)}
                    />
           </View>
             <Input
                placeholder="Descripcion del restaurante"
                multiline={true}
                inputContainerStyle={styles.textArea}
                defaultValue = {description || ""}
                onChange = {(e) => setRestaurantDescription(e.nativeEvent.text)}
            />
            <Text style={{fontSize:20,margin:10,color:"#b2b2b2"}}>Tipo de Restaurante: </Text>
          
            <RadioButton.Group  onValueChange={newchecked => setChecked(newchecked)} value={checked} defaultValue = {tipo || ''}>
                    
                <View style={styles.RadioButton}>
                    <Text>Gourmet</Text>
                    <RadioButton text="Gourmet" value="Gourmet" />
                    <Text>Familiar</Text>
                    <RadioButton value="Familiar" />
                    <Text>Comida Rapida</Text>
                    <RadioButton value="Comida Rapida" />
                </View>

            </RadioButton.Group>
            

            <Input
                placeholder="Dirección"
                containerStyle = {styles.input}
                defaultValue ={address || ""}
                onChange = {(e) => setRestaurantAddress(e.nativeEvent.text)}
                rightIcon={{ 
                    type:"material-community",
                    name:"google-maps",
                    color: locationRestaurant ? "#3494e6" : "#c2c2c2",
                    onPress:()=> setIsVisibleMap(true)
                 }}
            />
           
        </View>
    )
}

function Map(props){
    
    const {isVisibleMap, setIsVisibleMap, setLocationRestaurant, toastRef} = props;
    const [location, setLocation] = useState(location);
    
    useEffect(() => {
        (async()=>{
           const resultPermissions = await Permissions.askAsync(Permissions.LOCATION)
           console.log(resultPermissions);
           const statusPermissions = resultPermissions.permissions.location.status;

           if(statusPermissions !== "granted"){
                toastRef.current.show(
                    "Tienes que aceptar los permisos de localizacion para crear un estaurante.",3000
                )
           }else{
               const loc = await Location.getCurrentPositionAsync({ });
               
               setLocation( {
                   latitude:loc.coords.latitude,
                   longitude:loc.coords.longitude,
                latitudeDelta:0.001,
                longitudeDelta:0.001
                //     latitude:location.latitude,
                //     longitude:location.longitude,
                //    latitudeDelta:location.latitudeDelta,
                //    longitudeDelta:location.longitudeDelta
               } )
          
           }
        })()
    }, [])


    const confirmLocation = () => {
        setLocationRestaurant(location);
        //toastRef.current.show("Localizacion guardada correctamente.",3000);
        
        setIsVisibleMap(false);
    }

    return(
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
           <View>
               {location && (
                   <MapView 
                    style={styles.mapStyle} 
                    initialRegion={location} 
                    showsUserLocation={true}
                    onRegionChange= {(region)=> setLocation(region)}
                    >
                    
                       <MapView.Marker
                            coordinate={{
                                latitude:location.latitude,
                                longitude: location.longitude
                            }}
                            draggable
                       />
                   </MapView>
               )}
               <View style={styles.viewMapBtn}>
                            <Button 
                            title="Guardar Ubicacion." 
                            containerStyle={styles.viewMapBtnContainerSave}
                            buttonStyle={styles.viewMapBtnSave}
                            onPress={confirmLocation}
                            />
                            <Button 
                            title="Cancelar Ubicacion" 
                            containerStyle={styles.viewMapBtnContainerCancel} 
                            buttonStyle={styles.viewMapBtnCancel}
                            onPress={()=>setIsVisibleMap(false)}
                            
                            />
               </View>
           </View>
        </Modal>
    )
}

function UploadImage(props){

    const {toastRef, imagesSelected,setImagesSelected} = props;

    const imageSelect = async () =>{

        const resultPermisions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if(resultPermisions === "denied"){
            toastRef.current.show("Es necesario aceptar los permisos de la galeria, si los has rechazado tienes que ir Ajustes y activarlos manualmente.",3000)
        }else{  
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing : true,
                aspect:[4,3]
            })

        if(result.cancelled){
            toastRef.current.show(
                "Has cerrado la galeria sin seleccionar ninguna imagen.",2000
            )
        } else{
            setImagesSelected(result.uri);
            setImagesSelected([...imagesSelected, result.uri])
        }
            
        }
    }


const removeImage=(image)=>{
    

    Alert.alert(
        "Eliminar Imagen",
        "Estas seguro de que quieres eliminar la imagen?",
        [
            {
                text:"Cancel",
                style:"cancel"
            },
            {
                text:"Eliminar",
                onPress:()=>{

                    setImagesSelected(
                        filter(imagesSelected, (imageUrl)=> imageUrl !== image )     
                    )
                    
                }
            }
        ],
        {cancelable: false}
    )
}

    return(
        <View style={styles.viewImage}>
            {size(imagesSelected) < 4 && (
            <Icon
                type="material-community"
                name="folder-multiple-image"
                color="#7a7a7a"
                containerStyle = {styles.containerIcon}
                onPress={imageSelect}
            />  )}
            
            {map(imagesSelected, (imageRestaurant,index)=>(
                
                <Avatar
                    key={index}
                    style = {styles.miniatureStyle}
                    source={{uri:imageRestaurant}}
                    onPress={()=>removeImage(imageRestaurant)}
                />
            ))}
        </View>
    )
}



const styles = StyleSheet.create({
    RadioButton:{  
       alignItems: "center",
       marginLeft:30,
       marginTop:10,
       marginBottom:10,
       flex: 1, flexDirection: 'row',
    },
    scrollView:{
        height:"100%"
    },
    inputHorario:{
        width: "50%",
        marginBottom:10
    },
    inputTelefono:{
        width: "50%",
        marginBottom:10
    },
    viewForm:{
        marginLeft:10,
        marginRight:10
    },
    input:{
        marginBottom:10
    },
    textArea:{
        height:80,
        width:"100%",
        padding:0,
        margin:0,
    },
    btnAddRestaurant:{ 
        backgroundColor: "#3494e6",
        margin:20
     },
     viewImage:{
         flexDirection:"row",
         marginLeft:20,
         marginRight:20,
         marginTop:20
     },
     containerIcon:{
         alignItems:"center",
         justifyContent: "center",
         marginRight:10,
         height:70,
         width:70,
         backgroundColor: "#e3e3e3"

     },
     miniatureStyle:{
         width:70,
         height:70,
         marginRight: 10
     },
     viewPhoto:{
         alignItems: "center",
         height:200,
         marginBottom:20,

     },
     mapStyle:{  
         width:"100%",
         height:550,
     },
     viewMapBtn:{
         flexDirection:"row",
         justifyContent: "center",
        marginTop:10

     },
     viewMapBtnContainerCancel:{
         paddingLeft:5
     },
     viewMapBtnCancel:{  
         backgroundColor:"#a60d0d"
     },
     viewMapBtnContainerSave:{
        paddingRight:5,
     },
     viewMapBtnSave:{
         backgroundColor:"#00a680"
     }

})


























