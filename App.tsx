import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    requestUserPermission();
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert('Notification', remoteMessage.notification?.body || 'No message body');
    });
    return unsubscribe;
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };

  const handleRequest = async (
    url: string,
    data: object,
    successMessage: string,
    errorMessage: string
  ): Promise<void> => {
    setLoading(true);
    try {
      const response = await axios.post(url, data);
      const receivedToken: string = response.data.token;
      if (receivedToken) {
        setToken(receivedToken);
        await AsyncStorage.setItem('token', receivedToken);
        Alert.alert('Success', successMessage);
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      const errorMessageText = error instanceof Error ? error.message : 'An unknown error occurred';
      Alert.alert('Error', `${errorMessage}: ${errorMessageText}`);
    } finally {
      setLoading(false);
    }
  };

  const register = (): void => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Email and Password cannot be empty');
      return;
    }
    handleRequest('http://192.168.200.150:3000/register', { email, password }, 'Registered successfully', 'Registration failed');
  };

  const login = (): void => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Email and Password cannot be empty');
      return;
    }
    handleRequest('http://192.168.200.150:3000/login', { email, password }, 'Logged in successfully', 'Login failed');
  };

  const handleHinge = async (url: string, successMessage: string, errorMessage: string): Promise<void> => {
    setLoading(true);
    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (!storedToken) throw new Error('No token found');
      await axios.post(url, {}, { headers: { Authorization: `Bearer ${storedToken}` } });
      Alert.alert('Success', successMessage);
    } catch (error) {
      const errorMessageText = error instanceof Error ? error.message : 'An unknown error occurred';
      Alert.alert('Error', `${errorMessage}: ${errorMessageText}`);
    } finally {
      setLoading(false);
    }
  };

  const lockHinge = (): void => {
    handleHinge('http://192.168.200.150:3000/lock', 'Hinge locked', 'Failed to lock hinge');
  };

  const unlockHinge = (): void => {
    handleHinge('http://192.168.200.150:3000/unlock', 'Hinge unlocked', 'Failed to unlock hinge');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Button title="Register" onPress={register} />
          <Button title="Login" onPress={login} />
          <Button title="Lock Hinge" onPress={lockHinge} />
          <Button title="Unlock Hinge" onPress={unlockHinge} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default App;
