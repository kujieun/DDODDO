import * as React from "react";
import { StatusBar, StyleSheet, View, Image, Text } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import { useState, useEffect } from "react";

const MainHome = () => {
    const [daysLeft, setDaysLeft] = useState(0);

    useEffect(() => {
        // 목표 날짜 설정 (예: 강릉 여행 날짜)
        const targetDate = new Date("2024-10-13"); // YYYY-MM-DD 형식
        const today = new Date();

        // 날짜 차이 계산
        const diffTime = targetDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 밀리초를 일로 변환

        setDaysLeft(diffDays);
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            <LinearGradient
                style={styles.lineargradient}
                locations={[0, 0.46, 1]}
                colors={['#fafdff', '#dcefff', '#a0c2f6']}
                useAngle={true}
                angle={178.86}
            />
            <Image
                source={require('../image/mainhome/logo.png')}
                style={styles.logo}
            />
            <View style={styles.alarmcontainer}>
                <Image
                    source={require('../image/mainhome/alarm.png')}
                    style={styles.alarm}
                />
                <View style={styles.alarmWarning} />
            </View>
            <Text style={styles.nickname}>
                닉네임님,{'\n'}강릉 여행까지 D-{daysLeft} 남았습니다!
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    lineargradient: {
        flex: 1,
        width: "100%",
        height: 403,
        backgroundColor: "transparent",
    },
    logo: {
        position: 'absolute',
        width: 77,
        height: 27.93,
        left: 20,
        top: 41,
    },
    alarmcontainer: {
        position: 'absolute',
        width: 18,
        height: 23.1,
        left: 322,
        top: 43,
    },
    alarm: {
        width: 16,
        height: 19.1,
    },
    alarmWarning: {
        position: 'absolute',
        width: 8,
        height: 8,
        right: 0,
        top: 0,
        backgroundColor: '#FF4343',
        borderRadius: 4,
    },
    nickname: {
        position: 'absolute',
        height: 48,
        left: 54,
        top: 113,
        fontFamily: 'Pretendard-Bold', // 폰트 이름 확인 필요
        fontStyle: 'Bold',
        fontWeight: '600',
        fontSize: 20,
        lineHeight: 24,
        textAlign: 'center',
        letterSpacing: -0.025,
        color: '#111111',
    },
});

export default MainHome;
