import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, ImagePlus, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  CATEGORIES,
  CROPS,
  isAllowedImage,
  uploadPostImages,
  type CommunityPost,
} from "@/lib/community";

const MAX_IMAGES = 4;

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  userId: string;
  editing?: CommunityPost | null;
};

export function PostComposer({ open, onOpenChange, userId, editing }: Props) {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [crop, setCrop] = useState<string>("गेहूं");
  const [category, setCategory] = useState<string>("रोग/कीट");
  const [location, setLocation] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setTitle(editing?.title ?? "");
    setBody(editing?.body ?? "");
    setCrop(editing?.crop ?? "गेहूं");
    setCategory(editing?.category ?? "रोग/कीट");
    setLocation(editing?.location ?? "");
    setFiles([]);
    setPreviews([]);
  }, [open, editing]);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const picked = Array.from(list).filter((f) => {
      if (!isAllowedImage(f)) {
        toast.error("सिर्फ JPG, PNG या WEBP फोटो चुनें");
        return false;
      }
      return true;
    });
    const next = [...files, ...picked].slice(0, MAX_IMAGES);
    setFiles(next);
    setPreviews(next.map((f) => URL.createObjectURL(f)));
  }

  function removeFile(i: number) {
    const next = files.filter((_, idx) => idx !== i);
    setFiles(next);
    setPreviews(next.map((f) => URL.createObjectURL(f)));
  }

  const submit = useMutation({
    mutationFn: async () => {
      if (!title.trim()) throw new Error("पोस्ट का शीर्षक लिखें");
      const uploaded = files.length ? await uploadPostImages(userId, files) : [];
      if (editing) {
        const { error } = await supabase
          .from("community_posts")
          .update({
            title: title.trim(),
            body: body.trim(),
            crop,
            category,
            location: location.trim() || null,
            images: [...editing.images, ...uploaded],
          })
          .eq("id", editing.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from("community_posts").insert({
          user_id: userId,
          title: title.trim(),
          body: body.trim(),
          crop,
          category,
          location: location.trim() || null,
          images: uploaded,
        });
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success(editing ? "पोस्ट अपडेट हो गई" : "आपकी पोस्ट प्रकाशित हो गई 🌾");
      qc.invalidateQueries({ queryKey: ["community-posts"] });
      qc.invalidateQueries({ queryKey: ["my-community-posts"] });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {editing ? "पोस्ट एडिट करें" : "नई पोस्ट करें 🌾"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>शीर्षक</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="जैसे: मेरी गेहूं की फसल में यह बीमारी क्यों हो रही है?"
              className="text-[15px]"
            />
          </div>

          <div className="space-y-1.5">
            <Label>अपना सवाल / जानकारी</Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="फसल की उम्र, मौसम, दवा — जो भी जानकारी हो लिखें…"
              className="text-[15px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>फसल</Label>
              <Select value={crop} onValueChange={setCrop}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CROPS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>श्रेणी</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>गाँव / जिला (वैकल्पिक)</Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="जैसे: करनाल, हरियाणा"
            />
          </div>

          <div className="space-y-2">
            <Label>फसल की फोटो (अधिकतम {MAX_IMAGES})</Label>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => cameraRef.current?.click()}>
                <Camera className="mr-1.5 h-4 w-4" /> कैमरा
              </Button>
              <Button type="button" variant="outline" onClick={() => galleryRef.current?.click()}>
                <ImagePlus className="mr-1.5 h-4 w-4" /> गैलरी
              </Button>
            </div>
            <input
              ref={cameraRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              capture="environment"
              hidden
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <input
              ref={galleryRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              hidden
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
            {previews.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {previews.map((src, i) => (
                  <div key={src} className="relative">
                    <img src={src} alt={`फोटो ${i + 1}`} className="h-20 w-full rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute -right-1.5 -top-1.5 rounded-full bg-destructive p-1 text-destructive-foreground"
                      aria-label="फोटो हटाएं"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            className="w-full rounded-full bg-gradient-primary py-6 text-base font-bold"
            disabled={submit.isPending}
            onClick={() => submit.mutate()}
          >
            {submit.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            पोस्ट करें
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
