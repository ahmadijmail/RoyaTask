import React, {useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {VideoPlayer} from './src/components/VideoPlayer';

function App(): React.JSX.Element {
  return (
    <View style={styles.container}>

      <VideoPlayer
        source="https://roya-vod.ercdn.net/hls/i/r0/ixev5jcihldq43huwlykbswxmt0qv1qcaojfyx8h/ixev5jcihldq43huwlykbswxmt0qv1qcaojfyx8h_600.mp4"
        title="Family Matter"
        seasonNumber={3}
        episodeNumber={1}
        hasAds={true}
        nextEpisode={() => {
          // Handle next episode
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
