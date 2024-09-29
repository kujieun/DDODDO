import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const SignupScreen = ({route}) => {
const navigation = useNavigation();
const {userInfo} = route.params;

  const handleBackButton = () => {
    navigation.goBack(); // 이전 화면으로 돌아가는 함수
  };
  const [tripName, setTripName] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBackButton}
            style={styles.backButtonContainer}
          >
            <Image source={require('../../image/makeschedule/backbutton.png')} style={styles.backButton} />
          </TouchableOpacity>

          <Text style={styles.headerText}>일정만들기</Text>
        </View>
      </View>

      <Text style={styles.titleText}>여행의 이름을 지어주세요!</Text>
      <Text style={styles.subTitleText}>재미있는 이름을 지어주세요</Text>

      {/* 여행 이름 입력 박스 */}
      <View style={styles.tripnameContainer}>
        <Text style={styles.whatnameText}>이번 여행 이름은</Text>
        <TextInput
          style={styles.inputField}
          placeholder="여행 이름 입력"
          value={tripName}
          onChangeText={setTripName}
        />
        <Image source={require('../../image/makeschedule/character.png')} style={styles.character} />
      </View>

      {/* Submit 버튼 */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={() =>  navigation.navigate('setdate1', {tripName, userInfo})}
      >
        <Text style={styles.submitButtonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(220, 239, 255, 0.3)', // 30% 투명도
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
  titleText: {
    position: 'absolute',
    height: 30,
    left: 21,
    top: 130,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    color: '#111111',
  },
  subTitleText: {
    position: 'absolute',
    height: 20,
    left: 21,
    top: 164,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#3E3D5D',
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
  tripnameContainer: {
    position: 'absolute',
    left: 20,
    top: 233, // 상대적인 위치 설정
    width: 320,
    height: 302, // 높이 추가
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderColor: '#B3B6BD',
    borderWidth: 1,
    padding: 20, // 내부 padding 설정
    justifyContent: 'flex-start', // 내용 상단 정렬
  },
  whatnameText: {
    marginTop: 40,
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#111111',
    marginBottom: 10, // 아래 여백 추가
  },
  inputField: {
    height: 42,
    borderColor: '#B3B6BD',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 15, // 요소 사이 여백 추가
  },
  character: {
    marginTop: 10, // Adjusted top margin for spacing
    width: 134, // Set the width as needed
    height: 123, // Set the height as needed
    alignSelf: 'center', // Center horizontally
  },
});

export default SignupScreen;
