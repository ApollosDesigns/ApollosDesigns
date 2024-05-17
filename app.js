import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(null);

    const register = async () => {
        try {
            const response = await axios.post('http://192.168.200.150:3000/register', { email, password });
            setToken(response.data.token);
            await AsyncStorage.setItem('token', response.data.token);
            Alert.alert('Success', 'Registered successfully');
        } catch (error) {
            Alert.alert('Error', 'Registration failed');
        }
    };

    const login = async () => {
        try {
            const response = await axios.post('http://192.168.200.150:3000/login', { email, password });
            setToken(response.data.token);
            await AsyncStorage.setItem('token', response.data.token);
            Alert.alert('Success', 'Logged in successfully');
        } catch (error) {
            Alert.alert('Error', 'Login failed');
        }
    };

    const lockHinge = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.post('http://192.168.200.150:3000/lock', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            Alert.alert('Success', 'Hinge locked');
        } catch (error) {
            Alert.alert('Error', 'Failed to lock hinge');
        }
    };

    const unlockHinge = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.post('http://192.168.200.150:3000/unlock', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            Alert.alert('Success', 'Hinge unlocked');
        } catch (error) {
            Alert.alert('Error', 'Failed to unlock hinge');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Register" onPress={register} />
            <Button title="Login" onPress={login} />
            <Button title="Lock Hinge" onPress={lockHinge} />
            <Button title="Unlock Hinge" onPress={unlockHinge} />
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
