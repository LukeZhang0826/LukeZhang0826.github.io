import React, { useState, useEffect } from 'react';
import './loading.scss'

const LoadingScreen = () => {

  return (
    <section className="absolute h-screen w-full flex justify-center items-center loading-page bg-dark-teal z-[100]">
        <div className="loading-container">
            <div className="📦"></div>
            <div className="📦"></div>
            <div className="📦"></div>
            <div className="📦"></div>
            <div className="📦"></div>
        </div>
    </section>
  );
};

export default LoadingScreen;
