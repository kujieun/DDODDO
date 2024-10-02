import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Image } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation, useRoute  } from '@react-navigation/native';

const SignupScreen = () => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [startDate, setStartDate] = useState('0000.00.00');
  const [endDate, setEndDate] = useState('0000.00.00');
  const [calendarHeight, setCalendarHeight] = useState(390); // 초기 높이 설정
  const [dateChanged, setDateChanged] = useState(false); // 날짜 변경 상태 추가
  const navigation = useNavigation();
  const route = useRoute(); // route 가져오기
  const { tripName, userInfo } = route.params;
  console.log(userInfo)

      const handleBackButton = () => {
        navigation.goBack(); // 이전 화면으로 돌아가는 함수
      };

const onDayPress = (day) => {
  const dayString = day.dateString;

  setSelectedDays((prevSelectedDays) => {
    const newSelectedDays = [...prevSelectedDays];

    // 이미 선택된 날짜를 누르면 선택 해제
    if (newSelectedDays.includes(dayString)) {
      newSelectedDays.splice(newSelectedDays.indexOf(dayString), 1);
    } else {
      // 최대 2일까지 선택 가능
      if (newSelectedDays.length < 1) {
        if (newSelectedDays.length === 0 || isNextDay(newSelectedDays[newSelectedDays.length - 1], dayString)) {
          newSelectedDays.push(dayString);
        } else if (isPrevDay(newSelectedDays[0], dayString)) {
          // 이전 날 선택 가능
          newSelectedDays.unshift(dayString);
        }
      }
    }

if (newSelectedDays.length > 0) {
        setStartDate(newSelectedDays[0]);
        setEndDate(newSelectedDays[newSelectedDays.length - 1]);
        setDateChanged(true); // 날짜가 변경되었음을 설정
      } else {
        setStartDate('0000.00.00');
        setEndDate('0000.00.00');
        setDateChanged(false); // 날짜가 초기화되었음을 설정
      }

     // 날짜 수에 따라 캘린더 높이 조정
          setCalendarHeight(Math.max(370, newSelectedDays.length * 50)); // 50px씩 늘어나는 방식

    return newSelectedDays; // 선택된 날짜 배열 반환
  });
};


  // 연속적인 날인지 확인하는 함수
  const isNextDay = (prevDay, newDay) => {
    const prevDate = new Date(prevDay);
    const nextDate = new Date(newDay);
    const difference = (nextDate - prevDate) / (1000 * 60 * 60 * 24); // 일수 차이
    return difference === 1; // 연속적인 날인지 확인
  };

  // 이전 날인지 확인하는 함수
  const isPrevDay = (nextDay, newDay) => {
    const nextDate = new Date(nextDay);
    const prevDate = new Date(newDay);
    const difference = (nextDate - prevDate) / (1000 * 60 * 60 * 24); // 일수 차이
    return difference === 1; // 연속적인 날인지 확인
  };

  // 날짜 마킹 설정
  const markedDates = {};
  selectedDays.forEach(day => {
    markedDates[day] = {
      selected: true,
      selectedColor: 'lightblue',
      disableTouchEvent: false,
      selectedDotColor: 'orange',
    };
  });

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

          <Text style={styles.headerText}>일정 만들기</Text>
        </View>
      </View>

      <Text style={styles.titleText}>언제 여행을 떠나시나요?</Text>
      <Text style={styles.subTitleText}>당일치기 일정을 만들 수 있어요</Text>

      <Calendar
        monthFormat={'M월'}
         style={[styles.calendar, { height: calendarHeight }]} // 동적 높이 적용
        style={styles.calendar}
        onDayPress={onDayPress}
        markedDates={markedDates}
        theme={{
          todayTextColor: 'red',
          dayTextColor: 'black',
          arrowColor: 'orange',
        }}
        disableAllTouchEventsForDisabledDays={false}
        disableAllTouchEventsForInactiveDays={false}
      />
<View style={styles.dateContainer}>
        <View style={styles.dateBox}>
          <Text style={styles.dateText}>여행일</Text>
          <Text style={[styles.actualDateText, { color: dateChanged ? '#6495ED' : '#696969' }]}>
            {startDate}
          </Text>
        </View>

      </View>


      {/* Submit 버튼 */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={() =>  navigation.navigate('courseyn', {tripName, startDate, endDate ,userInfo})}
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
  calendar: {
    top: 209,
    borderWidth: 1,
    borderColor: 'transparent',
    width: 326,
    alignSelf: 'center',
    borderRadius: 10,
    elevation: 2,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: 230,
    paddingHorizontal: 20,
  },
  dateBox: {
    flex: 1,
    padding: 10,
  },
  dateText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#111111',
  },
   actualDateText: {
      fontFamily: 'Pretendard-SemiBold', // 다른 폰트 이름으로 변경
      fontSize: 20,
      color: '#696969',
    },
});

export default SignupScreen;