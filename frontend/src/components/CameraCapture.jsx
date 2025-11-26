import React, { useRef, useCallback } from "react";
import Webcam from "react-webcam";

export default function CameraCapture({ onCapture, onClose }) {
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) onCapture(imageSrc);
  }, [onCapture]);

  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center">
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="w-80 rounded-xl"
        videoConstraints={{ facingMode: "environment" }}
      />

      <div className="flex gap-4 mt-4">
        <button onClick={capture} className="bg-emerald-600 px-6 py-3 rounded-xl text-white">Capture</button>
        <button onClick={onClose} className="bg-gray-500 px-6 py-3 rounded-xl text-white">Cancel</button>
      </div>
    </div>
  );
}
