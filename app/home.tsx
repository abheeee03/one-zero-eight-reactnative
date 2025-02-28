import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  const handleCallAmbulance = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      console.log('Emergency call initiated at:', location.coords);
      alert('Emergency services have been notified. Help is on the way!');
    } catch (error) {
      alert('Error accessing location. Please try again.');
    }
  }, []);

  const handleFindAmbulance = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      console.log('Searching for ambulances near:', location.coords);
      router.push('/map');
    } catch (error) {
      alert('Error accessing location. Please try again.');
    }
  }, [router]);

  return (
    <View style={styles.container}>
        <TouchableOpacity
          style={[styles.button, styles.emBtn]}
          onPress={handleCallAmbulance}
        >
          <FontAwesome5 name="ambulance" size={24} color="red" />
          <Text style={[styles.buttonText, styles.emBtnText]}>Call Nearest {'\n'} Ambulance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.findButton, {top: 200}]}
          onPress={handleFindAmbulance}
        >
          <Text style={styles.buttonText}>Or Find Nearest Ambulance</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'red',
    gap: 20,
  },
  button: {
    padding: 20,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 10,
  },
  emBtn:{
    left: 90,
    backgroundColor: 'white',
    height: 200,
    width: 200,
    borderRadius: 200/2,
  },
  emBtnText:{
    color: 'red',
  },
  findButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
