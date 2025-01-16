"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";

// Dynamically import QrReader to ensure client-side rendering
const QRCodeReader = dynamic(
  () =>
    import("react-qr-reader").then((mod) => mod.QrReader),
  { ssr: false }
);

const QRReaderPage = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<string | null>(null);

  const handleResult = async (
    result: { text: string } | null, // Use a more specific type for result
    scanError: Error | null // Replace `any` with `Error` for error
  ) => {
    if (result) {
      const data = result.text;
      setScanResult(data);

      try {
        const response = await axios.post("/api/verify-qr", { code: data });
        setApiResponse(response.data.message || "Success");
      } catch (err) {
        console.error(err); // Log actual error for debugging
        setApiResponse("Failed to verify QR code");
      }
    }

    if (scanError) {
      console.error(scanError); // Log actual scanError
      setError("Error accessing camera or scanning QR code");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">QR Code Reader</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="w-full max-w-md border border-gray-300 rounded-lg overflow-hidden">
        <QRCodeReader
          onResult={handleResult}
          constraints={{ facingMode: "environment" }}
          style={{ width: "100%" }}
        />
      </div>
      {scanResult && <p className="mt-4">Scanned QR Code: {scanResult}</p>}
      {apiResponse && <p className="mt-2 text-green-500">API Response: {apiResponse}</p>}
    </div>
  );
};

export default QRReaderPage;
