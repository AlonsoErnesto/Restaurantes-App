                  
import React,{useRef} from 'react';
import { ActivityIndicator,StatusBar, FlatList,Image, Animated, Text, View, Dimensions, StyleSheet, TouchableOpacity, Easing, SafeAreaViewBase, SafeAreaView  } from 'react-native'
// import {Image} from "react-native-elements"
import {size} from "lodash";
import { useNavigation } from "@react-navigation/native"
import {LinearGradient,} from 'expo-linear-gradient'
//
 const { width, height } = Dimensions.get('screen');
 const SPACING = 12;
 const AVATAR_SIZE = 80;
 const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;
 export default function ListRestaurants(props) {
     
     const { restaurants,handleLoadMore , isLoading } = props;
     
     const navigation = useNavigation();
    
    //const restaurants = [];

    const scrollY = React.useRef(new Animated.Value(0)).current;
    return (
        <View style={{flex:1,backgroundColor:"#fff"}}>
            <Image
                source={{uri:'https://images.pexels.com/photos/907485/pexels-photo-907485.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'}}
                style={StyleSheet.absoluteFillObject}
                blurRadius={80}
            />
           {size(restaurants) > 0 ? (
                // lista de restaurantes
                
                <Animated.FlatList
                    data = {restaurants}
                    onScroll={Animated.event(
                        [{nativeEvent:{contentOffset:{y:scrollY}}}],
                        {useNativeDriver:true}
                    )}
                    contentContainerStyle = {{
                        padding:SPACING,
                        paddingTop:StatusBar.currentHeight || 42
                    }}
                         keyExtractor = {(item)=> item.id}
                    renderItem = {(restaurant,index)=>{

                        const inputRange = [
                            -1,
                            0,
                            ITEM_SIZE *0,
                            ITEM_SIZE * (0 + 2)
                        ]
                        const scale = scrollY.interpolate({
                            inputRange,
                            outputRange:[1,1,1,0],


                        }) 
                        
                          return <Resturant scale={scale} restaurant={restaurant} navigation={navigation} />
                        
                        
                        }}
                   
               
                    onEndReachedThreshold={0.5}
                    onEndReached={handleLoadMore}
                    ListFooterComponent={<FooterList isLoading={isLoading} />}
                />
           ) : (
               <View style={styles.loaderRestaurants}>
                   <ActivityIndicator size="large" color="#00a680" />
                   <Text>Cargado Restaurantes</Text>
               </View>
           )}
        </View>
    )
}

function FooterList(props){
    const { isLoading} = props;
    if(isLoading) {
        return (  
            <View style={styles.loaderRestaurants}>
                <ActivityIndicator  
                    size="large"
                    color="#00a680"
                />
            </View>
        )
    }else{
        return(
            <View style={styles.notFoundRestaurant}>
            <Text>No quedan restaurantes por cargar.</Text>
        </View>
        )
    }
}


function Resturant(props){
    
    const { restaurant,navigation, scale } = props
    const { id,images,name, description, address,tipo,horario } = restaurant.item;
   
    const imageRestaurant = images ? images[0]: null;

    const goRestaurant = () =>{
        navigation.navigate("restaurant",{
            id,
            name
        })
    }
   

    return(
        <TouchableOpacity onPress = {goRestaurant}>
  

          <LinearGradient
              colors={['rgba(255,255,255,1)','transparent']}
              end={{x:2,y:0.1}}
            //   end={{x:0.1,y:1}}
              
              style={{flexDirection:"row",padding:SPACING,marginBottom:SPACING,borderRadius:18,
              shadowColor:"#000", shadowOffset:{
                  width: 0,
                  height: 10,
              },
              shadowOpacity:.3,
              shadowRadius:20, }}
          >
          <Animated.View style={{flexDirection:"row",borderRadius:18,
                        shadowColor:"#000", shadowOffset:{
                            width: 0,
                            height: 10,
                        },
                        shadowOpacity:.3,
                        shadowRadius:20,
                        
                      

        }}>
            
              <Animated.View style={{ marginRight:15}}>
                <Image
                    resizeMode="cover"
                    PlaceholderContent= { <ActivityIndicator color="fff"/> } 
                    source={
                        imageRestaurant 
                        ? {uri: imageRestaurant}
                        : require("../../../assets/avatar.jpg")
                    }
                    style={{width:AVATAR_SIZE,height:AVATAR_SIZE,borderRadius:AVATAR_SIZE}}
                />
              </Animated.View>
              <View>
                  <View style={{flexDirection:"row"}}>
                    <Text style = {styles.restaurantName}>{name}</Text>
                    <Text style = {{fontWeight:"bold", right:0}}>{horario}</Text>
                  </View>
                  <Text style = {styles.restaurantAddress}>{address}</Text>
                  <Text style={styles.restaurantDescription}>Clasificación: {tipo}</Text>
                  <Text style={styles.restaurantDescription}>{description.substr(0,40)}...</Text>
                  
              </View>
          </Animated.View>

          </LinearGradient>

          
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    loaderRestaurants:{
        marginTop:10,
        marginBottom:10,
        alignItems:"center",
    },
    viewRestaurant:{
        flexDirection:"row",
        margin:10
    },
    viewRestaurantImage:{
        marginRight:15
    },
    imageRestaurant:{
        width:80,
        height:80
    },
    restaurantName:{
        fontWeight:"bold",
        width: 140,
        fontSize:20,
        fontWeight:'700'
    },
    restaurantAddress:{  
        fontSize:15,
        paddingTop:2,
        color:'#0099cc',
    },
    restaurantDescription:{  
        paddingTop:2,
        color:"grey",
        width:200
    },
    notFoundRestaurant:{
        marginTop:10,
        marginBottom:20,
        alignItems:"center"
    }

})





