import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MomPharmacy() {
  React.useEffect(() => {

  }, []);

  return (
    <SafeAreaView>
    <View style={styles.container}>
      
        <TouchableOpacity style={styles.backButton} onPress={() => { router.back()}}>
          <MaterialIcons name="arrow-back" size={24} color="#0d7377" />
        </TouchableOpacity>
       <View >
        <Text style={styles.title}>mom pharmacy</Text>

        
        </View>
        <Text style={styles.subtitle}>From Prescription to Paper-In a Tap </Text>
        <Image
          source={require('../../assets/images/print.gif')}
          style={styles.ctaIcon}
        />


        <Text style={styles.comingSoon}>Coming soon..</Text>
     
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
  
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
   
height:'100%'
  },
  
  backButton: {
    position: 'absolute',
    top: 24,
    left: 20,
  },
  title: {
    color: '#0d7377',
    fontWeight: '600',
    fontSize: 24,
    marginTop:-200
   
  },
  subtitle: {
    color: '#6b7280',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  ctaIcon: {
    width: 160,
    height: 160,
    marginBottom: 24,
  },
  comingSoon: {
    color: '#6b7280',
    fontWeight: '600',
    fontSize: 14,
  },
});