import React, { useState, useEffect } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    Image,
    ScrollView
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import DraggableFlatList from 'react-native-draggable-flatlist';

const TourPlaceHome = () => {
    const [pressedDay, setPressedDay] = useState(1); // 사용자가 클릭한 일자
    const [tourData, setTourData] = useState([]); // 코스 정보 상태 추가
    const [courseDetails, setCourseDetails] = useState([]); // 코스 세부정보 상태 추가
    const navigation = useNavigation();

    const handleBackButton = () => {
        navigation.goBack(); // 이전 화면으로 돌아가는 함수
    };

    const handleDayPress = (day) => {
        setPressedDay(day); // 클릭한 일자를 pressedDay로 설정
    };

    const route = useRoute(); // route 가져오기
    const { tripName, startDate, endDate, daysCount, contentid, selectedDayIndex } = route.params;

    useEffect(() => {
        console.log('Route Params:', route.params); // route.params의 값을 확인
        console.log('Selected Day Index:', selectedDayIndex);
    }, [route.params, selectedDayIndex]);

    const fetchCourseDetails = async () => {
        try {
            const response = await axios.get('http://apis.data.go.kr/B551011/KorService1/detailInfo1', {
                params: {
                    numOfRows: 10,
                    pageNo: 1,
                    MobileOS: 'AND',
                    MobileApp: '또, 강릉',
                    serviceKey: 'FQpciKW/JvtOmZVINTmwg2cOAZ2XZqKAZAluhDuoWqQXqDBoJFK48P+uEyIcNqIYPYT6HJzKxdYXuwD9nOX+CA==', // 여기에 본인의 서비스 키를 입력하세요
                    _type: 'json',
                    contentId: contentid,
                    contentTypeId: 25, // 관광 타입 ID
                },
            });

            // API 호출 결과에서 코스 세부 정보 추출
            if (response.data && response.data.response) {
                const courseData = response.data.response.body.items.item;

                // Ensure courseData is an array
                if (Array.isArray(courseData)) {
                    setCourseDetails(courseData);
                } else {
                    setCourseDetails([]); // Set to empty array if not an array
                }
                //console.log('Course Details:', courseData); // 코스 세부정보를 콘솔에 출력
            }
        } catch (error) {
            console.error('Error fetching course details:', error);
            setCourseDetails([]); // Ensure courseDetails is an array even on error
        }
    };

    useEffect(() => {
        fetchCourseDetails();
    }, [contentid]); // contentid 변경 시마다 데이터 fetch


     // Function to handle dragging
const renderItem = ({ item, index, drag, isActive }) => {
 // item의 복사본 생성
    const newItem = { ...item }; // 얕은 복사

    return (
        <TouchableOpacity
            style={[
                styles.cardContainer,
                { backgroundColor: isActive ? '#ffffff' : '#DCEFFF' }
            ]}
            onLongPress={drag} // 롱 프레스 시 드래그 시작
        >
            <Text style={styles.subnameText}>{newItem.subname}</Text>
        </TouchableOpacity>
    );
};


    return (
        <View style={styles.container}>
            <StatusBar translucent={true} backgroundColor="transparent" barStyle="dark-content" />
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBackButton} style={styles.backButtonContainer}>
                        <Image source={require('../../image/signup/backbutton.png')} style={styles.backButton} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>일정정하기</Text>
                    <TouchableOpacity style={styles.actionButtonContainer} />
                </View>
            </View>

            <View horizontal style={styles.imageView}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: 37.5665, // 서울 위도 예시
                        longitude: 126.9780, // 서울 경도 예시
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <Marker
                        coordinate={{ latitude: 37.5665, longitude: 126.9780 }} // 마커 위치
                        title="서울"
                        description="서울의 중심"
                    />
                </MapView>
            </View>

            <View style={styles.dateCategoryContainer}>
                {Array.from({ length: daysCount }, (_, index) => (
                    <TouchableOpacity
                        key={index + 1}
                        onPress={() => handleDayPress(index + 1)}
                        style={styles.group}
                    >
                        <Text style={[styles.dayText, pressedDay === index + 1 && styles.activeDayText]}>
                            {index + 1}일차
                        </Text>
                        <View style={[styles.line, pressedDay === index + 1 && styles.activeLine]} />
                    </TouchableOpacity>
                ))}
            </View>

<DraggableFlatList
    data={pressedDay === selectedDayIndex ? courseDetails : []}
    renderItem={renderItem}
    keyExtractor={(item, index) => `${item.contentid}-${index}`} // contentid와 index 결합
    onDragEnd={({ data }) => setCourseDetails([...data])} // 새로운 배열로 상태 업데이트
    contentContainerStyle={styles.scrollContainer}
/>



            {/* 일정추가 버튼 */}
            <View style={styles.buttonframeContainer}>
                <TouchableOpacity style={styles.frame234}>
                    <Text style={styles.frameText}>일정추가</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.frame234}>
                    <Text style={styles.frameText}>코스추가</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.frame236}>
                    <Text style={styles.frameTextWhite}>일정완료</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    // Container Styles
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerContainer: {
        position: 'absolute',
        backgroundColor: 'white',
        height: 75,
        width: '100%',
        zIndex: 1,
    },
    header: {
        top: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    headerText: {
        fontFamily: 'Pretendard-SemiBold',
        fontSize: 16,
        color: '#000000',
    },
    backButtonContainer: {
        width: 39.51,
        height: 50,
        justifyContent: 'center',
    },
    backButton: {
        width: 30,
        height: 30,
    },
    actionButtonContainer: {
        width: 42,
        height: 50,
        justifyContent: 'center',
    },

    // Map Styles
    imageView: {
        marginTop: 70,
        width: Dimensions.get('window').width,
        height: 265,
    },
    map: {
        width: '100%',
        height: '100%',
    },

    // Date Category Styles
    dateCategoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    group: {
        flex: 1, // 각 그룹이 동일한 너비를 가짐
        alignItems: 'center',
    },
    dayText: {
        fontFamily: 'Pretendard',
        fontWeight: '600',
        fontSize: 16,
        color: '#B8B6C3',
    },
    activeDayText: {
        color: '#6495ED',
    },
    line: {
        height: 2,
        width: '100%',
        backgroundColor: '#B8B6C3',
        marginTop: 5,
    },
    activeLine: {
        backgroundColor: '#6495ED',
    },

    // Draggable FlatList Styles
    scrollContainer: {
        flexGrow: 1,
        flexDirection: 'column', // 수직 방향으로 배치
        paddingVertical: 20,    // 카드들 간의 상하 여백 추가 (필요 시)
    },

    // Button Styles
    buttonframeContainer: {
        position: 'absolute',
        bottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        width: '100%',
        gap:10,
    },
    frame234: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 2,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#6495ED',
        borderRadius: 12,
        height: 40,
        flex: 1,
    },
    frame236: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 2,
        backgroundColor: '#6495ED',
        borderRadius: 12,
        height: 40,
        flex: 1,
    },
    frameText: {
        color: '#6495ED',
    },
    frameTextWhite: {
        color: '#FFFFFF',
    },
    cardContainer: {
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 10,
        shadowColor: '#DCEFFF',
        elevation: 2,
        alignSelf: 'flex-start',
    },
    subnameText: {
        fontFamily: 'Pretendard',
        fontSize: 15,
        color: '#000000',
    },
});

export default TourPlaceHome;
