import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

export default function App() {
  const [permiso, fijarPermiso] = useState(null);
  const [dni, fijarDni] = useState(null);
  const [loading, setLoading] = useState(false);
  const [direccion, setDireccion] = useState(null);

  const camaraRef = useRef(null);
  const [foto, setFoto] = useState(null);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      fijarPermiso(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const obtenerDireccion = async (lat, lng) => {
    const Getdireccion  = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBm29s27MlvC9J4LkHW5gftm8QC-Pim48I`)
    const rpt = await Getdireccion.json();
    const direccion = rpt.results[0].formatted_address;
    const distrito = rpt.results[0].address_components[2].long_name;
    let expresionRegular = /\s*,\s*/;
    let direccionFinal = direccion.split(expresionRegular)[0] + ',' + distrito;
    setDireccion(direccionFinal);
    // console.log(direccionArray[0]);
    console.log(direccionFinal);
  }

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    let { coords } = location;
    // text = JSON.stringify(location);
    // text = `Latitude: ${coords.latitude} Longitude: ${coords.longitude}`;
    obtenerDireccion(coords.latitude, coords.longitude);
  }
  
 


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
      setLoading(true);
      const response = await fetch('http://192.168.1.5/cre/cli/subir_imagen', {
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
      if (rpt == 1) {
        alert('Foto Subida');
      }
      
    }
    setLoading(false);
  };



  
  return (
    
      loading ?   
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator />
      </View>
     : 
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
          <View style={styles.direccion}>  
            <Text>{direccion}</Text>
            <View>
            <MapView>
             
            </MapView>
            </View>
          </View>
          
        </View>
      </Camera>
      </View>
      
      
     
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  direccion: {
    flex: 1,
  }
});
