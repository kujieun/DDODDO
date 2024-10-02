
import React, { useState, useEffect } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    Image,
    ScrollView, Modal
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { AdvancedMarkerElement, PinElement } from '@googlemaps/markerclusterer'; // 해당 라이브러리를 가져오세요.
import PickPlace from './pickplace';
import GetCourse1 from './getcourse1';
import firestore from '@react-native-firebase/firestore';



const TourPlaceHome = ({route}) => {
    const [pressedDay, setPressedDay] = useState(1); // 사용자가 클릭한 일자
    const [tourData, setTourData] = useState([]); // 코스 정보 상태 추가
    const [courseDetails, setCourseDetails] = useState([]); // 코스 세부정보 상태 추가
    const [modalVisible, setModalVisible] = useState(false); // 모달 상태 추가
    const [pickPlaceVisible, setPickPlaceVisible] = useState(false);
    const navigation = useNavigation();
    const [scheduleByDay, setScheduleByDay] = useState(Array.from({ length: daysCount }, () => []));
    const postsCollection = firestore().collection('plan');

    // const {userInfo} = route.params;
     // const route = useRoute(); // route 가져오기
     const { tripName, startDate, endDate, contentid, selectedDayIndex, userInfo } = route.params;
     console.log(userInfo)

   
    const handleCompleteSchedule = async () => {
        console.log(userInfo)
        try {
          await postsCollection.add({
            tripName: tripName, 
            startDate: startDate, 
            endDate: endDate, 
            daysCount: daysCount,
            courseDetails: courseDetails,
            email: userInfo.email,
          });
    
          navigation.navigate('end', { tripName, startDate, endDate, daysCount, userInfo });
        } catch (error) {
          console.log(error.message);
        }
      };


    const handleBackButton = () => {
        navigation.goBack(); // 이전 화면으로 돌아가는 함수
    };

    const handleDayPress = (day) => {
        setPressedDay(day); // 클릭한 일자를 pressedDay로 설정
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


      



   const handleAddSchedule = () => {
           setPickPlaceVisible(true); // 일정 추가 모달 열기
       };

       const handleAddCourse = () => {
           setModalVisible(true); // 코스 추가 모달 열기
       };



const fetchCourseDetails = async () => {
    try {
        const response = await axios.get('http://apis.data.go.kr/B551011/KorService1/detailInfo1', {
            params: {
                numOfRows: 10,
                pageNo: 1,
                MobileOS: 'AND',
                MobileApp: '또, 강릉',
                serviceKey: 'FQpciKW/JvtOmZVINTmwg2cOAZ2XZqKAZAluhDuoWqQXqDBoJFK48P+uEyIcNqIYPYT6HJzKxdYXuwD9nOX+CA==',
                _type: 'json',
                contentId: contentid,
                contentTypeId: 25, // 관광 타입 ID
            },
        });

        if (response.data && response.data.response) {
            const courseData = response.data.response.body.items.item;

            if (Array.isArray(courseData)) {
                const detailsWithMap = await Promise.all(courseData.map(async (course) => {
                    const subcontentId = course.subcontentid; // subcontentid 가져오기
                    const subname = course.subname; // subname 가져오기

                    const itemDetails = await fetchItemDetails(subcontentId); // 아이템 세부정보 가져오기

                    // 아이템 세부정보에서 mapx와 mapy 가져오기
                    const mapx = itemDetails.mapx !== undefined ? itemDetails.mapx : null;
                    const mapy = itemDetails.mapy !== undefined ? itemDetails.mapy : null;

                    return {
                        subcontentId,
                        subname,
                        mapx,
                        mapy,
                    };
                }));

                // courseDetails 상태 업데이트
                setCourseDetails(detailsWithMap);
            } else {
                setCourseDetails([]); // courseData가 배열이 아닐 경우 빈 배열로 설정
            }
        }
    } catch (error) {
        console.error('Error fetching course details:', error);
        setCourseDetails([]); // 오류 발생 시 빈 배열로 설정
    }
};



const fetchItemDetails = async (subcontentId) => {
    try {
        const response = await axios.get('https://apis.data.go.kr/B551011/KorService1/detailCommon1', {
            params: {
                serviceKey: 'FQpciKW/JvtOmZVINTmwg2cOAZ2XZqKAZAluhDuoWqQXqDBoJFK48P+uEyIcNqIYPYT6HJzKxdYXuwD9nOX+CA==',
                MobileOS: 'AND',
                MobileApp: '또,강릉',
                _type: 'json',
                contentId: subcontentId,
                mapinfoYN: 'Y',
            },
        });

        if (response.status === 200 && response.data.response?.body?.items?.item) {
            const items = response.data.response.body.items.item;
            return {
                mapx: items[0].mapx || null,
                mapy: items[0].mapy || null,
            };
        } else {
            //console.error('No items found for subcontentId:', subcontentId);
            return { mapx: null, mapy: null };
        }
    } catch (error) {
        console.error('Error fetching item details:', error);
        return { mapx: null, mapy: null };
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
                        latitude: 37.7550, // 서울 위도 예시
                        longitude: 128.8767, // 서울 경도 예시
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >


            {courseDetails.map(item => {
                const latitude = item.mapy; // 위도
                const longitude = item.mapx; // 경도

                // 유효한 위도와 경도인지 체크
                const isValidCoordinates = latitude !== null && longitude !== null && !isNaN(latitude) && !isNaN(longitude);

                if (isValidCoordinates) {
                    return (
                        <Marker
                            key={item.subcontentId}
                            coordinate={{
                                latitude: parseFloat(latitude),  // 위도를 숫자로 변환
                                longitude: parseFloat(longitude)  // 경도를 숫자로 변환
                            }}
                            title={item.subname}
                        />
                    );
                }
                return null;
            })}


                </MapView>
            </View>

<View style={styles.dateCategoryContainer}>
    {Array.from({ length: daysCount }, (_, index) => {
       // console.log(Rendering day ${index + 1}); // Debugging log
        return (
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
        );
    })}
</View>


        <DraggableFlatList
            data={pressedDay === selectedDayIndex ? courseDetails : []}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.subcontentId}-${index}`}


            onDragEnd={({ data }) => setCourseDetails([...data])} // 새로운 배열로 상태 업데이트
            contentContainerStyle={styles.scrollContainer}
        />



            {/* 일정추가 버튼 */}
            <View style={styles.buttonframeContainer}>


                 <TouchableOpacity style={styles.frame236} onPress={handleCompleteSchedule}>
                     <Text style={styles.frameTextWhite}>일정완료</Text>
                 </TouchableOpacity>
             </View>


        {/* 코스 추가 모달 */}
            <Modal
               // animationType="slide"
               // transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)} // 모달 닫기
            >
                <View style={styles.modalView}>
                    <GetCourse1 onClose={() => setModalVisible(false)} />
                </View>
            </Modal>

            {/* 일정 추가 모달 */}
            <Modal
                //animationType="slide"
                //transparent={true}
                visible={pickPlaceVisible}
                onRequestClose={() => setPickPlaceVisible(false)} // 모달 닫기
            >
                <View style={styles.modalView}>
                    <PickPlace onClose={() => setPickPlaceVisible(false)} />
                </View>
            </Modal>
        </View>
    );



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
                        latitude: 37.7550, // 서울 위도 예시
                        longitude: 128.8767, // 서울 경도 예시
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {dailyCourseDetails[pressedDay - 1]?.map(item => {
                        const latitude = item.mapy;
                        const longitude = item.mapx;

                        if (latitude && longitude) {
                            return (
                                <Marker
                                    key={item.subcontentId}
                                    coordinate={{
                                        latitude: parseFloat(latitude),
                                        longitude: parseFloat(longitude),
                                    }}
                                    title={item.subname}
                                />
                            );
                        }
                        return null;
                    })}
                </MapView>

            </View>

<View style={styles.dateCategoryContainer}>
    {Array.from({ length: daysCount }, (_, index) => {
       // console.log(Rendering day ${index + 1}); // Debugging log
        return (
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
        );
    })}
</View>


<DraggableFlatList
    data={dailyCourseDetails[pressedDay - 1] || []} // pressedDay에 맞는 데이터 표시
    renderItem={renderItem}
    keyExtractor={(item, index) => `${item.subcontentId}-${index}`}

    onDragEnd={({ data }) => {
        const updatedDailyDetails = [...dailyCourseDetails];
        updatedDailyDetails[pressedDay - 1] = data;
        setDailyCourseDetails(updatedDailyDetails); // 변경된 데이터 업데이트
    }}
    contentContainerStyle={styles.scrollContainer}
/>
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
     modalView: {
            flex: 1,

        },
});

export default TourPlaceHome;