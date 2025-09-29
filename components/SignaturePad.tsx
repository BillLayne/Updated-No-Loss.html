
import React, { useRef, useEffect, useState } from 'react';

interface SignaturePadProps {
  onSignatureEnd: (signature: string | null) => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSignatureEnd }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  const getCanvasContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      const ctx = getCanvasContext();
      if (ctx) {
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const getCoordinates = (event: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in event.nativeEvent) {
      return {
        x: event.nativeEvent.touches[0].clientX - rect.left,
        y: event.nativeEvent.touches[0].clientY - rect.top,
      };
    }
    return {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };
  };

  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    const ctx = getCanvasContext();
    if (!ctx) return;
    const { x, y } = getCoordinates(event);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSigned(true);
  };

  const draw = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const ctx = getCanvasContext();
    if (!ctx) return;
    const { x, y } = getCoordinates(event);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    const ctx = getCanvasContext();
    if (ctx) {
        ctx.closePath();
    }
    setIsDrawing(false);
    if(canvasRef.current) {
        onSignatureEnd(canvasRef.current.toDataURL('image/png'));
    }
  };

  const clearSignature = () => {
    const ctx = getCanvasContext();
    const canvas = canvasRef.current;
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onSignatureEnd(null);
      setHasSigned(false);
    }
  };

  return (
    <div>
      <div className="relative w-full aspect-[2/1] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full"
        />
        {!hasSigned && <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-gray-400">Sign Here</p>
        </div>}
      </div>
      <button
        type="button"
        onClick={clearSignature}
        className="mt-2 text-sm text-brand-blue-600 hover:text-brand-blue-500 font-medium"
      >
        Clear Signature
      </button>
    </div>
  );
};

export default SignaturePad;
