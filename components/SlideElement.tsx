'use client';

import { useRef, useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';
import { usePresentationStore } from '@/lib/store/presentationStore';
import type { SlideElement as SlideElementType } from '@/lib/types/presentation';
import { Video } from 'lucide-react';

interface SlideElementProps {
  element: SlideElementType;
  isSelected: boolean;
  onSelect: () => void;
}

export default function SlideElement({ element, isSelected, onSelect }: SlideElementProps) {
  const { updateElement } = usePresentationStore();
  const elementRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [isDraggingLocal, setIsDraggingLocal] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'element',
    item: { id: element.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    begin: () => {
      setIsDraggingLocal(true);
    },
    end: () => {
      setIsDraggingLocal(false);
    },
  }));

  useEffect(() => {
    if (elementRef.current && !isResizing) {
      drag(elementRef.current);
    }
  }, [drag, isResizing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('resize-handle')) {
      return;
    }
    e.stopPropagation();
    onSelect();
  };

  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeHandle(handle);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize({ width: element.size.width, height: element.size.height });
    setStartPosition({ x: element.position.x, y: element.position.y });
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;

      let newWidth = startSize.width;
      let newHeight = startSize.height;
      let newX = startPosition.x;
      let newY = startPosition.y;

      switch (resizeHandle) {
        case 'se': // Southeast (bottom-right)
          newWidth = Math.max(50, startSize.width + deltaX);
          newHeight = Math.max(50, startSize.height + deltaY);
          break;
        case 'sw': // Southwest (bottom-left)
          newWidth = Math.max(50, startSize.width - deltaX);
          newHeight = Math.max(50, startSize.height + deltaY);
          newX = startPosition.x + deltaX;
          break;
        case 'ne': // Northeast (top-right)
          newWidth = Math.max(50, startSize.width + deltaX);
          newHeight = Math.max(50, startSize.height - deltaY);
          newY = startPosition.y + deltaY;
          break;
        case 'nw': // Northwest (top-left)
          newWidth = Math.max(50, startSize.width - deltaX);
          newHeight = Math.max(50, startSize.height - deltaY);
          newX = startPosition.x + deltaX;
          newY = startPosition.y + deltaY;
          break;
        case 'e': // East (right)
          newWidth = Math.max(50, startSize.width + deltaX);
          break;
        case 'w': // West (left)
          newWidth = Math.max(50, startSize.width - deltaX);
          newX = startPosition.x + deltaX;
          break;
        case 's': // South (bottom)
          newHeight = Math.max(50, startSize.height + deltaY);
          break;
        case 'n': // North (top)
          newHeight = Math.max(50, startSize.height - deltaY);
          newY = startPosition.y + deltaY;
          break;
      }

      updateElement(element.id, {
        size: { width: newWidth, height: newHeight },
        position: { x: newX, y: newY },
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeHandle(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeHandle, startPos, startSize, startPosition, element.id, updateElement]);

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${element.position.x}px`,
    top: `${element.position.y}px`,
    width: `${element.size.width}px`,
    height: `${element.size.height}px`,
    opacity: (isDragging || isDraggingLocal) ? 0.5 : 1,
    cursor: isResizing ? 'grabbing' : (isSelected ? 'move' : 'pointer'),
    border: isSelected ? '2px solid hsl(var(--primary))' : '2px solid transparent',
    outline: isSelected ? '2px solid hsl(var(--primary) / 0.3)' : 'none',
    pointerEvents: isResizing ? 'none' : 'auto',
    ...element.style,
  };

  const renderContent = () => {
    switch (element.type) {
      case 'text':
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              padding: '8px',
              fontSize: element.style?.fontSize || 16,
              color: element.style?.color || 'hsl(var(--foreground))',
              fontFamily: element.style?.fontFamily || 'Arial',
              fontWeight: element.style?.fontWeight || 'normal',
              fontStyle: element.style?.fontStyle || 'normal',
              textDecoration: element.style?.textDecoration || 'none',
              textAlign: element.style?.textAlign || 'left',
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            {element.content || 'Text'}
          </div>
        );
      case 'image':
        return (
          <img
            src={element.content}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23e5e7eb" width="300" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="Arial"%3EObrázok sa nenašiel%3C/text%3E%3C/svg%3E';
            }}
          />
        );
      case 'shape':
        const shapeType = element.content || 'square';
        const shapeStyle: React.CSSProperties = {
          width: '100%',
          height: '100%',
          backgroundColor: element.style?.backgroundColor || 'hsl(var(--primary))',
          border: `${element.style?.borderWidth || 0}px solid ${
            element.style?.borderColor || 'hsl(var(--border))'
          }`,
        };

        if (shapeType === 'circle') {
          shapeStyle.borderRadius = '50%';
        } else if (shapeType === 'triangle') {
          shapeStyle.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
        } else if (shapeType === 'rounded') {
          shapeStyle.borderRadius = '12px';
        }

        return <div style={shapeStyle} />;
      case 'video':
        return (
          <div style={{ width: '100%', height: '100%', backgroundColor: 'hsl(var(--muted))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: 'hsl(var(--foreground))', textAlign: 'center' }}>
              <Video className="w-12 h-12 mx-auto mb-2" />
              <p style={{ fontSize: '14px' }}>Video</p>
              <p style={{ fontSize: '12px', opacity: 0.7 }}>{element.content}</p>
            </div>
          </div>
        );
      default:
        return <div>{element.content}</div>;
    }
  };

  const ResizeHandle = ({ position, cursor }: { position: string; cursor: string }) => {
    const getPosition = () => {
      const style: React.CSSProperties = {
        width: '12px',
        height: '12px',
        cursor,
        zIndex: 1000,
        backgroundColor: 'hsl(var(--primary))',
        border: '2px solid hsl(var(--background))',
        borderRadius: '50%',
        position: 'absolute',
      };

      if (position.includes('n')) style.top = '-6px';
      if (position.includes('s')) style.bottom = '-6px';
      if (position.includes('e')) style.right = '-6px';
      if (position.includes('w')) style.left = '-6px';
      if (position === 'n' || position === 's') {
        style.left = '50%';
        style.transform = 'translateX(-50%)';
      }
      if (position === 'e' || position === 'w') {
        style.top = '50%';
        style.transform = 'translateY(-50%)';
      }
      if (position.length === 2) {
        style.transform = 'none';
      }

      return style;
    };

    return (
      <div
        className="resize-handle"
        onMouseDown={(e) => handleResizeStart(e, position)}
        style={getPosition()}
      />
    );
  };

  return (
    <div
      ref={elementRef}
      style={style}
      onMouseDown={handleMouseDown}
      className="select-none"
    >
      {renderContent()}
      
      {/* Resize Handles */}
      {isSelected && !isDragging && !isDraggingLocal && (
        <>
          <ResizeHandle position="nw" cursor="nw-resize" />
          <ResizeHandle position="ne" cursor="ne-resize" />
          <ResizeHandle position="sw" cursor="sw-resize" />
          <ResizeHandle position="se" cursor="se-resize" />
          <ResizeHandle position="n" cursor="n-resize" />
          <ResizeHandle position="s" cursor="s-resize" />
          <ResizeHandle position="e" cursor="e-resize" />
          <ResizeHandle position="w" cursor="w-resize" />
        </>
      )}
    </div>
  );
}
