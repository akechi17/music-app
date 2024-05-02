import { Song } from "@/types";
import { FaPause, FaPlay } from "react-icons/fa";

interface PlayButtonProps {
  song?: Song;
  data: Song;
}

const PlayButton: React.FC<PlayButtonProps> = ({ data, song }) => {
  const Icon = song?.id === data.id ? FaPause : FaPlay;
  return (
    <button
      className={`transition rounded-full flex items-center bg-[#a168f9] p-4 drop-shadow-md translate ${
        song?.id === data.id ? "translate-y-0 opacity-100" : "translate-y-1/4 opacity-0"
      } group-hover:opacity-100 group-hover:translate-y-0 hover:scale-110`}
    >
      <Icon className='text-black' />
    </button>
  );
};

export default PlayButton;
