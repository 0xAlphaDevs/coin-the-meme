"use client";

import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric"; // v6
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bold, Italic, Type, Plus } from "lucide-react";

// Common meme fonts (similar to imgflip)
const MEME_FONTS = [
  "Impact",
  "Arial Black",
  "Comic Sans MS",
  "Times New Roman",
  "Helvetica",
  "Verdana",
  "Georgia",
  "Trebuchet MS",
  "Arial",
  "Courier New",
];

export const MemeEditor = () => {
  const canvasEl = useRef<HTMLCanvasElement>({} as HTMLCanvasElement);
  const [canvas, setCanvas] = React.useState<fabric.Canvas>();
  const [selectedObject, setSelectedObject] = useState<fabric.Textbox | null>(
    null
  );
  const [fontSize, setFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState("Impact");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUppercase, setIsUppercase] = useState(false);

  useEffect(() => {
    if (!canvasEl.current) return;

    const options = {
      width: 400,
      height: 400,
      backgroundColor: "#f0f0f0",
    };

    const initialCanvas = new fabric.Canvas(canvasEl.current, options);
    setCanvas(initialCanvas);
    // make the fabric.Canvas instance available to your app
    // Add initial text
    const helloWorld = new fabric.Textbox("Hello world!", {
      fontFamily: "Impact",
      fontSize: 30,
      fill: "black",
      stroke: "black",
      strokeWidth: 0, // No stroke by default
      textAlign: "center",
      letterSpacing: 2, // Add letter spacing
    });

    initialCanvas.add(helloWorld);
    initialCanvas.centerObject(helloWorld);

    // Handle object selection
    initialCanvas.on("selection:created", (e) => {
      //fires when you click a text object.
      const activeObject = e.selected?.[0];
      if (activeObject && activeObject.type === "textbox") {
        const textObj = activeObject as fabric.Textbox;
        setSelectedObject(textObj);
        setFontSize(textObj.fontSize || 20);
        setFontFamily(textObj.fontFamily || "Impact");
        setIsBold(textObj.fontWeight === "bold");
        setIsItalic(textObj.fontStyle === "italic");
      }
    });

    initialCanvas.on("selection:updated", (e) => {
      //fires when you switch between different text objects.
      const activeObject = e.selected?.[0];
      if (activeObject && activeObject.type === "textbox") {
        const textObj = activeObject as fabric.Textbox;
        setSelectedObject(textObj);
        setFontSize(textObj.fontSize || 20);
        setFontFamily(textObj.fontFamily || "Impact");
        setIsBold(textObj.fontWeight === "bold");
        setIsItalic(textObj.fontStyle === "italic");
      }
    });

    initialCanvas.on("selection:cleared", () => {
      //fires when you click off everything.
      setSelectedObject(null);
    });

    return () => {
      initialCanvas.dispose();
    };
  }, []);

  const addNewText = () => {
    if (!canvas) return;

    const text = new fabric.Textbox("New Text", {
      left: 50,
      top: 50,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fill: "black",
      stroke: "black",
      strokeWidth: 0, // No stroke by default
      fontWeight: isBold ? "bold" : "normal",
      fontStyle: isItalic ? "italic" : "normal",
      textAlign: "center",
      letterSpacing: 2, // Add letter spacing
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  // TO DO : modify this
  const addImage = () => {
    if (!canvas) return;

    // Example image URL, replace with your own
    const imageUrl = "/meme-template-1.jpeg";

    // create HTMLImage element and pass to fabric.FabricImage
    const imgElement = new Image();
    imgElement.src = imageUrl;

    imgElement.onload = () => {
      const image = new fabric.FabricImage(imgElement);
      canvas.add(image);
      canvas.setActiveObject(image);
      canvas.renderAll();
    };
  };

  // TO DO : modify this
  const downloadImage = () => {
    if (!canvas) return;

    const dataUrl = canvas.toDataURL();

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "meme.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateSelectedText = (property: string, value: any) => {
    if (!selectedObject || !canvas) return;

    selectedObject.set(property, value);
    canvas.renderAll();
  };

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
    updateSelectedText("fontSize", newSize);
  };

  const handleFontFamilyChange = (newFont: string) => {
    setFontFamily(newFont);
    updateSelectedText("fontFamily", newFont);
  };

  const toggleBold = () => {
    const newBold = !isBold;
    setIsBold(newBold);
    updateSelectedText("fontWeight", newBold ? "bold" : "normal");
  };

  const toggleItalic = () => {
    const newItalic = !isItalic;
    setIsItalic(newItalic);
    updateSelectedText("fontStyle", newItalic ? "italic" : "normal");
  };

  const toggleUppercase = () => {
    if (!selectedObject || !canvas) return;

    const newUppercase = !isUppercase;
    setIsUppercase(newUppercase);

    const currentText = selectedObject.text || "";
    const newText = newUppercase
      ? currentText.toUpperCase()
      : currentText.toLowerCase();
    selectedObject.set("text", newText);
    canvas.renderAll();
  };

  return (
    <div className="flex gap-6 p-6 max-w-6xl mx-auto">
      {/* Canvas Section */}
      <div className="flex-1">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold mb-2">Meme Editor</h1>
          <p className="text-gray-600">Edit your memes with Fabric.js</p>
        </div>

        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasEl}
            className="border border-gray-300 rounded-lg shadow-lg"
          />
        </div>

        <div className="text-center">
          <Button
            onClick={addNewText}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Text
          </Button>

          <Button onClick={addImage} className="bg-blue-500 hover:bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Image
          </Button>

          <Button
            onClick={downloadImage}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="w-80">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="w-5 h-5" />
              Text Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedObject && (
              <p className="text-sm text-gray-500 italic">
                Select a text object to edit its properties
              </p>
            )}

            {/* Font Family */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Font Family
              </label>
              <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEME_FONTS.map((font) => (
                    <SelectItem
                      key={font}
                      value={font}
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Font Size: {fontSize}px
              </label>
              <input
                type="range"
                min="12"
                max="72"
                value={fontSize}
                onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Text Formatting */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Text Formatting
              </label>
              <div className="flex gap-2">
                <Button
                  variant={isBold ? "default" : "outline"}
                  size="sm"
                  onClick={toggleBold}
                  disabled={!selectedObject}
                  className={
                    isBold ? "bg-blue-500 text-white" : "bg-white text-black"
                  }
                >
                  <Bold className="w-4 h-4" />
                </Button>

                <Button
                  variant={isItalic ? "default" : "outline"}
                  size="sm"
                  onClick={toggleItalic}
                  disabled={!selectedObject}
                  className={
                    isItalic ? "bg-blue-500 text-white" : "bg-white text-black"
                  }
                >
                  <Italic className="w-4 h-4" />
                </Button>

                <Button
                  variant={isUppercase ? "default" : "outline"}
                  size="sm"
                  onClick={toggleUppercase}
                  disabled={!selectedObject}
                  className={
                    isUppercase
                      ? "bg-blue-500 text-white"
                      : "bg-white text-black"
                  }
                >
                  ABC
                </Button>
              </div>
            </div>

            {/* Color Controls */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Text Color
              </label>
              <input
                type="color"
                defaultValue="#000000"
                onChange={(e) => updateSelectedText("fill", e.target.value)}
                disabled={!selectedObject}
                className="w-full h-10 rounded border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Stroke Color
              </label>
              <input
                type="color"
                defaultValue="#000000"
                onChange={(e) => updateSelectedText("stroke", e.target.value)}
                disabled={!selectedObject}
                className="w-full h-10 rounded border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Stroke Width: {selectedObject?.strokeWidth || 0}px
              </label>
              <input
                type="range"
                min="0"
                max="10"
                defaultValue="0"
                onChange={(e) =>
                  updateSelectedText("strokeWidth", Number(e.target.value))
                }
                disabled={!selectedObject}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
