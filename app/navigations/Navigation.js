//react
import React from 'react';
// Navigations
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
//rect nativ elements
import { Icon } from 'react-native-elements'

// Components

import  RestaurantsStack  from './RestaurantsStack';
import FavoritesStack from './FavoritesStack';
import TopRestaurantsStack from "./TopRestaurantsStack";
import SearchStack from "./SearchStack";
import AccountStack from "./AccountStack";
//VARIABLES
const Tab = createBottomTabNavigator();

export default function Navigation()
{
    return(
        <NavigationContainer>
            <Tab.Navigator initialRouteName="account" 
                           tabBarOptions={{
                               inactiveTintColor:"#646464",
                               activeTintColor:"#3494E6"
                           }}
                           screenOptions={({ route })=>({
                                tabBarIcon:({ color }) => screenOptions(route,color),
                           })}
                           >

                <Tab.Screen name="top-restaurants" component={TopRestaurantsStack} style={{margin:30}} options={{title:"Top"}}/>
                <Tab.Screen name="favorites" component={FavoritesStack} options={{title:"Favorito"}}/>
                
                <Tab.Screen name="restaurants" component={RestaurantsStack} options={{title:"Restaurante"}} />
                <Tab.Screen name="search" component={SearchStack} options={{title:"Buscar"}}/>
                <Tab.Screen name="account" component={AccountStack} options={{title:"Perfil"}}/>

            </Tab.Navigator>
        </NavigationContainer>
    )
}



function screenOptions (route,color){

    let iconName;

    switch (route.name) {
        case "restaurants":
            iconName = "silverware";
            break;
        case "favorites":
            iconName = "heart-multiple-outline";
            break;
        case "top-restaurants":
            iconName = "podium-gold";
            break;
        case "search":
            iconName = "layers-search-outline"
            break;
        case "account":
            iconName = "account-circle-outline"
            break;
        default:
            break;
    }

    return (
        <Icon  type="material-community" name={iconName} size={24} color={color} />
    )

}




