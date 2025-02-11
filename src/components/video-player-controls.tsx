import Slider from '@react-native-community/slider';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {VideoPlayerControlsProps} from '../types/video-player-types';
import {formatTime} from '../lib/helper';

const icons = {
  forward: require('../assets/btnForward.png'),
  pause: require('../assets/btnPause.png'),
  play: require('../assets/btnPlay.png'),
  rewind: require('../assets/btnRewind.png'),
  back: require('../assets/iconBack.png'),
  backEn: require('../assets/iconBackEn.png'),
  channelPrograms: require('../assets/iconChannelPrograms.png'),
  download: require('../assets/iconDownload.png'),
  episodes: require('../assets/iconEpisodes.png'),
  expand: require('../assets/iconExpand.png'),
  free: require('../assets/iconFree.png'),
  minimize: require('../assets/iconMinimize.png'),
  pip: require('../assets/iconPip.png'),
  settings: require('../assets/iconSettings.png'),
  share: require('../assets/iconShare.png'),
};

const VideoPlayerControls: React.FC<VideoPlayerControlsProps> = ({
  title,
  controls,
  setControls,
  videoRef,
  source,
}) => {
  const navigation = useNavigation();

  const handleTimeControl = (
    action: 'forward' | 'backward' | 'seek',
    value?: number,
  ) => {
    if (!videoRef.current) return;

    const wasPlaying = controls.isPlaying;
    let newTime = controls.progress;

    switch (action) {
      case 'forward':
        newTime = Math.min(controls.progress + 10, controls.duration);
        break;
      case 'backward':
        newTime = Math.max(controls.progress - 10, 0);
        break;
      case 'seek':
        newTime = value ?? 0;
        break;
    }

    setControls(prev => ({
      ...prev,
      isPlaying: false,
      progress: newTime,
    }));

    videoRef.current.seek(newTime);

    setTimeout(() => {
      /// this setTimeour fix that video doesnt auto resume on IOS
      /// TODO will see other way to fix
      setControls(prev => ({
        ...prev,
        isPlaying: wasPlaying,
      }));
    }, 100);
  };

  const onShare = async () => {
    try {
       await Share.share({
        message: `Enjoy Watching: ${source}`,
      });
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <View style={styles.controlsContainer}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={onShare}
          style={[styles.iconButton, {paddingRight: '9%'}]}>
          <Image source={icons.share} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.titleArabic}>{title}</Text>

        <View style={styles.freeContainer}>
          <Text style={styles.freeText}>FREE</Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}>
          <Image source={icons.back} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.centerControls}>
        {controls.isBuffering ? (
          <ActivityIndicator
            size="large"
            color="white"
            style={styles.loadingIndicator}
          />
        ) : (
          <>
            <TouchableOpacity onPress={() => handleTimeControl('backward')}>
              <View style={styles.circleButton}>
                <Image source={icons.rewind} style={styles.controlIcon} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setControls(prev => ({...prev, isPlaying: !prev.isPlaying}))
              }>
              <View style={styles.playPauseButton}>
                <Image
                  source={controls.isPlaying ? icons.pause : icons.play}
                  style={styles.playPauseIcon}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleTimeControl('forward')}>
              <View style={styles.circleButton}>
                <Image source={icons.forward} style={styles.controlIcon} />
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.bottomBar}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(controls.progress)}</Text>
          <Text style={styles.timeText}>{formatTime(controls.duration)}</Text>
        </View>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={controls.duration}
            value={controls.progress}
            minimumTrackTintColor="rgb(255, 255, 255)"
            maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
            thumbTintColor="rgb(255, 255, 255)"
            onSlidingComplete={value => handleTimeControl('seek', value)}
          />
        </View>
      </View>
    </View>
  );
};

export default VideoPlayerControls;

const styles = StyleSheet.create({
  controlsContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'space-between',
    padding: 20,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  titleArabic: {
    flex: 1,
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },

  freeContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  freeText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  centerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  circleButton: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonNumber: {
    color: 'white',
    fontSize: 12,
    position: 'absolute',
    top: 8,
  },
  playPauseButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    width: '100%',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeText: {
    color: 'white',
    fontSize: 14,
  },
  sliderContainer: {
    width: '100%',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  speedButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  speedText: {
    color: 'white',
    fontSize: 14,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  iconButton: {
    marginHorizontal: 8,
  },

  controlIcon: {
    width: 60,
    height: 60,
  },

  playPauseIcon: {
    width: 70,
    height: 70,
  },
  controlButton: {
    marginHorizontal: 8,
  },

  loadingIndicator: {
    position: 'absolute',
    alignSelf: 'center',
  },
});
