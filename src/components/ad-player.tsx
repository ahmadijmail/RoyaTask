import React, {useEffect, useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import Video, { OnReceiveAdEventData, VideoRef } from 'react-native-video';

interface AdPlayerProps {
  adTagUrl: string;
  onAdEvent: (data: OnReceiveAdEventData) => void;
}

export const AdPlayer: React.FC<AdPlayerProps> = ({adTagUrl, onAdEvent}) => {
  const adVideoRef = useRef<VideoRef>(null);
  return (
    <Video
      style={styles.video}
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
});
