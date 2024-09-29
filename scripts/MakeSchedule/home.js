import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const SignupScreen = () => {
  const navigation = useNavigation();
  return (
<View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => { /* 뒤로 가기 기능 구현 예정 */ }}
            style={styles.backButtonContainer}
          >
            <Image source={require('../../image/signup/backbutton.png')} style={styles.backButton} />
          </TouchableOpacity>

          <Text style={styles.headerText}>일정만들기</Text>
        </View>
      </View>

      {/* 중앙 텍스트 */}
      <Text style={styles.centerText}>아직 일정이 하나도 없어요</Text>

      {/* Submit 버튼 */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={() =>  navigation.navigate('setdate')}
      >
        <Text style={styles.submitButtonText}>새로운 일정 만들기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
      position: 'absolute',
      backgroundColor: 'white',
      height: 75,
      width: '100%',
      zIndex: 2,
    },
  header: {
    alignItems: 'center',
  },
  headerText: {
    top: 45,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#111111',
  },
  backButtonContainer: {
    position: 'absolute',
    left: 20,
    top: 30,
    width: 39.51,
    height: 50,
    justifyContent: 'center',
  },
  backButton: {
    width: 30,
    height: 30,
  },
  centerText: {
    flex: 1,
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: -50,
  },
  submitButton: {
    position: 'absolute',
    height: 48,
    left: 20,
    right: 20,
    bottom: 25,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6495ED',
  },
  submitButtonText: {
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default SignupScreen;
