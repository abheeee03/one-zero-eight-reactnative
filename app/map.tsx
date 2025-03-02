import { StyleSheet, View, TouchableOpacity, Text, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { useEffect, useRef, useState, useCallback } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Location from 'expo-location';

export default function Map() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(true);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 20.5937,
    longitude: 78.9629,
  });
  const [ambulanceLocations, setAmbulanceLocations] = useState([
    { 
      id: 1,
      latitude: 20.5937,
      longitude: 78.9629,
      distance: "1.5 km",
      eta: "3 mins"
    },
    { 
      id: 2,
      latitude: 20.5937,
      longitude: 78.9629,
      distance: "3.2 km",
      eta: "7 mins"
    },
    { 
      id: 3,
      latitude: 20.5937,
      longitude: 78.9629,
      distance: "5.8 km",
      eta: "12 mins"
    }
  ]);
  
  const stepRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    (async () => {
      if (!isMounted) return;

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High
        });
        
        const newLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        
        setCurrentLocation(newLocation);
        
        setAmbulanceLocations(prev => prev.map((amb, index) => ({
          ...amb,
          latitude: newLocation.latitude + (index + 1) * 0.01, 
          longitude: newLocation.longitude + (index + 1) * 0.01, 
        })));

        mapRef.current?.animateToRegion({
          ...newLocation,
          latitudeDelta: 0.05, 
          longitudeDelta: 0.05,
        }, 1000);
      } catch (error) {
        console.warn('Error getting location:', error);
      }
    })();
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    const moveAmbulances = () => {
      if (!isMounted || !intervalRef.current) return;
      
      stepRef.current += 1;
      
      setAmbulanceLocations(prev => prev.map((amb, index) => {
        const radius = 0.002 + (index * 0.001); // Different radius for each ambulance
        const angle = ((stepRef.current + (index * 60)) * 2 * Math.PI) / 180; // Different phase for each ambulance
        const baseLatitude = currentLocation.latitude + (index + 1) * 0.01;
        const baseLongitude = currentLocation.longitude + (index + 1) * 0.01;
        
        return {
          ...amb,
          latitude: baseLatitude + radius * Math.sin(angle),
          longitude: baseLongitude + radius * Math.cos(angle),
        };
      }));
    };

    intervalRef.current = setInterval(moveAmbulances, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      stepRef.current = 0;
    };
  }, [isMounted, currentLocation]);

  const handleClose = useCallback(() => {
    setIsMounted(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    router.back();
  }, [router]);

  if (!isMounted) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            ...currentLocation,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          zoomEnabled={true}
          showsUserLocation={true}
          loadingEnabled={true}
        >
          <UrlTile 
            urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
          />
          {isMounted && ambulanceLocations.map((ambulance) => (
            <Marker
              key={ambulance.id}
              coordinate={{
                latitude: ambulance.latitude,
                longitude: ambulance.longitude,
              }}
              title={`Ambulance ${ambulance.id}`}
              description={`Distance: ${ambulance.distance} | ETA: ${ambulance.eta}`}
            >
              <View style={styles.markerContainer}>
                <FontAwesome5 name="ambulance" size={24} color="#FF3B30" />
              </View>
            </Marker>
          ))}
        </MapView>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={handleClose}
        >
          <Text style={styles.closeButtonText}>Close Map</Text>
        </TouchableOpacity>
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>Available Ambulances:</Text>
          {ambulanceLocations.map((amb) => (
            <Text key={amb.id} style={styles.infoText}>
              Ambulance {amb.id}: {amb.distance} away ({amb.eta})
            </Text>
          ))}
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
  infoBoxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
});
