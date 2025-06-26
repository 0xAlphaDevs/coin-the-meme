"use client";

import React, { useEffect, useRef } from "react";
import * as fabric from "fabric"; // v6

export const MemeEditor = () => {
  const canvasEl = useRef<HTMLCanvasElement>({} as HTMLCanvasElement);
  const [canvas, setCanvas] = React.useState<fabric.Canvas>();

  useEffect(() => {
    const options = {};
    const initialCanvas = new fabric.Canvas(canvasEl.current, options);
    setCanvas(initialCanvas);
    // make the fabric.Canvas instance available to your app
    const helloWorld = new fabric.Textbox("Hello world!");
    initialCanvas.add(helloWorld);
    initialCanvas.centerObject(helloWorld);

    // return () => {
    //   initialCanvas.dispose();
    // };
  }, []);

  return (
    <div className="text-center mb-4">
      <h1 className="text-2xl font-bold">Meme Editor</h1>
      <p className="text-gray-600">Edit your memes with Fabric.js</p>

      <canvas width="300" height="300" ref={canvasEl} />
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white
        rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => {
          const text = new fabric.Textbox("New Text", {
            left: 50,
            top: 50,
            fontSize: 20,
            fill: "black",
          });
          canvas?.add(text);
          canvas?.centerObject(text);
        }}
      >
        Add Text
      </button>
    </div>
  );
};
