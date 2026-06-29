import React, { useEffect, useRef, useState } from 'react';

import { motion, useAnimation } from 'framer-motion';
import useInView from '../../utils/useInView';
import useMousePosition from '../../utils/useMousePosition';
import "./about.scss";
import SideBarMask from '../sideBar/SideBarMask';
import { IconHoverProvider } from '../../IconHoverContext';

type Props = {}

const About = (props: Props) => {
  const [titleRef, titleInView] = useInView<HTMLHeadingElement>();
  const [para1Ref, para1InView] = useInView<HTMLParagraphElement>();
  const [para2Ref, para2InView] = useInView<HTMLParagraphElement>();

  const [isHovered, setIsHovered] = useState(false);
  const { x, y } = useMousePosition();
  const size = isHovered ? 500 : 0;

  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        duration: 0.5
      }
    });
  }, [controls]);

  return (
    <section className="h-screen w-full bg-medium-teal">
      <motion.div 
        className="about-mask absolute h-screen w-full flex items-center justify-end z-[10] bg-blue"
        animate={{
          WebkitMaskPosition: `${x ? x - (size/2) : 0}px ${y ? y - (size/2) : 0}px`,
          WebkitMaskSize: `${size}px`,
        }}
        transition={{ ease: "backOut", duration: 0.5}}
      >
          <SideBarMask />
        <div 
          onMouseEnter={() => {setIsHovered(true)}} onMouseLeave={() => {setIsHovered(false)}}
          className="container flex flex-col w-[40%] mr-[4%] text-right text-black cursor-default"
        >
            <h1>MY NIGHT LIFE</h1>
            <p>Aspiring musician <br />and producer here.</p>
            <p>
              I’m a Jazz Trombonist <br />wandering the streets of <br />Waterloo and Toronto.<br />
              I play with many <br />ensembles all across <br />Ontario Canada.
            </p>
        </div>
      </motion.div>
      <div className="h-screen w-full flex items-center z-[2] justify-end">
        
        <div className="container flex flex-col w-[40%] mr-[4%] text-right text-white cursor-default z-[2]">
          <motion.h1
            ref={titleRef}
            initial={{ y: -50, opacity: 0 }}
            animate={titleInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.2 }}
          >
            ABOUT ME
          </motion.h1>
    
          <motion.p
            ref={para1Ref}
            initial={{ y: 50, opacity: 0 }}
            animate={para1InView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            Second-year <br />undergrad here.
          </motion.p>

          <motion.p
            ref={para2Ref}
            initial={{ y: 50, opacity: 0 }}
            animate={para2InView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            I’m a <span className="gradient-text">jack of all trades</span> <br />
            <span className="profession-text"> designer</span>, 
            <span className="profession-text"> developer</span>, <br />
            and <span className="profession-text"> engineer </span>
            with a <br />strong focus on <br />creating functional <br />high-quality product.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

export default About;
