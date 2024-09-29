import React, { useState, useEffect ,useMemo} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar,  Image, FlatList, ActivityIndicator, ScrollView , TextInput} from 'react-native';
import axios from 'axios';
import { useCurrentLocation } from './MyLocation';
import firestore from '@react-native-firebase/firestore';

const categories = [
  { id: 1, label: '전체', code: null },
  { id: 2, label: '한식', code: 'A05020100' },
  { id: 3, label: '서양식', code: 'A05020200' },
  { id: 4, label: '일식', code: 'A05020300' },
  { id: 5, label: '중식', code: 'A05020400' },
  { id: 6, label: '이색음식', code: 'A05020700' },
  { id: 7, label: '카페', code: 'A05020900' },
];

const SignupScreen = ({route}) => {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [tourData, setTourData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [totalCount, setTotalCount] = useState(1000);
  const [likedItems, setLikedItems] = useState({});
  const { currentLocation, getDistanceBetweenCoordinates } = useCurrentLocation();

  const { userInfo } = route.params;
  const postsCollection = firestore().collection('location');
  const [likedStates, setLikedStates] = useState({});

  // searchbox 표시 여부를 관리하는 상태 추가
    const [searchVisible, setSearchVisible] = useState(false);

  const handleCategoryPress = (id) => {
    setSelectedCategory(id);
    setPageNo(1);
    setLoading(true);
  };

  // 검색 아이콘 클릭 시 searchbox 표시
    const handleSearchPress = () => {
      setSearchVisible(!searchVisible);
    };

    // 장소 검색 'searchText' 상태 추가
    const [searchText, setSearchText] = useState('');

    //tourData 필터링
const filteredData = useMemo(() => {
  return tourData.filter(item =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );
}, [searchText, tourData]);

const fetchTourData = async () => {
  try {
    const selectedCategoryCode = categories.find(category => category.id === selectedCategory)?.code;

    const response = await axios.get('https://apis.data.go.kr/B551011/KorService1/areaBasedList1', {
      params: {
        serviceKey: "FQpciKW/JvtOmZVINTmwg2cOAZ2XZqKAZAluhDuoWqQXqDBoJFK48P+uEyIcNqIYPYT6HJzKxdYXuwD9nOX+CA==",
        numOfRows: totalCount,  // 전체 데이터를 한 번에 가져오도록 설정
        pageNo: 1,
        MobileOS: 'AND',
        MobileApp: '또,강릉',
        _type: 'json',
        contentTypeId: 39,
        areaCode: 32,
        sigunguCode: 1,
        listYN: 'Y',
        arrange: 'Q',
        cat3: selectedCategoryCode,
      },
    });

    if (response.status === 200 && response.data.response && response.data.response.body && response.data.response.body.items) {
      const items = response.data.response.body.items.item;

      if (Array.isArray(items)) {
        const formattedData = items.map(item => ({
          title: item.title || "No Title",
          overview: item.overview || "No Overview",
          image: item.firstimage || '',
          tel: item.tel || "",
          contentid: item.contentid,
          mapx: item.mapx || null, // 좌표 X
          mapy: item.mapy || null, // 좌표 Y
        }));

        const uniqueData = formattedData.filter((item, index, self) =>
          index === self.findIndex((t) => t.contentid === item.contentid)
        );

        setTourData(uniqueData);  // 전체 데이터를 한 번에 저장
      } else {
        console.error('Items is not an array or is empty:', items);
      }
    } else {
      console.error('Unexpected response structure:', response.data);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchTourData(pageNo);
  }, [pageNo, selectedCategory]);

  // 좋아요 기능 처리 함수
  const handleLikePress = async (item) => {
    const isLiked = likedStates[item.contentid] || false;

    setLikedItems((prev) => ({
      ...prev,
      [item.contentid]: !isLiked,
    }));
    // like 상태 반전
    setLikedStates((prev) => ({
      ...prev,
      [item.contentid]: !isLiked,
    }));
  
    try {
      // item.contentid와 userInfo.email이 정의되어 있는지 확인 필요
      if (!item.contentid || !userInfo.email) {
        console.error('Invalid contentId or user email');
        return;
      }
  
      const locationRef = postsCollection
        .where('contentId', '==', item.contentid) // 필드명이 정확한지 확인
        .where('email', '==', userInfo.email); // 필드명이 정확한지 확인
  
      const snapshot = await locationRef.get();
  
      if (!isLiked) {
        // 좋아요 상태라면 Firestore에 추가
        if (snapshot.empty) {
          await postsCollection.add({
            contentId: item.contentid,
            title: item.title,
            image: item.image,
            email: userInfo.email,
            liked: true,
          });
        }
      } else {
        // 좋아요 취소 상태라면 Firestore에서 삭제
        snapshot.forEach(async (doc) => {
          await postsCollection.doc(doc.id).delete();
        });
      }
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };
  

  // 좋아요 상태 불러오기
  useEffect(() => {
    const fetchLikedStates = async () => {
      try {
        const snapshot = await postsCollection
          .where('email', '==', userInfo.email) // 사용자 이메일로 조회
          .get();

        const likes = {};
        snapshot.forEach((doc) => {
          const data = doc.data();
          likes[data.contentId] = data.liked; // 해당 contentId의 liked 상태 저장
        });

        setLikedStates(likes); // 불러온 liked 상태를 상태로 설정
      } catch (error) {
        console.error('Error fetching liked states:', error);
      }
    };

    fetchLikedStates(); // 페이지 로드 시 liked 상태 불러오기
  }, []);

  const loadMoreData = () => {
    if (!loading && tourData.length < totalCount) {
      setPageNo(prevPageNo => prevPageNo + 1);
    }
  };

  const calculateDistance = (item) => {
    if (currentLocation && item.mapx && item.mapy) {
      const destination = { latitude: parseFloat(item.mapy), longitude: parseFloat(item.mapx) };
      const distance = getDistanceBetweenCoordinates(currentLocation, destination);
      return `${(distance * 1000).toFixed(0)}m`; // 거리 결과를 미터 단위로 변환
    }
    return '정보 없음';
  };

  const renderItem = ({ item }) => (
 <View style={styles.restaurantItem}>
    <Image
      source={item.image ? { uri: item.image } : require('../image/restaurant/emptythumbnail.png')}
      style={styles.restaurantImage}
    />
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.title}</Text>
        <Text style={styles.restaurantDescription}>{item.overview}</Text>
        <View style={styles.ratingRow}>
          <View style={styles.starRating}>
            <Image source={require('../image/restaurant/yellowstar.png')} style={styles.star} />
            <Text style={styles.ratingText}>0.0 (0)</Text>
          </View>
          <View style={styles.distanceRow}>
            <View style={styles.dot} />
            <Text style={styles.distanceText}>{calculateDistance(item)}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => handleLikePress(item)}
        style={styles.actionButton}
      >
        <Image
          source={likedStates[item.contentid] ? require('../image/restaurant/like.png') : require('../image/restaurant/unlike.png')}
          style={styles.actionIcon}
        />
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" color="#6495ED" />;
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => { /* 뒤로가기 기능 */ }}
          style={styles.backButtonContainer}
        >
          <Image source={require('../image/signup/backbutton.png')} style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.headerText}>추천 맛집</Text>
        <TouchableOpacity
          onPress={handleSearchPress}
          style={styles.searchButtonContainer}
        >
          <Image source={require('../image/restaurant/searchicon.png')} style={styles.searchIcon} />
        </TouchableOpacity>
      </View>

      {/* searchbox 표시 */}
            {searchVisible && (
              <View style={styles.searchBoxContainer}>
                <Image source={require('../image/restaurant/searchbox.png')} style={styles.searchBox} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="장소 이름 검색"
                  placeholderTextColor="#999"
                  value={searchText}
                  onChangeText={(text) => setSearchText(text)}
                />
              </View>
            )}

      <View style={styles.navContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={styles.categoryWrapper}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleCategoryPress(category.id)}
                style={[
                  styles.categoryContainer,
                  selectedCategory === category.id && styles.selectedCategory
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.selectedCategoryText
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
            <View style={styles.lineContainer}>
              {categories.map((category) => (
                <View
                  key={category.id}
                  style={[
                    styles.line,
                    (selectedCategory === category.id) ? styles.activeLine : styles.inactiveLine
                  ]}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={styles.rectangle} />

      <View style={styles.frame222}>
        <Text style={styles.sortOptionText}>평점 높은 순</Text>
        <TouchableOpacity onPress={() => { /* 여기에 필터 버튼 클릭 시 동작을 추가 */ }}>
          <Image source={require('../image/restaurant/filtertype.png')} style={styles.filterType} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => { /* 여기에 버튼 클릭 시 동작을 추가 */ }}
        style={styles.FilterIconButtonContainer}
      >
        <Image source={require('../image/restaurant/filtericon.png')} style={styles.filterIcon} />
      </TouchableOpacity>

      <FlatList
        style={styles.restaurantList}
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.contentid.toString() + index.toString()}  // 고유한 키 생성
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        //contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  searchButtonContainer: {
    position: 'absolute',
    right: 5,
    top: 30,
    width: 42,
    height: 50,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  searchIcon: {
  top:2,
    width: 19,
    height: 19,
  },
  searchBoxContainer: {
      position: 'absolute',
      left: '5.28%',
      right: '14.72%',
      top: 40,
      height: 38,
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchBox: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      resizeMode: 'contain', // 이미지 비율 유지
    },
    searchInput: {
      flex: 1,
      marginLeft: 10, // 여백
      color: '#111',
      fontSize: 16,
    },
  navContainer: {
    position: 'absolute',
    top: 95,
    left: 0,
    width: '100%',
    height: 33,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    paddingHorizontal: 0,
  },
  categoryWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 33,
  },
  categoryContainer: {
    alignItems: 'center',
    width: 60,
    position: 'relative',
  },
  categoryText: {
    fontFamily: 'Pretendard',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.025,
    color: '#646C79',
  },
  selectedCategoryText: {
    color: '#6495ED',
  },
  lineContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    flexDirection: 'row',
    height: 2,
    backgroundColor: '#DDDEE0',
  },
  line: {
    width: 60,
    height: 2,
  },
  activeLine: {
    backgroundColor: '#6495ED',
  },
  inactiveLine: {
    backgroundColor: 'transparent',
  },
  rectangle: {
    position: 'absolute',
    height: 39,
    left: 0,
    right: 0,
    top: 128,
    backgroundColor: '#F0F1F2',
  },
  frame222: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    paddingHorizontal: 8,
    position: 'absolute',
    width: 85,
    height: 35,
    left: 20,
    top: 130,
  },
  sortOptionText: {
    width: 85,
    height: 35,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 35,
    color: '#646C79',
    marginRight: -10,
  },
  filterType: {
    width: 13,
    height: 5,
  },
  FilterIconButtonContainer: {
    position: 'absolute',
    width: 35,
    height: 35,
    right: 20,
    top: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    width: 35,
    height: 35,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  restaurantList: {
    flex:1,
    top: 165,
    left: 20,
    right: 14,
    marginBottom:175,
  },
  restaurantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 93,
    marginBottom: 14,
  },
  restaurantImage: {
    width: 93,
    height: 93,
    backgroundColor: '#D9D9D9',
    borderRadius: 12,
  },
  restaurantInfo: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 14,
  },
  restaurantName: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 21,
    color: '#111111',
  },
  restaurantDescription: {
    fontSize: 12,
    lineHeight: 17,
    color: '#646C79',
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  starRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    width: 15,
    height: 15,
  },
  ratingText: {
    fontSize: 10,
    lineHeight: 14,
    color: '#B8B6C3',
    marginLeft: 4,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  dot: {
    width: 4,
    height: 4,
    backgroundColor: '#D9D9D9',
    borderRadius: 2,
  },
  distanceText: {
    fontSize: 10,
    lineHeight: 14,
    color: '#B8B6C3',
    marginLeft: 4,
  },
  actionButton: {
    width: 33,
    height: 93,
    justifyContent: 'center',
    alignItems: 'flex-end',
    right: 50,
  },
  actionIcon: {
    width: 19.02,
    height: 15.81,
  },
});

export default SignupScreen;
