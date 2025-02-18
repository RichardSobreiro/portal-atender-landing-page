/** @format */
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './ImageViewer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faTimes,
  faSearchPlus,
  faSearchMinus,
} from '@fortawesome/free-solid-svg-icons';

interface ImageViewerProps {
  images: { id: string; originalName: string; imageUrl: string }[];
  initialIndex: number; // ✅ New prop for starting image
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  initialIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex); // ✅ Start with initialIndex
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;
      setPosition((prev) => ({
        x: prev.x + event.movementX,
        y: prev.y + event.movementY,
      }));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    resetTransform();
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    resetTransform();
  };

  const zoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.2, 3));
  };

  const zoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.2, 1));
    resetTransform();
  };

  const handleWheelZoom = (event: React.WheelEvent) => {
    event.preventDefault();
    if (event.deltaY > 0) {
      zoomOut();
    } else {
      zoomIn();
    }
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      dragStart.current = {
        x: event.clientX - position.x,
        y: event.clientY - position.y,
      };
    }
  };

  const resetTransform = () => {
    setPosition({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div className={styles.viewerOverlay} onWheel={handleWheelZoom}>
      <button className={styles.closeButton} onClick={onClose}>
        <FontAwesomeIcon icon={faTimes} />
      </button>

      <div className={styles.mainImageContainer}>
        <button className={styles.navButton} onClick={handlePrev}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        <div
          className={styles.imageWrapper}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            cursor: isDragging ? 'grabbing' : zoom > 1 ? 'grab' : 'default',
          }}
          onMouseDown={handleMouseDown}
        >
          <Image
            src={images[currentIndex].imageUrl}
            alt={images[currentIndex].originalName}
            width={800}
            height={600}
            className={styles.mainImage}
          />
        </div>

        <button className={styles.navButton} onClick={handleNext}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

      {/* Thumbnail List */}
      <div className={styles.thumbnailContainer}>
        {images.map((image, index) => (
          <Image
            key={image.id}
            src={image.imageUrl}
            alt={image.originalName}
            width={80}
            height={80}
            className={`${styles.thumbnail} ${index === currentIndex ? styles.activeThumbnail : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      {/* Zoom Controls */}
      <div className={styles.zoomControls}>
        <button className={styles.zoomButton} onClick={zoomOut}>
          <FontAwesomeIcon icon={faSearchMinus} />
        </button>
        <span className={styles.zoomPercentage}>{Math.round(zoom * 100)}%</span>
        <button className={styles.zoomButton} onClick={zoomIn}>
          <FontAwesomeIcon icon={faSearchPlus} />
        </button>
      </div>
    </div>
  );
};

export default ImageViewer;
