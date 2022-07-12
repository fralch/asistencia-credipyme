import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { Camera, CameraType } from 'expo-camera';

export default function App() {
  const [permiso, fijarPermiso] = useState(null);
  const [type, setType] = useState(CameraType.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      fijarPermiso(status === 'granted');
    })();
  }, []);

  if (permiso === null) {
    return <View />;
  }
  if (permiso === false) {
    return <Text>No tienes Acceso a la Camara</Text>;
  }
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={CameraType.front}>
        <View style={styles.inputContendor}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(type === CameraType.back ? CameraType.front : CameraType.back);
            }}>
           
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>
          <TextInput
              style={styles.input}
             
              placeholder="useless placeholder"
              keyboardType="numeric"
            />
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  inputContendor: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
