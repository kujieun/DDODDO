import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  StatusBar,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute  } from '@react-navigation/native';

const Coursehome = ({onClose, onContentIdSelected}) => {
  const [tripstylePanelVisible, setTripstylePanelVisible] = useState(false);
  const [withwhoPanelVisible, setWithwhoPanelVisible] = useState(false);
  const [tourData, setTourData] = useState([]);
  const [originalTourData, setOriginalTourData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedStates, setLikedStates] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [totalCount, setTotalCount] = useState(1000);
  const navigation = useNavigation();
  const route = useRoute(); // route 가져오기
  const { tripName, startDate, endDate } = route.params;

  const cat3Mapping = {
    '가족': 'C01120001',
    '나': 'C01130001',
    '힐링코스': 'C01140001',
    '도보코스': 'C01150001',
  };

  const getCategoryLabel = (cat3) => {
    return Object.keys(cat3Mapping).find(key => cat3Mapping[key] === cat3) || '기타';
  };

  const fetchTourData = async (pageNo = 1) => {
    try {
      const response = await axios.get('https://apis.data.go.kr/B551011/KorService1/areaBasedList1', {
        params: {
          serviceKey: "FQpciKW/JvtOmZVINTmwg2cOAZ2XZqKAZAluhDuoWqQXqDBoJFK48P+uEyIcNqIYPYT6HJzKxdYXuwD9nOX+CA==",
          numOfRows: 18,
          pageNo: pageNo,
          MobileOS: 'AND',
          MobileApp: '또,강릉',
          _type: 'json',
          contentTypeId: 25,
          areaCode: 32,
          sigunguCode: 1,
          listYN: 'Y',
          arrange: 'Q',
        },
      });

      if (response.status === 200) {
        const items = response.data.response.body.items.item;
        const totalCountFromResponse = response.data.response.body.totalCount;

        setTotalCount(totalCountFromResponse);

        if (Array.isArray(items)) {
          const formattedData = items.map(item => ({
            title: item.title || "No Title",
            image: item.firstimage || '',
            contentid: item.contentid,
            cat3: item.cat3 || "No Category",
          }));

          const uniqueData = formattedData.filter((item, index, self) =>
            index === self.findIndex((t) => t.contentid === item.contentid)
          );

          setTourData(uniqueData);
          setOriginalTourData(uniqueData); // 원본 데이터 저장
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTourData = (selectedCategory) => {
    const selectedCat3 = cat3Mapping[selectedCategory];
    if (selectedCat3) {
      const filteredData = originalTourData.filter(item => item.cat3 === selectedCat3);
      setTourData(filteredData);
    } else {
      setTourData(originalTourData); // 선택된 카테고리가 없을 경우 원본 데이터로 복원
    }
  };

  const loadMoreData = () => {
    if (!loading && tourData.length < totalCount) {
      setPageNo(prevPageNo => {
        const newPageNo = prevPageNo + 1;
        fetchTourData(newPageNo);
        return newPageNo;
      });
    }
  };

  useEffect(() => {
    fetchTourData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#D9D9D9" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButtonContainer}>
          <Image source={require('../../image/signup/backbutton.png')} style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.headerText}>추천 코스</Text>
      </View>

      <View style={styles.lineContainer}>
        <View style={styles.line} />
      </View>

      <View style={styles.tripstyleFilterContainer}>
        <TouchableOpacity onPress={() => setTripstylePanelVisible(true)}>
          <Image source={require('../../image/course/tripstyleFilter.png')} style={styles.tripstyleFilter} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setWithwhoPanelVisible(true)}>
          <Image source={require('../../image/course/withwhoFilter.png')} style={styles.tripstyleFilter} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          setTourData(originalTourData); // 원본 데이터로 복원
          setWithwhoPanelVisible(false);
          setTripstylePanelVisible(false);
        }}>
          <Image source={require('../../image/course/reset.png')} style={styles.tripstyleFilter} />
        </TouchableOpacity>

      </View>

      {(tripstylePanelVisible || withwhoPanelVisible) && (
        <TouchableWithoutFeedback onPress={() => { setTripstylePanelVisible(false); setWithwhoPanelVisible(false); }}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

{tripstylePanelVisible && (
  <View style={styles.panel}>
    <TouchableOpacity onPress={() => setTripstylePanelVisible(false)}>
      <View style={styles.swipePanelHandle} />
    </TouchableOpacity>

    <Text style={styles.panelTitle}>여행 스타일</Text>

    <TouchableOpacity onPress={() => { filterTourData('힐링코스'); setWithwhoPanelVisible(false); }}>
      <Text style={styles.panelItem}>힐링코스</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => { filterTourData('도보코스'); setWithwhoPanelVisible(false); }}>
      <Text style={styles.panelItem}>도보코스</Text>
    </TouchableOpacity>
  </View>
)}


      {withwhoPanelVisible && (
        <View style={styles.panel}>
          <TouchableOpacity onPress={() => setWithwhoPanelVisible(false)}>
            <View style={styles.swipePanelHandle} />
          </TouchableOpacity>
          <Text style={styles.panelTitle}>누구와</Text>
          <TouchableOpacity onPress={() => { filterTourData('혼자'); setWithwhoPanelVisible(false); }}>
            <Text style={styles.panelItem}>혼자</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { filterTourData('가족'); setWithwhoPanelVisible(false); }}>
            <Text style={styles.panelItem}>가족</Text>
          </TouchableOpacity>
        </View>
      )}

<View style={styles.flatListContainer}>
  <FlatList
    contentContainerStyle={styles.cardsContainer}
    data={tourData}
    keyExtractor={(item) => item.contentid.toString()}
    onEndReached={loadMoreData}
    onEndReachedThreshold={0.5}
    renderItem={({ item }) => {
      return (
        <TouchableOpacity
          onPress={() => navigation.navigate('coursedetail', { contentid: item.contentid })}
          style={styles.card}
        >
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.cardImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={{ textAlign: 'center', justifyContent: 'center' }}>이미지 준비중입니다</Text>
            </View>
          )}
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <TouchableOpacity
              onPress={() => {
                // contentid를 넘겨주는 로직
                navigation.navigate('scheduledetail', { contentid: item.contentid });
                // 모달 창을 닫음
                onClose();
              }}
            >
              <Image
                source={require('../../image/makeschedule/add.png')}
                style={styles.likeIcon}
              />
            </TouchableOpacity>

          </View>
          <Text style={styles.cat3Text}>{getCategoryLabel(item.cat3)}</Text>
        </TouchableOpacity>
      );
    }}
  />
</View>

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
    fontFamily: 'Pretendard-SemiBold',
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
    top: 2,
    width: 19,
    height: 19,
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

  searchInput: {
    flex: 1,
    marginLeft: 10, // 여백
    color: '#111',
    fontSize: 16,
  },
  tripstyleFilterContainer: {
    position: 'absolute',
    top: 99,
    left: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 2,
    height: 28,
  },
  tripstyleFilter: {
    width: 103,
    height: 28,
    resizeMode: 'contain',
    marginRight: 8,

  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 10,
    zIndex: 15,
    paddingVertical: 20, // 패널 내 여백 추가
    maxHeight: '80%', // 너무 길어지면 80% 높이까지만 허용
  },
  swipePanelHandle: {
    width: 150,
    height: 5,
    backgroundColor: '#CCCCCC',
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    marginBottom: 16,
    marginLeft: 19,
    color: '#111111',
  },
  panelItem: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    paddingVertical: 10,
    marginLeft: 19,
    color: '#111111',
  },
  flatListContainer: {
    flex: 1,
    top:110,
    padding:10,
    marginBottom:95,
  },
    cardsContainer: {
      paddingBottom: 16,
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: 8,
      marginBottom: 10,

      marginHorizontal: 16,
      elevation:1,
    },
    cardImage: {
      width: '100%',
      height: 150,
      borderRadius: 8,
    },
    placeholderImage: {
      width: '100%',
      height: 150,
      backgroundColor: '#eee',
      borderRadius: 8,
      justifyContent: 'center', // 추가
        alignItems: 'center', // 추가
        display: 'flex', // 추가
    },
    cardTitleContainer: {
      flexDirection: 'row', // 가로 방향으로 배치
      alignItems: 'flex-start', // 아이콘과 텍스트의 정렬
      marginRight: 10, // 아이콘과의 간격
    },
    cardTitle: {
      fontSize: 16,
      fontFamily: 'Pretendard-SemiBold',
      color:'#111111',
      marginTop: 8,
      marginLeft: 8, // 아이콘과의 간격
      flexWrap: 'wrap', // 텍스트가 길어지면 줄 바꿈
      flex: 1, // 남은 공간을 차지
    },
    likeIcon: {
      width: 36,
      marginTop: 8,
      height: 36,
    },
    loading: {
      flex: 1,
      justifyContent: 'center',
    },
    cat3Text: {
      fontSize: 12,
      fontFamily: 'Pretendard-Regular',
      color: '#648C79',
      marginLeft: 8, // 카드 제목과의 간격
      marginBottom:8,
    },
});

export default Coursehome;