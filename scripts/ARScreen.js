import { ArViewerView } from 'react-native-ar-viewer';
import { Platform, View } from 'react-native';

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <ArViewerView
        style={{ flex: 1 }}
        model={Platform.OS === 'android' ? 'dice.glb' : 'dice.usdz'}
        lightEstimation
        manageDepth
        allowRotate
        allowScale
        allowTranslate
        disableInstantPlacement
        onStarted={() => console.log('started')}
        onEnded={() => console.log('ended')}
        onModelPlaced={() => console.log('model displayed')}
        onModelRemoved={() => console.log('model not visible anymore')}
        planeOrientation="both"
      />
    </View>
  );
};

export default App;
