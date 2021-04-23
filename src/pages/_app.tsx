import styles from '../styles/app.module.scss';
import { Header } from '../components/Header'
import '../styles/global.scss'
import { Player } from '../components/Player';
import { PlayerContext } from '../contexts/PlayerContext';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [ episodeList, setEpisodeList ] = useState([]);
  const [currentEpisodeIndex, setcurrentEpisodeIndex] = useState(0);
  const [isPlaying, setisPlaying] = useState(false)

  const play = (episode) => {
    setEpisodeList([episode]);
    setcurrentEpisodeIndex(0);
    setisPlaying(true);
  }

  const togglePlay = () => {
    setisPlaying(!isPlaying);
  }

  const setPlayingState = (state: boolean) => {
    setisPlaying(state);
  }

  return(
    <PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, play, setPlayingState, togglePlay, isPlaying }}>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />        
        </main>
        <Player />
      </div>
    </PlayerContext.Provider>
  )
}

export default MyApp
