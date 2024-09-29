import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CameraMenu = () => {
  const navigation = useNavigation();  
  const [selectedButton, setSelectedButton] = useState('all'); // 초기 선택 버튼

  // 이미지 경로
  const images = {
    header: require('../img/home/header.png'),
    all: require('../img/home/all.png'),
    selectAll: require('../img/home/selectall.png'),
    drama: require('../img/home/drama.png'),
    selectDrama: require('../img/home/selectdrama.png'),
    movie: require('../img/home/movie.png'),
    selectMovie: require('../img/home/selectmovie.png'),
    musicVideo: require('../img/home/musicvideo.png'),
    selectMusicVideo: require('../img/home/selectmusicvideo.png'),
  };

  const imageData = [
    {
      id: '1',
      locationImage: require('../img/home/location1.png'),
      filters: [
        { id: 'filter2', image: require('../img/home/camerafilter2.png') },
        { id: 'filter1', image: require('../img/home/camerafilter1.png') },
      ],
    },
    {
      id: '2',
      locationImage: require('../img/home/location2.png'),
      filters: [
        { id: 'filter2', image: require('../img/home/camerafilter2.png') },
        { id: 'filter1', image: require('../img/home/camerafilter1.png') },
      ],
    },
    {
      id: '3',
      locationImage: require('../img/home/location3.png'),
      filters: [
        { id: 'filter2', image: require('../img/home/camerafilter2.png') },
        { id: 'filter1', image: require('../img/home/camerafilter1.png') },
      ],
    },
    {
      id: '4',
      locationImage: require('../img/home/location4.png'),
      filters: [
        { id: 'filter2', image: require('../img/home/camerafilter2.png') },
        { id: 'filter1', image: require('../img/home/camerafilter1.png') },
      ],
    },
    {
      id: '5',
      locationImage: require('../img/home/location5.png'),
      filters: [
        { id: 'filter2', image: require('../img/home/camerafilter2.png') },
        { id: 'filter1', image: require('../img/home/camerafilter1.png') },
      ],
    },
    {
      id: '6',
      locationImage: require('../img/home/location6.png'),
      filters: [
        { id: 'filter2', image: require('../img/home/camerafilter2.png') },
        { id: 'filter1', image: require('../img/home/camerafilter1.png') },
      ],
    },
    {
      id: '7',
      locationImage: require('../img/home/location7.png'),
      filters: [
        { id: 'filter2', image: require('../img/home/camerafilter2.png') },
        { id: 'filter1', image: require('../img/home/camerafilter1.png') },
      ],
    },
  ];

  // 버튼 클릭 시 호출되는 함수
  const handlePress = (buttonName) => {
    setSelectedButton(buttonName);
  };

    // 필터링된 이미지 데이터
    const filteredImageData = imageData.filter(item => {
      if (selectedButton === 'all') return true; // 모든 항목 표시
      if (selectedButton === 'drama') return ['1', '4', '6', '7'].includes(item.id); // 드라마에 해당하는 아이디만 표시
      if (selectedButton === 'musicVideo') return item.id === '2'; // 뮤직비디오에 해당하는 아이디만 표시
      if (selectedButton === 'movie') return ['3', '5'].includes(item.id); // 영화에 해당하는 아이디만 표시
      return false; // 그 외의 경우는 표시하지 않음
    });


  const handleFilterPress = (locationId, filterId) => {
    let filterImageUri = '';
    
    if (locationId === '1') {
      filterImageUri = filterId === 'filter1' 
        ? 'https://firebasestorage.googleapis.com/v0/b/ddoddo-e621b.appspot.com/o/camera%2Flocation1%2Fcharacter.png?alt=media&token=c546ab8b-ef32-400f-8c32-f56d67d98ffa'  // filter1의 이미지 URL
        : ''; // filter2는 백그라운드 제거
    } else if (locationId === '2') {
      filterImageUri = filterId === 'filter1' 
        ? 'https://firebasestorage.googleapis.com/v0/b/ddoddo-e621b.appspot.com/o/camera%2Flocation2%2Fcharacter.png?alt=media&token=b2e99438-1eb8-413f-b7df-6849437deb7c'  // filter2의 이미지 URL
        : ''; // filter2는 백그라운드 제거
    }else{
      filterImageUri = filterId === 'filter1' 
        ? 'https://firebasestorage.googleapis.com/v0/b/ddoddo-e621b.appspot.com/o/camera%2F%E1%84%83%E1%85%A1%E1%86%B7%E1%84%8B%E1%85%B3%E1%86%AB%20%E1%84%8C%E1%85%A1%E1%86%BC%E1%84%89%E1%85%A9-%20%E1%84%8B%E1%85%A7%E1%84%92%E1%85%A2%E1%86%BC%E1%84%8C%E1%85%B5.png?alt=media&token=5076d00b-4553-4763-a989-36f1140f7b03'  // filter2의 이미지 URL
        : ''; // filter2는 백그라운드 제거
    }
  
    const screenParams = {
        filterId,
        filterImageUri,
        locationId,
    };
    navigation.navigate('CameraFilter', screenParams); // 화면 이동
  };
  
  const renderItem = ({ item }) => (
    <View>
      <Image source={item.locationImage} style={styles.locationImage} />
      <View style={styles.filterContainer}>
        {item.filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            onPress={() => handleFilterPress(item.id, filter.id)}
          >
            <Image source={filter.image} style={styles.filterImage} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 상단 헤더 이미지 */}
      <Image source={images.header} style={styles.headerImage} />

      {/* 버튼 섹션 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => handlePress('all')}>
          <Image
            source={selectedButton === 'all' ? images.selectAll : images.all}
            style={styles.buttonImage}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handlePress('drama')}>
          <Image
            source={selectedButton === 'drama' ? images.selectDrama : images.drama}
            style={styles.buttonImage}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handlePress('movie')}>
          <Image
            source={selectedButton === 'movie' ? images.selectMovie : images.movie}
            style={styles.buttonImage}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handlePress('musicVideo')}>
          <Image
            source={selectedButton === 'musicVideo' ? images.selectMusicVideo : images.musicVideo}
            style={styles.buttonImage}
          />
        </TouchableOpacity>
      </View>

      {/* 이미지와 필터가 들어있는 리스트 */}
      <FlatList
        data={filteredImageData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerImage: {
    width: '100%', // 화면 너비에 맞게 조정
    height: screenHeight * 0.1, // 화면 높이의 10%로 설정
    resizeMode: 'cover',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: screenWidth * 0.06,
  },
  buttonImage: {
    width: screenWidth * 0.2, // 화면 너비의 20% 크기
    height: screenHeight * 0.08, // 화면 높이의 8% 크기
    resizeMode: 'contain',
  },
  locationImage: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.5, 
    resizeMode: 'contain', 
    marginTop: '-10%',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    top: '-35%',
    marginBottom: '-20%',
  },
  filterImage: {
    width: 130,
    resizeMode: 'contain',
  },
});

export default CameraMenu;
