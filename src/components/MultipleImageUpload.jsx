import { ImagePlus, Trash2Icon } from "lucide-react";
import { useState, useEffect } from "react";

const ImageUpload = ({ onUpload, initialImages = [] }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploadedImages, setUploadedImages] = useState(initialImages);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setPreviews(initialImages);
    setUploadedImages(initialImages);
  }, [initialImages]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files).slice(0, 10 - uploadedImages.length);
    if (selectedFiles.length === 0) return;

    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  const handleUpload = async () => {
    if (files.length === 0 || isUploading) return;

    setIsUploading(true);

    try {
      const uploadedUrls = [...uploadedImages]; // Keep previous images

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "pharma connect");

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dwmae0ztq/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();
        uploadedUrls.push(result.secure_url);
      }

      setUploadedImages(uploadedUrls);
      onUpload(uploadedUrls); // Pass the updated images to the parent
      setFiles([]); // Clear local files after upload
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    setPreviews(updatedImages);
    onUpload(updatedImages); // Inform parent of updated images
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {uploadedImages.map((preview, index) => (
          <div key={index} className="relative w-24 h-24">
            <img src={preview} alt="Uploaded" className="w-full h-full object-cover rounded" />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
            >
              <Trash2Icon size={14} />
            </button>
          </div>
        ))}

        {uploadedImages.length < 10 && (
          <label className="w-24 h-24 flex items-center justify-center bg-gray-100 border cursor-pointer rounded-lg">
            <ImagePlus size={30} className="text-gray-500" />
            <input type="file" multiple onChange={handleFileChange} className="hidden" />
          </label>
        )}
      </div>

      {files.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`mt-2 px-4 py-2 text-white rounded ${isUploading ? "bg-gray-400" : "bg-blue-500"}`}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
