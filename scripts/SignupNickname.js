import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Image } from 'react-native';

const SignupScreen = () => {


  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => {/* 뒤로가기 기능 */}} style={styles.backButtonContainer}>
          <Image
            source={require('../image/signup/backbutton.png')}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>정보 입력</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressCircleContainer}>
          <View style={styles.circleEmptyProgress}></View>
          <Text style={styles.inactiveText}>약관 동의</Text>
        </View>
        <View style={styles.progressLine}></View>
        <View style={styles.progressCircleContainer}>
          <View style={styles.circleFilledProgress}></View>
          <Text style={styles.activeText}>정보입력</Text>
        </View>
      </View>


      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor:  '#B3B6BD' }]}
      >
        <Text style={styles.submitButtonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingRight: 20,
    paddingLeft: 20,
  },
  header: {
    position: 'relative',
    alignItems: 'center',
  },
  headerText: {
    top: 45,
    fontFamily: 'Pretendard',
    fontWeight: '600',
    fontSize: 16,
    color: '#111111',
    textAlign: 'center',
  },
  backButtonContainer: {
    position: 'absolute',
    left: 0,
    top: 30,
    width: 39.51,
    height: 50,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 30,
    height: 30,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 85,
    justifyContent: 'center',
    position: 'relative',
  },
  progressCircleContainer: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  circleFilledProgress: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#6495ED',
    zIndex: 2,
  },
  circleEmptyProgress: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#B3B6BD',
    zIndex: 2,
  },
  progressLine: {
    width: 56,
    height: 3,
    backgroundColor: '#B3B6BD',
    opacity: 0.5,
    position: 'absolute',
    top: 5,
    zIndex: -1,
  },
  activeText: {
    fontFamily: 'Pretendard',
    fontWeight: '600',
    fontSize: 12,
    color: '#6495ED',
    marginTop: 5,
  },
  inactiveText: {
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: 12,
    color: '#B3B6BD',
    marginTop: 5,
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
    paddingHorizontal: 121,
    paddingVertical: 2,
  },
  submitButtonText: {
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default SignupScreen;
