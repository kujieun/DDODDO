import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity, StatusBar, Image, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; // Navigation hook 추가
import MapView, { Marker } from 'react-native-maps';

const TourPlaceHome = ({ route }) => {
  const navigation = useNavigation();
  const { contentid } = route.params;
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tourData, setTourData] = useState([]);
  const [placeName, setPlaceName] = useState('');
  const [overview, setOverview] = useState(''); // overview 상태 추가
const [mapx, setMapx] = useState(null);
  const [mapy, setMapy] = useState(null);

  const fetchItemDetails = async () => {
    try {
      const response = await axios.get('https://apis.data.go.kr/B551011/KorService1/detailCommon1', {
        params: {
          serviceKey: 'FQpciKW/JvtOmZVINTmwg2cOAZ2XZqKAZAluhDuoWqQXqDBoJFK48P+uEyIcNqIYPYT6HJzKxdYXuwD9nOX+CA==',
          numOfRows: 10,
          pageNo: 1,
          MobileOS: 'AND',
          MobileApp: '또,강릉',
          _type: 'json',
          defaultYN: 'Y',
          contentId: contentid,
          firstImageYN: 'Y',
          overviewYN: 'Y',
          addrinfoYN: 'Y',
          mapinfoYN: 'Y',
        },
      });

      console.log('API Response:', response.data);

      if (response.status === 200 && response.data.response?.body?.items?.item) {
        const items = response.data.response.body.items.item;

        const formattedData = items.map(item => ({
          title: item.title || "No Title",
          overview: item.overview || "No Overview",
          firstimage: item.firstimage || '',
          addr1: item.addr1 || "No Address",
          tel: item.tel || "No Phone Number",
          homepage: item.homepage || "No Website",
          mapx: item.mapx || null,
          mapy: item.mapy || null,
        }));

        setTourData(formattedData);
        setPlaceName(items[0].title || 'Unknown Place');
        setOverview(extractFirstSentence(items[0].overview || 'No Overview')); // 첫 문장만 추출하여 상태에 저장
        setMapx(items[0].mapx || null);
                setMapy(items[0].mapy || null);
      } else {
        setError('No items found.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemDetails();
  }, []);

  const handleBackButton = () => {
    navigation.goBack(); // 이전 화면으로 돌아가는 함수
  };

  const handleActionPress = () => {
    setIsLiked(!isLiked);
  };

  // 개요에서 첫 문장만 추출하는 함수
  const extractFirstSentence = (text) => {
    if (!text) return '';
    const periodIndex = text.indexOf('.');
    if (periodIndex === -1) return text; // 문장이 없으면 원본 반환
    return text.substring(0, periodIndex + 1); // 첫 문장만 반환
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent={true} backgroundColor="transparent" barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBackButton}
          style={styles.backButtonContainer}
        >
          <Image source={require('../image/signup/backbutton.png')} style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{placeName}</Text>
        <TouchableOpacity
          onPress={handleActionPress}
          style={styles.actionButtonContainer}
        >
          <Image
            source={isLiked ? require('../image/restaurant/like.png') : require('../image/restaurant/unlike.png')}
            style={styles.actionIcon}
          />
        </TouchableOpacity>
      </View>


<ScrollView contentContainerStyle={styles.scrollContainer}>
      <View horizontal style={styles.imageView}>
        {tourData.map((place, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image
              source={{ uri: place.firstimage }}
              style={styles.placeImage}
            />
          </View>
        ))}
      </View>


      {/* 추가된 타이틀과 리뷰 섹션 */}
      <Text style={styles.placeTitle}>{placeName}</Text>
      <View style={styles.review}>
        <Image source={require('../image/detail/yellowstar.png')} style={styles.star} />
        <Text style={styles.reviewText}>0.0 (0)</Text>
      </View>

      {/* 관광지 설명 */}
      <Text style={styles.description}>관광지 설명을 열심히 써봅시다 짠짜짠</Text>

      {/* Frame 184 */}
      <View style={styles.frame184}>
        <Text style={styles.frameText}>#또강릉이</Text>
      </View>

      {/* Frame 185 */}
      <View style={styles.frame185}>
        <Text style={styles.frameText}>#추천</Text>
      </View>

      {/* Line 38 */}
      <View style={styles.line1} />

      {/* Frame 211 */}
      <View style={styles.frame211}>
        <Image source={require('../image/detail/save.png')} style={styles.iconImage} />
      </View>

      {/* Frame 212 */}
      <View style={styles.frame212}>
        <Image source={require('../image/detail/addtoschedule.png')} style={styles.iconImage} />
      </View>

      {/* Frame 231 */}
      <View style={styles.frame213}>
        <Image source={require('../image/detail/share.png')} style={styles.iconImage} />
      </View>

      {/* Line 38 */}
      <View style={styles.line2} />

    <View style={styles.placedetailcontainer}>
      {/* 장소 소개 */}
      <Text style={styles.placeIntroTitle}>장소 소개</Text>
      <Text style={styles.placeIntroDescription}>
        {overview} {/* 개요에서 첫 문장만 렌더링 */}
      </Text>

      {/* Line 38 */}
      <View style={styles.line3} />

      <Text style={styles.placeDetailTitle}>기본 정보</Text>

<View style={styles.mapContainer}>
            {!loading && !error && tourData.length > 0 && (
              <MapView style={styles.map}>
                {mapx && mapy && (
                  <Marker
                    coordinate={{
                      latitude: parseFloat(mapy),
                      longitude: parseFloat(mapx),
                    }}
                  />
                )}
              </MapView>
            )}
          </View>


       </View>
     </ScrollView>
    </View>
  );
};

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        zIndex:-1,
      },
      header: {
        alignItems: 'center',
      },
      headerText: {
        top: 45,
        fontFamily: 'Pretendard',
        fontWeight: '600',
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
        backgroundColor: '#FFFFFF',
      },
      backButton: {
        width: 30,
        height: 30,
      },
      actionButtonContainer: {
        position: 'absolute',
        right: 5,
        top: 30,
        width: 42,
        height: 50,
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
      },
      actionIcon: {
        top: 2,
        width: 19,
        height: 19,
        resizeMode: 'contain',
      },
      scrollContainer: {
          flexGrow: 1, // 컨텐츠가 스크롤 뷰의 높이에 맞게 늘어나도록 설정
         // paddingBottom: 20, // 스크롤뷰의 하단에 여백을 추가
        },
      imageView: {
        marginTop: 60,
      },
      imageContainer: {
        width: Dimensions.get('window').width,
        height: 265,
        marginRight: 10,
        zIndex:-1,
      },
      placeImage: {
        width: '100%',
        height: '100%',
      },

placeTitle: { // 추가된 스타일
    position: 'absolute',
    width: 92,
    height: 24,
    left: 20,
    top: 341,
    fontFamily: 'Pretendard',
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 24,
    color: '#111111',

  },
  review: { // 추가된 리뷰 정보 스타일
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'absolute',
    width: 89,
    height: 19,
    left: 122,
    top: 344,
  },
  star: { // 별 아이콘 스타일
    width: 15,
    height: 15,
  },
  reviewText: { // 리뷰 텍스트 스타일
    width: 70,
    height: 17,
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 17,
    color: '#B8B6C3',
    marginLeft: 5,
  },
  description: {
      position: 'absolute',
      width: 208,
      height: 17,
      left: 20,
      top: 375,
      fontFamily: 'Pretendard',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: 14,
      lineHeight: 17,
      color: '#111111',
    },
    frame184: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 2,
        paddingHorizontal: 17,
        gap: 8,
        position: 'absolute',
        width: 111,
        height: 26,
        left: 20,
        top: 412,
        borderColor: '#DDDEE0',
        borderWidth: 1,
        borderRadius: 12,
      },
      frame185: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 2,
        paddingHorizontal: 17,
        gap: 8,
        position: 'absolute',
        width: 78,
        height: 26,
        left: 139,
        top: 412,
        borderColor: '#DDDEE0',
        borderWidth: 1,
        borderRadius: 12,
      },
       line1: {
          position: 'absolute',
          left: '-0.28%',
          right: '0.28%',
          top: 460,
          borderBottomWidth: 1.5,
          borderColor: 'rgba(221, 222, 224, 0.5)',
        },

          frame211: {
            position: 'absolute',
            height: 70,
            width:92,
            left: '5.56%',
            right: '68.89%',
            top: 461,
            alignItems: 'center',
          },
        frame212: {
            position: 'absolute',
            height: 70,
            width:92,
            left: '37.22%',
            right: '37.22%',
            top: 461,
            alignItems: 'center',
          },
          frame213: {
            position: 'absolute',
            height: 70,
            width:92,
            left: '68.89%',
            right: '5.56%',
            top: 461,
            alignItems: 'center',
          },
          iconImage: {
            width: '100%',
            height: '100%',
          },
         line2: {
            position: 'absolute',
            left: '-0.28%',
            right: '0.28%',
            top: 536,
            borderBottomWidth: 8,
            borderColor: 'rgba(221, 222, 224, 0.5)',
            marginBottom:500,
          },
 placedetailcontainer: {
    flex: 1,
    paddingHorizontal: '5.56%',
    paddingTop: 220,
    justifyContent: 'flex-start', // 자식 요소들을 상단에 배치
  },

  placeIntroTitle: {
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: -0.025,
    color: '#111111',
    marginBottom: 10, // 제목과 본문 사이의 간격
  },

  placeIntroDescription: {
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: -0.025,
    color: '#111111',
    marginBottom: 30, // 본문과 밑줄 사이의 간격
  },

  line3: {
    borderBottomWidth: 1.5,
    borderColor: 'rgba(221, 222, 224, 0.5)',
    marginBottom: 10, // 제목과 본문 사이의 간격
  },
    placeDetailTitle: {
      fontFamily: 'Pretendard',
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: 18,
      lineHeight: 28,
      letterSpacing: -0.025,
      color: '#111111',
      marginBottom: 10, // 제목과 본문 사이의 간격
    },
    mapContainer: {
        height: '100%',
        width: '100%',
      },
      map: {
        width: '100%',
        height: '100%',
      },

    });

    export default TourPlaceHome;
