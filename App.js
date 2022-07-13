import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

export default function App() {
  const [permiso, fijarPermiso] = useState(null);
  const [dni, fijarDni] = useState(null);

  const camaraRef = useRef(null);
  const [foto, setFoto] = useState(null);



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

  const tomarFoto = async () => {
    if (camaraRef) {
      const foto = await camaraRef.current.takePictureAsync();
      setFoto(foto);
      const base64 = await FileSystem.readAsStringAsync(foto.uri, { encoding: 'base64' });
      // console.log(base64);
      const response = await fetch('http://192.168.1.15/cre/cli/subir_imagen', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dni: dni,
          file: base64
        })
      });
      const rpt = await response.json();
      console.log(rpt);
    }
  };
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={CameraType.front} ref={camaraRef} >
        <View style={styles.inputContendor}>
          <TextInput
            style={styles.input}
            placeholder="Ingresar DNI"
            keyboardType="numeric"
            onChangeText={fijarDni}
          />
          <TouchableOpacity style={styles.button}>
            {/* <Text style={styles.text} onPress={() => Alert.alert('Simple Button pressed')}> ENVIAR </Text>            */}
            <Text style={styles.text} onPress={() => tomarFoto()}> ENVIAR </Text>
          </TouchableOpacity>

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

  },
  text: {
    width: 100,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: 'white',
    alignSelf: 'flex-end',
    backgroundColor: 'white',
  },
});
