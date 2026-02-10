export type SlideElementType = 'text' | 'image' | 'shape' | 'video' | 'chart';

export interface SlideElement {
  id: string;
  type: SlideElementType;
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation?: number;
  style?: {
    // Text styles
    color?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    textAlign?: string;
    lineHeight?: number;
    letterSpacing?: number;
    
    // Shape and image styles
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderStyle?: string;
    borderRadius?: number;
    boxShadow?: string;
    
    // Image specific
    objectFit?: string;
    
    // Common
    opacity?: number;
    padding?: string;
    
    // Chart specific
    chartType?: 'bar' | 'line' | 'pie' | 'area';
    chartTitle?: string;
  };
  animation?: {
    type: string;
    duration: number;
    delay?: number;
    easing?: string;
  };
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
}