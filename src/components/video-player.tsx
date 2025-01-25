import React from 'react';
import {View, StyleSheet} from 'react-native';
import Video from 'react-native-video';
import VideoPlayerControls from './video-player-controls';
import {AdPlayer} from './ad-player';
import {VideoPlayerProps} from '../types/video-player-types';
import {useVideoPlayer} from '../hooks/video-player-hook';

const adTagUrls = {
  preRoll:
    'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=',
  midRoll:
    'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=',
  postRoll:
    'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinearvpaid2js&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=',
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({source, title}) => {
  const {
    mainVideoRef,
    controls,
    onProgress,
    onLoad,
    onVideoEnd,
    onBuffer,
    handleAdEvent,
    setControls,
  } = useVideoPlayer(adTagUrls);

  return (
    <View style={styles.container}>
      <Video
        ref={mainVideoRef}
        style={[styles.video, controls.isAdPlaying && styles.hidden]}
        onProgress={onProgress}
        onLoad={onLoad}
        onEnd={onVideoEnd}
        onBuffer={onBuffer}
        controls={false}
        paused={!controls.isPlaying || controls.isAdPlaying}
        resizeMode="contain"
        source={{uri: source}}
      />

      {(controls.isAdLoaded || controls.isAdPlaying) && (
        <AdPlayer
          adTagUrl={adTagUrls[controls.currentAd!]}
          onAdEvent={handleAdEvent}
          isAdLoaded={controls.isAdLoaded}
        />
      )}

      {controls.showControls && (
        <VideoPlayerControls
          title={title}
          controls={controls}
          setControls={setControls}
          videoRef={mainVideoRef}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
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
