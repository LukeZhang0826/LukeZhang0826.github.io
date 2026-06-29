import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './info.scss';
import SideBarMask from '../sideBar/SideBarMask';

const Info = () => {
  
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // State to track hover
  const size = isClicked ? 3000 : 0;

  return (
    <section className="h-screen w-full bg-dark-grey relative">

      <motion.div 
        className="info-mask z-[100] absolute top-0 h-screen w-full flex items-center justify-center text-black bg-green"
        animate={{
          WebkitMaskPosition: `50% 50%`,
          WebkitMaskSize: `${size}px`,
        }}
        transition={{ ease: "easeInOut", duration: 1}}
      >
        <SideBarMask />

         
        <div className="z-[2] w-[34%]">
            <p className="code-title">{'const = () => {'}</p>
            <p className="code-title" >{'\tlet projects = [];'}</p>
            <p className="code-title" >{' '}</p>
            <p className="code-title">{'\tconst portfolioWebsite = {'}</p>
            <p className="code-title" >{'\t\tname: "Portfolio Website",'}</p>
            <p className="code-title" >{'\t\tdescription: "This is my portfolio website",'}</p>
            <p className="code-title" >{'\t\ttechStack: ['}</p>
            <p className="code-title" >{'\t\t\t"React",'}</p>
            <p className="code-title" >{'\t\t\t"TypeScript",'}</p>
            <p className="code-title" >{'\t\t\t"ThreeJS",'}</p>
            <p className="code-title" >{'\t\t\t"TailwindCSS",'}</p>
            <p className="code-title" >{'\t\t\t"R3Fdrei",'}</p>
            <p className="code-title" >{'\t\t\t"FramerMotion",'}</p>
            <p className="code-title" >{'\t\t],'}</p>
            <p className="code-title" >{'\t\tlink: '}<a className="code-title cursor-pointer">lukeypookster.com,</a></p>
            <p className="code-title" >{'\t} '}</p>
            <p className="code-title code-title-typing" style={{ animationDelay: "1s" }} >{'\tprojects.push(portfolioWebsite);'}</p>
            <p className="code-title" >{' '}</p>
            <p className="code-title" >{'\tconst stabit = {'}</p>
            <p className="code-title" >{'\t\tname: "Stabit",'}</p>
            <p className="code-title" >{'\t\tdescription: "This is a Solana NFT staking app",'}</p>
            <p className="code-title" >{'\t\tcollaborators: '}<a className="code-title cursor-pointer">Amy Qin,</a></p>
            <p className="code-title code-title-typing" style={{ animationDelay: "2.5s" }}  >{'\t\ttechStack: ['}</p>
            <p className="code-title" >{'\t\t\t"React-Native",'}</p>
            <p className="code-title" >{'\t\t\t"TypeScript",'}</p>
            <p className="code-title" >{'\t\t\t"Rust",'}</p>
            <p className="code-title" >{'\t\t\t"Solana",'}</p>
            <p className="code-title" >{'\t\t\t"Metaplex",'}</p>
            <p className="code-title" >{'\t\t\t"Anchor",'}</p>
            <p className="code-title" >{'\t\t],'}</p>
            <p className="code-title" >{'\t\tlink: '}<a className="code-title cursor-pointer">github.com/solanagirl/stabit-dapp,</a></p>
            <p className="code-title" >{'\t} '}</p>
            <p className="code-title code-title-typing" style={{ animationDelay: "3s" }} >{'\tprojects.push(stabit);'}</p>
            <p className="code-title" >{' '}</p>
            <p className="code-title" >{'\treturn projects'}</p>
            <p className="code-title" >{' '}</p>
            <p className="code-title" style={{whiteSpace: 'pre'}}>{'};'}</p>
        </div>

        <h1 
          onClick={() => {setIsClicked(!isClicked)}}
          className="z-[2] w-[16%] text-center"
        >
          <a
            className="p-2.5 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            WHAT I DO
          </a>
        </h1>


        <div className="z-[2] w-[34%]">
            <p className="code-title" >{'const = () => {'}</p>
            <p className="code-title" >{'\tlet moreProjects = [];'}</p>
            <p className="code-title" >{' '}</p>
            <p className="code-title" >{'\tconst finanseer = {'}</p>
            <p className="code-title" >{'\t\tname: "finanseer",'}</p>
            <p className="code-title code-title-typing" style={{ animationDelay: "2s" }} >{'\t\tdescription: "This is a MERN finance dashboard",'}</p>
            <p className="code-title" >{'\t\ttechStack: ['}</p>
            <p className="code-title" >{'\t\t\t"React",'}</p>
            <p className="code-title" >{'\t\t\t"MongoDB",'}</p>
            <p className="code-title" >{'\t\t\t"Express",'}</p>
            <p className="code-title" >{'\t\t\t"NodeJS",'}</p>
            <p className="code-title" >{'\t\t\t"MUI",'}</p>
            <p className="code-title" >{'\t\t\t"RegressionJS",'}</p>
            <p className="code-title" >{'\t\t],'}</p>
            <p className="code-title" >{'\t\tlink: '}<a className="code-title cursor-pointer">finanseer.netlify.app,</a></p>
            <p className="code-title" >{'\t} '}</p>
            <p className="code-title code-title-typing" style={{ animationDelay: "1.5s" }}  >{'\tmoreProjects.push(finanseer);'}</p>
            <p className="code-title" >{' '}</p>
            <p className="code-title" >{'\tconst flashED = {'}</p>
            <p className="code-title" >{'\t\tname: "FlashED",'}</p>
            <p className="code-title" >{'\t\tdescription: "This is a flashcard generator app",'}</p>
            <p className="code-title" >{'\t\tcollaborators: '}<a className="code-title cursor-pointer">Calix Huang,</a></p>
            <p className="code-title" >{'\t\ttechStack: ['}</p>
            <p className="code-title" >{'\t\t\t"Python",'}</p>
            <p className="code-title" >{'\t\t\t"Tkinter",'}</p>
            <p className="code-title" >{'\t\t\t"customTkinter",'}</p>
            <p className="code-title" >{'\t\t\t"Regex",'}</p>
            <p className="code-title" >{'\t\t],'}</p>
            <p className="code-title" >{'\t\tlink: '}<a className="code-title cursor-pointer">github.com/LukeZhang0826/FlashED,</a></p>
            <p className="code-title" >{'\t} '}</p>
            <p className="code-title" >{'\tmoreProjects.push(flashED);'}</p>
            <p className="code-title" >{' '}</p>
            <p className="code-title code-title-typing" style={{ animationDelay: "1.5s" }}  >{'\treturn moreProjects'}</p>
            <p className="code-title" >{' '}</p>
            <p className="code-title" >{'};'}</p>
            <p className="code-title" >{' '}</p>
            <p className="code-title" >{'// This is just a placeholder, this page will be changed'}</p>
        </div>


      </motion.div>

      <div className="h-screen w-full flex items-center justify-center text-white">
        <h1 className="z-[2] w-[16%] text-center">
          <a
            className={`p-2.5 cursor-pointer transition-anchor`}
            style={{ color: isHovered ? '#ffffff' : '' }} // Change color based on hover state
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            WHAT I DO
          </a>
        </h1>
      </div>
    </section>
  );
};

export default Info;