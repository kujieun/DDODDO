import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const SignupScreen = () => {
    const navigation = useNavigation();
      const handleBackButton = () => {
        navigation.goBack(); // 이전 화면으로 돌아가는 함수
      };

  return (
<View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBackButton}  // 이 부분은 문자열 없이 확실히 주석 처리
            style={styles.backButtonContainer}
          >
            <Image source={require('../../image/signup/backbutton.png')} style={styles.backButton} />
          </TouchableOpacity>

          <Text style={styles.headerText}>일정만들기</Text>
        </View>
      </View>

      {/* 중앙 텍스트 */}
      <Text style={styles.centerText}>여행 코스를 추천할까요?</Text>

      {/* Submit 버튼 */}
      <TouchableOpacity
        style={styles.yesButton}
        onPress={() =>  navigation.navigate('getcourse')}
      >
        <Text style={styles.yesButtonText}>네, 추천해주세요!</Text>
      </TouchableOpacity>

      {/* Submit 버튼 */}
            <TouchableOpacity
              style={styles.noButton}
              onPress={() => { /* 제출 버튼 클릭 시 실행될 동작 */ }}
            >
              <Text style={styles.noButtonText}>괜찮아요, 직접 만들게요!</Text>
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
  centerText: {
    flex: 1,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    color: '#111111',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: -50,
  },
  yesButton: {
    position: 'absolute',
    height: 48,
    left: 20,
    right: 20,
    bottom: 90,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6495ED',
  },
  yesButtonText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: '#FFFFFF',
  },
  noButton: {
    position: 'absolute',
    height: 48,
    left: 20,
    right: 20,
    bottom: 25,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#6495ED', // 원하는 색상
      borderWidth: 1, // 테두리 두께 추가
    backgroundColor: '#FFFFFF',
  },
  noButtonText: {
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: 16,
    color: '#000000',
  },
});

export default SignupScreen;
