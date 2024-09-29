import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Image, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const SignupScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userInfo } = route.params;
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState('0000.00.00');
  const [endDate, setEndDate] = useState('0000.00.00');
  const [courseDetails, setcourseDetails] = useState([]);
  


  // Firestore에서 가져오기
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const postsCollection = await firestore()
          .collection('plan') // 게시글 컬렉션
          .where('email', '==', userInfo.email) // 이메일이 일치하는 게시글만 필터링
          .get();
  
        if (!postsCollection.empty) {
          const data = postsCollection.docs.map((doc) => doc.data())[0]; // 첫 번째 데이터 사용
          setTripName(data.tripName);
          setStartDate(data.startDate);
          setEndDate(data.endDate);
          setcourseDetails(data.courseDetails || []);
        } else {
          console.error('No data found');
        }
      } catch (error) {
        console.error('Error fetching posts: ', error);
      }
    };
  
    fetchUserPosts();
  }, [userInfo.email]);

  

  const handleBackButton = () => {
    navigation.goBack(); // 이전 화면으로 돌아가는 함수
  };

  // 여행 일수 계산
  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include start day
    return diffDays;
  };

  const daysCount = calculateDays(startDate, endDate);

  const [selectedDayIndex, setSelectedDayIndex] = useState(null); // 선택된 일자의 인덱스

  // selectedDayIndex가 변경될 때마다 콘솔에 출력
  useEffect(() => {
    if (selectedDayIndex !== null) {
      console.log("Selected Day Index:", selectedDayIndex);
      // navigation.navigate('scheduledetail', { tripName, startDate, endDate, daysCount, contentid, selectedDayIndex });
    }
  }, [selectedDayIndex]);

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

      <Text style={styles.titleText}>여행 예정 일정</Text>

      <View style={styles.scheduleContainer}>
        <Text style={styles.tripName}>{tripName}</Text>
        <View style={styles.dateTextContainer}>
          <Text style={styles.dateText}>{`${startDate}~${endDate}`}</Text>
          <Text style={styles.noDaysText}>일정이 없습니다.</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => navigation.navigate('courseyn', { tripName, startDate, endDate })}
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
  scheduleContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 25,
    position: 'absolute',
    height: 131,
    left: 20,
    right: 20,
    top: 180,
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
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  dateText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.5,
    color: '#646C79',
  },
  noDaysText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.5,
    color: '#646C79',
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
