import { useRef, useState } from 'react';
import { OnProgressData, OnLoadData, OnBufferData, OnReceiveAdEventData, VideoRef } from 'react-native-video';
import { AD_TYPES, AdType, ControlsState } from '../types/video-player-types';

export const useVideoPlayer = (source: string, adTagUrls: Record<AdType, string>) => {
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
    setControls((prev) => ({
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
      setPlayedAds((prev) => ({ ...prev, midRoll: true }));
    }
  };

  const onLoad = (data: OnLoadData) => {
    setControls((prev) => ({
      ...prev,
      duration: data.duration,
    }));

    if (adTagUrls.preRoll && !playedAds.preRoll) {
      playAd(AD_TYPES.PRE_ROLL);
      setPlayedAds((prev) => ({ ...prev, preRoll: true }));
    }
  };

  const onVideoEnd = () => {
    if (adTagUrls.postRoll && !playedAds.postRoll) {
      playAd(AD_TYPES.POST_ROLL);
      setPlayedAds((prev) => ({ ...prev, postRoll: true }));
    }
  };

  const onBuffer = (data: OnBufferData) => {
    setControls((prev) => ({
      ...prev,
      isPlaying: data.isBuffering ? false : true,
      isBuffering: data.isBuffering,
    }));
  };

  const playAd = (adType: AdType) => {
    if (mainVideoRef.current) {
      mainVideoRef.current.pause();
    }

    setControls((prev) => ({
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
        setControls((prev) => ({
          ...prev,
          isAdPlaying: true,
          isPlaying: false,
          showControls: false,
        }));
        break;

      case 'SKIPPED':
      case 'COMPLETED':
      case 'ALL_ADS_COMPLETED':
        setControls((prev) => ({
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
        setControls((prev) => ({
          ...prev,
          isAdPlaying: false,
          currentAd: null,
          showControls: true,
          isPlaying: true,
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
    setControls
  };
};