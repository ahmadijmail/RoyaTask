import React, {useEffect} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {VideoPlayer} from './src/components/VideoPlayer';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function HomeScreen({navigation}) {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button
        title="Watch Video"
        onPress={() => navigation.push('VideoScreen')}
      />
    </View>
  );
}

function VideoScreen() {
  const data = {
    source:
      'https://roya-vod.ercdn.net/hls/i/r0/ixev5jcihldq43huwlykbswxmt0qv1qcaojfyx8h/ixev5jcihldq43huwlykbswxmt0qv1qcaojfyx8h_600.mp4',
    title: 'Family Matter',
    seasonNumber: 3,
    episodeNumber: 1,
    hasAds: true,
  };

  return (
    <VideoPlayer
      source={data.source}
      title={data.title}
      seasonNumber={data.seasonNumber}
      episodeNumber={data.episodeNumber}
      hasAds={data.hasAds}
      nextEpisode={() => {
        // Handle next episode
      }}
    />
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="VideoScreen"
          component={VideoScreen}
          options={{
            headerShown: false,
            orientation: 'landscape',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
