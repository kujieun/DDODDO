import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CameraMenu = () => {
  const navigation = useNavigation();

  // 이미지 경로
  const images = {
    ocean: require('../img/tip/ocean.png'),
    museum: require('../img/tip/museum.png'),
    rain: require('../img/tip/rain.png'),
  };

  // 각 버튼 클릭 시 TipDetail 페이지로 이동하며 선택한 이미지명을 전달
  const handleNavigate = (imageName) => {
    navigation.navigate('TipDetail', { selectedImage: imageName });
  };


  return (
    <View style={styles.container}>
      {/* 상단 헤더 이미지 */}
      <Image source={require('../img/tip/header.png')} style={styles.headerImage} />

      {/* ScrollView로 컨텐츠 감싸기 */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity style={styles.contentContainer}
          onPress={() => handleNavigate('ocean')}>
          <Image source={images.ocean} style={styles.contentImage} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.contentContainer}
        onPress={() => handleNavigate('museum')}>
          <Image source={images.museum} style={styles.contentImage} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.contentContainer}
            onPress={() => handleNavigate('rain')}>
          <Image source={images.rain} style={styles.contentImage} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerImage: {
    width: '100%',
    height: screenHeight * 0.1,
    resizeMode: 'cover',
    marginTop: 15,
  },
  contentImage: {
    width: screenWidth * 0.8, // 화면 너비의 80%
    // height: screenHeight * 0.3, // 화면 높이의 30%
    resizeMode: 'contain',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '-30%',
    marginBottom: '-35%',
  },
  scrollViewContent: {
    paddingBottom: 20, // ScrollView의 마지막 부분 여백 추가
  },
});

export default CameraMenu;
