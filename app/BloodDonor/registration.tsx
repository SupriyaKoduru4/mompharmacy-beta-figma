import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Checkbox from 'expo-checkbox';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Keyboard, KeyboardAvoidingView, LayoutAnimation, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, UIManager, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);}
const BASE_URL = 'https://mom-beta-server1.onrender.com/api/donar';
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const locationData = {
  Telangana: {
    Hyderabad: ['Gachibowli', 'Madhapur', 'Uppal'],
    Rangareddy: ['Ghatkesar', 'LB Nagar'],
    'Hitech City': ['Cyber Towers', 'Mindspace'],
  },
  'Andhra Pradesh': {
    Vijayawada: ['Labbipet', 'Benz Circle'],
  },
};
const FAQItem = ({ question, answer }) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };
  return (
    <View style={styles.faqItem}>
      <TouchableOpacity style={styles.faqHeader} onPress={toggleExpand}>
        <Text style={styles.faqQuestion}>{question}</Text>
        <MaterialIcons 
          name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
          size={24} 
          color="#00A99D"
        />
      </TouchableOpacity>
      {expanded && <Text style={styles.faqAnswer}>{answer}</Text>}
    </View>
  );};
const RegisterScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  // Blood group dropdown state
  const [bloodOpen, setBloodOpen] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [bloodItems, setBloodItems] = useState(
    bloodGroups.map((bg) => ({ label: bg, value: bg }))
  );
  
  // Keep this for backward compatibility with the form
  const [bloodGroup, setBloodGroup] = useState('');
  
  // Sync selectedBloodGroup with bloodGroup
  useEffect(() => {
    if (selectedBloodGroup) {
      setBloodGroup(selectedBloodGroup);
    }
  }, [selectedBloodGroup]);
  const [dob, setDob] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  // Location dropdown states
  const [stateOpen, setStateOpen] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [stateItems, setStateItems] = useState(
    Object.keys(locationData).map((key) => ({ label: key, value: key }))
  );

  const [districtOpen, setDistrictOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [districtItems, setDistrictItems] = useState([]);

  const [cityOpen, setCityOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [cityItems, setCityItems] = useState([]);

  const [Pincode, setPincode] = useState('');
  const [availability, setAvailability] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  // Update district items when state changes
  useEffect(() => {
    if (selectedState) {
      const districts = Object.keys(locationData[selectedState] || {}).map((d) => ({
        label: d,
        value: d,
      }));
      setDistrictItems(districts);
      setSelectedDistrict('');
      setSelectedCity('');
      setCityItems([]);
    }
  }, [selectedState]);

  // Update city items when district changes
  useEffect(() => {
    if (selectedState && selectedDistrict) {
      const cities = (locationData[selectedState]?.[selectedDistrict] || []).map((c) => ({
        label: c,
        value: c,
      }));
      setCityItems(cities);
      setSelectedCity('');
    }
  }, [selectedDistrict]);

  const handleSubmit = async () => {
    if (!name || !mobileNumber || !email || !selectedBloodGroup || !selectedState || !selectedDistrict || !selectedCity || !Pincode) {
      Alert.alert('Error', 'Please fill all the fields.');
      return;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(mobileNumber)) {
      Alert.alert('Invalid Mobile Number', 'Mobile number must be exactly 10 digits.');
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Email must be a valid Gmail address ending with @gmail.com.');
      return;
    }
    const dataToSend = {
      name,
      bloodGroup: selectedBloodGroup,
      dob: dob.toISOString().split('T')[0],
      phone: mobileNumber,
      email,
      state: selectedState,
      city: selectedCity,
      district: selectedDistrict,
      availability,
    };
    try {
      console.log('Sending data to server:', dataToSend);
      const response = await axios.post(`${BASE_URL}/register`, dataToSend);
      console.log('Response from server:', response);
      if (response.status === 201) {
        Alert.alert('Success', 'Registration successful!');
        navigation.goBack();
      } else { Alert.alert('Error', response.data.message || 'Registration failed.');}
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('Error', 'Server error or request failed.');
    }};
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={{flex:1}}>
      <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
         
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}><MaterialIcons name="arrow-back" size={24} color="#00A99D" /></TouchableOpacity>
            <Text style={styles.headerTitle}>Register as Donor</Text></View>
          <TextInput 
            style={styles.input} 
            placeholder="Enter Your Name" 
            placeholderTextColor="#9E9E9E" 
            value={name} 
            onChangeText={setName}
          />
          <TextInput 
            style={styles.input} 
            placeholder="+91 Enter Mobile Number" 
            placeholderTextColor="#9E9E9E" 
            keyboardType="phone-pad" 
            value={mobileNumber} 
            onChangeText={setMobileNumber}
          />
          <TextInput 
            style={styles.input} 
            placeholder="Enter Email" 
            placeholderTextColor="#9E9E9E"
            value={email} 
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity 
            onPress={() => {
              Keyboard.dismiss();
              setShowDatePicker(true);
            }} 
            style={[styles.input, {justifyContent: 'center', backgroundColor: '#E8F5F3'}]}
          >
            <Text style={{color: dob ? '#212121' : '#9E9E9E', fontSize: 18}}>
              {dob ? dob.toDateString() : 'Select your date of birth'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker 
              value={dob || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                if (Platform.OS === 'android') {
                  setShowDatePicker(false);
                }
                if (selectedDate) {
                  setDob(selectedDate);
                }
              }}
              maximumDate={new Date()}
              style={styles.datePicker}
            />
          )}
          {Platform.OS === 'ios' && showDatePicker && (
            <View style={styles.iosButtons}>
              <TouchableOpacity 
                style={styles.iosButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.iosButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.iosButton, {backgroundColor: '#00A99D'}]}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={[styles.iosButtonText, {color: 'white'}]}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.locationRow}>
            <View style={[styles.dropdownContainer, {flex: 1}]}>
              <DropDownPicker
                open={stateOpen}
                value={selectedState}
                items={stateItems}
                setOpen={setStateOpen}
                setValue={setSelectedState}
                setItems={setStateItems}
                placeholder="Select State"
                placeholderStyle={styles.placeholderStyle}
                style={[styles.dropdown, {flex: 1}]}
                textStyle={styles.dropdownText}
                listMode="MODAL"
                modalProps={{
                  animationType: 'slide',
                }}
                onOpen={() => {
                  if (districtOpen) setDistrictOpen(false);
                  if (cityOpen) setCityOpen(false);
                  if (bloodOpen) setBloodOpen(false);
                }}
              />
            </View>
            <View style={[styles.dropdownContainer, {flex: 1}]}>
              <DropDownPicker
                open={districtOpen}
                value={selectedDistrict}
                items={districtItems}
                setOpen={setDistrictOpen}
                setValue={setSelectedDistrict}
                setItems={setDistrictItems}
                placeholder="Select District"
                placeholderStyle={styles.placeholderStyle}
                style={[styles.dropdown, {flex: 1}]}
                textStyle={styles.dropdownText}
                disabled={!selectedState}
                listMode="MODAL"
                modalProps={{
                  animationType: 'slide',
                }}
                onOpen={() => {
                  if (stateOpen) setStateOpen(false);
                  if (cityOpen) setCityOpen(false);
                  if (bloodOpen) setBloodOpen(false);
                }}
              />
            </View>
          </View>

          <View style={styles.locationRow}>
            <View style={[styles.dropdownContainer, {flex: 2}]}>
              <DropDownPicker
                open={cityOpen}
                value={selectedCity}
                items={cityItems}
                setOpen={setCityOpen}
                setValue={setSelectedCity}
                setItems={setCityItems}
                placeholder="Select City"
                placeholderStyle={styles.placeholderStyle}
                style={styles.dropdown}
                textStyle={styles.dropdownText}
                disabled={!selectedDistrict}
                listMode="MODAL"
                modalProps={{
                  animationType: 'slide',
                }}
                onOpen={() => {
                  if (stateOpen) setStateOpen(false);
                  if (districtOpen) setDistrictOpen(false);
                  if (bloodOpen) setBloodOpen(false);
                }}
              />
            </View>
            <View style={[styles.dropdownContainer, {flex: 1, marginLeft: 10}]}>
              <TextInput 
                style={styles.input} 
                placeholder="Pincode" 
                placeholderTextColor="grey" 
                keyboardType="phone-pad" 
                value={Pincode}
                onChangeText={setPincode}
              />
            </View>
          </View>

          <View style={styles.dropdownContainer}>
            <DropDownPicker
              open={bloodOpen}
              value={selectedBloodGroup}
              items={bloodItems}
              setOpen={setBloodOpen}
              setValue={setSelectedBloodGroup}
              setItems={setBloodItems}
              placeholder="Select Blood Group"
              placeholderStyle={styles.placeholderStyle}
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              listMode="MODAL"
              modalProps={{
                animationType: 'slide',
              }}
              onOpen={() => {
                if (stateOpen) setStateOpen(false);
                if (districtOpen) setDistrictOpen(false);
                if (cityOpen) setCityOpen(false);
              }}
            />
          </View>
          <Text style={[styles.label, {fontFamily: 'PlusJakartaSans-Medium'}]}>I am available to donate my blood?</Text>
          <View style={styles.availabilityContainer}>
            <TouchableOpacity onPress={() => setAvailability(true)} style={styles.checkboxRow}>
              <Checkbox value={availability === true} color="#00A99D" />
              <Text style={styles.checkboxLabel}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setAvailability(false)} style={styles.checkboxRow}>
              <Checkbox value={availability === false} color="#00A99D" />
              <Text style={styles.checkboxLabel}>No</Text>
            </TouchableOpacity></View>
          <View style={styles.checkboxRow}>
            <Checkbox value={authorized} onValueChange={setAuthorized} color="#00A99D" />
            <Text style={styles.checkboxLabel}>Agree for Terms & Condition</Text></View>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Register</Text></TouchableOpacity>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <FAQItem
            question="Who can donate?"
            answer="Healthy individuals between 18-65 years and above 50kg, and with a hemoglobin level of at least 12.5 g/dL."/>
          <FAQItem question="When to donate?" answer="Once every 6 months if healthy." />
          <FAQItem
            question="Which food should eat after donating blood?"
            answer={`Iron-rich: Lean meat, poultry, fish (like tuna and salmon), beans, spinach, fortified cereals, raisins, and legumes.
Vitamin C-rich: Citrus fruits, berries, bell peppers, tomatoes.
Hydrating: Water, juice, broth, and herbal tea.
Whole grains: Brown rice, quinoa, oats, and whole wheat bread.
Protein: Eggs, cashews, almonds.`}/>
          <Text style={styles.sectionMain}>Help a heart beat and become the hero someone needs.</Text>
          <View style={styles.bottomLogosContainer}>
            <View style={styles.logoBlock}>
              <Image source={require('../../assets/images/mom.png')} style={styles.logoImage} resizeMode="contain" />
              <Text style={styles.logoText}>mom pharmacy</Text></View>
            <View style={styles.logoBlock}>
              <Image source={require('../../assets/images/momlab.png')} style={styles.logoImage} resizeMode="contain"/>
              <Text style={styles.logoText}>mom labs</Text>
            </View></View></ScrollView></Pressable></SafeAreaView></KeyboardAvoidingView>);};
const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: 'white' },
  locationRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 12,
    gap: 10,
  },
  dropdownContainer: { flex: 1 },
  dropdown: { 
    borderColor: 'transparent', 
    borderWidth: 0, 
    borderRadius: 8, 
    paddingHorizontal: 12,
    minHeight: 48,
    justifyContent: 'center',
    backgroundColor: '#E8F5F3',
  },
  placeholderStyle: { 
    color: '#9E9E9E',
    fontSize: 18,
    fontWeight: '400',
  },
  dropdownText: { 
    fontSize: 18, 
    color: '#212121',
    fontWeight: '400',
  },
  header: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 18, color: 'black', fontWeight: 'bold', textAlign: 'left', left:10 },
  input: { 
    borderColor: 'transparent', 
    borderWidth: 0, 
    borderRadius: 8, 
    paddingHorizontal: 16,
    paddingVertical: 12, 
    marginBottom: 12,
    color: '#212121',
    fontSize: 18,
    minHeight: 48,
    backgroundColor: '#E8F5F3',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  label: { fontSize: 18, fontWeight: '500', marginVertical: 10, color: 'grey' },
  bloodGroupContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 15 },
  bloodDropWrapper: { margin: 8, borderRadius: 40, padding: 5 },
  bloodDropWrapperSelected: { borderWidth: 2, borderColor: '#00A99D' },
  bloodIconWrapper: {width: 60,height: 60,borderRadius: 30,backgroundColor: 'white',alignItems: 'center',justifyContent: 'center',position: 'relative'},
  bloodOverlayText: { position: 'absolute', color: 'white', fontSize: 10, textAlign: 'center', zIndex: 1 },
  availabilityContainer: { flexDirection: 'row', marginBottom: 15, justifyContent: 'flex-start' },
  checkboxRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginRight: 15,
    marginBottom: 8,
  },
  checkboxLabel: { 
    fontSize: 14, 
    marginLeft: 8,
    color: '#212121',
  },
  button: {
    backgroundColor: '#00A99D',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  datePicker: {
    width: '100%',
    backgroundColor: 'white',
  },
  iosButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  iosButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginLeft: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  iosButtonText: {
    fontSize: 16,
    color: '#00A99D',
    fontWeight: '600',
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  sectionMain: { fontSize: 24, marginTop: 20, paddingTop: 20, color: 'grey'},
  faqItem: { 
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 12,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: { 
    fontSize: 15, 
    color: '#212121',
    fontWeight: '500',
    flex: 1,
  },
  faqAnswer: { 
    fontSize: 13, 
    color: '#616161', 
    marginTop: 8,
    lineHeight: 20,
  },
  bottomLogosContainer: {flexDirection: 'row',justifyContent: 'space-around',alignItems: 'center',marginTop: 20,marginBottom: 30},
  logoBlock: { alignItems: 'center', width: 150 },
  logoImage: { width: 120, height: 80, marginBottom: 5 },
  logoText: { fontSize: 14, color: '#333', textAlign: 'center' },
});
export default RegisterScreen;