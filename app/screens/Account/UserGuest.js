import { LayoutAnimation, Animated, Dimensions, Text, View, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import React, { Component } from 'react';
import {Button} from 'react-native-elements'
import  Constants  from 'expo-constants';

//useNavigation
import { useNavigation } from '@react-navigation/native';

var {height, width} = Dimensions.get('window');

const smallSize = width / 5;
const itemWidth = width * .67;
const itemHeight = height / 2 - Constants.statusBarHeight * 2;
const fontSize=  300;

const COLORS = ['coral', 'mediumturquoise', 'palevioletred', 'papayawhip', 'tomato']

const ITEMS = [
  `https://images.pexels.com/photos/2280573/pexels-photo-2280573.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`,
  'https://images.pexels.com/photos/6210747/pexels-photo-6210747.jpeg?cs=srgb&dl=pexels-tim-douglas-6210747.jpg&fm=jpg',
  'https://images.pexels.com/photos/1260968/pexels-photo-1260968.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'https://images.pexels.com/photos/8408386/pexels-photo-8408386.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'https://images.pexels.com/photos/6646068/pexels-photo-6646068.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'https://live.mrf.io/statics/i/ps/www.cocinacaserayfacil.net/wp-content/uploads/2017/01/5-recetas-de-cocina-faciles-rapidas-y-economicas.jpg?width=1200&enable=upscale',
  
]
const NameRestaurant = [
  'Comida Rapida',
  'Polleria',
  'Pizza',
  'Carnes',
  'Comidas asiaticas',
  'y mas...'
]



function InfoNavigate()
{  
  const navigation = useNavigation();

  return (
    <>

 <ScrollView centerContent={true} style={styles.ViewBody}>
          
          <Text style={styles.title} >Consulta tu perfil en AppRestaurant</Text>
          <Text style={styles.description} >Como describirias tu mejor restaurante? Busca y viualiza los mejores 
          restaurantes de una forma sencilla, vota cual te ha gustado mas y comenta como fue tu experiencia.
            </Text>
            <View style={styles.viewBtn}>
                <Button
                    buttonStyle={styles.btnStyle}
                    containerStyle = {styles.btnContainer}
                    title = "Ver tu perfil"
                    // nombre del ACCOUNT "login"
                    onPress = {()=> navigation.navigate("login")}
                />
            </View>
      </ScrollView>
    </>
  )
}

export default class UserGuest extends Component {

  
  constructor(props) {
    super(props)

    this.state = {
      scrollX: new Animated.Value(0),
      indicator: new Animated.Value(1)
    }
  }

  componentDidMount() {
    LayoutAnimation.spring()
  }


  render() {
    
    return (
      
      <View style={styles.container}>

        <View style={{height: 20 + height / 2}}>
         
          {this.renderScroll()}
        </View>
        <View style={{flex: 1}}>


    <InfoNavigate/>

         
          </View>
      </View>
    );
  }

  renderScroll() {
    return <Animated.ScrollView
      horizontal={true}
      style={{flex: 1}}
      contentContainerStyle={{alignItems: 'center', flexGrow: 1}}
      decelerationRate={0}
      snapToInterval={itemWidth}
      scrollEventThrottle={16}
      snapToAlignment="start"
      showsHorizontalScrollIndicator={false}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: this.state.scrollX } } }]
      )}
    >
      {ITEMS.map((image,i) => {
        return this.renderRow(image, i)
      })}


    </Animated.ScrollView>
  }


  renderNormal(image, i) {
    if (image === '' ) {
      return null
    }

    return <View key={i}  style={{flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 20}}>
        <ImageBackground source={{uri: image}} style={[{height: smallSize, width: smallSize, opacity: 1, resizeMode: 'cover'}]} />
        <View style={{marginLeft: 20}}>
          
        </View>
      </View>
  }

  renderRow(image, i) {
    let inputRange = [(i - 1) * itemWidth, i * itemWidth, (i + 1) * itemWidth, (i + 2) * itemWidth];
    let secondRange = [(i - 1) * itemWidth, i * itemWidth, (i + 1) * itemWidth]

    // Ensure that we're leaving space for latest item.
    if (image === '') {
      return <View key={i} style={[styles.emptyItem, {width: width * .33}]}></View>
    }

    return (
      <Animated.View key={i} style={[styles.emptyItem, {
        opacity: this.state.scrollX.interpolate({
          inputRange: secondRange,
          outputRange: [.3, 1, 1]
        }),
        height: this.state.scrollX.interpolate({
          inputRange: secondRange,
          outputRange: [itemHeight * .8, itemHeight, itemHeight],
        })
      }]}>
        <ImageBackground key={i} source={{uri: image}} style={[StyleSheet.AbsoluteFill, {height: itemHeight, width: itemWidth, opacity: 1, resizeMode: 'cover'}]}>
        <View style={[StyleSheet.AbsoluteFill, {opacity: 0.4, backgroundColor: COLORS[i], width: itemWidth, height: itemHeight}]}></View>
        <Animated.View
            style={[{
              width: itemWidth,
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              flex: 1,
              position: 'relative',
              height: itemHeight,
              opacity: this.state.scrollX.interpolate({
                inputRange,
                outputRange: [0.4,1, 1, 1]
              }),
              transform: [{
                scale: this.state.scrollX.interpolate({
                  inputRange,
                  outputRange: [.5, 1, 1.4, 1]
                })
              }]
            }]}>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', width: itemWidth, height: itemHeight, position: 'absolute', bottom: -itemHeight / 4, right: -itemWidth / 4}}>
              <Text style={{fontSize: fontSize,color: 'rgba(0,0,0,0.5)'}}>
              {i + 1 }
              </Text>
              {/* {i + 1} */}
            </View>
          </Animated.View>
          </ImageBackground>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Constants.statusBarHeight
  },
  emptyItem: {
    overflow: 'hidden',
    height: itemHeight,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 20,
    borderColor: 'white',
    width: itemWidth,
    backgroundColor: 'transparent'
  },
  heading: {
    fontSize: 22,
    fontWeight: '300',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  viewBody:{
    marginLeft:30,
    marginRight:30,
},

title:{
    fontSize:19,
    fontWeight:"bold",
    marginBottom:10,
    textAlign:"center"
},
description:{
    textAlign:"center",
    marginBottom:20,
    marginLeft:30,
    marginRight:30
},
viewBtn:{
    flex:1,
    alignItems:"center",
},
btnStyle:{
    backgroundColor:"#00a680"
},
btnContainer:{
    width:"50%"
}
});