import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar } from 'react-native'; // StatusBar 추가

const SignupScreen = () => {
  return (
    <View style={styles.container}>
      {/* 상태바 설정 */}
      <StatusBar
        translucent
        backgroundColor="transparent" // 상태바 배경 투명으로 설정
        barStyle="dark-content" // 상태 표시줄 내용물 색상 설정
      />

      {/* 헤더 영역 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {/* 뒤로가기 기능 */}} style={styles.backButtonContainer}>
          <Image
            source={require('../image/signup/backbutton.png')}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>이용약관</Text>
      </View>

      {/* 약관 동의 섹션 */}
      <View style={styles.agreementContainer}>
        <View style={styles.agreementOption}>
          <View style={styles.circleFilled}></View>
          <Text style={styles.activeText}>약관 동의</Text>
        </View>
        <View style={styles.agreementOption}>
          <View style={styles.circleEmpty}></View>
          <Text style={styles.inactiveText}>정보입력</Text>
        </View>
      </View>

      <View style={styles.line}></View>

      {/* 전체 동의 박스 */}
      <View style={styles.agreementBox}>
        <View style={styles.checkBox}></View>
        <Text style={styles.agreementText}>전체 동의합니다</Text>
      </View>

      <View style={styles.divider}></View>

      {/* 상세 약관 */}
      <View style={styles.agreementDetailBox}>
        <View style={styles.checkBox}></View>
        <Text style={styles.detailText}>[필수] 서비스 이용약관</Text>
      </View>

      <View style={styles.agreementDetailBox}>
        <View style={styles.checkBox}></View>
        <Text style={styles.detailText}>[필수] 만 14세 이상입니다.</Text>
      </View>

      <View style={styles.agreementDetailBox}>
        <View style={styles.checkBox}></View>
        <Text style={styles.detailText}>[필수] 개인정보 수집 및 이용 동의</Text>
      </View>

      <View style={styles.agreementDetailBox}>
        <View style={styles.checkBox}></View>
        <Text style={styles.optionalText}>[선택] 위치 서비스 이용 동의</Text>
      </View>

      {/* 제출 버튼 */}
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>동의하고 시작하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  header: {
    position: 'relative',
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'Pretendard',
    fontWeight: '600',
    fontSize: 16,
    color: '#111111',
    textAlign: 'center',
  },
  backButtonContainer: {
    position: 'absolute',
    left: 5,
    top: 30,
    width: 39.51,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 24,
    height: 24,
  },
  agreementContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
  },
  agreementOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeText: {
    fontFamily: 'Pretendard',
    fontWeight: '600',
    fontSize: 12,
    color: '#6495ED',
    marginLeft: 10,
  },
  inactiveText: {
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: 12,
    color: '#B3B6BD',
    marginLeft: 10,
  },
  circleFilled: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#6495ED',
  },
  circleEmpty: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#B3B6BD',
  },
  line: {
    borderBottomWidth: 1,
    borderColor: '#B3B6BD',
    marginVertical: 20,
  },
  agreementBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBox: {
    width: 20,
    height: 20,
    borderColor: '#DDDEE0',
    borderWidth: 1,
    borderRadius: 5,
  },
  agreementText: {
    fontFamily: 'Pretendard',
    fontWeight: '600',
    fontSize: 16,
    color: '#111111',
    marginLeft: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: '#B3B6BD',
    marginVertical: 10,
  },
  agreementDetailBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  detailText: {
    fontFamily: 'Pretendard',
    fontWeight: '600',
    fontSize: 14,
    color: '#111111',
    marginLeft: 10,
  },
  optionalText: {
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: 14,
    color: '#111111',
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: '#6495ED',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 40,
  },
  submitButtonText: {
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default SignupScreen;
