import { ImagePlus } from "lucide-react";
import { Trash2Icon } from "lucide-react";
import { useState, useEffect } from "react";

const ImageUpload = ({ onUpload, initialImage }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  useEffect(() => {
    if (initialImage) {
      setPreview(initialImage);
      setIsUploaded(true);
    }
  }, [initialImage]);

  const handleFileChange = (event) => {
    console.log(event.target.files); // Debug: Check if the file is being selected
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setIsUploaded(false);
    }
  };

  const handleUpload = async () => {
    if (!file || isUploading || isUploaded) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "pharma_connect"); // Replace with your upload preset

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dwmae0ztq/image/upload", // Replace with your cloud name
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();
      console.log(result);  
      onUpload(result.secure_url);
      setPreview(result.secure_url);
      setIsUploaded(true);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreview(null);
    setIsUploaded(false);
    onUpload("");
  };

  return (
    <div>
      <div className="relative w-48 h-48 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center">
        {preview ? (
          <>
            <img
              src={preview}
              alt="Selected"
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
            >
              <Trash2Icon />
            </button>
          </>
        ) : (
          <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
            <span className="text-gray-400 text-4xl mb-2"><ImagePlus size={60}/></span>
            <span className="text-gray-500 text-sm">Upload Image</span>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {file && !isUploaded && (
        <button
          onClick={handleUpload}
          disabled={isUploading || isUploaded}
          className={`mt-4 ${isUploading ? 'bg-blue-400' : 'bg-blue-500'} text-white px-4 py-2 rounded-md`}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      )}
    </div>
  );
};

export default ImageUpload;