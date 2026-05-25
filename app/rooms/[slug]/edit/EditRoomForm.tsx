"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Map,
  Compass,
  Sliders,
  Cigarette,
  Wine,
  User,
  Bath,
  Wifi,
  Wind,
  Flame,
  Car,
  Dumbbell,
  Shirt,
  ShieldAlert,
  ChevronLeft,
  BookOpen,
  Briefcase,
  GraduationCap
} from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import LocationSelect from "@/components/shared/LocationSelect";
import { editRoomSchema, type EditRoomInput } from "@/server/validations/room";
import { editRoom } from "@/server/actions/editRoom";
import { uploadImage } from "@/server/actions/uploadImage";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

const RoomLocationPicker = dynamic(
  () => import("@/components/maps/RoomLocationPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[300px] md:h-[380px] bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[rgb(34,142,222)] animate-spin" />
      </div>
    ),
  }
);

const AMENITIES_LIST = [
  { id: "washroom", label: "Attached washroom", icon: Bath },
  { id: "ac", label: "Air conditioning", icon: Wind },
  { id: "kitchen", label: "Kitchen access", icon: Flame },
  { id: "parking", label: "Parking", icon: Car },
  { id: "laundry", label: "Laundry", icon: Shirt },
  { id: "study_table", label: "Personal study table", icon: BookOpen },
];

export default function EditRoomForm({ initialData, roomId }: { initialData: any, roomId: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Parse initial images to match state shape
  const initialImages = (initialData.images || []).map((url: string) => ({ url, isUploading: false }));
  const [images, setImages] = useState<{ file?: File; url: string; isUploading: boolean }[]>(initialImages);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty: isFormDirty },
  } = useForm<EditRoomInput>({
    resolver: zodResolver(editRoomSchema) as any,
    defaultValues: {
      title: initialData.title,
      description: initialData.description,
      images: initialData.images || [],
      locationText: initialData.locationText,
      coordinates: initialData.coordinates,
      rentAmount: initialData.rentAmount,
      deposit: initialData.deposit,
      capacity: initialData.capacity,
      currentOccupants: initialData.currentOccupants || 0,
      cleanlinessExpectation: initialData.cleanlinessExpectation,
      smokerAllowed: initialData.smokerAllowed,
      drinkerAllowed: initialData.drinkerAllowed,
      guestPolicy: initialData.guestPolicy,
      genderPreference: initialData.genderPreference,
      amenities: initialData.amenities || [],
    },
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

    for (const imgObj of newImages) {
      try {
        const formData = new FormData();
        formData.append("file", imgObj.file);

        const res = (await uploadImage(formData)) as { url?: string; error?: string };

        if (res.error) {
          console.error("Upload failed:", res.error);
          showErrorToast("Upload Failed", res.error);
          setImages((prev) => {
            const updated = prev.filter((i) => i.url !== imgObj.url);
            setValue("images", updated.filter((i) => !i.isUploading).map((i) => i.url), { shouldValidate: true });
            return updated;
          });
        } else if (res.url) {
          setImages((prev) => {
            const updated = prev.map((i) => i.url === imgObj.url ? { ...i, url: res.url as string, isUploading: false } : i);
            setValue("images", updated.filter((i) => !i.isUploading).map((i) => i.url), { shouldValidate: true });
            return updated;
          });
        }
      } catch (err) {
        console.error("Upload error:", err);
        showErrorToast("Upload Failed", "Something went wrong uploading your image.");
        setImages((prev) => {
          const updated = prev.filter((i) => i.url !== imgObj.url);
          setValue("images", updated.filter((i) => !i.isUploading).map((i) => i.url), { shouldValidate: true });
          return updated;
        });
      }
    }
  };

  const removeImage = (urlToRemove: string) => {
    setImages((prev) => {
      const updated = prev.filter((i) => i.url !== urlToRemove);
      setValue("images", updated.filter((i) => !i.isUploading).map((i) => i.url), { shouldValidate: true });
      return updated;
    });
  };

  const onSubmit = async (data: EditRoomInput) => {
    if (images.some((img) => img.isUploading)) {
      showErrorToast("Images Uploading", "Please wait for all images to finish uploading.");
      return;
    }

    const uploadedUrls = images
      .filter((i) => !i.isUploading && !i.url.startsWith("blob:"))
      .map((i) => i.url);
    data.images = uploadedUrls;

    const isImagesDirty = JSON.stringify(uploadedUrls) !== JSON.stringify(initialData.images || []);
    
    if (!isFormDirty && !isImagesDirty) {
      router.push(`/rooms/${initialData.slug}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await editRoom(roomId, data);

      if (result.error) {
        showErrorToast("Update Failed", result.error);
        setIsSubmitting(false);
      } else if (result.room?.slug) {
        showSuccessToast("Room Updated", "Your changes have been saved successfully.");
        router.push(`/rooms/${result.room.slug}`);
      }
    } catch (err: any) {
      console.error(err);
      showErrorToast("Error", err.message || "Something went wrong.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f7f9ff] text-slate-900 pt-28 pb-16 px-4 md:px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-gradient-to-br from-[rgb(46,219,244)]/10 to-[rgb(34,142,222)]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900">Edit Room Listing</h1>
            <p className="text-slate-500 mt-1">Update your room's details and preferences.</p>
          </div>
          <Link href={`/rooms/${initialData.slug}`} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm text-slate-600 hover:text-slate-900 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Room
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8">
          
          {/* Card 1: Basic Information */}
          <div className="bg-white/80 border border-slate-200/50 backdrop-blur-xl rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <Info className="h-5 w-5 text-[rgb(34,142,222)]" /> Basic Details
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Listing Title <span className="text-red-500">*</span></label>
                <input
                  {...register("title")}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[rgb(34,142,222)] focus:ring-4 focus:ring-[rgb(34,142,222)]/10 transition-all font-semibold"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Listing Description <span className="text-red-500">*</span></label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[rgb(34,142,222)] focus:ring-4 focus:ring-[rgb(34,142,222)]/10 transition-all font-medium resize-none leading-relaxed"
                />
                {errors.description && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Monthly Rent (Rs.) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-slate-400 font-bold text-sm">Rs.</span>
                    <input
                      type="number"
                      {...register("rentAmount")}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 font-bold"
                    />
                  </div>
                  {errors.rentAmount && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.rentAmount.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Deposit (Rs.)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-slate-400 font-bold text-sm">Rs.</span>
                    <input
                      type="number"
                      {...register("deposit")}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Location */}
          <div className="bg-white/80 border border-slate-200/50 backdrop-blur-xl rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <Map className="h-5 w-5 text-[rgb(34,142,222)]" /> Location & Map Pin
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Select Location / Area</label>
                <Controller
                  control={control}
                  name="locationText"
                  render={({ field }) => (
                    <LocationSelect
                      value={field.value || ""}
                      onChange={field.onChange}
                      multiple={false}
                      theme="light"
                      error={errors.locationText?.message}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-600">Pin Location on Map</label>
                <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-inner h-[320px] md:h-[380px] bg-slate-50">
                  <RoomLocationPicker
                    onChange={(pos) => setValue("coordinates", pos, { shouldValidate: true })}
                    initialPosition={initialData.coordinates}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Amenities */}
          <div className="bg-white/80 border border-slate-200/50 backdrop-blur-xl rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <Sliders className="h-5 w-5 text-[rgb(34,142,222)]" /> Features & Amenities
            </h2>

            <Controller
              control={control}
              name="amenities"
              render={({ field }) => {
                const selected = field.value || [];
                const toggleAmenity = (id: string) => {
                  field.onChange(selected.includes(id) ? selected.filter((v: string) => v !== id) : [...selected, id]);
                };

                return (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {AMENITIES_LIST.map((item) => {
                      const isSelected = selected.includes(item.id);
                      const Icon = item.icon;
                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => toggleAmenity(item.id)}
                          className={cn(
                            "p-2 py-3 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2 text-center select-none hover:shadow-md",
                            isSelected
                              ? "bg-[rgb(34,142,222)]/8 border-[rgb(34,142,222)] text-[rgb(29,93,185)] shadow-[0_4px_20px_rgba(34,142,222,0.15)]"
                              : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                          )}
                        >
                          <div className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
                            isSelected ? "bg-[rgb(34,142,222)]/20" : "bg-slate-50 text-slate-400"
                          )}>
                            <Icon className="w-4.5 h-4.5" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-800 leading-tight">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              }}
            />
          </div>

          {/* Card 4: Rules & Lifestyle Profile */}
          <div className="bg-white/80 border border-slate-200/50 backdrop-blur-xl rounded-3xl p-6 md:p-8 space-y-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <Users className="h-5 w-5 text-[rgb(34,142,222)]" /> Room Rules & Preferences
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Cleanliness Selector */}
              <Controller
                control={control}
                name="cleanlinessExpectation"
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2.5">Cleanliness Standard</label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { value: "low", label: "Low", desc: "Relaxed / Chill" },
                        { value: "medium", label: "Medium", desc: "Standard weekly" },
                        { value: "high", label: "High", desc: "Always pristine" },
                      ].map((item) => (
                        <button
                          type="button"
                          key={item.value}
                          onClick={() => field.onChange(item.value)}
                          className={cn(
                            "p-2.5 py-3.5 rounded-2xl border text-center transition-all duration-200 cursor-pointer flex flex-col justify-between h-20 select-none",
                            field.value === item.value
                              ? "bg-[rgb(34,142,222)]/8 border-[rgb(34,142,222)] shadow-[0_4px_16px_rgba(34,142,222,0.1)] text-[rgb(29,93,185)]"
                              : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                          )}
                        >
                          <span className="font-bold text-sm block text-slate-800">{item.label}</span>
                          <span className="text-[9px] text-slate-400 mt-1 line-clamp-1">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              />

              {/* Guest Policy Selector */}
              <Controller
                control={control}
                name="guestPolicy"
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2.5">Guest Policy</label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { value: "no", label: "No Guests", desc: "Private space" },
                        { value: "often", label: "Occasional", desc: "Sometimes" },
                        { value: "regular", label: "Frequent", desc: "Friends welcome" },
                      ].map((item) => (
                        <button
                          type="button"
                          key={item.value}
                          onClick={() => field.onChange(item.value)}
                          className={cn(
                            "p-2.5 py-3.5 rounded-2xl border text-center transition-all duration-200 cursor-pointer flex flex-col justify-between h-20 select-none",
                            field.value === item.value
                              ? "bg-[rgb(34,142,222)]/8 border-[rgb(34,142,222)] shadow-[0_4px_16px_rgba(34,142,222,0.1)] text-[rgb(29,93,185)]"
                              : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                          )}
                        >
                          <span className="font-bold text-sm block text-slate-800">{item.label}</span>
                          <span className="text-[9px] text-slate-400 mt-1 line-clamp-1">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Gender Preference */}
              <Controller
                control={control}
                name="genderPreference"
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2.5">Gender Preference</label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { value: "any", label: "Any", icon: Users },
                        { value: "male", label: "Male", icon: User },
                        { value: "female", label: "Female", icon: User },
                      ].map((item) => {
                        const Icon = item.icon;
                        const active = field.value === item.value;
                        return (
                          <button
                            type="button"
                            key={item.value}
                            onClick={() => field.onChange(item.value)}
                            className={cn(
                              "p-2.5 py-3 rounded-2xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1.5 h-20 select-none",
                              active
                                ? "bg-[rgb(34,142,222)]/8 border-[rgb(34,142,222)] shadow-[0_4px_16px_rgba(34,142,222,0.1)] text-[rgb(29,93,185)] font-bold"
                                : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                            )}
                          >
                            <Icon className={cn("w-4.5 h-4.5", active ? "text-[rgb(29,93,185)]" : "text-slate-400")} />
                            <span className="text-xs font-bold text-slate-800">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              />

              {/* Occupation Preference */}
              <Controller
                control={control}
                name="occupationPreference"
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2.5">Occupation</label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { value: "any", label: "Any", icon: Users },
                        { value: "student", label: "Students", icon: GraduationCap },
                        { value: "worker", label: "Workers", icon: Briefcase },
                      ].map((item) => {
                        const Icon = item.icon;
                        const active = field.value === item.value;
                        return (
                          <button
                            type="button"
                            key={item.value}
                            onClick={() => field.onChange(item.value)}
                            className={cn(
                              "p-2.5 py-3 rounded-2xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1.5 h-20 select-none",
                              active
                                ? "bg-[rgb(34,142,222)]/8 border-[rgb(34,142,222)] shadow-[0_4px_16px_rgba(34,142,222,0.1)] text-[rgb(29,93,185)] font-bold"
                                : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                            )}
                          >
                            <Icon className={cn("w-4.5 h-4.5", active ? "text-[rgb(29,93,185)]" : "text-slate-400")} />
                            <span className="text-xs font-bold text-slate-800">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
              {/* Room Capacity */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2.5">Total Capacity <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <span className="absolute left-4 top-3.5 flex items-center text-slate-400 font-bold text-sm pointer-events-none">People:</span>
                  <input
                    type="number"
                    {...register("capacity")}
                    placeholder="1"
                    min="1"
                    className="w-full pl-20 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:border-[rgb(34,142,222)] focus:ring-4 focus:ring-[rgb(34,142,222)]/10 transition-all font-bold h-14"
                  />
                </div>
                {errors.capacity && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.capacity.message}</p>}
              </div>

              {/* Current Occupants */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2.5">Current Occupants <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <span className="absolute left-4 top-3.5 flex items-center text-slate-400 font-bold text-sm pointer-events-none">People:</span>
                  <input
                    type="number"
                    {...register("currentOccupants")}
                    placeholder="0"
                    min="0"
                    className="w-full pl-20 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:border-[rgb(34,142,222)] focus:ring-4 focus:ring-[rgb(34,142,222)]/10 transition-all font-bold h-14"
                  />
                </div>
                {errors.currentOccupants && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.currentOccupants.message}</p>}
              </div>
            </div>

            {/* Smoking & Drinking Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-6 border-t border-slate-100">
              <Controller
                control={control}
                name="smokerAllowed"
                render={({ field }) => (
                  <button
                    type="button"
                    onClick={() => field.onChange(!field.value)}
                    className={cn(
                      "p-4 rounded-3xl border transition-all duration-300 cursor-pointer flex items-center gap-4 text-left select-none w-full hover:shadow-sm",
                      field.value
                        ? "bg-[rgb(248,150,60)]/8 border-[rgb(248,150,60)] text-[rgb(246,137,83)]"
                        : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                    )}
                  >
                    <div className={cn(
                      "w-11 h-11 rounded-2xl flex items-center justify-center shrink-0",
                      field.value ? "bg-[rgb(248,150,60)]/20" : "bg-slate-50 text-slate-400"
                    )}>
                      <Cigarette className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <span className="text-sm font-bold block text-slate-800">Smokers Allowed</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">{field.value ? "Yes, smoking permitted" : "No smoking allowed"}</span>
                    </div>
                  </button>
                )}
              />

              <Controller
                control={control}
                name="drinkerAllowed"
                render={({ field }) => (
                  <button
                    type="button"
                    onClick={() => field.onChange(!field.value)}
                    className={cn(
                      "p-4 rounded-3xl border transition-all duration-300 cursor-pointer flex items-center gap-4 text-left select-none w-full hover:shadow-sm",
                      field.value
                        ? "bg-purple-500/8 border-purple-500 text-purple-600"
                        : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                    )}
                  >
                    <div className={cn(
                      "w-11 h-11 rounded-2xl flex items-center justify-center shrink-0",
                      field.value ? "bg-purple-500/20" : "bg-slate-50 text-slate-400"
                    )}>
                      <Wine className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <span className="text-sm font-bold block text-slate-800">Drinkers Allowed</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">{field.value ? "Yes, alcohol permitted" : "No alcohol allowed"}</span>
                    </div>
                  </button>
                )}
              />
            </div>
          </div>

          {/* Card 5: Photos */}
          <div className="bg-white/80 border border-slate-200/50 backdrop-blur-xl rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <ImageIcon className="h-5 w-5 text-[rgb(34,142,222)]" /> Photos
            </h2>

            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-slate-200 border-dashed rounded-3xl cursor-pointer bg-slate-50 hover:bg-slate-100/50">
                <div className="flex flex-col items-center justify-center">
                  <UploadCloud className="w-9 h-9 mb-2.5 text-[rgb(34,142,222)]" />
                  <p className="text-sm text-slate-600 font-medium">Click to upload or drag images</p>
                </div>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group rounded-2xl overflow-hidden border border-slate-200/80 aspect-square bg-slate-100">
                      <img src={img.url} alt="Room" className={cn("w-full h-full object-cover", img.isUploading && "opacity-50")} />
                      {img.isUploading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[1px]">
                          <Loader2 className="w-6 h-6 text-[rgb(29,93,185)] animate-spin" />
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => removeImage(img.url)}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 rounded-full text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 gap-3">
            <Link
              href={`/rooms/${initialData.slug}`}
              className="px-8 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all flex items-center justify-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={
                isSubmitting || 
                images.some((i) => i.isUploading) || 
                (!isFormDirty && JSON.stringify(images.filter((i) => !i.isUploading && !i.url.startsWith("blob:")).map(i => i.url)) === JSON.stringify(initialData.images || []))
              }
              className="roomy-btn-primary px-10 py-3.5 text-base shadow-[0_6px_24px_rgba(34,142,222,0.3)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving Changes...</> : <><CheckCircle className="w-5 h-5" /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
