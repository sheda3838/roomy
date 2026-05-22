"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  UploadCloud,
  X,
  MapPin,
  DollarSign,
  Users,
  Info,
  Clock,
  CheckCircle,
  Loader2,
  Image as ImageIcon,
  Map
} from "lucide-react";

// Dynamically import Leaflet map to prevent SSR window errors
const RoomLocationPicker = dynamic(
  () => import("@/components/maps/RoomLocationPicker"),
  { ssr: false, loading: () => <div className="w-full h-[300px] md:h-[400px] bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div> }
);

import { createRoomSchema, type CreateRoomInput } from "@/server/validations/room";
import { createRoom } from "@/server/actions/createRoom";
import { uploadImage } from "@/server/actions/uploadImage";

export default function CreateRoomPage() {
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [images, setImages] = useState<{ file?: File; url: string; isUploading: boolean }[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateRoomInput>({
    resolver: zodResolver(createRoomSchema) as any,
    defaultValues: {
      images: [],
      capacity: 1,
      genderPreference: "any",
      cleanlinessExpectation: "medium",
      smokerAllowed: false,
      drinkerAllowed: false,
      guestPolicy: "no",
    } as Partial<CreateRoomInput>,
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isUploading: true,
    }));

    setImages((prev) => [...prev, ...newImages]);

    // Upload each image to Cloudinary
    for (const imgObj of newImages) {
      try {
        const formData = new FormData();
        formData.append("file", imgObj.file);

        const res = await uploadImage(formData) as { url?: string; error?: string };
        
        if (res.error) {
          console.error("Upload failed:", res.error);
          setImages((prev) => {
            const updated = prev.filter((i) => i.url !== imgObj.url);
            setValue("images", updated.filter((i) => !i.isUploading).map(i => i.url), { shouldValidate: true });
            return updated;
          });
        } else if (res.url) {
          setImages((prev) => {
            const updated = prev.map((i) => (i.url === imgObj.url ? { ...i, url: res.url as string, isUploading: false } : i));
            setValue("images", updated.filter((i) => !i.isUploading).map(i => i.url), { shouldValidate: true });
            return updated;
          });
        }
      } catch (err) {
        console.error("Upload error:", err);
        setImages((prev) => {
          const updated = prev.filter((i) => i.url !== imgObj.url);
          setValue("images", updated.filter((i) => !i.isUploading).map(i => i.url), { shouldValidate: true });
          return updated;
        });
      }
    }
  };

  const removeImage = (urlToRemove: string) => {
    setImages((prev) => {
      const updated = prev.filter((i) => i.url !== urlToRemove);
      setValue("images", updated.filter((i) => !i.isUploading).map(i => i.url), { shouldValidate: true });
      return updated;
    });
  };

  const onSubmit = async (data: CreateRoomInput) => {
    // Check if there are still uploading images
    if (images.some((img) => img.isUploading)) {
      setErrorMsg("Please wait for all images to finish uploading.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    // Set uploaded image URLs
    const uploadedUrls = images.filter((i) => !i.isUploading && !i.url.startsWith("blob:")).map((i) => i.url);
    data.images = uploadedUrls;

    try {
      const result = await createRoom(data);

      if (result.error) {
        setErrorMsg(result.error);
        setIsSubmitting(false);
      } else if (result.room?.slug) {
        setSuccessMsg("Room published successfully!");
        router.push(`/rooms/${result.room.slug}`);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 py-10 px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Post a Room
          </h1>
          <p className="text-zinc-400 mt-2">
            Provide details about the space to find the most compatible flatmates.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-800/50 rounded-xl text-red-200 text-sm">
            {errorMsg}
          </div>
        )}
        
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8">
          
          {/* Section 1: Basic Info */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-4">
              <Info className="h-5 w-5 text-indigo-400" /> Basic Details
            </h2>

            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">Title <span className="text-red-500">*</span></label>
              <input
                {...register("title")}
                placeholder="e.g. Spacious Single Room in Colombo 07"
                className="w-full px-4 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">Description <span className="text-red-500">*</span></label>
              <textarea
                {...register("description")}
                rows={4}
                placeholder="Describe the room, building amenities, and the vibe of the place..."
                className="w-full px-4 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              />
              {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-2">Location (Area/City) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <input
                    {...register("locationText")}
                    placeholder="e.g. Nugegoda, Colombo 03"
                    className="w-full pl-9 pr-4 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                {errors.locationText && <p className="text-red-400 text-xs mt-1">{errors.locationText.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-2">Monthly Rent (Rs.) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <input
                    type="number"
                    {...register("rentAmount")}
                    placeholder="e.g. 25000"
                    className="w-full pl-9 pr-4 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                {errors.rentAmount && <p className="text-red-400 text-xs mt-1">{errors.rentAmount.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-2">Deposit (Rs.) <span className="text-zinc-500 font-normal">(Optional)</span></label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <input
                    type="number"
                    {...register("deposit")}
                    placeholder="e.g. 50000"
                    className="w-full pl-9 pr-4 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-2">Room Capacity <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <input
                    type="number"
                    {...register("capacity")}
                    placeholder="1"
                    min="1"
                    className="w-full pl-9 pr-4 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                {errors.capacity && <p className="text-red-400 text-xs mt-1">{errors.capacity.message}</p>}
              </div>
            </div>
          </div>

          {/* Section 1.5: Location Map */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-4">
              <Map className="h-5 w-5 text-indigo-400" /> Pin exact location <span className="text-red-500 ml-1">*</span>
            </h2>
            <p className="text-sm text-zinc-400 mb-4">
              Zoom in and click on the map to place a pin exactly where the room is located. This helps flatmates find you in local searches.
            </p>

            <RoomLocationPicker
              onChange={(pos) => setValue("coordinates", pos, { shouldValidate: true })}
            />
            {errors.coordinates?.lat && (
              <p className="text-red-400 text-sm mt-2">{errors.coordinates.lat.message}</p>
            )}
            {errors.coordinates?.lng && !errors.coordinates.lat && (
              <p className="text-red-400 text-sm mt-2">{errors.coordinates.lng.message}</p>
            )}
            {errors.coordinates?.message && !errors.coordinates.lat && !errors.coordinates.lng && (
              <p className="text-red-400 text-sm mt-2">{errors.coordinates.message}</p>
            )}
          </div>

          {/* Section 2: Images */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-4">
              <ImageIcon className="h-5 w-5 text-indigo-400" /> Photos <span className="text-red-500 ml-1">*</span>
            </h2>
            
            <div>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-800 border-dashed rounded-xl cursor-pointer bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 mb-2 text-indigo-400" />
                  <p className="text-sm text-zinc-400"><span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop</p>
                </div>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
              {errors.images && <p className="text-red-400 text-sm mt-2">{errors.images.message}</p>}
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border border-zinc-800 aspect-square bg-zinc-900">
                    <img src={img.url} alt="Room" className={`w-full h-full object-cover ${img.isUploading ? "opacity-50" : "opacity-100"}`} />
                    {img.isUploading ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeImage(img.url)}
                        className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Roommate Preferences & Lifestyle */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-4">
              <Users className="h-5 w-5 text-indigo-400" /> Preferences & Rules
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              
              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-2">Gender Preference <span className="text-red-500">*</span></label>
                <select {...register("genderPreference")} className="w-full px-4 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-indigo-500">
                  <option value="any">Any Gender</option>
                  <option value="male">Male Only</option>
                  <option value="female">Female Only</option>
                </select>
                {errors.genderPreference && <p className="text-red-400 text-xs mt-1">{errors.genderPreference.message}</p>}
              </div>

              {/* Cleanliness */}
              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-2">Cleanliness Expected <span className="text-red-500">*</span></label>
                <select {...register("cleanlinessExpectation")} className="w-full px-4 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-indigo-500">
                  <option value="low">Relaxed / Low</option>
                  <option value="medium">Average / Medium</option>
                  <option value="high">Strict / High</option>
                </select>
                {errors.cleanlinessExpectation && <p className="text-red-400 text-xs mt-1">{errors.cleanlinessExpectation.message}</p>}
              </div>

              {/* Guest Policy */}
              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-2">Guest Policy <span className="text-red-500">*</span></label>
                <select {...register("guestPolicy")} className="w-full px-4 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-indigo-500">
                  <option value="no">No Guests Allowed</option>
                  <option value="often">Sometimes / Occasional</option>
                  <option value="regular">Regular / Frequently</option>
                </select>
                {errors.guestPolicy && <p className="text-red-400 text-xs mt-1">{errors.guestPolicy.message}</p>}
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 pt-4 border-t border-zinc-800/50">
              <label className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl cursor-pointer">
                <input type="checkbox" {...register("smokerAllowed")} className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-zinc-900" />
                <span className="text-sm font-semibold text-zinc-200">Smokers Allowed</span>
              </label>

              <label className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl cursor-pointer">
                <input type="checkbox" {...register("drinkerAllowed")} className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-zinc-900" />
                <span className="text-sm font-semibold text-zinc-200">Drinkers Allowed</span>
              </label>
            </div>
            
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting || images.some(i => i.isUploading)}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Publishing...
                </>
              ) : (
                "Publish Room Listing"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
