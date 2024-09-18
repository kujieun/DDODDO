import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, PermissionsAndroid } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [device, setDevice] = useState(null);
  const devices = useCameraDevices();

  useEffect(() => {
    const getPermissions = async () => {
      const status = await Camera.getCameraPermissionStatus();
      console.log('Camera permission status:', status);

      if (status === 'authorized') {
        setHasPermission(true);
      } else {
        const requestStatus = await Camera.requestCameraPermission();
        setHasPermission(requestStatus === 'authorized');
      }
    };

    getPermissions();
  }, []);

  useEffect(() => {
    // 장치 목록을 확인하여 사용 가능한 back 장치 선택
    const backDevice = devices.back || Object.values(devices).find(d => d.position === 'back');
    if (backDevice) {
      setDevice(backDevice);
      console.log('Selected device:', backDevice);
    } else {
      console.log('Back device not found');
    }
  }, [devices]);

  if (!hasPermission) return <Text>No access to camera</Text>;
  if (!device) return <Text>Loading camera...</Text>; // 장치가 로드될 때까지 대기

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
      />
      <TouchableOpacity style={styles.captureButton}>
        <Text style={styles.buttonText}>Capture</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  captureButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#000',
  },
});

export default CameraScreen;
