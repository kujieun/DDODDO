import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const SignupScreen = () => {
  const navigation = useNavigation();

  const handleBackButton = () => {
    navigation.goBack(); // 이전 화면으로 돌아가는 함수
  };

  const route = useRoute(); // route 가져오기
  const { tripName, startDate, endDate, contentid } = route.params;

  // 여행 일수 계산
  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include start day
    return diffDays;
  };

  const daysCount = calculateDays(startDate, endDate);
  const daysArray = Array.from({ length: daysCount }, (_, i) => `${i + 1}일차`);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null); // 선택된 일자의 인덱스

 // selectedDayIndex가 변경될 때마다 콘솔에 출력
  useEffect(() => {
    if (selectedDayIndex !== null) {
      console.log("Selected Day Index:", selectedDayIndex);
      navigation.navigate('scheduledetail', { tripName, startDate, endDate, daysCount, contentid, selectedDayIndex });
    }
  }, [selectedDayIndex])

  const getDayBoxWidth = (daysCount) => {
    switch (daysCount) {
      case 1:
        return '100%';
      case 2:
        return '50%';
      case 3:
        return '33%';
      default:
        return '100%'; // 기본값은 100%
    }
  };

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

        <View style={styles.lineContainer}>
          <View style={styles.line} />
        </View>
      </View>

      <Text style={styles.titleText}>코스를 어디에 추가하시나요?</Text>
        <TouchableOpacity
          style={styles.frame280}
          onPress={() => {

          }}
        >
          <Text style={styles.subTitleText}>새로운 일정 만들기</Text>
        </TouchableOpacity>

      <Text style={{ fontFamily: 'Pretendard-SemiBold', fontSize: 15, top: 226, left: 20, color: '#000000' }}>
        내 일정
      </Text>

    {/* 여행 일정 컨테이너 */}
    <View style={styles.scheduleContainer}>
      <Text style={styles.tripName}>{tripName}</Text>
      <View style={styles.dateTextContainer}>
        <Text style={styles.dateText}>{`${startDate}~${endDate}`}</Text>
        <View style={styles.daysCountContainer}>
          {daysArray && daysArray.length > 0 ? (
            daysArray.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dayBox, { width: getDayBoxWidth(daysArray.length) }]} // Adjust width
                onPress={() => {
                  setSelectedDayIndex(index+1); // 선택된 인덱스 저장
                  navigation.navigate('scheduledetail', { tripName, startDate, endDate, daysCount, contentid, selectedDayIndex });
                }}
              >
                <Text style={styles.dayText}>{day}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noDaysText}>일정이 없습니다.</Text> // 비어있는 경우 처리
          )}
        </View>
      </View>
    </View>
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
    height: 80,
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
  lineContainer: {
    position: 'absolute',
    top: 81,
    width: '100%',
    flexDirection: 'row',
    height: 2,
    backgroundColor: '#6495ED',
  },
  line: {
    width: 60,
    height: 2,
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
  frame280: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: 148,
    height: 28,
    left: 20,
    top: 162,
    backgroundColor: '#6495ED',
    borderRadius: 12,
  },
  subTitleText: {
    width: 108,
    height: 22,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: -0.025,
    color: '#FFFFFF',
  },
  scheduleContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 25,
    position: 'absolute',
    height: 131,
    left: 20,
    right: 20,
    top: 263,
    backgroundColor: '#DCEFFF',
    borderRadius: 20,
    elevation: 2,
  },
  tripName: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.5,
    color: '#111111',
    marginBottom: 2,
  },
  dateTextContainer: {
    display: 'flex',
    flexDirection: 'column',  // 변경: 가로로 정렬
    alignItems: 'flex-start',
  },
  dateText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.5,
    color: '#646C79',
  },
  daysCountContainer: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 6,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.025,
    color: '#646C79',
  },
});

export default SignupScreen;
