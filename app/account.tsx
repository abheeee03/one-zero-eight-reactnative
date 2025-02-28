import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function AccountScreen() {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in with Google</Text>
      <TouchableOpacity style={styles.googleButton} >
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  googleButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
