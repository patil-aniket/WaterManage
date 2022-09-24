import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import firebase from '../config';
import App from '../../../App';

const MotorStatus = () => {
  const [motorstat, setMotorStatus] = useState([]);

  useEffect(() => {
    const ref = firebase.database().ref('WatrManage/motorstatus');
    const data = ref.on('value', (snapshot) => {
      const val = snapshot.val() ? 'running' : 'stopped';
      setMotorStatus(val);
    });
  });

  return (
    <View style={styles.container}>
      <Text style={styles.textContainer}>Motor Status</Text>
      <Text style={styles.textContainerChild}>{motorstat}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default MotorStatus;
