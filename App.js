import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Image,
  AppState,
} from 'react-native';
import {GameEngine} from 'react-native-game-engine';
import entities from './src/entities';
import Physics from './src/physics';
import LinearGradient from 'react-native-linear-gradient';
import colorWheel from './src/colorWheel.png';
import musicNotes from './src/musicNotes.png';
import TrackPlayer, {State} from 'react-native-track-player';

export default function App() {
  const appState = useRef(AppState.currentState);

  const [colorIndex, setColorIndex] = useState(0);
  const [play, setPlay] = useState(false);

  const start = async () => {
    // Set up the player
    TrackPlayer.updateOptions({
      stopWithApp: true,
    });
    await TrackPlayer.setupPlayer();

    // Add a track to the queue
    await TrackPlayer.add({
      id: 'trackId',
      url: require('./src/bgMusic.mp3'),
      title: 'Track Title',
      artist: 'Track Artist',
    });

    // Start playing it
    await TrackPlayer.play();
  };

  const backgrounds = [
    ['#BFE6BA', '#D3959B'],
    ['#56ab2f', '#a8e063'],
    ['#42275a', '#734b6d'],
    ['#2C3E50', '#FD746C'],
    ['#e96443', '#904e95'],
    ['#3a7bd5', '#3a6073'],
  ];

  const [running, setRunning] = useState(false);
  const [gameEngine, setGameEngine] = useState(null);
  const [currentPoints, setCurrentPoints] = useState(0);
  useEffect(() => {
    setRunning(false);
    start();
  }, []);

  useEffect(() => {
    if (play) {
      TrackPlayer.pause();
    } else {
      TrackPlayer.play();
    }
  }, [play]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
      if (appState.current.match(/background/)) {
        TrackPlayer.pause();
      } else if (appState.current.match(/active/)) {
        TrackPlayer.play();
      }

    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <>
      <View
        style={{
          height: 50,
          width: '100%',
          backgroundColor: 'white',
          flexDirection: 'row',
        }}>
        {/* extras */}
        <TouchableOpacity
          onPress={() => setColorIndex(prev => (prev + 1) % backgrounds.length)}
          style={{
            height: 50,
            width: 50,
            marginLeft: 18,
            marginTop: 9,
          }}>
          <Image source={colorWheel} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setPlay(!play)}
          style={{
            height: 50,
            width: 50,
            marginLeft: 18,
            marginTop: 9,
          }}>
          <Image source={musicNotes} />
        </TouchableOpacity>
      </View>
      <LinearGradient colors={backgrounds[colorIndex]} style={{flex: 1}}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 40,
            fontWeight: 'bold',
            margin: 20,
          }}>
          {currentPoints}
        </Text>
        <GameEngine
          ref={ref => {
            setGameEngine(ref);
          }}
          systems={[Physics]}
          entities={entities()}
          running={running}
          onEvent={e => {
            switch (e.type) {
              case 'game_over':
                setRunning(false);
                gameEngine.stop();
                break;
              case 'new_point':
                setCurrentPoints(currentPoints + 1);
                break;
            }
          }}
          style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
          <StatusBar style="auto" />
        </GameEngine>

        {!running ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                backgroundColor: 'transparent',
                paddingHorizontal: 30,
                paddingVertical: 10,
                borderWidth: 3,
                borderColor: 'black',
              }}
              onPress={() => {
                setCurrentPoints(0);
                setRunning(true);
                gameEngine.swap(entities());
              }}>
              <Text style={{fontWeight: 'bold', color: 'black', fontSize: 30}}>
                START GAME
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </LinearGradient>
    </>
  );
}
