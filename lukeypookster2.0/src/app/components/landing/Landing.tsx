import React, { useRef, useState } from 'react';
import './landing.scss';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import useMousePosition from '../../utils/useMousePosition';
import SideBarMask from '../sideBar/SideBarMask';
import { IconHoverProvider } from '../../IconHoverContext';

type Props = {}

const Landing = (props: Props) => {
  
  const [isHovered, setIsHovered] = useState(false);
  const { x, y } = useMousePosition();
  const size = isHovered ? 500 : 0;

  return (
    <section className="h-screen w-full bg-dark-teal">
        <motion.div 
          className="landing-mask absolute h-screen w-full flex items-center z-[10] bg-purple"
          animate={{
            WebkitMaskPosition: `${x ? x - (size/2) : 0}px ${y ? y - (size/2) : 0}px`,
            WebkitMaskSize: `${size}px`,
          }}
          transition={{ ease: "backOut", duration: 0.5}}
        >
            <SideBarMask />
            <div 
              onMouseEnter={() => {setIsHovered(true)}} onMouseLeave={() => {setIsHovered(false)}}
              className="container flex flex-col gap-[20px] w-[30%] ml-[14%] mb-[60px] text-center"
            >
              <h1 className="pb-[16px]">HELLO HELLO</h1>
              <img className="h-[100px]" src="/txt/landing/DOING.svg" alt="DOING" />
              <img className="h-[100px]" src="/txt/landing/WHAT_I.svg" alt="WHAT I" />
              <img className="h-[100px]" src="/txt/landing/WANT.svg" alt="WANT" />
              <img className="h-[100px]" src="/txt/landing/CUZ_I.svg" alt="CUZ I" />
              <img className="h-[100px]" src="/txt/landing/CAN.svg" alt="CAN :P" />
          </div>
        </motion.div>

        <div className="h-screen w-full flex items-center">
          <MaskText />
        </div>
      </section>
  )
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
    <div ref={ref} className="container flex flex-col gap-[20px] w-[30%] ml-[14%] mb-[60px] text-center z-[2] text-white">
      <div key={0} className="overflow-hidden flex justify-center">
        <motion.h1 custom={0} variants={animation} initial="initial" animate={inView ? "enter" : ""} className="pb-[16px]">LUKE ZHANG</motion.h1>
      </div>
      <div key={1} className="overflow-hidden flex justify-center">
        <motion.img custom={1} variants={animation} initial="initial" animate={inView ? "enter" : ""} className="h-[100px]" src="/txt/landing/GOOD.svg" alt="GOOD" />
      </div>
      <div key={2} className="overflow-hidden flex justify-center">
        <motion.img custom={2} variants={animation} initial="initial" animate={inView ? "enter" : ""} className="h-[100px]" src="/txt/landing/STUFF.svg" alt="STUFF" />
      </div>
      <div key={3} className="overflow-hidden flex justify-center">
        <motion.img custom={3} variants={animation} initial="initial" animate={inView ? "enter" : ""} className="h-[100px]" src="/txt/landing/AND.svg" alt="AND" />
      </div>
      <div key={4} className="overflow-hidden flex justify-center">
        <motion.img custom={4} variants={animation} initial="initial" animate={inView ? "enter" : ""} className="h-[100px]" src="/txt/landing/COOL.svg" alt="COOL" />
      </div>
      <div key={5} className="overflow-hidden flex justify-center">
        <motion.img custom={5} variants={animation} initial="initial" animate={inView ? "enter" : ""} className="h-[100px]" src="/txt/landing/THINGS.svg" alt="THINGS" />
      </div>
    </div>
  )
}



export default Landing