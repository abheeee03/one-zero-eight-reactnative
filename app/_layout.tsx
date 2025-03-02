import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'red',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#ddd',
          backgroundColor: '#fff',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="ambulance" size={24} color={color} />
          ),
          headerTitle: 'Emergency Services',
        }}
      />
      {/* <Tabs.Screen
        name="home"
        options={{
          href: null, // Hide this tab but keep the route
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          href: null, // Hide this tab but keep the route
        }}
      /> */}
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user" size={24} color={color} />
          ),
          headerTitle: 'My Account',
        }}
      />
    </Tabs>
  );
}
