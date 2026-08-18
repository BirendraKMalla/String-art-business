import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";

import {
  FiUpload,
  FiZap,
  FiMapPin,
  FiCheck,
  FiArrowRight,
  FiX,
  FiSliders,
  FiInfo,
} from "react-icons/fi";

import { generateStringArt, createOrder } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Info from "../components/Info";

function Create() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Crop states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const [generatedImage, setGeneratedImage] = useState("");

  const [designId, setDesignId] = useState("");
  const [linesGenerated, setLinesGenerated] = useState(0);
  const [nailCount, setNailCount] = useState(0);
  const [size, setSize] = useState(0);
  const [lineWeight, setLineWeight] = useState(0);

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [isPublic, setIsPublic] = useState(false);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [ordering, setOrdering] = useState(false);

  const { token } = useAuth();

  const navigate = useNavigate();

  // ----------------------------------------
  // Revoke object URLs to prevent memory leaks
  // ----------------------------------------

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // ----------------------------------------
  // Select image
  // ----------------------------------------

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    if (!selectedImage) {
      return;
    }

    setImage(selectedImage);

    const url = URL.createObjectURL(selectedImage);

    setPreviewUrl(url);

    // Reset crop
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);

    // Open crop editor immediately
    setShowCropper(true);

    // Reset generated result
    setGeneratedImage("");
    setDesignId("");

    setLinesGenerated(0);
    setNailCount(0);
    setSize(0);
    setLineWeight(0);

    setMessage("");
  };

  // ----------------------------------------
  // Crop complete
  // ----------------------------------------

  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  // ----------------------------------------
  // Apply crop
  // ----------------------------------------

  const handleApplyCrop = async () => {
    if (!croppedAreaPixels || !previewUrl) {
      return;
    }

    try {
      const croppedImage = await getCroppedImage(previewUrl, croppedAreaPixels);

      setImage(croppedImage);

      setPreviewUrl(URL.createObjectURL(croppedImage));

      setShowCropper(false);

      setMessage("Crop applied successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Could not crop the image.");
    }
  };

  // ----------------------------------------
  // Cancel crop
  // ----------------------------------------

  const handleCancelCrop = () => {
    setShowCropper(false);
  };

  // ----------------------------------------
  // Generate cropped image
  // ----------------------------------------

  const getCroppedImage = (imageSrc, cropPixels) => {
    return new Promise((resolve, reject) => {
      const imageElement = new Image();

      imageElement.onload = () => {
        const canvas = document.createElement("canvas");

        const size = Math.min(cropPixels.width, cropPixels.height);

        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not create canvas context"));
          return;
        }

        /*
         * Draw the cropped portion into the canvas.
         */
        ctx.drawImage(
          imageElement,
          cropPixels.x,
          cropPixels.y,
          cropPixels.width,
          cropPixels.height,
          0,
          0,
          size,
          size,
        );

        /*
         * Convert canvas to File.
         */
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Could not create image"));
              return;
            }

            const file = new File([blob], "cropped-image.jpg", {
              type: "image/jpeg",
            });

            resolve(file);
          },
          "image/jpeg",
          0.95,
        );
      };

      imageElement.onerror = () => {
        reject(new Error("Could not load image"));
      };

      imageElement.src = imageSrc;
    });
  };

  // ----------------------------------------
  // Generate string art
  // ----------------------------------------

  const handleGenerate = async () => {
    if (!image) {
      setMessage("Please select an image first.");
      return;
    }

    if (!token) {
      setMessage("Please login first.");
      return;
    }

    try {
      setLoading(true);

      setMessage("Generating string art...");

      const data = await generateStringArt(image, token);

      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);

        setDesignId(data.designId);

        setLinesGenerated(data.linesGenerated);

        setNailCount(data.nailCount);

        setSize(data.size);

        setLineWeight(data.lineWeight);

        sessionStorage.setItem("designId", data.designId);

        setMessage("String art generated successfully!");
      } else {
        setMessage(data.message || "Generation failed.");
      }
    } catch (error) {
      console.error(error);

      setMessage(error.message || "Something went wrong while generating the string art.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // Place order
  // ----------------------------------------

  const handlePlaceOrder = async () => {
    if (!token) {
      setMessage("Please login first.");
      return;
    }

    if (!designId) {
      setMessage("Please generate your string art first.");
      return;
    }

    if (!street || !city || !state) {
      setMessage("Please enter your complete delivery address.");
      return;
    }

    try {
      setOrdering(true);

      setMessage("Creating your order...");

      const orderData = {
        designId,

        deliveryAddress: {
          street,
          city,
          state,
        },

        isPublic,
      };

      const data = await createOrder(orderData, token);

      if (data.order) {
        setMessage("Order created successfully!");

        navigate(`/orders/${data.order._id}`);
      } else {
        setMessage(data.message || "Order creation failed.");
      }
    } catch (error) {
      console.error(error);

      setMessage(error.message || "Something went wrong while creating the order.");
    } finally {
      setOrdering(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream px-4 md:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-12 h-px bg-gold-accent" />
            <span className="text-xs font-medium text-terracotta tracking-wider uppercase">
              Create Your Design
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-deep-brown mb-4">
            Create Your String Art
          </h1>

          <p className="text-sage">
            Upload your photo and generate your custom string-art design.
          </p>
        </div>

        <div className="
          bg-parchment
          rounded-[var(--radius-xl)]
          shadow-card
          border border-warm-beige
          p-6 md:p-10
        ">
          {/* File upload */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-deep-brown mb-2">
              Upload your photo
            </label>

            <div className="
              border-2
              border-dashed
              border-warm-beige
              rounded-[var(--radius-lg)]
              p-6 md:p-8
              text-center
              bg-cream
              hover:border-terracotta
              hover:shadow-card
              transition-all duration-300
            ">
              <FiUpload size={32} className="mx-auto mb-3 text-terracotta" />

              <p className="font-medium text-deep-brown">
                Choose an image to get started
              </p>

              <p className="text-sm text-sage mt-1 mb-5">
                JPG, JPEG or PNG
              </p>

              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <label
                htmlFor="image-upload"
                className="
                  inline-flex
                  items-center
                  gap-2
                  bg-terracotta
                  text-white
                  px-6 py-3
                  rounded-full
                  cursor-pointer
                  hover:bg-deep-brown
                  hover:shadow-card-hover
                  transition
                "
              >
                <FiUpload size={18} />
                Choose File
              </label>

              {image && (
                <p className="text-sm text-sage mt-4 break-all">
                  {image.name}
                </p>
              )}
            </div>
          </div>

          {/* Cropped image preview */}
          {previewUrl && !showCropper && (
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h2 className="text-xl font-semibold text-deep-brown">
                  Selected Image
                </h2>

                <button
                  onClick={() => setShowCropper(true)}
                  className="
                    text-sm
                    font-medium
                    text-terracotta
                    hover:underline
                  "
                >
                  Edit Crop
                </button>
              </div>

              <div className="flex justify-center">
                <img
                  src={previewUrl}
                  alt="Selected"
                  className="
                    w-full
                    max-w-md
                    aspect-square
                    object-cover
                    rounded-full
                    shadow-card
                    ring-4 ring-warm-beige
                  "
                />
              </div>
            </div>
          )}

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={loading || showCropper}
            className="
              mt-8
              inline-flex
              items-center
              justify-center
              gap-2
              bg-terracotta
              text-white
              px-8 py-3
              rounded-full
              transition-all duration-300
              hover:bg-deep-brown
              hover:shadow-card-hover
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            <FiZap size={18} />

            {loading ? "Generating..." : "Generate String Art"}
          </button>

          {/* Message */}
          {message && (
            <p className={`mt-5 ${
              message.includes("successfully") | message.includes("applied")
                ? "text-sage"
                : "text-terracotta"
            }`}>
              {message}
            </p>
          )}

          {/* Generated result */}
          {generatedImage && (
            <div className="mt-12 border-t border-warm-beige pt-10">
              {/* Decorative element */}
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-px bg-gold-accent" />
                <span className="text-xs font-medium text-terracotta tracking-wider uppercase">
                  Your Creation
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-deep-brown mb-8">
                Your String Art
              </h2>

              <div className="grid md:grid-cols-2 gap-10">
                {/* Generated image */}
                <div className="
                  bg-cream
                  rounded-[var(--radius-lg)]
                  p-4
                  shadow-inner
                ">
                  <img
                    src={generatedImage}
                    alt="Generated string art"
                    className="
                      w-full
                      rounded-[var(--radius-lg)]
                      shadow-card
                    "
                  />
                </div>

                {/* Design information */}
                <div className="
                  bg-cream
                  rounded-[var(--radius-lg)]
                  p-6 md:p-8
                  border border-warm-beige
                ">
                  <div className="flex items-center gap-3 mb-6">
                    <FiInfo size={20} className="text-terracotta" />
                    <h3 className="text-xl font-semibold text-deep-brown">
                      Design Information
                    </h3>
                  </div>

                  <div className="space-y-5">
                    <Info label="Canvas" value="Circle" />
                    <Info label="Size" value={`${size} px`} />
                    <Info label="Nails" value={nailCount} />
                    <Info label="Lines Generated" value={linesGenerated} />
                    <Info label="Processing Size" value={`${size} × ${size}`} />
                    <Info label="Line Weight" value={lineWeight} />
                  </div>
                </div>
              </div>

              {/* Delivery information */}
              <div className="mt-12 border-t border-warm-beige pt-10">
                <div className="flex items-center gap-3 mb-3">
                  <FiMapPin size={25} className="text-terracotta flex-shrink-0" />

                  <h2 className="text-2xl md:text-3xl font-bold text-deep-brown">
                    Delivery Information
                  </h2>
                </div>

                <p className="text-sage mb-8">
                  Enter the address where you want your string-art piece
                  delivered.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Street */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-deep-brown mb-2">
                      Street Address
                    </label>

                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Enter your street address"
                      className="
                        w-full
                        bg-cream
                        border border-warm-beige
                        rounded-[var(--radius-sm)]
                        px-4 py-3
                        text-deep-brown
                        placeholder-sage
                        focus:outline-none
                        focus:ring-2
                        focus:ring-terracotta/30
                        focus:border-terracotta
                        transition
                      "
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-deep-brown mb-2">
                      City
                    </label>

                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Enter your city"
                      className="
                        w-full
                        bg-cream
                        border border-warm-beige
                        rounded-[var(--radius-sm)]
                        px-4 py-3
                        text-deep-brown
                        placeholder-sage
                        focus:outline-none
                        focus:ring-2
                        focus:ring-terracotta/30
                        focus:border-terracotta
                        transition
                      "
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-deep-brown mb-2">
                      State
                    </label>

                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Enter your state"
                      className="
                        w-full
                        bg-cream
                        border border-warm-beige
                        rounded-[var(--radius-sm)]
                        px-4 py-3
                        text-deep-brown
                        placeholder-sage
                        focus:outline-none
                        focus:ring-2
                        focus:ring-terracotta/30
                        focus:border-terracotta
                        transition
                      "
                    />
                  </div>
                </div>

                {/* Public */}
                <div className="mt-8 flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-terracotta"
                  />

                  <div>
                    <p className="font-semibold text-deep-brown">
                      Allow my finished artwork to be displayed publicly
                    </p>

                    <p className="text-sm text-sage mt-1">
                      Your artwork may be shown in our gallery or portfolio.
                    </p>
                  </div>
                </div>

                {/* Place order */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={ordering}
                  className="
                    mt-10
                    w-full
                    flex
                    items-center
                    justify-center
                    gap-2
                    bg-terracotta
                    text-white
                    py-4
                    rounded-full
                    text-lg
                    font-medium
                    transition-all duration-300
                    hover:bg-deep-brown
                    hover:shadow-card-hover
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  {ordering ? (
                    <>
                      <FiCheck size={20} />
                      Creating Order...
                    </>
                  ) : (
                    <>
                      Place Order
                      <FiArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* =================================================
          CROP MODAL
      ================================================= */}
      {showCropper && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            bg-black/70
            flex
            items-center
            justify-center
            p-4
          "
        >
          {/* Crop editor */}
          <div
            className="
              relative
              w-full
              max-w-2xl
              bg-parchment
              rounded-[var(--radius-xl)]
              shadow-strong
              border border-warm-beige
              overflow-hidden
            "
          >
            {/* Header */}
            <div
              className="
                flex
                items-center
                justify-between
                px-5 py-4
                border-b border-warm-beige
              "
            >
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-deep-brown">
                  Adjust Your Image
                </h2>

                <p className="text-xs md:text-sm text-sage mt-1">
                  Position the image inside the circle. You can also use
                  the image as-is without cropping.
                </p>
              </div>

              <button
                onClick={handleCancelCrop}
                className="
                  w-9 h-9
                  rounded-full
                  flex
                  items-center
                  justify-center
                  bg-cream
                  text-terracotta
                  hover:text-deep-brown
                  transition
                "
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Crop area */}
            <div
              className="
                relative
                w-full
                h-[55vh]
                max-h-[500px]
                min-h-[280px]
                bg-black
              "
            >
              <Cropper
                image={previewUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            {/* Controls */}
            <div className="px-5 py-4">
              <div className="flex items-center gap-3">
                <FiSliders size={18} className="text-sage" />
                <span className="text-sm text-sage">Zoom</span>

                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 accent-terracotta"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-5">
                <button
                  onClick={handleCancelCrop}
                  className="
                    px-6 py-3
                    rounded-full
                    border border-warm-beige
                    bg-cream
                    text-terracotta
                    hover:bg-warm-beige
                    transition
                  "
                >
                  Use As-Is
                </button>

                <button
                  onClick={handleApplyCrop}
                  className="
                    px-6 py-3
                    rounded-full
                    bg-terracotta
                    text-white
                    hover:bg-deep-brown
                    hover:shadow-card-hover
                    transition
                  "
                >
                  Apply Crop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Create;
