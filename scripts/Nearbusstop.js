import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      {/* 추천 맛집/ 홈 */}
      <Text style={styles.title}>추천맛집</Text>

      {/* 선택지 스크롤 뷰 */}
      <ScrollView horizontal style={styles.scrollContainer}>
        <View style={styles.scrollItem}>
          <Text style={styles.scrollItemText}>안녕</Text>
          <View style={styles.scrollItemLine} />
        </View>
        <View style={styles.scrollItem}>
          <Text style={styles.scrollItemText}>헬로</Text>
          <View style={styles.scrollItemLine} />
        </View>
        <View style={styles.scrollItem}>
          <Text style={styles.scrollItemText}>니하오</Text>
          <View style={styles.scrollItemLine} />
        </View>
        {/* 더 많은 아이템들 */}
      </ScrollView>

      {/* 추천 맛집 리스트 */}
      <View style={styles.restaurantList}>
        {/* 첫 번째 레스토랑 아이템 */}
        <View style={styles.restaurantItem}>
          <View style={styles.restaurantImage} />
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>장소이름</Text>
            <Text style={styles.restaurantDescription}>
              이 가게는 ~~가 특징입니다유! 혹시나 두줄이 될 수도?
            </Text>
            <View style={styles.ratingRow}>
              <View style={styles.starRating}>
                <View style={styles.star} />
                <Text style={styles.ratingText}>5.0 (35)</Text>
              </View>
              <View style={styles.distanceRow}>
                <View style={styles.dot} />
                <Text style={styles.distanceText}>111m</Text>
              </View>
            </View>
          </View>
          <View style={styles.actionButton}>
            <View style={styles.actionIcon} />
          </View>
        </View>

        {/* 두 번째 레스토랑 아이템 */}
        <View style={styles.restaurantItem}>
          <View style={styles.restaurantImage} />
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>장소이름</Text>
            <Text style={styles.restaurantDescription}>
              이 가게는 ~~가 특징입니다유! 혹시나 두줄이 될 수도?
            </Text>
            <View style={styles.ratingRow}>
              <View style={styles.starRating}>
                <View style={styles.star} />
                <Text style={styles.ratingText}>5.0 (35)</Text>
              </View>
              <View style={styles.distanceRow}>
                <View style={styles.dot} />
                <Text style={styles.distanceText}>111m</Text>
              </View>
            </View>
          </View>
          <View style={styles.actionButton}>
            <View style={styles.actionIcon} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    position: 'absolute',
    top: 45,
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    color: '#111111',
  },
  scrollContainer: {
    position: 'absolute',
    top: 95,
    left: 0,
    right: 0,
    height: 33,
  },
  scrollItem: {
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  scrollItemText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#6495ED',
  },
  scrollItemLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#6495ED',
    marginTop: 4,
  },
  restaurantList: {
    position: 'absolute',
    top: 185,
    left: 20,
    right: 14,
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
    backgroundColor: '#FFB800',
    borderRadius: 0.8,
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
  },
  actionIcon: {
    width: 27,
    height: 27,
    backgroundColor: '#D9D9D9',
  },
});
