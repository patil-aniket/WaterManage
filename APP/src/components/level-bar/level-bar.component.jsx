import Wave from 'react-native-waveview';
import { StyleSheet, View, Text, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import firebase from '../config';
import AnimatedNumbers from 'react-native-animated-numbers';
const WaterLevel = () => {
const [animateToNumber, setAnimateToNumber] = useState(0);
  

  useEffect(() => {
    const ref = firebase.database().ref('WatrManage/level');
    const data = ref.on('value', (snapshot) => {
      const val = snapshot.val();
      const temp = parseInt((val/5)*100);
      setAnimateToNumber(temp); 
      Wave._waveRect && Wave._waveRect.setWaterHeight(val*100);
      
      
    });
  },[animateToNumber]);


  return(
    <View style={_styles.container} >
      <View style={_styles.percContainer}>
        <AnimatedNumbers
          animateToNumber={animateToNumber}
          fontStyle={_styles.textContainer}
        />
        <Text style={_styles.textContainer}>%</Text>
      </View>
      
      <View style={_styles.waveContainer} >
        <Wave
            ref={ref=>Wave._waveRect = ref}
            style={_styles.wave}
            H={50}
            waveParams={[
                {A: 40, T: 600, fill: '#62c2ff'},
                {A: 33, T: 550, fill: '#0087dc'},
                {A: 28, T: 520, fill: '#1aa7ff'},
            ]}
            animated={true}
        >
        </Wave>
      </View>
    </View>



  );
}


const _styles = StyleSheet.create({
  container:{
    width: '100%',
    alignItems: 'center',
    height: '69%',
    backgroundColor:'tranparent',
  },
  percContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: '25%',
    zIndex: 1,
  },
  textContainer:{
    color: 'white',
    alignItems: 'center',
    fontWeight: '700',
    fontSize: 50,
    textTransform: 'uppercase',
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'tranparent',
    width: '100%',
    height: '100%',
  },
  wave: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: 'tranparent',
  },
  waveBall: {
    width: 100,
    aspectRatio: 1,
    borderRadius: 50,
    overflow: 'hidden',
  },
});

export default WaterLevel;