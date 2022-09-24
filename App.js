import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Switch,
  StatusBar,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import firebase from './src/components/config';
import MotorStatus from './src/components/motor-status/motor-status.component';
import WaterLevel from './src/components/level-bar/level-bar.component';
import 'react-native-gesture-handler';

export default function App() {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  useEffect(() => {
    const ref = firebase.database().ref('WatrManage/man');
    const data = ref.on('value', (snapshot) => {
      const val = snapshot.val();
      setIsEnabled(val ? true: false);
    });
  });

  const doSomething = (value) => {
    firebase
      .database()
      .ref('WatrManage/')
      .update({
        man: value ? 1 : 0,
      })
      .then((data) => {
        //success callback
        console.log('data ', data);
      })
      .catch((error) => {
        //error callback
        console.log('error ', error);
      });
  };
  return (
    <View style={[{ backgroundColor: 'black' }]}>
      <SafeAreaView
        style={[
          {
            alignItems: 'center',
            height: '100%',
            backgroundColor: 'tranparent',
          },
        ]}
      >
        <StatusBar style='light-content' />

        <View style={styles.headerContainer}>
          <Text style={styles.headTextContainer}>Smart Water Management</Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.textContainer}>Manual Mode</Text>
          <View style={styles.switchContainer}>
            <Switch
              trackColor={{ false: '#767577', true: '#767577' }}
              thumbColor={isEnabled ? '#00FFFF' : '#fff'}
              ios_backgroundColor='#3e3e3e'
              onValueChange={toggleSwitch}
              value={isEnabled}
              onChange={doSomething(isEnabled)}
            />
          </View>
          <Text style={styles.textContainerChild}>Water System</Text>
        </View>
        {/* motor status component */}
        <MotorStatus />
        {/* water wave component */}
        <WaterLevel />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
  },
  container: {
    width: '90%',
    marginTop: 15,
    alignItems: 'center',
    borderColor: '#e6e6e6',
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    borderRightWidth: 0.5,
    borderLeftWidth: 0.5,
    borderRadius: 10,
  },
  headerContainer: {
    width: '100%',
    backgroundColor: '#000',
    alignItems: 'center',
    height: 40,
  },
  headTextContainer: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    textTransform: 'capitalize',
  },
  textContainer: {
    color: '#787878',
    fontWeight: '400',
    fontSize: 16,
    padding: 10,
    textTransform: 'uppercase',
  },
  textContainerChild: {
    color: '#787878',
    fontWeight: '200',
    fontSize: 13,
    padding: 10,
    textTransform: 'uppercase',
  },
  switchContainer: {
    padding: 10,
  },
});
