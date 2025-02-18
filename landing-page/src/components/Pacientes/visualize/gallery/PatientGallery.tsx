/** @format */
import React, { useEffect, useState } from 'react';
import Image from 'next/image'; // ✅ Use Next.js Image
import axiosInstance from '@/services/axiosInstance';
import styles from './PatientGallery.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUpload,
  faSave,
  faTimes,
  faTrash,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { useSpinner } from '@/context/SpinnerContext';
import { toast } from 'react-toastify';
import ImageViewer from './ImageViewer';

interface PatientGalleryProps {
  patientId: string;
}

interface PatientImage {
  id: string;
  originalName: string;
  imageUrl: string;
  createdAt: string;
}

const PatientGallery: React.FC<PatientGalleryProps> = ({ patientId }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<PatientImage[]>([]);
  const { showSpinner, hideSpinner } = useSpinner();
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  useEffect(() => {
    fetchImages();
  }, [patientId]);

  const fetchImages = async () => {
    if (!patientId) return;
    showSpinner();
    try {
      const response = await axiosInstance.get<PatientImage[]>(
        `/patients/${patientId}/images`
      );
      setExistingImages(response.data);
    } catch (error) {
      console.error('Erro ao carregar imagens:', error);
      toast.error('Erro ao carregar imagens.');
    } finally {
      hideSpinner();
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    updateSelectedFiles(Array.from(event.dataTransfer.files));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      updateSelectedFiles(Array.from(event.target.files));
    }
  };

  const updateSelectedFiles = (files: File[]) => {
    const validFiles = files.filter((file) => file.type.startsWith('image/'));
    setSelectedFiles([...selectedFiles, ...validFiles]);

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviews]);
  };

  const removeSelectedImage = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);

    const updatedPreviews = [...previewUrls];
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);

    setSelectedFiles(updatedFiles);
    setPreviewUrls(updatedPreviews);
  };

  const handleSave = async () => {
    if (selectedFiles.length === 0) return;
    showSpinner();
    try {
      const formData = new FormData();
      const imagesMetadata = [
        ...existingImages.map((image) => ({
          id: image.id,
          originalName: image.originalName,
        })),
        ...selectedFiles.map((file) => ({ id: null, originalName: file.name })),
      ];
      formData.append('imagesMetadata', JSON.stringify(imagesMetadata));
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      await axiosInstance.post(
        `/patients/${patientId}/images/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      toast.success('Imagens enviadas com sucesso!');
      fetchImages();
      setSelectedFiles([]);
      setPreviewUrls([]);
    } catch (error) {
      console.error('Erro ao enviar imagens:', error);
      toast.error('Erro ao enviar imagens.');
    } finally {
      hideSpinner();
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    showSpinner();
    try {
      await axiosInstance.delete(`/patients/${patientId}/images/${imageId}`);
      toast.success('Imagem deletada com sucesso!');
      fetchImages(); // Refresh images after delete
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      toast.error('Erro ao deletar imagem.');
    } finally {
      hideSpinner();
    }
  };

  const groupImagesByDate = () => {
    const grouped: Record<string, PatientImage[]> = {};
    existingImages.forEach((image) => {
      const date = image.createdAt.split('T')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(image);
    });
    return Object.entries(grouped).sort(([dateA], [dateB]) =>
      dateA < dateB ? 1 : -1
    );
  };

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setIsViewerOpen(true);
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.uploadArea}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <FontAwesomeIcon icon={faUpload} className={styles.uploadIcon} />
        <p>Arraste e solte imagens aqui ou clique para selecionar</p>
        <input
          type="file"
          id="fileInput"
          className={styles.fileInput}
          multiple
          accept="image/*"
          onChange={handleFileSelect}
        />
      </div>

      {/* Show thumbnails for selected images */}
      <div className={styles.previewContainer}>
        {previewUrls.map((url, index) => (
          <div key={index} className={styles.previewItem}>
            <Image
              src={url}
              alt="Preview"
              width={160}
              height={160}
              className={styles.previewImage}
            />
            <button
              className={styles.removeButton}
              onClick={() => removeSelectedImage(index)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        ))}
      </div>

      <button
        className={styles.saveButton}
        onClick={handleSave}
        disabled={selectedFiles.length === 0}
      >
        <FontAwesomeIcon icon={faSave} /> Salvar
      </button>

      {isViewerOpen && (
        <ImageViewer
          images={existingImages}
          initialIndex={viewerIndex}
          onClose={() => setIsViewerOpen(false)}
        />
      )}

      {/* Grouped Images */}
      <div className={styles.existingImagesContainer}>
        {groupImagesByDate().map(([date, images]) => (
          <div key={date} className={styles.imageGroup}>
            <h3 className={styles.dateHeader}>
              {new Date(date).toLocaleDateString()}
            </h3>
            <div className={styles.imageGrid}>
              {images.map((image, index) => (
                <div key={image.id} className={styles.imageWrapper}>
                  <Image
                    src={image.imageUrl}
                    alt={image.originalName}
                    width={160}
                    height={160}
                    className={styles.existingImage}
                  />
                  {/* <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteImage(image.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button> */}
                  <div className={styles.imageActions}>
                    <button
                      className={styles.viewButton}
                      onClick={() => openViewer(index)}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteImage(image.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientGallery;
