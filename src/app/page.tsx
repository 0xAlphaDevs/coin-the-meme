"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Edit3, Coins, Zap, Play } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-yellow-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-green-200/40 rounded-full"></div>
        <div className="absolute top-40 right-20 w-48 h-48 border-2 border-yellow-200/30 rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-24 h-24 border-2 border-green-300/50 rounded-full"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 border-2 border-yellow-300/35 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-green-200/20 rounded-full"></div>
        <div className="absolute top-10 right-1/4 w-20 h-20 border-2 border-yellow-200/40 rounded-full"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-yellow-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
              Coin the Meme
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Button className="bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600" onClick={() => window.location.href = "/editor"}>
              Try Now
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                Create Memes,{" "}
                <span className="bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
                  as Valuable Coins
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Create memes and launch them as coins on Zora.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-lg px-8 py-3"
                  onClick={() => window.location.href = "/editor"}
                >
                  Start Creating
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Demo Preview */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Edit3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Meme Editor Preview</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-3 w-3 bg-green-400 rounded-full"></div>
                  <div className="h-3 w-3 bg-yellow-400 rounded-full"></div>
                  <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="editor" className="relative z-10 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">What You Get</h2>
            <p className="text-xl text-gray-600">Essential tools for meme creation and coins minting</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 h-full">
            {/* Feature 1 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-yellow-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <Card className="relative border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 rounded-2xl h-full">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-yellow-500 rounded-xl flex items-center justify-center mb-6">
                    <Edit3 className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Meme Editor</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Create memes with custom fonts, colors, text styles, and templates.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Feature 2 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-green-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <Card className="relative border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 rounded-2xl h-full">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-green-500 rounded-xl flex items-center justify-center mb-6">
                    <Coins className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Zora Integration</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Integration with Zora to coin the meme.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Feature 3 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-yellow-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <Card className="relative border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 rounded-2xl h-full">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-yellow-500 rounded-xl flex items-center justify-center mb-6">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">One-Click Mint</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Deploy your coin with image and relevant metadata instantly on Base Mainnet.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 px-6 py-16 bg-white/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Three steps from idea to coin</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center relative">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Create</h3>
              <p className="text-gray-600">Use the editor to add text, choose fonts, and customize your meme design.</p>
            </div>

            <div className="text-center relative">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Export</h3>
              <p className="text-gray-600">Download your finished meme or prepare it for coining on Zora.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Coin the Meme</h3>
              <p className="text-gray-600">Connect your wallet and coin your meme on the Zora protocol.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Ready to Start?</h2>
          <p className="text-xl text-gray-600 mb-8">Try Klyro now and turn your meme ideas into coinss</p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-lg px-12 py-4"
            onClick={() => window.location.href = "/editor"}
          >
            Launch Editor
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 py-2  text-center">
        <a href="https://www.alphadevs.dev/" target="_blank" rel="noopener noreferrer" className="font-semibold">
          @alphadevs 2025
        </a>
      </footer>
    </div>
  )
}
