import React, {useEffect, useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import Video, { OnReceiveAdEventData, VideoRef } from 'react-native-video';

interface AdPlayerProps {
  adTagUrl: string;
  onAdEvent: (data: OnReceiveAdEventData) => void;
  isAdLoaded:boolean
}

export const AdPlayer: React.FC<AdPlayerProps> = ({adTagUrl, onAdEvent,isAdLoaded}) => {
  const adVideoRef = useRef<VideoRef>(null);
  return (
    <Video
      style={isAdLoaded?styles.hidden: styles.video}
      ref={adVideoRef}
      source={{
        uri: require('../assets/blankVideo.mp4'),
        ad: {
          adTagUrl,
        },
      }}
      onReceiveAdEvent={onAdEvent}
      controls={false}
      paused={false}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  video: {
    flex: 1,
  },
  hidden: {
    opacity: 0, 
    position: 'absolute', 
    width: 0, 
    height: 0,
  },
});
