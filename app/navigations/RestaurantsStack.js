import React from "react";
import { createStackNavigator } from "@react-navigation/stack"
import Restaurants from "../screens/Restaurants/Restaurants";
import  AddRestaurant from "../screens/Restaurants/AddRestaurant"
import Restaurant from "../screens/Restaurants/Restaurant"
import AddReviewRestaurant from "../Components/Restaurants/AddReviewRestaurant";
import UpdateRestaurant from "../Components/Restaurants/UpdateRestaurant"

const Stack = createStackNavigator();

export default function RestaurantsStack(){
    return(  
        <Stack.Navigator>
            <Stack.Screen name="restaurants" component={Restaurants} options={{title:"Restaurantes"}}/>
            <Stack.Screen name="add-restaurant" component={AddRestaurant} options={{title:"Nuevo Restaurante"}} />
            <Stack.Screen name="restaurant" component={Restaurant}  />
            <Stack.Screen name="add-review-restaurant" component={AddReviewRestaurant} options={{title:"Nuevo Comentario"}} />
            <Stack.Screen name="update-restaurant" component={UpdateRestaurant} options={{title:"Modificar Restaurante"}} />
        </Stack.Navigator>
    )
}























