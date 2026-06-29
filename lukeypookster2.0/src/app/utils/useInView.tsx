import { useState, useEffect, useRef, RefObject } from 'react';

const useInView = <T extends HTMLElement>(): [RefObject<T>, boolean] => {
  const [inView, setInView] = useState(false);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      {
        threshold: 0.1 // adjust the threshold to trigger earlier or later
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  return [ref, inView];
};

export default useInView;
