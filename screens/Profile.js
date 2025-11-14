import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile({ navigation }) {
  const { user, logout, saveProfile } = useContext(AuthContext);

  const [firstName, setFirstName] = useState(user?.name || '');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(null);

  // checkboxes
  const [orderStatus, setOrderStatus] = useState(false);
  const [passwordChanges, setPasswordChanges] = useState(false);
  const [offers, setOffers] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const saved = await AsyncStorage.getItem('@profile');
      if (saved) {
        const data = JSON.parse(saved);
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
        setAvatar(data.avatar || null);
        setOrderStatus(!!data.orderStatus);
        setPasswordChanges(!!data.passwordChanges);
        setOffers(!!data.offers);
        setNewsletter(!!data.newsletter);
      }
    } catch (err) {
      console.log('Failed to load profile', err);
    }
  };

  // Simple US phone validation
  const isPhoneValid = (p) => {
    const regex = /^\(?([0-9]{3})\)?[-.●\s]?([0-9]{3})[-.●\s]?([0-9]{4})$/;
    return regex.test(p);
  };

  // Image picker with permission request and robust result handling
  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Permission to access media library is required.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });

      // result can be either { cancelled: true } (old) or { canceled: true, assets: [...] } (new)
      if (result.canceled === true || result.cancelled === true) {
        return;
      }

      // prefer new shape: result.assets[0].uri
      const uri =
        (result.assets && result.assets[0] && result.assets[0].uri) ||
        (result.uri) ||
        null;

      if (uri) setAvatar(uri);
    } catch (err) {
      console.log('Image pick error', err);
      Alert.alert('Error', 'Could not pick image.');
    }
  };

  const handleSave = async () => {
    if (phone && !isPhoneValid(phone)) {
      Alert.alert('Invalid Phone Number', 'Enter a valid U.S. phone number (e.g. 555-555-5555).');
      return;
    }

    const profileData = {
      firstName,
      lastName,
      email,
      phone,
      avatar,
      orderStatus,
      passwordChanges,
      offers,
      newsletter,
    };

    try {
      await AsyncStorage.setItem('@profile', JSON.stringify(profileData));
      // update auth context if you want user's display name/email to update globally
      if (saveProfile) {
        saveProfile({ name: firstName, email });
      }
      Alert.alert('Profile saved', 'Your profile changes have been saved.');
    } catch (err) {
      console.log('Save profile error', err);
      Alert.alert('Error', 'Failed to save profile.');
    }
  };

  const handleLogout = async () => {
    try {
      // remove profile and any other keys you want cleared
      await AsyncStorage.removeItem('@profile');
    } catch (err) {
      console.log('Error clearing profile key', err);
    }
    // auth context logout (also should clear stored user)
    if (logout) logout();
  };

  const getInitials = () => {
    const f = firstName?.trim()?.charAt(0)?.toUpperCase() || '';
    const l = lastName?.trim()?.charAt(0)?.toUpperCase() || '';
    return (f + l) || (user?.name ? user.name.charAt(0).toUpperCase() : '');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>

      <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.initials}>
            <Text style={styles.initialsText}>{getInitials()}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Personal Information</Text>

      <TextInput
        style={styles.input}
        placeholder="First name"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Last name"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Phone number (US only)"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text style={styles.sectionTitle}>Email Notifications</Text>

      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setOrderStatus(!orderStatus)}
      >
        <View style={[styles.checkbox, orderStatus && styles.checkboxSelected]} />
        <Text style={styles.checkboxText}>Order Status</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setPasswordChanges(!passwordChanges)}
      >
        <View style={[styles.checkbox, passwordChanges && styles.checkboxSelected]} />
        <Text style={styles.checkboxText}>Password Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setOffers(!offers)}
      >
        <View style={[styles.checkbox, offers && styles.checkboxSelected]} />
        <Text style={styles.checkboxText}>Special Offers</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setNewsletter(!newsletter)}
      >
        <View style={[styles.checkbox, newsletter && styles.checkboxSelected]} />
        <Text style={styles.checkboxText}>Newsletter</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 12 }}>
        <Button title="Save Changes" onPress={handleSave} />
      </View>

      <View style={{ marginTop: 12 }}>
        <Button title="Log Out" color="red" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#495E57',
    padding: 20,
  },
  header: {
    color: '#F4CE14',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    color: '#EDEFEE',
    fontSize: 18,
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#EDEFEE',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#F4CE14',
  },
  initials: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#EDEFEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#495E57',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#EDEFEE',
    marginRight: 10,
  },
  checkboxSelected: {
    backgroundColor: '#F4CE14',
    borderColor: '#F4CE14',
  },
  checkboxText: {
    color: '#EDEFEE',
    fontSize: 16,
  },
});
