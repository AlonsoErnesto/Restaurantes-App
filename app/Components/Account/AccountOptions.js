import React, {useState} from "react";
import { StyleSheet,View, Text }  from "react-native";
import { ListItem } from "react-native-elements";
import {map} from "lodash";
import Modal from "../Modal";

//components
import ChangeEmailForm from "./ChangeEmailForm";
import ChangeDisplayNameForm from "./ChangeDisplayNameForm";
import ChangePasswordForm from "./ChangePasswordForm";
import ChangeMyRestaurants from "./ChangeMyRestaurants";
import ChangeDNIForm from "./ChangeDNIForm"


export default function AccountOptions(props){

    const { userInfo,toastRef,setReloadUserInfo } = props;
    const [showModal, setShowModal] = useState(false)
    const [renderComponent, setRenderComponent] = useState(null)

    //console.log(menuOptions)
    // https://apiperu.dev/api/dni/{numero} 

    const selectComponent = (key) => {
        switch (key)
        {
            case 'dni':
                setRenderComponent(
                    <ChangeDNIForm
                        setShowModal={setShowModal}
                    />
                )
                setShowModal(true);
                break;


            case "listRestaurants":
                setRenderComponent(
                    <ChangeMyRestaurants
                            setShowModal ={setShowModal}
                    />
                )
                setShowModal(true);
                break;
            case "displayName":
                setRenderComponent(
                <ChangeDisplayNameForm 
                    displayName={userInfo.displayName} 
                    setShowModal={setShowModal} 
                    toastRef={toastRef}
                    setReloadUserInfo={setReloadUserInfo}
                
                />)
                setShowModal(true);
                break;
            case "email":
                setRenderComponent(
                  <ChangeEmailForm
                  email = {userInfo.email}
                  setShowModal={setShowModal} 
                  toastRef={toastRef}
                  setReloadUserInfo={setReloadUserInfo}
                  />
                )
                setShowModal(true);
                break;
            case "password":
                setRenderComponent(
                    <ChangePasswordForm
                    
                    setShowModal={setShowModal} 
                    toastRef={toastRef}
                    setReloadUserInfo={setReloadUserInfo}
                    />
                )
                setShowModal(true);
                break;
            default:
                setRenderComponent(null);
                setShowModal(false)
                break;
        }
    }
    const menuOptions = generateOptions(selectComponent);

    return(
        <View>
            
           {
               map(menuOptions,(menu, index)=>( 
                   <ListItem 
                        key={index} 
                        title={menu.title}  
                        leftIcon = {{
                            type:menu.iconType,
                            name: menu.iconNameLeft,
                            color:menu.iconColorLeft

                        }}rightIcon = {{
                            type:menu.iconType,
                            name: menu.iconNameRight,
                            color:menu.iconColorRight
                        }}
                        containerStyle = {styles.menuIem}
                        onPress={menu.onPress}
                        />
               ))
           }
            { renderComponent && (

                <Modal  isVisible={showModal} setIsVisible = {setShowModal} >
                    {renderComponent} 
                </Modal>
            
            )}
        </View>
    )
}

function generateOptions(selectComponent){
    return [
        {
            title:"DNI",
            iconType:"material-community",
            iconNameLeft:"card-account-details-star-outline",
            iconColorLeft:"#ccc",
            iconNameRight:"chevron-right",
            iconColorRight:"#ccc",
            onPress: () => selectComponent("dni")
        },
        {
            title:"Cambiar Nombre y Apellidos",
            iconType:"material-community",
            iconNameLeft:"account-circle",
            iconColorLeft:"#ccc",
            iconNameRight:"chevron-right",
            iconColorRight:"#ccc",
            onPress:()=> selectComponent("displayName")
        },
        {
            title:"Cambiar Email",
            iconType:"material-community",
            iconNameLeft:"at",
            iconColorLeft:"#ccc",
            iconNameRight:"chevron-right",
            iconColorRight:"#ccc",
            onPress:()=> selectComponent("email")
        },
        {
            title:"Cambiar Contraseña",
            iconType:"material-community",
            iconNameLeft:"lock-reset",
            iconColorLeft:"#ccc",
            iconNameRight:"chevron-right",
            iconColorRight:"#ccc",
            onPress:()=> selectComponent("password")
        },
        {
            title:"Lista de Restaurantess",
            iconType:"material-community",
            iconNameLeft:"store",
            iconColorLeft:"#ccc",
            iconNameRight:"chevron-right",
            iconColorRight:"#ccc",
            onPress: () => selectComponent("listRestaurants")
        }

    ]
}

const styles = StyleSheet.create({
        menuIem:{
            borderBottomWidth: 1,
            borderBottomColor:"#e3e3e3"
        }
})



