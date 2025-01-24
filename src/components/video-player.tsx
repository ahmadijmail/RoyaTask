import React, {useState, useRef} from 'react';
import {View, StyleSheet, Platform, StatusBar} from 'react-native';
import Video from 'react-native-video';
import VideoPlayerControls from './video-player-controls';
import {ControlsState, VideoPlayerProps} from '../types/video-player-types';


export const VideoPlayer: React.FC<VideoPlayerProps> = ({source, title}) => {
  const videoRef = useRef<React.ElementRef<typeof Video>>(null);
  const [controls, setControls] = useState<ControlsState>({
    isPlaying: true,
    progress: 0,
    duration: 0,
    showControls: true,
  });

  const onProgress = (data: {currentTime: number}) => {
    setControls(prev => ({
      ...prev,
      progress: data.currentTime,
    }));
  };

  const onLoad = (data: {duration: number}) => {
    setControls(prev => ({
      ...prev,
      duration: data.duration,
    }));
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <Video
        ref={videoRef}
        source={{uri: source}}
        style={styles.video}
        onProgress={onProgress}
        onLoad={onLoad}
        onError={error => console.log('Video Error:', error)}
        paused={!controls.isPlaying}
        resizeMode="contain"
      />

      {controls.showControls && (
        <VideoPlayerControls
          title={title}
          controls={controls}
          setControls={setControls}
          videoRef={videoRef}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: Platform.OS === 'ios' ? 44 : 0,
  },
  video: {
    flex: 1,
  },
});
