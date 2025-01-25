import {useRef, useState} from 'react';
import {
  OnProgressData,
  OnLoadData,
  OnBufferData,
  OnReceiveAdEventData,
  VideoRef,
} from 'react-native-video';
import {AD_TYPES, AdType, ControlsState} from '../types/video-player-types';

export const useVideoPlayer = (
  adTagUrls: Record<AdType, string>,
) => {
  const mainVideoRef = useRef<VideoRef>(null);
  const [controls, setControls] = useState<ControlsState>({
    isPlaying: true,       // Whether the main video is playing
    progress: 0,           // Current playback time of the main video
    duration: 0,           // Total duration of the main video
    showControls: true,    // Whether to show video controls (e.g., play/pause)
    isAdPlaying: false,    // Whether an ad is currently playing
    currentAd: null,       // Type of the current ad (pre-roll, mid-roll, post-roll)
    isBuffering: false,    // Whether the main video is buffering
    isAdLoaded: false,     // Whether the ad has loaded successfully (used to toggle visibility of the ad component)
  });                      // so add will be only shown if it's working fine

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

    if (controls.duration <= 0) {
      return;  
    }

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
      currentAd: adType,
      isAdLoaded: true,
    }));
  };

  const handleAdEvent = (data: OnReceiveAdEventData) => {

    switch (data.event) {
      case 'LOADED':
        setControls(prev => ({
          ...prev,
          isAdPlaying: true,
          isPlaying: false,
          showControls: false,
          isAdLoaded: false,
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
          isAdLoaded: false,
        }));

        if (controls.currentAd !== AD_TYPES.POST_ROLL) {
          if (mainVideoRef.current) {
            mainVideoRef.current.seek(controls.progress);
          }
        }
        break;

      case 'ERROR':
        console.log('Ad error:', data);
        setControls(prev => ({
          ...prev,
          isAdPlaying: false,
          currentAd: null,
          showControls: true,
          isPlaying: true,
          isAdLoaded: false,
        }));
        break;
    }
  };

  return {
    mainVideoRef,
    controls,
    playedAds,
    onProgress,
    onLoad,
    onVideoEnd,
    onBuffer,
    playAd,
    handleAdEvent,
    setControls,
  };
};
