import ProtectedLayout from '@/components/ProtectedRoute';
import { userAuth } from '@/Context/authContext';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileCompletionCard from '../profile/Percentage';

const profileSections = [
  {
    title: 'My Orders',
    icon: <Image source={require('@/assets/images/order.png')} style={{ height: 30, width: 23 }} />,
    link: '../profile/myorders',
  },
  {
    title: 'My Prescriptions',
    icon: <Image source={require('@/assets/images/prescription.png')} style={{ height: 30, width: 25}} />,
    link: '../profile/prescription',
  },
  {
    title: 'Wish List',
    icon: <Image source={require('../../assets/images/wishlist.png')} style={{ height: 28, width: 28 }} />,
    link: '../profile/wishlist',
  },
  {
    title: 'Tell Us What You Need',
    icon: <Image source={require('@/assets/images/suggestion.png')} style={{ height: 28, width: 28}} />,
    link: '../profile/suggestionbox',
  },
  {
    title: 'My Reports',
    icon: <Image source={require('@/assets/images/report.png')} style={{ height: 28, width: 20 }} />,
    link: '../profile/my_reports',
  },
  {
    title: 'Address Book',
    icon: <Image source={require('@/assets/images/address.png')} style={{ height: 28, width: 28 }} />,
    link: '../profile/addressbook',
  },
  {
    title: 'Terms & Conditions',
    icon: <Image source={require('@/assets/images/terms.png')} style={{ height: 32, width: 25 }} />,
    link: '../profile/terms&conditions',
  },
  {
    title: 'Settings',
    icon: <Image source={require('@/assets/images/settings.png')} style={{ height: 28, width: 28 }} />,
    link: '../profile/settings',
  },
  {
    title: 'About Us',
    icon: <Image source={require('@/assets/images/about1.png')} style={{ height: 28, width: 28}} />,
    link: '../profile/About',
  },
];

export default function ProfileScreen() {
  const { logout, userDetails } = userAuth();
  const { profileCompletion } = useLocalSearchParams();

  // Calculate fallback completion if param isn't passed
  const computedCompletion = useMemo(() => {
    const totalFields = 5;
    const filledFields = [
      userDetails?.name,
      userDetails?.mobileNo,
      userDetails?.gender,
      userDetails?.dateOfBirth,
      userDetails?.primaryAddress,
    ].filter((field) => field && field.toString().trim() !== '').length;

    return Math.round((filledFields / totalFields) * 100);
  }, [userDetails]);

  const percentage = profileCompletion ? parseInt(profileCompletion as string, 10) : computedCompletion;

  return (
    <ProtectedLayout>
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={32} color="#1A7563" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Account & Settings</Text>
            </View>
     </View> */}
        <View style={styles.box}>
          <View style={styles.editContainer}>
          <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Account & Settings</Text>
            </View>
            <TouchableOpacity style={styles.MaterialIcons} onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={32} color="#1A7563" />
            </TouchableOpacity>

     </View>

     
            <Pressable onPress={() => router.push('/profile/edit')}>
              <Image source={require('@/assets/images/edit.png')} style={{ height: 20, width: 20 }} />
            </Pressable>
          </View>

          {userDetails && <View style={styles.profileContainer}>
            <Image style={styles.avatar} source={require('../../assets/images/profileimg.png')} />
            <View style={styles.profileDetails}>
              <Text style={styles.name}>{userDetails.name || 'Loading...'}</Text>
              <Text style={styles.mobileNo}>{userDetails.mobileNo || ''}</Text>
            </View>
          </View>}

          <ProfileCompletionCard percentage={percentage} />
        </View>

        <FlatList
          data={profileSections}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(item.link)} style={styles.profileBox}>
              <View style={styles.row}>
                {item.icon}
                <Text style={styles.sectionTitle}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          )}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
    
        <View style={styles.footerTextContainer}>
          <Text style={styles.footerText}>Care Like Your <AntDesign name="heart" size={24} color="red" /> Mom</Text>
        </View>
        <View style={styles.footerTextContainer1}>
          <Text style={styles.footerText1}>Made with Love by mom Fam</Text>
        </View>

        <View style={styles.bottomLogosContainer}>
          <View style={styles.logoBlock}>
            <Image source={require('../../assets/images/momlogo.png')} style={styles.logoImage} resizeMode="contain" />
            <Text style={styles.logoText}>mom pharmacy</Text>
          </View>
          <View style={styles.logoBlock}>
            <Image source={require('../../assets/images/momlabs.png')} style={styles.logoImage} resizeMode="contain" />
            <Text style={styles.logoText}>mom labs</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    </ProtectedLayout>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  screen: { flex: 1, backgroundColor: '#fff' },
  box: { backgroundColor: '#ceebe7', paddingBottom: 16 , marginBottom: 10, borderTopLeftRadius:20, borderTopRightRadius: 20},
  header: { paddingVertical: 20, marginRight: 50,  },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  headerTitle: { fontSize: 25, fontWeight: 'bold', color: '#007e71', marginLeft: 12, marginBottom: -5 },
  editContainer: { alignItems: 'flex-end', paddingHorizontal: 20, marginTop: 10 },
  profileContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginVertical: 20 },
  avatar: { width: 150, height: 100, borderRadius: 40 },
  profileDetails: { marginLeft: 16 },
  name: { fontSize: 20, fontWeight: '700', color: '#444444', width: "80%" },
  mobileNo: {fontSize: 15, fontWeight: '700', color: '#444444' },
  email: { fontSize: 14, color: '#fff', marginTop: 4 },
  profileBox: {
    backgroundColor: '#f2faf9',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 6,
    elevation: 3,
    shadowColor: '#007e71',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: -20,

  },
  row: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#007e71', marginLeft: 12 },
  footerTextContainer: { marginTop: 30, alignItems: 'center' },
  footerText: { fontSize: 25, fontWeight: '900', color: '#44444488', marginVertical: 4 },
  footerTextContainer1: { marginTop: 10, alignItems: 'center' },
  footerText1: { fontSize: 15, fontWeight: '600', color: '#9B9B9B', marginVertical: 4 },
  bottomLogosContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, marginBottom: 30 },
  logoBlock: { alignItems: 'center', width: 150 },
  logoImage: { width: 100, height: 60, marginBottom: 10 },
  logoText: { fontSize: 14, color: '#444444', textAlign: 'center' },
  MaterialIcons: { marginLeft:-50, marginTop : -30}
});
