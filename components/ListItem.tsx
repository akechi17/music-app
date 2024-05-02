"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaPlay } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

interface ListItemProps {
  image: string;
  name: string;
  href: string;
}

const ListItem: React.FC<ListItemProps> = ({ image, name, href }) => {
  const router = useRouter();

  useEffect(() => {
    AOS.init({
      duration: 1000, // specify animation duration
      easing: "ease", // specify animation easing
      once: true, // whether animation should only happen once
      offset: 100, // offset (in pixels) from the bottom of the viewport
    });
    AOS.refresh();
  }, []);

  const onClick = () => {
    // Add authentication before push
    router.push(href);
  };

  return (
    <button
      data-aos='flip-down'
      onClick={onClick}
      className='relative group flex items-center rounded-md overflow-hidden gap-x-4 bg-neutral-100/10 hover:bg-neutral-100/20 transition pr-4'
    >
      <div className='relative min-h-[64px] min-w-[64px]'>
        <Image className='object-cover' fill src={image} alt='Image' />
      </div>
      <p className='font-medium truncate py-5'>{name}</p>
      <div className='absolute transition opacity-0 rounded-full flex items-center justify-center bg-[#a168f9] p-4 drop-shadow-md right-5 group-hover:opacity-100 hover:scale-110'>
        <FaPlay className='text-black' />
      </div>
    </button>
  );
};

export default ListItem;
