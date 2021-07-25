import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Account from '../screens/Account/Account';
import Login from '../screens/Account/Login';
import Register from '../screens/Account/Register';

const Stack = createStackNavigator();

export default function AccountStack (){
    return (
        <Stack.Navigator>
            <Stack.Screen name="account" component={Account} options={{title:"Cuenta"}} />
            {/* EL NAME ES LLAMADO EN EL USER GUEST PARA LA FUNCION NAVIGATE */}
            <Stack.Screen name="login" component={Login} options={{title:"Iniciar Sesion"}} />

            <Stack.Screen name="register" component={Register} options={{title:"Registrarse"}} />
        </Stack.Navigator>
    )
}






