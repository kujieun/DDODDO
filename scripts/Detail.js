import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity, StatusBar, Image, ScrollView, ActivityIndicator, Linking } from 'react-native';
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
  const [isSaved, setIsSaved] = useState(false);
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

  // 저장하기
   const handleSaveToggle = () => {
      setIsSaved(!isSaved);
    };

const cleanURL = (url) => {
  if (!url || typeof url !== 'string') return '';

  const cleanUrl = url.replace(/<[^>]*>/g, '').trim();

  const match = cleanUrl.match(/https?:\/\/[^\s"]+/);

  return match ? match[0] : cleanUrl;
};


 const handlePress = () => {
    const rawURL = tourData[0]?.homepage;
    const url = cleanURL(rawURL); // URL 정리
    console.log('링크:', url); // URL을 콘솔에 출력
    Linking.openURL(url);
  };

  const displayURL = cleanURL(tourData[0]?.homepage);

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
      <View style={styles.headerContainer}>
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


    <View style={styles.placeTitleReviewContainer}>
      <Text style={styles.placeTitle}>{placeName}   </Text>
      <View style={styles.review}>
        <Image source={require('../image/detail/yellowstar.png')} style={styles.star} />
        <Text style={styles.description}>0.0 (0)</Text>
      </View>
    </View>


      {/* 관광지 설명 */}
      <Text style={[styles.description, {marginLeft:20}, {marginTop:10}]}>관광지 설명입니다</Text>

    <View style={styles.frameContainer}>
      <View style={styles.frame184}>
        <Text style={styles.frameText}>#또강릉</Text>
      </View>
      <View style={styles.frame185}>
        <Text style={styles.frameText}>#추천</Text>
      </View>
    </View>


      {/* Line 38 */}
      <View style={styles.line1} />

<View style={styles.frameContainer2}>
      {/* Frame 211 */}
      <TouchableOpacity
        style={styles.frame211}
        onPress={handleSaveToggle}
      >
        <Image
          source={isSaved ? require('../image/detail/save.png') : require('../image/detail/unsave.png')}
          style={styles.iconImage}
        />
      </TouchableOpacity>

      {/* Frame 212 */}
      <TouchableOpacity
        style={styles.frame212}
        onPress={() => {/* Handle add to schedule action */}}
      >
        <Image
          source={require('../image/detail/addtoschedule.png')}
          style={styles.iconImage}
        />
      </TouchableOpacity>

      {/* Frame 231 */}
      <TouchableOpacity
        style={styles.frame213}
        onPress={() => {/* Handle share action */}}
      >
        <Image
          source={require('../image/detail/share.png')}
          style={styles.iconImage}
        />
      </TouchableOpacity>
    </View>

      {/* Line 38 */}
      <View style={styles.line2} />

    <View style={styles.placedetailcontainer}>
      {/* 장소 소개 */}
      <Text style={styles.placeTitle}>장소 소개</Text>
      <Text style={[styles.description, {marginTop:5}]}>
        {overview} {/* 개요에서 첫 문장만 렌더링 */}
      </Text>

      {/* Line 38 */}
      <View style={styles.line3} />

      <Text style={styles.placeTitle}>기본 정보</Text>

 <View style={styles.mapContainer}>
            {!loading && !error && tourData.length > 0 && (
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: mapy ? parseFloat(mapy) : 37.5665, // 기본 위치
                  longitude: mapx ? parseFloat(mapx) : 126.978, // 기본 위치
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                {mapx && mapy && (
                  <Marker
                    coordinate={{
                      latitude: parseFloat(mapy),
                      longitude: parseFloat(mapx),
                    }}
                    title={placeName}
                    description={overview}
                  />
                )}
              </MapView>
            )}
          </View>

 <View>
        <Text style={styles.description}>
          주소: {tourData[0]?.addr1}{"\n"}
          전화번호: {tourData[0]?.tel}
        </Text>
        <TouchableOpacity onPress={handlePress}>
           <Text style={[styles.description, { marginBottom: 15 }]}>홈페이지: {displayURL}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.line3} />

        <Text style={styles.placeTitle}>기본 정보</Text>



       </View>
     </ScrollView>
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
    fontFamily: 'Pretendard',
    fontWeight: '600',
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
  actionIcon: {
    width: 19,
    height: 19,
    resizeMode: 'contain',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  imageView: {
    marginTop: 70,
  },
  imageContainer: {
    width: Dimensions.get('window').width,
    height: 265,
    marginRight: 10,
    zIndex: -1,
    marginBottom:20,
  },
  placeImage: {
    width: '100%',
    height: '100%',
  },
  placeTitleReviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    marginLeft: 20,
  },
placeTitle: {
    fontFamily: 'Pretendard',
    fontWeight: '600',
    fontSize: 20,
    color: '#111111',

    flexShrink: 1,  // 제목이 길어질 경우 줄 바꿈을 허용
  },
  review: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,  // 제목과 리뷰 사이의 간격 조정
  },

  star: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  /*
  reviewText: {
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: 14,
    color: '#111111',
  },
  */
  description: {
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: 14,
    color: '#333333',
  },
 frameContainer: {
    flexDirection: 'row',
    //justifyContent: 'space-between', // 또는 'center'로 조정 가능
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 10,
  },
  frame184: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 17,
    gap: 8,
    width:80,
    borderColor: '#DDDEE0',
    borderWidth: 1,
    borderRadius: 12,
    marginRight:10,
  },
  frame185: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderColor: '#DDDEE0',
    borderWidth: 1,
    borderRadius: 12,
  },
  frameText: {
    fontFamily: 'Pretendard',
    fontWeight: '500',
    fontSize: 12,
    color: '#999999',
  },
  line1: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 10,
    marginBottom: 0,
  },
  frameContainer2: {
    position: 'relative', // 부모 컨테이너의 위치를 기준으로 자식 요소 배치
      height: 60, // 적절한 높이 설정
      width: '100%', // 부모 컨테이너의 너비
      marginTop: 0,
   },
    frame211: {
      position: 'absolute',
      height: 70,
      width: 92,
      left: '5.56%',
      top: 0, // 상단 위치
      alignItems: 'center',
    },
    frame212: {
      position: 'absolute',
      height: 70,
      width: 92,
      left: '37.22%',
      top: 0, // 상단 위치
      alignItems: 'center',
    },
    frame213: {
      position: 'absolute',
      height: 70,
      width: 92,
      right: '5.56%',
      top: 0,
      alignItems: 'center',
    },
    iconImage: {
      width: '100%',
      height: '100%',
    },
  line2: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 8,
    borderColor: 'rgba(221, 222, 224, 0.5)',
  },
  placedetailcontainer: {
    marginLeft: 20,
    marginRight:20,
    marginTop: 10,
  },
  placeTitle: {
    fontFamily: 'Pretendard',
    fontWeight: '600',
    fontSize: 16,
    color: '#111111',
  },
  /*
  placeIntroDescription: {
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: 14,
    color: '#333333',
  },
  */
  mapContainer: {
    width: '100%',
    height: 200,
    marginTop: 10,
        borderRadius:100,
  },
  map: {
    width: '100%',
    height: '100%',

  },
  line3: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 10,
    marginBottom: 10,
  },
/*
   infotext: {
      fontFamily: 'Pretendard',
      fontWeight: '400',
      fontSize: 14,
      color: '#333333',
    },
    */
});

export default TourPlaceHome;
