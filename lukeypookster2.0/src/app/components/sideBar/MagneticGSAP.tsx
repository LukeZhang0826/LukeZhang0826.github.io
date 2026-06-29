import React, { useEffect, RefObject } from 'react';
import gsap from 'gsap';

type Props = {
  children: React.ReactElement;
  refPair: [RefObject<HTMLDivElement>, RefObject<HTMLDivElement>];
};

const MagneticGSAP: React.FC<Props> = ({ children, refPair }) => {
  const [iconRef, maskIconRef] = refPair;
  useEffect(() => {
    
    console.log(iconRef.current)
    const xTo = gsap.quickTo(iconRef.current!, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(iconRef.current!, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const xToMask = gsap.quickTo(maskIconRef.current!, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yToMask = gsap.quickTo(maskIconRef.current!, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = iconRef.current!.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      xTo(x);
      yTo(y);
      xToMask(x);
      yToMask(y);
    };

    const onMouseLeave = () => {
      xTo(0);
      yTo(0);
      xToMask(0);
      yToMask(0);
    };

    if (iconRef.current && maskIconRef.current) {
      iconRef.current.addEventListener("mousemove", onMouseMove);
      iconRef.current.addEventListener("mouseleave", onMouseLeave);
      maskIconRef.current.addEventListener("mousemove", onMouseMove);
      maskIconRef.current.addEventListener("mouseleave", onMouseLeave);
    }

    return () => {
      if (iconRef.current && maskIconRef.current) {
        iconRef.current.removeEventListener("mousemove", onMouseMove);
        iconRef.current.removeEventListener("mouseleave", onMouseLeave);
        maskIconRef.current.removeEventListener("mousemove", onMouseMove);
        maskIconRef.current.removeEventListener("mouseleave", onMouseLeave);
      }
    };

  }, [iconRef, maskIconRef]);

  return children;
};

export default MagneticGSAP;
