import React, {useRef, useState, useEffect} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import Video, {
  OnBufferData,
  OnLoadData,
  OnProgressData,
  OnReceiveAdEventData,
  VideoRef,
} from 'react-native-video';
import VideoPlayerControls from './video-player-controls';
import {AdPlayer} from './ad-player';
import {
  AD_TYPES,
  AdType,
  ControlsState,
  VideoPlayerProps,
} from '../types/video-player-types';

const adTagUrls = {
  preRoll:
    'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=',
  midRoll:
    'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=',
  postRoll:
    'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinearvpaid2js&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=',
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({source, title}) => {
  const mainVideoRef = useRef<VideoRef>(null);
  const [controls, setControls] = useState<ControlsState>({
    isPlaying: true,
    progress: 0,
    duration: 0,
    showControls: true,
    isAdPlaying: false,
    currentAd: null,
    isBuffering: false,
  });

  const [playedAds, setPlayedAds] = useState<Record<AdType, boolean>>({
    preRoll: false,
    midRoll: false,
    postRoll: false,
  });

  const onProgress = (data: OnProgressData) => {
    setControls(prev => ({
      ...prev,
      progress: data.currentTime,
    }));

    const midRollTriggerTime = controls.duration * 0.5;
    if (
      data.currentTime >= midRollTriggerTime &&
      !controls.isAdPlaying &&
      adTagUrls.midRoll &&
      !playedAds.midRoll
    ) {
      playAd(AD_TYPES.MID_ROLL);
      setPlayedAds(prev => ({...prev, midRoll: true}));
    }
  };

  const onLoad = (data: OnLoadData) => {
    setControls(prev => ({
      ...prev,
      duration: data.duration,
    }));

    if (adTagUrls.preRoll && !playedAds.preRoll) {
      playAd(AD_TYPES.PRE_ROLL);
      setPlayedAds(prev => ({...prev, preRoll: true}));
    }
  };

  const onVideoEnd = () => {
    if (adTagUrls.postRoll && !playedAds.postRoll) {
      playAd(AD_TYPES.POST_ROLL);
      setPlayedAds(prev => ({...prev, postRoll: true}));
    }
  };

  const onBuffer = (data: OnBufferData) => {
    setControls(prev => ({
      ...prev,
      isPlaying: data.isBuffering ? false : true,
      isBuffering: data.isBuffering,
    }));
  };

  const playAd = (adType: AdType) => {
    if (mainVideoRef.current) {
      mainVideoRef.current.pause();
    }

    setControls(prev => ({
      ...prev,
      isAdPlaying: true,
      currentAd: adType,
      isPlaying: false,
      showControls: false,
    }));
  };

  const handleAdEvent = (data: OnReceiveAdEventData) => {
    switch (data.event) {
      case 'STARTED':
        setControls(prev => ({
          ...prev,
          isAdPlaying: true,
          isPlaying: false,
          showControls: false,
        }));
        break;

      case 'SKIPPED':
      case 'COMPLETED':
      case 'ALL_ADS_COMPLETED':
        setControls(prev => ({
          ...prev,
          isAdPlaying: false,
          currentAd: null,
          showControls: true,
          isPlaying: controls.currentAd !== AD_TYPES.POST_ROLL,
        }));

        if (controls.currentAd !== AD_TYPES.POST_ROLL) {
          if (mainVideoRef.current) {
            mainVideoRef.current.seek(controls.progress);
          }
        }

        break;

      case 'ERROR':
        console.error('Ad error:', data);
        setControls(prev => ({
          ...prev,
          isAdPlaying: false,
          currentAd: null,
          showControls: true,
          isPlaying: true,
        }));
        break;
    }
  };

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

      {controls.isAdPlaying && (
        <AdPlayer
          adTagUrl={adTagUrls[controls.currentAd!]}
          onAdEvent={handleAdEvent}
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
    opacity: 0, // Make the video invisible
    position: 'absolute', // Remove it from the layout flow
    width: 0, // Set width to 0 to avoid taking up space
    height: 0, // Set height to 0 to avoid taking up space
  },
});
