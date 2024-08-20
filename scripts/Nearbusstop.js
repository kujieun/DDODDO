import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Image, ScrollView } from 'react-native';

const SignupScreen = () => {
const [selectedCategory, setSelectedCategory] = useState(1);

  const handleCategoryPress = (id) => {
    setSelectedCategory(id);
  };

 return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { /* 뒤로가기 기능 */ }} style={styles.backButtonContainer}>
          <Image source={require('../image/signup/backbutton.png')} style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.headerText}>추천 맛집</Text>

        {/* Search Icon Button */}
        <TouchableOpacity onPress={() => { /* Search 기능 */ }} style={styles.searchButtonContainer}>
          <Image source={require('../image/searchicon.png')} style={styles.searchIcon} />
        </TouchableOpacity>
      </View>

      {/* Navigation Bar */}
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
    </View>
  );
};

const categories = [
  { id: 1, label: '한식' },
  { id: 2, label: '서양식' },
  { id: 3, label: '일식' },
  { id: 4, label: '중식' },
  { id: 5, label: '이색음식' },
  { id: 6, label: '카페' },
  { id: 7, label: '클럽' },
];


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

  // Frame 228 - Search Button Styles
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
    width: 20,
    height: 20,
  },
  navContainer: {
      position: 'absolute',
      top: 90,
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
    marginRight: 0,
    width: 56,
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
    width: 56,
    height: 2,
  },
  activeLine: {
    backgroundColor: '#6495ED',
  },
  inactiveLine: {
    backgroundColor: 'transparent',
  },
});

export default SignupScreen;
