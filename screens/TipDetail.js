import React from 'react';
import { View, Image, StyleSheet, Dimensions, FlatList } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// 이미지 경로 배열
const museumList = [
  require('../img/tip/museumtop.png'),
  require('../img/tip/museum1.png'),
  require('../img/tip/museum2.png'),
  require('../img/tip/museum3.png'),
];

const rainList = [
    require('../img/tip/raintop.png'),
    require('../img/tip/rain1.png'),
    require('../img/tip/rain2.png'),
    require('../img/tip/rain3.png'),
  ];


  const oceanList = [
    require('../img/tip/oceantop.png'),
    require('../img/tip/ocean1.png'),
    require('../img/tip/ocean2.png'),
    require('../img/tip/ocean3.png'),
  ];

const TipDetail = ({route}) => {

    const { selectedImage } = route.params;

    let imageList = [];
  switch (selectedImage) {
    case 'museum':
      imageList = museumList;
      break;
    case 'rain':
      imageList = rainList;
      break;
    case 'ocean':
      imageList = oceanList;
      break;
    default:
      imageList = museumList; // 기본값을 museum으로 설정
  }

  // 각 이미지 렌더링 함수
  const renderItem = ({ item }) => (
    <View style={styles.contentContainer}>
      <Image source={item} style={styles.contentImage} />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 상단 헤더 이미지 */}
      <Image source={require('../img/tip/header.png')} style={styles.headerImage} />

      {/* 이미지 리스트를 FlatList로 출력 */}
      <FlatList
        data={imageList} // 이미지 배열 전달
        renderItem={renderItem} // 각 아이템 렌더링 함수
        keyExtractor={(item, index) => index.toString()} // 고유 key 설정
        contentContainerStyle={styles.flatListContainer} // FlatList 스타일 설정
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerImage: {
    width: '100%', // 화면 너비에 맞게 조정
    height: screenHeight * 0.1, // 화면 높이의 10%로 설정
    resizeMode: 'cover',
    marginTop: 15,
  },
  contentImage: {
    width: screenWidth, 
    resizeMode: 'contain',
  },
  contentContainer: {
    alignItems: 'center', // 내용 중앙 정렬
    justifyContent: 'center', 
    marginTop: '-50%',
    marginBottom: '-10%',
  },
  flatListContainer: {
    paddingBottom: 20,
  },
});

export default TipDetail;
