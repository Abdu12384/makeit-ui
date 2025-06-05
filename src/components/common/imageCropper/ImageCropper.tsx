import type React from "react"
import { useState, useRef, useCallback } from "react"
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { Upload, RefreshCw, Trash2, ZoomIn, ZoomOut, Check } from "lucide-react"

interface SquareImageCropperProps {
  onCropComplete: (croppedImageBlob: Blob) => void
  className?: string
  maxHeight?: number
}

const SquareImageCropper: React.FC<SquareImageCropperProps> = ({ onCropComplete, className = "", maxHeight = 300 }) => {
  const [imgSrc, setImgSrc] = useState<string>("")
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const [loading, setLoading] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)


  const centerSquareCrop = useCallback((mediaWidth: number, mediaHeight: number) => {
    return centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        1, 
        mediaWidth,
        mediaHeight,
      ),
      mediaWidth,
      mediaHeight,
    )
  }, [])

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined) 
      setRotate(0) 
      setScale(1) 

      const reader = new FileReader()
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "")
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget
      setCrop(centerSquareCrop(width, height))
    },
    [centerSquareCrop],
  )

  const applyCrop = useCallback(async () => {
    if (!imgRef.current || !completedCrop) return

    setLoading(true)

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      setLoading(false)
      return
    }

    const scaleX = imgRef.current.naturalWidth / imgRef.current.width
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height

    const pixelRatio = window.devicePixelRatio
    canvas.width = completedCrop.width * scaleX * pixelRatio
    canvas.height = completedCrop.height * scaleY * pixelRatio

    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = "high"

    const cropX = completedCrop.x * scaleX
    const cropY = completedCrop.y * scaleY
    const cropWidth = completedCrop.width * scaleX
    const cropHeight = completedCrop.height * scaleY

    // Save context state
    ctx.save()

    // Move to center of canvas
    ctx.translate(canvas.width / (2 * pixelRatio), canvas.height / (2 * pixelRatio))

    // Rotate around the center
    ctx.rotate((rotate * Math.PI) / 180)

    // Scale the image
    ctx.scale(scale, scale)

    // Draw the image, centered
    ctx.drawImage(
      imgRef.current,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      -cropWidth / 2,
      -cropHeight / 2,
      cropWidth,
      cropHeight,
    )

    // Restore context state
    ctx.restore()

    // Convert canvas to blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCropComplete(blob)
        }
        setLoading(false)
      },
      "image/png",
      1,
    )
  }, [completedCrop, imgRef, rotate, scale, onCropComplete])

  // Reset all changes
  const resetImage = () => {
    if (imgRef.current) {
      const { width, height } = imgRef.current
      setCrop(centerSquareCrop(width, height))
      setRotate(0)
      setScale(1)
    }
  }

  // Clear the image
  const clearImage = () => {
    setImgSrc("")
    setCrop(undefined)
    setCompletedCrop(undefined)
    setRotate(0)
    setScale(1)
  }

  // Zoom in/out
  const handleZoom = (zoomIn: boolean) => {
    setScale((prevScale) => {
      const newScale = zoomIn ? prevScale + 0.1 : prevScale - 0.1
      return Math.max(0.5, Math.min(3, newScale))
    })
  }

  // Rotate the image
  const handleRotate = () => {
    setRotate((prevRotate) => (prevRotate + 90) % 360)
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      {/* Upload Section */}
      {!imgSrc && (
        <label
          htmlFor="image-upload"
          className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex flex-col items-center justify-center">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-500">Click to upload an image</span>
            <span className="text-xs text-gray-400 mt-1">PNG, JPG, GIF</span>
          </div>
          <input id="image-upload" type="file" accept="image/*" onChange={onSelectFile} className="hidden" />
        </label>
      )}

      {/* Cropping Area */}
      {imgSrc && (
        <div className="flex flex-col">
          <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center overflow-hidden">
            <div className="max-w-full" style={{ maxHeight: `${maxHeight}px`, overflow: "auto" }}>
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1} // Force 1:1 aspect ratio for square
                className="max-w-full"
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc || "/placeholder.svg"}
                  style={{
                    transform: `scale(${scale}) rotate(${rotate}deg)`,
                    maxHeight: `${maxHeight}px`,
                    objectFit: "contain",
                  }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between mt-4 gap-2">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleZoom(true)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4 text-gray-700" />
              </button>
              <button
                type="button"
                onClick={() => handleZoom(false)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4 text-gray-700" />
              </button>
              <button
                type="button"
                onClick={handleRotate}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                title="Rotate"
              >
                <RefreshCw className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={resetImage}
                className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={clearImage}
                className="px-3 py-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors flex items-center"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Clear
              </button>
            </div>
          </div>

          {/* Apply Crop Button */}
          <button
            type="button"
            onClick={applyCrop}
            disabled={!completedCrop || loading}
            className={`w-full mt-4 py-2 px-4 rounded-md flex items-center justify-center font-medium ${
              !completedCrop || loading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700 text-white"
            } transition-colors`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Apply Crop
              </>
            )}
          </button>
        </div>
      )}

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

export default SquareImageCropper
