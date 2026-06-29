import React, { createContext, useState, useContext, useRef } from 'react';

type IconHoverContextType = {
    hoveredIcon: string | null;
    setHoveredIcon: (icon: string | null) => void;
    currentSection: number;
    setCurrentSection: (section: number) => void;
    glowColors: string[];
    iconRefs: {
        logo: React.RefObject<HTMLDivElement>;
        linkedin: React.RefObject<HTMLDivElement>;
        telegram: React.RefObject<HTMLDivElement>;
        github: React.RefObject<HTMLDivElement>;
    };
    maskIconRefs: {
        logo: React.RefObject<HTMLDivElement>;
        linkedin: React.RefObject<HTMLDivElement>;
        telegram: React.RefObject<HTMLDivElement>;
        github: React.RefObject<HTMLDivElement>;
    };
}

type IconHoverProviderProps = {
    children: React.ReactNode;
}

const IconHoverContext = createContext<IconHoverContextType | undefined>(undefined);

export const IconHoverProvider: React.FC<IconHoverProviderProps> = ({ children }) => {
    const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
    const [currentSection, setCurrentSection] = useState(0);
    const glowColors = ['#5200FF', '#0075FF', '#24FF00', '#DBFF00'];
    
    const logoRef = useRef<HTMLDivElement>(null);
    const linkedinRef = useRef<HTMLDivElement>(null);
    const telegramRef = useRef<HTMLDivElement>(null);
    const githubRef = useRef<HTMLDivElement>(null);
    
    const logoMaskRef = useRef<HTMLDivElement>(null);
    const linkedinMaskRef = useRef<HTMLDivElement>(null);
    const telegramMaskRef = useRef<HTMLDivElement>(null);
    const githubMaskRef = useRef<HTMLDivElement>(null);

    return (
        <IconHoverContext.Provider value={{
            hoveredIcon,
            setHoveredIcon,
            currentSection,
            setCurrentSection,
            glowColors,
            iconRefs: {
                logo: logoRef,
                linkedin: linkedinRef,
                telegram: telegramRef,
                github: githubRef,
            },
            maskIconRefs: {
                logo: logoMaskRef,
                linkedin: linkedinMaskRef,
                telegram: telegramMaskRef,
                github: githubMaskRef,
            }
        }}>
            {children}
        </IconHoverContext.Provider>
    );
};

export const useIconHover = () => {
    const context = useContext(IconHoverContext);
    if (!context) {
        throw new Error("useIconHover must be used within a IconHoverProvider");
    }
    return context;
}