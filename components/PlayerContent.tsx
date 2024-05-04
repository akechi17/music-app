import React, { useEffect, useState, useRef } from "react";
import { Song } from "@/types";
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";
import useSound from "use-sound";
import { TbMicrophone2, TbRepeat, TbRepeatOnce } from "react-icons/tb";
import { LuShuffle } from "react-icons/lu";
import ProgressBar from "./ProgressBar";
import Link from "next/link";

const formatTime = (duration: number): string => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  const formattedMinutes = minutes < 10 ? `${minutes}` : `${minutes}`;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${formattedMinutes}:${formattedSeconds}`;
};

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [totalDuration, setTotalDuration] = useState<number | null>(null);
  const [currentMinute, setCurrentMinute] = useState<number | null>(null);
  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const RepeatIcon = isRepeat ? TbRepeatOnce : TbRepeat;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;
  const currentIndex = player.ids.findIndex((id) => id === player.activeId);
  const isRepeatRef = useRef<boolean>(isRepeat);
  const shuffleIndexRef = useRef<number>(0);

  useEffect(() => {
    isRepeatRef.current = isRepeat;
  }, [isRepeat]);

  const [play, { pause, sound, stop }] = useSound(songUrl, {
    volume: volume,
    loop: false, // Set loop to false initially
    onplay: () => setIsPlaying(true),
    onend: () => {
      if (!isRepeatRef.current) {
        setIsPlaying(false);
        onPlayNext();
      } else {
        // Check if the sound is loaded before playing
        if (sound && !sound.isPlaying) {
          sound.play();
        }
      }
    },
    onpause: () => setIsPlaying(false),
    format: ["mp3"],
  });

  useEffect(() => {
    sound?.play();

    return () => {
      sound?.unload();
    };
  }, [sound]);

  const handlePlay = () => {
    if (!isPlaying) {
      play();
    } else pause();
  };

  useEffect(() => {
    if (isShuffle) {
      shuffleIndexRef.current = Math.floor(Math.random() * player.ids.length);
    }
  }, [isShuffle, player.ids.length]);

  const onPlayNext = () => {
    if (player.ids.length === 0) {
      return;
    }

    let nextIndex;
    if (isShuffle) {
      nextIndex = shuffleIndexRef.current;
      shuffleIndexRef.current =
        (shuffleIndexRef.current + 1) % player.ids.length;
    } else {
      nextIndex = currentIndex + 1;
    }

    const nextSong = player.ids[nextIndex];
    player.setId(nextSong);
  };

  const onPlayPrevious = () => {
    if (player.ids.length === 0) {
      return;
    }

    const previousSong = player.ids[currentIndex - 1];

    if (!previousSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }

    player.setId(previousSong);
  };

  const toggleMute = () => {
    setVolume((prevVolume) => (prevVolume === 0 ? 1 : 0));
  };

  const toggleRepeat = () => {
    setIsRepeat((prevRepeat) => !prevRepeat);
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const updateProgress = (update: number) => {
    sound.seek(update);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.code === "Space" &&
        !(
          event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement
        )
      ) {
        event.preventDefault();
        handlePlay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    if (sound) {
      setTotalDuration(sound._duration || null);
    }

    const timerId = setInterval(() => {
      if (sound && isPlaying) {
        setCurrentMinute(Math.floor(sound.seek()));
      }
    }, 1000); // Update every second

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(timerId); // Clean up the interval timer
    };
  }, [sound, handlePlay, isPlaying]);

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 h-full'>
      <div className='flex w-full justify-start'>
        <div className='flex items-center gap-x-4 w-56 md:w-80'>
          <MediaItem data={song} />
          <LikeButton songId={song.id} />
        </div>
      </div>
      <div className='flex md:hidden col-auto w-full justify-end items-center'>
        <div
          onClick={handlePlay}
          onKeyDown={handlePlay}
          className='h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer'
        >
          <Icon size={24} className='text-black' />
        </div>
      </div>
      <div className='flex flex-col items-center justify-center'>
        <div className='hidden h-full md:flex justify-center items-center w-full max-w-[722px] gap-x-6'>
          <LuShuffle
            size={18}
            className={`${
              isShuffle ? "text-[#e69d25]" : "text-neutral-400"
            } cursor-pointer hover:text-white transition`}
            onClick={toggleShuffle}
          />
          <AiFillStepBackward
            size={20}
            className='text-neutral-400 cursor-pointer hover:text-white transition'
            onClick={onPlayPrevious}
          />
          <div
            onClick={handlePlay}
            onKeyDown={handlePlay}
            className='flex items-center justify-center h-8 w-8 rounded-full bg-white p-1 cursor-pointer'
          >
            <Icon size={24} className='text-black' />
          </div>
          <AiFillStepForward
            size={20}
            className='text-neutral-400 cursor-pointer hover:text-white transition'
            onClick={onPlayNext}
          />
          <RepeatIcon
            size={20}
            className={`${
              isRepeat ? "text-[#e69d25]" : "text-neutral-400"
            } cursor-pointer hover:text-white transition`}
            onClick={toggleRepeat}
          />
        </div>
        <div className='flex relative items-center w-full h-8 gap-3'>
          <p className='text-neutral-400 text-xs'>
            {currentMinute ? formatTime(currentMinute) : "0:00"}
          </p>
          <ProgressBar
            value={sound?.seek()}
            max={sound?._duration}
            onChange={(value) => updateProgress(value)}
          />
          <p className='text-neutral-400 text-xs'>
            {totalDuration ? formatTime(totalDuration) : "0:00"}
          </p>
        </div>
      </div>
      <div className='hidden md:flex w-full justify-end pr-2 gap-3'>
        <div className='flex items-center'>
          <Link href={`/lyrics/${currentIndex}`}>
            <TbMicrophone2 size={23} />
          </Link>
        </div>
        <div className='flex items-center gap-x-2 w-[120px]'>
          <VolumeIcon
            onClick={toggleMute}
            className='cursor-pointer'
            size={27}
          />
          <Slider value={volume} onChange={(value) => setVolume(value)} />
        </div>
      </div>
    </div>
  );
};

export default PlayerContent;
