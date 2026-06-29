import React, { useContext, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import useMousePosition from '../../utils/useMousePosition';
import { BiSolidChevronsRight } from 'react-icons/bi';
import CameraContext from '../../CameraContext';
import './end.scss'

const End = () => {
  const {
    setCameraPosition,
    hideElements, setHideElements,
    sectionZIndex, setSectionZIndex,
    sectionDisplay, setSectionDisplay
  } = useContext(CameraContext);

  const cameraPositions = [
    {x: -0.67, y: 0.58, z: -0.49},
    {x: 0.0, y: 0.65, z: 0.2},
  ]

  const handleAnchorClick = () => {
    setHideElements(true);
  };
  
  const showScene = () => {
    if (hideElements) {
      setSectionZIndex(1);
      setSectionDisplay('none');

      setCameraPosition({ x: cameraPositions[1].x, y: cameraPositions[1].y, z: cameraPositions[1].z });
    }
  };


  const [isHovered, setIsHovered] = useState(false);
  const { x, y } = useMousePosition();
  const size = isHovered ? 500 : 0;

  return (
      <motion.section
            style={{ zIndex: sectionZIndex, display: sectionDisplay }}
            animate={hideElements ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 1, ease: [0.42, 0, 0.58, 1] }}
            onAnimationComplete={showScene}
            className="h-screen w-full relative"
        >
            <motion.div
                className={`z-[2] end-mask absolute h-[70%] w-full flex items-center justify-center bg-yellow ${hideElements && "opacity-0"}`}
                animate={{
                    WebkitMaskPosition: `${x ? x - (size / 2) : 0}px ${y ? y - (size / 2) : 0}px`,
                    WebkitMaskSize: `${size}px`,
                }}
                transition={{ ease: "backOut", duration: 0.5 }}
            >
                <div
                    onMouseEnter={() => { setIsHovered(true); }} onMouseLeave={() => { setIsHovered(false); }}
                    className="flex flex-col gap-[20px] items-center justify-center text-black w-[46%]"
                >
                    <h1 className="pb-[16px]">MY DREAM</h1>
                    <img className="h-[100px]" src="/txt/end/ONE_DAY.svg" alt="ONE DAY" />
                    <img className="h-[100px]" src="/txt/end/I_WILL.svg" alt="I WILL" />
                    <img className="h-[100px]" src="/txt/end/ARRIVE.svg" alt="ARRIVE" />
                    <h1 className="pt-[16px]"><a onClick={handleAnchorClick} className="cursor-pointer p-[16px]">CLICK ME AND SEE!</a></h1>
                </div>
            </motion.div>
            <motion.div
                className="z-[1] h-[70%] w-full flex items-center justify-center"
                initial={{ opacity: 1 }}
                animate={hideElements ? { opacity: 0 } : { opacity: 1 }}
                transition={{ ease: [0.42, 0, 0.58, 1] }}
            >
                <MaskText />
            </motion.div>
            <motion.div
                className="h-[30%] w-full bg-dark-grey flex flex-col justify-center footer"
                initial={{ translateY: 0 }}
                animate={hideElements ? { translateY: '100%' } : { translateY: 0 }}
                transition={{ ease: [0.42, 0, 0.58, 1] }}
            >
                <Text3D primary={"CONNECT"} secondary={"SOCIAL MEDIA SUCKS"} size="title" />
                <div className="grid grid-cols-3 mx-[20%]">
                  <div className="text-white">
                    <Text3D primary="LinkedIn" secondary="Serious.me" size="large" />
                    <Text3D primary="Telegram" secondary="Web3 LinkedIn" size="large" />
                    <Text3D primary="Github" secondary="Crappy Code" size="large" />
                  </div>
                  <div className="text-white">
                    <Text3D primary="Instagram" secondary="Not Tiktok" size="large" />
                    <Text3D primary="Youtube" secondary="Random BS" size="large" />
                    <Text3D primary="Threads" secondary="Barely Use It" size="large" />
                  </div>
                  <div className="text-white">
                    <p className="text-[12px] mt-[16px] flex">Email</p>
                    <Text3D primary="l677zhan@uwaterloo.ca" secondary="I promise I check my email :)" size="small" />
                    <p className="text-[12px] mt-[16px] flex">Phone</p>
                    <Text3D primary="+1 (416) 560-0826" secondary="(っ˘ω˘ς )" size="small" />
                    <p className="text-[12px] mt-[16px] flex">Discord</p>
                    <Text3D primary="LukeyPookster (duh)" secondary="Literally all my handles are LukeyPookster" size="small" />
                  </div>
                </div>
            </motion.div>
        </motion.section>
  )
}

export default React.memo(End)

type Text3DProps = {
  primary: string;
  secondary: string;
  size?: 'large' | 'small' | 'title';
};

function Text3D({ primary, secondary, size = 'large' }: Text3DProps) {

  const containerClass = `text-3d-${size}-container ${size === 'title' ? 'mx-[20%]' : ''}`;
  const primaryClass = `text-3d-${size}-primary ${size === 'title' ? 'text-white' : ''}`;
  const secondaryClass = `text-3d-${size}-secondary bg-yellow text-black`;

  const Tag = size === 'title' ? 'h1' : 'p';

  return (
    <div className={containerClass}>
      <Tag className={`${primaryClass}`}>
        {size !== 'title' && <BiSolidChevronsRight />}
        {primary}
      </Tag>
      <Tag className={`${secondaryClass}`}>
        {size !== 'title' && <BiSolidChevronsRight />}
        {secondary}
      </Tag>
    </div>
  );
}

const MaskText = (props: any) => {
  const animation = {
    initial: {y: "100%"},
    enter: (i: number) => ({y: "0", transition: {duration: 0.75, ease: [0.33, 1, 0.68, 1],  delay: 0.075 * i}})
  }

  const { ref, inView } = useInView({
    threshold: 0.75,
    triggerOnce: true
  });

  return (
    <div ref={ref} className="flex flex-col gap-[20px] items-center justify-center text-white w-[46%]">
      <div key={0} className="overflow-hidden flex justify-center">
        <motion.h1 custom={0} variants={animation} initial="initial" animate={inView ? "enter" : ""} className="pb-[16px]">MY MOTTO</motion.h1>
      </div>
      <div key={1} className="overflow-hidden flex justify-center">
        <motion.img custom={1} variants={animation} initial="initial" animate={inView ? "enter" : ""} className="h-[100px]" src="/txt/end/EVERY_STEP.svg" alt="EVERY STEP" />
      </div>
      <div key={2} className="overflow-hidden flex justify-center">
        <motion.img custom={2} variants={animation} initial="initial" animate={inView ? "enter" : ""} className="h-[100px]" src="/txt/end/IS_A_STEP.svg" alt="IS A STEP" />
      </div>
      <div key={3} className="overflow-hidden flex justify-center">
        <motion.img custom={3} variants={animation} initial="initial" animate={inView ? "enter" : ""} className="h-[100px]" src="/txt/end/FORWARD.svg" alt="FORWARD" />
      </div>
      <div key={4} className="overflow-hidden flex justify-center">
        <motion.h1 custom={4} variants={animation} initial="initial" animate={inView ? "enter" : ""} className="pt-[16px]"><a className="cursor-pointer p-[16px]">IT ALL STARTS HERE</a></motion.h1>
      </div>
    </div>
  )
}