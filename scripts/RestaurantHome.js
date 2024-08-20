import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView, Animated, PanResponder, Dimensions } from 'react-native';
import axios from 'axios';

// 배너 관리
const BannerSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = (event) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const currentIndex = Math.floor(contentOffset.x / layoutMeasurement.width);
    setCurrentIndex(currentIndex);
  };

  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScroll={handleSwipe}
      scrollEventThrottle={16}
    >
      {images.map((image, index) => (
        <View key={index} style={styles.banner}>
          <Image source={image} style={styles.image} />
        </View>
      ))}
    </ScrollView>
  );
};

const Food = ({ navigation }) => {
  const [tourData, setTourData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pan = useRef(new Animated.ValueXY()).current;

  const images = [
    require('../image/marker2.png'),

  ];

  const fetchTourData = async (page) => {
    try {
      const response = await axios.get('https://apis.data.go.kr/B551011/KorService1/areaBasedList1', {
        params: {
          serviceKey: "FQpciKW/JvtOmZVINTmwg2cOAZ2XZqKAZAluhDuoWqQXqDBoJFK48P+uEyIcNqIYPYT6HJzKxdYXuwD9nOX+CA==",
          numOfRows: 10,
          pageNo: page,
          MobileOS: 'AND',
          MobileApp: '또,강릉',
          _type: 'json',
          listYN: 'Y',
          arrange: 'Q',
          contentTypeId: 39,
          areaCode: 32,
          sigunguCode: 1,
        },
      });
      if (response.status === 200 && response.data.response) {
        const formattedData = response.data.response.body.items.item.map(item => ({
          ...item,
          tel: item.tel || "", // 전화번호가 없을 경우를 대비하여 빈 문자열로 설정
          homepage: item.homepage || "", // 홈페이지 주소가 없을 경우를 대비하여 빈 문자열로 설정
          overview: item.overview || "", // 콘텐츠 개요가 없을 경우를 대비하여 빈 문자열로 설정
        }));
        setTourData(formattedData);
        setTotalCount(response.data.response.body.totalCount);
      } else {
        console.error('Unexpected response structure:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      console.log('Response data:', error.response ? error.response.data : 'No response data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchTourData(pageNo);
  }, [pageNo]);

  const handleNextPage = () => {
    if (pageNo < Math.ceil(totalCount / 10)) {
      setPageNo(prevPageNo => prevPageNo + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageNo > 1) {
      setPageNo(prevPageNo => prevPageNo - 1);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          pan.setValue({ x: 0, y: 0 });
        } else {
          pan.setValue({ x: 0, y: gestureState.dy });
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy < -50) {
          Animated.spring(pan, { toValue: { x: 0, y: -300 }, useNativeDriver: false }).start();
        }
      }
    })
  ).current;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <BannerSlider images={images} />
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>
            강릉에 있는
            {'\n'}
            맛집을 돌아다니며
            {'\n'}
            든든한 여행을 함께해요
          </Text>
        </View>
      </View>

      <Animated.View
        style={[
          styles.tabContainer,
          { transform: [{ translateY: pan.y }] }
        ]}
        {...panResponder.panHandlers}
      >
        <FlatList
          data={tourData}
          keyExtractor={(item) => item.contentid.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Detail', { item })}
            >
              {item.firstimage2 ? (
                <Image source={{ uri: item.firstimage2 }} style={styles.thumbnail} />
              ) : (
                <View style={styles.noImageContainer}>
                  <Text style={styles.noImageText}>No Image</Text>
                </View>
              )}
              <View style={styles.textContainer}>
                <Text style={styles.itemText}>{item.title}</Text>
                {item.addr1 && <Text style={styles.itemAddress}>{item.addr1}</Text>}
                {item.homepage && (
                  <Text style={styles.itemAddress}>Homepage: {item.homepage}</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, pageNo === 1 && styles.disabledButton]}
            onPress={handlePreviousPage}
            disabled={pageNo === 1}
          >
            <Text style={styles.buttonText}>이전</Text>
          </TouchableOpacity>
          <Text style={styles.pageNoText}>Page {pageNo}</Text>
          <TouchableOpacity
            style={[styles.button, pageNo === Math.ceil(totalCount / 10) && styles.disabledButton]}
            onPress={handleNextPage}
            disabled={pageNo === Math.ceil(totalCount / 10)}
          >
            <Text style={styles.buttonText}>다음</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles =
 StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  overlay: {
    position: 'absolute',
    top: 50,
    left: 130,
    zIndex: 1,
  },
  overlayText: {
    top: '20%',
    left: '-40%',
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 250,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '220%',
    top: '20%',
    resizeMode: 'cover',
    opacity: 0.7,
  },
  banner: {
    width: Dimensions.get('window').width,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -300,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '95%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  noImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#fff',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemAddress: {
    marginTop: 4,
    fontSize: 14,
    color: '#777',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#99ccff',
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  pageNoText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Food;
