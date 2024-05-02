"use client";

import useAuthModal from "@/hooks/useAuthModal";
import useUploadModal from "@/hooks/useUploadModal";
import useUser from "@/hooks/useUser";
import { Song } from "@/types";
import { AiOutlinePlus } from "react-icons/ai";
import { TbPlaylist } from "react-icons/tb";
import MediaItem from "./MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

interface LibraryProps {
  songs: Song[];
}

const Library: React.FC<LibraryProps> = ({ songs }) => {
  const authModal = useAuthModal();
  const uploadModal = useUploadModal();
  const { user } = useUser();

  const onPlay = useOnPlay(songs);
  const onClick = () => {
    if (!user) {
      return authModal.onOpen();
    }
    return uploadModal.onOpen();
  };
  useEffect(() => {
    AOS.init({
      duration: 1000, // specify animation duration
      easing: "ease", // specify animation easing
      once: true, // whether animation should only happen once
      offset: 100, // offset (in pixels) from the bottom of the viewport
    });
  }, []);
  return (
    <div>
      <div className='flex items-center justify-between px-5 pt-4'>
        <div className='inline-flex items-center gap-x-2'>
          <TbPlaylist className='text-neutral-400' size={26} />
          <p className='capitalize text-neutral-400 font-medium text-md'>
            Your Library
          </p>
        </div>
        <AiOutlinePlus
          onClick={onClick}
          size={20}
          className='text-neutral-400 cursor-pointer hover:text-white transition'
        />
      </div>
      <div className='flex flex-col gap-y-2 mt-4 px-3' data-aos="fade-right">
        {songs.map((item) => (
          <MediaItem onClick={(id: string) => onPlay(id)} key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
};

export default Library;
