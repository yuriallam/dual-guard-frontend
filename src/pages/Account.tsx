import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { Camera, User, Upload, CheckCircle2, X, Video } from "lucide-react";
import { useState, useRef, useCallback } from "react";

const Account = () => {
  const { user } = useAuth();
  const [idPhoto, setIdPhoto] = useState<string | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState<"id" | "selfie" | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const openCamera = useCallback(async (mode: "id" | "selfie") => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: mode === "selfie" ? "user" : "environment" } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOpen(true);
      setCameraMode(mode);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  }, []);

  const closeCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
    setCameraMode(null);
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        if (cameraMode === "id") {
          setIdPhoto(dataUrl);
        } else if (cameraMode === "selfie") {
          setSelfiePhoto(dataUrl);
        }
      }
    }
    closeCamera();
  }, [cameraMode, closeCamera]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Account</h1>
            <p className="text-muted-foreground mt-1">Manage your profile information</p>
          </div>

          {/* Avatar Section */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Update your avatar</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-gradient-primary text-white text-2xl">
                    {user?.name?.charAt(0) || <User className="h-10 w-10" />}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-white hover:bg-primary/90 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                <Button variant="outline" size="sm">Upload Image</Button>
                <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
              </div>
            </CardContent>
          </Card>

          {/* Identity Verification Section */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Identity Verification
                {idPhoto && selfiePhoto && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Submitted
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                Verify your identity by providing a photo of your ID and a selfie
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Camera Modal */}
              {isCameraOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                  <div className="bg-card rounded-xl p-4 max-w-lg w-full space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">
                        {cameraMode === "id" ? "Capture ID Document" : "Take a Selfie"}
                      </h3>
                      <button onClick={closeCamera} className="text-muted-foreground hover:text-foreground">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      {cameraMode === "id" 
                        ? "Position your ID document clearly within the frame" 
                        : "Look directly at the camera for a clear photo"}
                    </p>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={closeCamera} className="flex-1">
                        Cancel
                      </Button>
                      <Button variant="gradient" onClick={capturePhoto} className="flex-1">
                        <Camera className="h-4 w-4 mr-2" />
                        Capture
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {/* ID Document */}
                <div className="space-y-3">
                  <Label>ID Document</Label>
                  <div 
                    className={`relative aspect-[3/2] rounded-lg border-2 border-dashed transition-colors ${
                      idPhoto ? "border-green-500/50 bg-green-500/5" : "border-border/50 bg-muted/30"
                    } flex items-center justify-center overflow-hidden`}
                  >
                    {idPhoto ? (
                      <>
                        <img src={idPhoto} alt="ID Document" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setIdPhoto(null)}
                          className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1 hover:bg-destructive/90"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">ID card, passport, or driver's license</p>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => openCamera("id")}
                    disabled={!!idPhoto}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    {idPhoto ? "Photo Captured" : "Open Camera"}
                  </Button>
                </div>

                {/* Selfie */}
                <div className="space-y-3">
                  <Label>Selfie Photo</Label>
                  <div 
                    className={`relative aspect-[3/2] rounded-lg border-2 border-dashed transition-colors ${
                      selfiePhoto ? "border-green-500/50 bg-green-500/5" : "border-border/50 bg-muted/30"
                    } flex items-center justify-center overflow-hidden`}
                  >
                    {selfiePhoto ? (
                      <>
                        <img src={selfiePhoto} alt="Selfie" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setSelfiePhoto(null)}
                          className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1 hover:bg-destructive/90"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <User className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Take a clear photo of yourself</p>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => openCamera("selfie")}
                    disabled={!!selfiePhoto}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    {selfiePhoto ? "Photo Captured" : "Open Camera"}
                  </Button>
                </div>
              </div>

              {idPhoto && selfiePhoto && (
                <Button variant="gradient" className="w-full">
                  Submit Verification
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Personal Info */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue={user?.name?.split(" ")[0]} placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue={user?.name?.split(" ")[1]} placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email} placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="johndoe" placeholder="johndoe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" placeholder="Smart contract security researcher..." />
              </div>
              <Button variant="gradient" className="mt-4">Save Changes</Button>
            </CardContent>
          </Card>

          {/* Connected Wallet */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Connected Wallet</CardTitle>
              <CardDescription>Your connected Web3 wallet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
                    <span className="text-white font-bold text-sm">MM</span>
                  </div>
                  <div>
                    <p className="font-medium">MetaMask</p>
                    <p className="text-sm text-muted-foreground font-mono">0x1234...5678</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Disconnect</Button>
              </div>
              <Button variant="outline" className="w-full">Connect Another Wallet</Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive">Delete Account</Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
