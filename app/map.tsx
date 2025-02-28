import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { useEffect, useRef, useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';

export default function Map() {
  const router = useRouter();
  const [ambulanceLocation, setAmbulanceLocation] = useState({
    latitude: 20.5937,
    longitude: 78.9629,
  });
  
  const stepRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start position (slightly north of center)
    const startPosition = {
      latitude: 20.6037,
      longitude: 78.9629,
    };

    // Set initial position
    setAmbulanceLocation(startPosition);

    // Animate the ambulance
    const moveAmbulance = () => {
      stepRef.current += 1;
      
      // Create a circular motion
      const radius = 0.005; // Size of the circle
      const angle = (stepRef.current * 2 * Math.PI) / 180; // Convert step to radians
      
      setAmbulanceLocation({
        latitude: startPosition.latitude + radius * Math.sin(angle),
        longitude: startPosition.longitude + radius * Math.cos(angle),
      });
    };

    // Start the interval
    intervalRef.current = setInterval(moveAmbulance, 100);

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const handleClose = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 20.5937,
            longitude: 78.9629,
            latitudeDelta: 0.0222,
            longitudeDelta: 0.0121,
          }}
        >
          <Marker
            coordinate={ambulanceLocation}
            title="Ambulance"
            description="Ambulance en route"
          >
            <View style={styles.markerContainer}>
              <FontAwesome5 name="ambulance" size={24} color="#FF3B30" />
            </View>
          </Marker>
        </MapView>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={handleClose}
        >
          <Text style={styles.closeButtonText}>Close Map</Text>
        </TouchableOpacity>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Ambulance ETA: 5 mins</Text>
          <Text style={styles.infoText}>Distance: 2.3 km</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  infoBox: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
});
