import React, { useEffect, useRef } from 'react';
import { BiLogoLinkedinSquare, BiLogoTelegram, BiLogoGithub } from 'react-icons/bi';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useIconHover } from '../../IconHoverContext';
import MagneticGSAP from './MagneticGSAP';

gsap.registerPlugin(ScrollToPlugin);

type Props = {}

const SideBarMask = (props: Props) => {

  const { hoveredIcon, setHoveredIcon } = useIconHover();

  // const { iconRefs, maskIconRefs } = useIconHover();
  
  const handleAnchorClick = (sectionIndex: number) => {
    const yPos = sectionIndex * window.innerHeight;
    gsap.to(window, {
      duration: 1,
      scrollTo: { y: yPos, autoKill: false },
      ease: 'power2.inOut'
    });
  };

  return (
      <div className="container fixed top-0 left-0 flex flex-col h-screen w-[8%] z-[6]">
        <div className="h-[20%] flex justify-center items-center">
            <div 
              className="p-[25px]"
              onMouseEnter={() => setHoveredIcon('logo')} 
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <svg 
                className="cursor-pointer" 
                width="50" height="50" viewBox="0 0 50 48" xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M26.8372 17.3653C27.2848 16.2563 27.9774 15.3711 29.0999 14.5849C29.7629 14.1206 30.5758 13.6909 31.1097 13.9297C31.598 14.1482 31.8529 14.9259 31.9771 15.6433C32.2075 16.9745 31.988 18.0981 31.9236 19.2397C33.107 19.9407 34.1108 20.8138 34.822 21.883L35.01 22.1812C36.118 21.6061 37.2752 21.3746 38.6947 21.523C39.4806 21.6052 40.3468 21.8038 40.6172 22.2986C40.9089 22.8323 40.5072 23.7106 40.0948 24.4787C39.157 26.2252 38.1639 27.4016 36.7208 28.2921L37.0911 30.6554L37.3034 31.7374C38.2903 31.5748 39.424 31.3445 40.5709 31.3195C41.4842 31.2996 42.4058 31.41 42.7137 31.9913C42.9994 32.5307 42.7566 33.4756 42.4257 34.2756C41.7208 35.9794 40.6158 37.0256 39.2185 37.7526C39.8186 39.1472 40.5137 40.494 41.2982 41.7986L42.2303 43.2652C45.8574 39.8978 48.6961 34.8137 49.6389 29.3975C50.5818 23.9813 49.6288 18.233 47.3541 13.8318C45.1945 9.37262 41.1684 5.17193 36.2752 2.69468C31.3819 0.217425 25.6216 -0.536348 20.7626 0.369583C15.8818 1.14827 10.7057 3.79365 6.92208 7.77167C3.13846 11.7497 0.747279 17.0604 0.201104 21.9875C-0.472817 26.8988 0.548346 32.6353 3.24501 37.4219C5.94167 42.2086 10.3138 46.0455 14.8557 48C15.4059 43.6608 16.3573 39.4282 17.7099 35.3023C16.0929 35.1441 14.5141 34.6483 13.08 33.775C11.4146 32.7609 9.94454 31.2378 9.39018 29.4699C8.41151 26.3488 10.2868 22.4646 12.8883 20.0811C13.6955 19.3416 14.5726 18.7465 15.5037 18.2788C15.7902 16.682 16.1182 14.8729 17.0122 13.6021C17.2404 13.2777 17.5056 12.9883 17.8021 12.9217C18.1364 12.8467 18.5106 13.0552 18.8508 13.3249C19.8712 14.1342 20.5853 15.4955 21.341 16.8715C22.5202 16.8247 23.7276 16.8905 24.9424 17.0464L26.8372 17.3653Z" fill="#000000"/>
                <path d="M22.5777 22.115C22.0129 22.3216 21.6979 23.23 22.013 23.7436C22.2189 24.3101 23.1245 24.6261 23.6365 24.31C24.2013 24.1034 24.5163 23.195 24.2012 22.6815C23.9952 22.1149 23.0896 21.799 22.5777 22.115Z" fill="#000000"/>
              </svg>
            </div>
        </div>
        <div className="relative h-[50%] w-100 flex">
          <div className="h-100 w-[3px] mx-auto flex bg-black" />
          <a className="absolute h-[25%] w-[75%] top-[00%] left-0 right-0 mx-auto z-[2] cursor-pointer" onClick={() => handleAnchorClick(0)} />
          <a className="absolute h-[25%] w-[75%] top-[25%] left-0 right-0 mx-auto z-[2] cursor-pointer" onClick={() => handleAnchorClick(1)} />
          <a className="absolute h-[25%] w-[75%] top-[50%] left-0 right-0 mx-auto z-[2] cursor-pointer" onClick={() => handleAnchorClick(2)} />
          <a className="absolute h-[25%] w-[75%] top-[75%] left-0 right-0 mx-auto z-[2] cursor-pointer" onClick={() => handleAnchorClick(3)} />
        </div>
        <div className="h-[30%] flex flex-col justify-center items-center">
          {/* <MagneticGSAP refPair={[iconRefs.linkedin, maskIconRefs.linkedin]}> */}
            <div 
              // ref={maskIconRefs.linkedin}
              onMouseEnter={() => setHoveredIcon('linkedin')} 
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <BiLogoLinkedinSquare 
                className={"w-[30px] h-[30px] m-3 cursor-pointer"} 
              />
            </div>
          {/* </MagneticGSAP> */}
            <div
              onMouseEnter={() => setHoveredIcon('telegram')} 
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <BiLogoTelegram 
                className={"w-[30px] h-[30px] m-3 cursor-pointer"} 
              />
            </div>
            <div
              onMouseEnter={() => setHoveredIcon('github')} 
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <BiLogoGithub 
                className={"w-[30px] h-[30px] m-3 cursor-pointer"} 
              />
            </div>
        </div>
      </div>
  )
}

export default SideBarMask;
