import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Favorites  from '../screens/Favorites';

const stack = createStackNavigator();

export default function FavoritesStack () {
    return (
        <stack.Navigator>
            <stack.Screen name="Favorites" component={Favorites} options={{title:"Favoritos"}} />
        </stack.Navigator>
    )
}




