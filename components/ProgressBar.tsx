"use client";

import * as RadixSlider from "@radix-ui/react-slider";

interface ProgressBarProps {
  value?: number;
  max?: number;
  onChange?: (value: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value = 1, onChange, max }) => {
  const handleChange = (newValue: number[]) => {
    onChange?.(newValue[0]);
  };

  return (
    <RadixSlider.Root
      className='flex relative items-center select-none touch-none w-full h-10 cursor-pointer'
      defaultValue={[1]}
      value={[value]}
      onValueChange={handleChange}
      max={max}
      step={0.1}
      aria-label='Progress'
    >
      <RadixSlider.Track className='bg-[#e69d25] relative grow rounded-full h-[3px]'>
        <RadixSlider.Range className='absolute bg-[#e23e64] rounded-full h-full' />
        <RadixSlider.Thumb className='w-5 h-5 block rounded-full bg-[#a0a0a2] shadow-md border-2 border-[#6f4683] -mt-2' />
      </RadixSlider.Track>
    </RadixSlider.Root>
  );
};

export default ProgressBar;