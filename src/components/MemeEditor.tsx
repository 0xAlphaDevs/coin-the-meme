"use client";

import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric"; // v6
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bold, Italic, Type, Plus, Download, Coins, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MEME_FONTS, MEME_TEMPLATES } from "@/lib/constants";
import CoinMemeButton from "./CoinMemeButton";

export const MemeEditor = () => {
  const canvasEl = useRef<HTMLCanvasElement>({} as HTMLCanvasElement);
  const [canvas, setCanvas] = React.useState<fabric.Canvas>();
  const [selectedObject, setSelectedObject] = useState<fabric.Textbox | null>(null);
  const [fontSize, setFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState("Impact");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUppercase, setIsUppercase] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [backgroundImage, setBackgroundImage] = useState<fabric.FabricImage | null>(null);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>("")

  useEffect(() => {
    if (!canvasEl.current) return;

    const options = {
      width: 750,
      height: 500,
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !canvas) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const imgElement = new Image();
      imgElement.src = e.target?.result as string;
      imgElement.onload = () => {
        // Remove existing background image if any
        if (backgroundImage) {
          canvas.remove(backgroundImage);
        }
        // Create new fabric image
        const image = new fabric.FabricImage(imgElement);
        // Resize canvas to match image dimensions
        canvas.setDimensions({ width: imgElement.width, height: imgElement.height });
        // Scale image to fit canvas if needed
        const scaleX = imgElement.width / imgElement.width;
        const scaleY = imgElement.height / imgElement.height;
        image.set({
          left: 0,
          top: 0,
          scaleX: scaleX,
          scaleY: scaleY,
          selectable: false, // Make background non-selectable
          evented: false, // Make background non-interactive
        });
        // Add image as background (send to back)
        canvas.add(image);
        canvas.sendObjectToBack(image);
        setBackgroundImage(image);
        canvas.renderAll();
      };
    };
    reader.readAsDataURL(file);
  };

  const handleTemplateSelect = (templateUrl: string) => {
    if (!canvas) return
    const imgElement = new Image()
    imgElement.src = templateUrl
    imgElement.onload = () => {
      if (backgroundImage) {
        canvas.remove(backgroundImage)
      }
      const image = new fabric.FabricImage(imgElement)
      canvas.setDimensions({ width: imgElement.width, height: imgElement.height })
      image.set({
        left: 0,
        top: 0,
        selectable: false,
        evented: false,
      })
      canvas.add(image)
      canvas.sendObjectToBack(image)
      setBackgroundImage(image)
      canvas.renderAll()
    }
  }

  const addImage = () => {
    fileInputRef.current?.click();
  };

  const generateMeme = () => {
    if (!canvas) return
    const dataUrl = canvas.toDataURL()
    setGeneratedImageUrl(dataUrl)
    setIsGenerateDialogOpen(true)
  }

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
    <div className="flex gap-6 p-6 mx-auto px-16 bg-gradient-to-br from-green-100 via-yellow-50 to-white">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      {/* Canvas Section */}
      <div className="flex-1 ">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold mb-2 mt-4">Meme Editor</h1>
        </div>

        <div className="flex justify-center mb-4 mt-16">
          <canvas
            ref={canvasEl}
            className="border border-gray-300 rounded-lg shadow-lg"
          />
        </div>

        <div className="text-center mt-10">
          <Button
            onClick={generateMeme}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Star className="w-4 h-4 mr-2" />
            Generate Meme
          </Button>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="space-y-6 mt-30">

        {/* Image Controls */}
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-yellow-200 h-100 w-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Plus className="w-5 h-5" />
              Image Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={addImage} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Image
            </Button>

            <div>
              <h4 className="text-sm font-medium mb-3 text-gray-700">Meme Templates</h4>
              <div className="grid grid-cols-3 gap-2">
                {MEME_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.url)}
                    className="aspect-square border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-colors overflow-hidden bg-gray-50"
                    title={template.name}
                  >
                    <img
                      src={template.url || "/placeholder.svg"}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Text Controls */}
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-green-200 w-100 h-160">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Type className="w-5 h-5" />
              Text Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedObject && (
              <p className="text-sm text-gray-500 italic">Select a text object to edit its properties</p>
            )}

            <Button onClick={addNewText} className="w-full bg-green-500 hover:bg-green-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Text
            </Button>

            {/* Font Family */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Font Family</label>
              <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEME_FONTS.map((font) => (
                    <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Font Size: {fontSize}px</label>
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
              <label className="block text-sm font-medium mb-2 text-gray-700">Text Formatting</label>
              <div className="flex gap-2">
                <Button
                  variant={isBold ? "default" : "outline"}
                  size="sm"
                  onClick={toggleBold}
                  disabled={!selectedObject}
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button
                  variant={isItalic ? "default" : "outline"}
                  size="sm"
                  onClick={toggleItalic}
                  disabled={!selectedObject}
                >
                  <Italic className="w-4 h-4" />
                </Button>
                <Button
                  variant={isUppercase ? "default" : "outline"}
                  size="sm"
                  onClick={toggleUppercase}
                  disabled={!selectedObject}
                >
                  ABC
                </Button>
              </div>
            </div>

            {/* Color Controls */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Text Color</label>
              <input
                type="color"
                defaultValue="#000000"
                onChange={(e) => updateSelectedText("fill", e.target.value)}
                disabled={!selectedObject}
                className="w-full h-10 rounded border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Stroke Color</label>
              <input
                type="color"
                defaultValue="#000000"
                onChange={(e) => updateSelectedText("stroke", e.target.value)}
                disabled={!selectedObject}
                className="w-full h-10 rounded border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Stroke Width: {selectedObject?.strokeWidth || 0}px
              </label>
              <input
                type="range"
                min="0"
                max="10"
                defaultValue="0"
                onChange={(e) => updateSelectedText("strokeWidth", Number(e.target.value))}
                disabled={!selectedObject}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generate Meme Dialog */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>

        <DialogContent className="">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Your Meme is Ready!</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {generatedImageUrl && (
              <div className="flex justify-center">
                <img
                  src={generatedImageUrl || "/placeholder.svg"}
                  alt="Generated Meme"
                  className="max-w-full max-h-96 rounded-lg shadow-lg"
                />
              </div>
            )}
            <div className="flex flex-col gap-4 justify-center">
              <Button onClick={downloadImage} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 ">
                <Download className="w-5 h-5 mr-2" />
                Download
              </Button>
              <CoinMemeButton imageBlob={generatedImageUrl} />
            </div>
          </div>
        </DialogContent>

      </Dialog>
    </div>
  );
};
