import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePlayer } from "../../contexts/PlayerContext";
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';

import styles from './styles.module.scss';
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

export const Player = () => {
  const [progress, setProgress] = useState(0);

  const { episodeList, 
          currentEpisodeIndex, 
          setPlayingState, 
          togglePlay, 
          isPlaying,
          playNext,
          playPrevious,
          hasNext,
          hasPrevious,
          toggleLoop, 
          isLooping,
          toggleShuffle,
          isShuffling,
          clearPlayerState } = usePlayer();

  const episode = episodeList[currentEpisodeIndex];

  const audioRef = useRef<HTMLAudioElement>(null);

  const setupProgressListener = () => {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    })
  }

  const handleSeek = (amount: number) => {
    audioRef.current.currentTime =amount;
    setProgress(amount);
  }

  const handleEpisodeEnded = () => {
    if (hasNext) {
      console.log('Playing Next');
      playNext();
    } else {
      console.log('Clearing');
      clearPlayerState();
    }
  }

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying])

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora"/>
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode }>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}      

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            { episode ? (
              <Slider 
                trackStyle={{ backgroundColor: '#04D361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}  
                handleStyle={{ borderColor: '#04D361', borderWidth: 4 }}
                onChange={handleSeek}
                max={episode.duration}
                value={progress}
              /> 
            ) : (
              <div className={styles.emptySlider}/>
            )}             
          </div>
          <span>{convertDurationToTimeString(episode ? episode.duration : 0)}</span>
        </div>

        { episode && (
          <audio 
            src={episode.url} 
            ref={audioRef}
            loop={isLooping}
            autoPlay
            onEnded={() => handleEpisodeEnded()}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={() => setupProgressListener()}
          />
        )}

        <div className={styles.buttons}>
          <button 
            type="button" 
            disabled={!episode || episodeList.length === 1}
            onClick={() => toggleShuffle()}
            className={ isShuffling ? styles.isActive : '' } >            
            <img src="/shuffle.svg" alt="Embaralhar"/>
          </button>
          <button type="button" onClick={() => playPrevious()} disabled={!episode || !hasPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior"/>
          </button>
          <button type="button" 
            className={styles.playButton} 
            disabled={!episode}
            onClick={ () => togglePlay()}>
            { isPlaying ? (
              <img src="/pause.svg" alt="Pause"/>
            ) : (
              <img src="/play.svg" alt="Tocar"/>  
            )}
          </button>
          <button type="button" onClick={() => playNext()} disabled={!episode || !hasNext}>
            <img src="/play-next.svg" alt="Tocar próxima"/>
          </button>
          <button type="button" 
                  onClick={() => toggleLoop()} 
                  disabled={!episode} 
                  className={ isLooping ? styles.isActive : '' }>
            <img src="/repeat.svg" alt="Repetir"/>
          </button>
        </div>
      </footer>
    </div>
  )
}