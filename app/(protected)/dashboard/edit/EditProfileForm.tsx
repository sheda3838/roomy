"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Briefcase,
  GraduationCap,
  Sun,
  Moon,
  ChevronLeft,
  Check,
  Home,
  CheckSquare,
  Loader2,
  UploadCloud,
  Image as ImageIcon,
} from "lucide-react";
import { editProfile } from "@/server/actions/editProfile";
import { uploadImage } from "@/server/actions/uploadImage";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import type { EditProfileInput } from "@/server/validations/profile";
import LocationSelect from "@/components/shared/LocationSelect";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FACILITIES_LIST } from "@/constants/facilities";

interface Props {
  initialData: EditProfileInput;
}

export default function EditProfileForm({ initialData }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<EditProfileInput>(initialData);
  const [image, setImage] = useState<{ file?: File; url: string; isUploading: boolean } | null>(
    initialData.profilePicture ? { url: initialData.profilePicture, isUploading: false } : null
  );

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    
    const imgObj = {
      file,
      url: URL.createObjectURL(file),
      isUploading: true,
    };
    setImage(imgObj);

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      const res = (await uploadImage(uploadData)) as { url?: string; error?: string };

      if (res.error) {
        console.error("Upload failed:", res.error);
        showErrorToast("Upload Failed", res.error);
        setImage(null);
      } else if (res.url) {
        setImage({ file, url: res.url, isUploading: false });
        updateField("profilePicture", res.url);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setImage(null);
    }
  };

  const updateField = (key: keyof EditProfileInput, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const isValid = () => {
    if (!formData.fullName || formData.fullName.length < 2) return false;
    if (!formData.gender || !formData.roleType) return false;
    if (
      !formData.cleanlinessLevel ||
      !formData.sleepType ||
      !formData.guestPolicy ||
      formData.smoker === undefined ||
      formData.drinker === undefined
    )
      return false;

    if (formData.isActiveSeeker) {
      return (
        formData.budgetMin !== undefined &&
        formData.budgetMin !== null &&
        formData.budgetMax !== undefined &&
        formData.budgetMax !== null &&
        formData.budgetMax >= formData.budgetMin &&
        formData.preferredLocations.length > 0
      );
    }
    return true;
  };

  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid()) return;

    if (!isDirty) {
      router.push("/dashboard");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = { ...formData };
      if (!payload.isActiveSeeker) {
        payload.budgetMin = undefined;
        payload.budgetMax = undefined;
        payload.preferredLocations = [];
      }

      const result = await editProfile(payload);

      if (result.error) {
        showErrorToast("Profile Update Failed", result.error);
        setIsSubmitting(false);
      } else {
        showSuccessToast("Profile Updated", "Your lifestyle preferences have been saved.");
        router.refresh();
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      showErrorToast("Error", err.message || "Failed to update profile.");
      setIsSubmitting(false);
    }
  };

  const getCardClass = (active: boolean) =>
    `relative flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all duration-300 cursor-pointer select-none ${
      active
        ? "bg-[rgb(34,142,222)]/8 border-[rgb(34,142,222)] text-[rgb(29,93,185)] shadow-sm"
        : "bg-white border-slate-200/80 text-slate-400 hover:border-slate-300 hover:text-slate-600"
    }`;

  const getSelectTileClass = (active: boolean) =>
    `px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-300 cursor-pointer text-center select-none ${
      active
        ? "bg-[rgb(34,142,222)]/8 border-[rgb(34,142,222)] text-[rgb(29,93,185)] shadow-sm"
        : "bg-white border-slate-200/80 text-slate-400 hover:border-slate-300 hover:text-slate-600"
    }`;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <User className="h-6 w-6 text-[rgb(34,142,222)]" /> Edit Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">Update your lifestyle preferences.</p>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors font-medium text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Info */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Basic Info</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Profile Picture</label>
              <div className="w-56 h-56">
                <label className="flex flex-col items-center justify-center w-full h-full border-2 border-slate-200 border-dashed rounded-3xl cursor-pointer bg-slate-50 hover:bg-slate-100/50 transition-all hover:border-[rgb(34,142,222)]/50 shadow-inner group overflow-hidden relative">
                  {image ? (
                    <>
                      <img src={image.url} alt="Profile" className={cn("w-full h-full object-cover", image.isUploading && "opacity-50")} />
                      {image.isUploading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[1px]">
                          <Loader2 className="w-8 h-8 text-[rgb(29,93,185)] animate-spin" />
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ImageIcon className="w-8 h-8 text-white mb-2" />
                          <span className="text-white text-sm font-semibold">Change Photo</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-8 h-8 mb-3 text-[rgb(34,142,222)] group-hover:scale-110 transition-transform" />
                      <p className="text-sm text-slate-600 font-medium">
                        <span className="font-bold text-[rgb(29,93,185)]">Click to upload</span>
                      </p>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={image?.isUploading} />
                </label>
                
                {image && !image.isUploading && (
                  <div className="mt-3 flex justify-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setImage(null);
                        updateField("profilePicture", "");
                      }}
                      className="text-sm text-red-500 hover:text-red-600 font-semibold px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Remove Photo
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[rgb(34,142,222)] focus:ring-4 focus:ring-[rgb(34,142,222)]/10 transition-all font-semibold"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Gender</label>
                <div className="grid grid-cols-2 gap-2">
                  <div onClick={() => updateField("gender", "male")} className={getSelectTileClass(formData.gender === "male")}>Male</div>
                  <div onClick={() => updateField("gender", "female")} className={getSelectTileClass(formData.gender === "female")}>Female</div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <div onClick={() => updateField("roleType", "student")} className={getSelectTileClass(formData.roleType === "student")}>Student</div>
                  <div onClick={() => updateField("roleType", "worker")} className={getSelectTileClass(formData.roleType === "worker")}>Worker</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lifestyle */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Lifestyle</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Cleanliness Level</label>
              <div className="grid grid-cols-3 gap-2">
                {(["low", "medium", "high"] as const).map((level) => (
                  <div key={level} onClick={() => updateField("cleanlinessLevel", level)} className={getSelectTileClass(formData.cleanlinessLevel === level)}>
                    <span className="capitalize">{level}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Sleep Pattern</label>
                <div className="grid grid-cols-2 gap-2">
                  <div onClick={() => updateField("sleepType", "early")} className={getCardClass(formData.sleepType === "early")}>
                    <Sun className="h-5 w-5 mb-1 text-amber-500" />
                    <span className="font-bold text-xs text-slate-800">Early Bird</span>
                  </div>
                  <div onClick={() => updateField("sleepType", "night_owl")} className={getCardClass(formData.sleepType === "night_owl")}>
                    <Moon className="h-5 w-5 mb-1 text-[rgb(29,93,185)]" />
                    <span className="font-bold text-xs text-slate-800">Night Owl</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Guest Policy</label>
                <div className="flex flex-col gap-2">
                  <div onClick={() => updateField("guestPolicy", "no")} className={getSelectTileClass(formData.guestPolicy === "no")}>No Guests</div>
                  <div onClick={() => updateField("guestPolicy", "often")} className={getSelectTileClass(formData.guestPolicy === "often")}>Sometimes</div>
                  <div onClick={() => updateField("guestPolicy", "regular")} className={getSelectTileClass(formData.guestPolicy === "regular")}>Frequently</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Do you smoke?</label>
                <div className="grid grid-cols-2 gap-2">
                  <div onClick={() => updateField("smoker", true)} className={getSelectTileClass(formData.smoker === true)}>Yes</div>
                  <div onClick={() => updateField("smoker", false)} className={getSelectTileClass(formData.smoker === false)}>No</div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Do you drink?</label>
                <div className="grid grid-cols-2 gap-2">
                  <div onClick={() => updateField("drinker", true)} className={getSelectTileClass(formData.drinker === true)}>Yes</div>
                  <div onClick={() => updateField("drinker", false)} className={getSelectTileClass(formData.drinker === false)}>No</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Looking for a Room */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Looking for a Room</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Are you actively searching for a room?</label>
            <div className="grid grid-cols-2 gap-4">
              <div onClick={() => updateField("isActiveSeeker", true)} className={getCardClass(formData.isActiveSeeker === true)}>
                <Home className="h-5 w-5 mb-2 text-[rgb(34,142,222)]" />
                <span className="font-bold text-sm text-slate-800">Yes, looking</span>
              </div>
              <div onClick={() => updateField("isActiveSeeker", false)} className={getCardClass(formData.isActiveSeeker === false)}>
                <CheckSquare className="h-5 w-5 mb-2 text-slate-400" />
                <span className="font-bold text-sm text-slate-800">No, just browsing</span>
              </div>
            </div>
          </div>

          {formData.isActiveSeeker && (
            <div className="space-y-6 p-5 bg-slate-50 border border-slate-100 rounded-2xl animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Monthly Budget Range (Rs.)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">Rs.</span>
                    <input
                      type="number"
                      placeholder="Min Budget"
                      value={formData.budgetMin !== undefined ? formData.budgetMin : ""}
                      onChange={(e) => updateField("budgetMin", e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[rgb(34,142,222)] font-semibold"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">Rs.</span>
                    <input
                      type="number"
                      placeholder="Max Budget"
                      value={formData.budgetMax !== undefined ? formData.budgetMax : ""}
                      onChange={(e) => updateField("budgetMax", e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[rgb(34,142,222)] font-semibold"
                    />
                  </div>
                </div>
                {formData.budgetMin !== undefined && formData.budgetMax !== undefined && formData.budgetMax < formData.budgetMin && (
                  <p className="text-xs text-red-500 mt-1">Max budget must be greater than or equal to Min budget.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Preferred Locations</label>
                <LocationSelect
                  value={formData.preferredLocations}
                  onChange={(val) => updateField("preferredLocations", val)}
                  multiple={true}
                  placeholder="Select preferred locations..."
                  theme="light"
                />
              </div>
              
              <div className="pt-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Preferred Facilities
                </label>
                <p className="text-xs text-slate-500 mb-4">
                  Choose facilities based on your realistic budget expectations. Rooms with more facilities may cost more.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {FACILITIES_LIST.map((item) => {
                    const currentFacilities = formData.preferredFacilities || [];
                    const isSelected = currentFacilities.includes(item.id);
                    const Icon = item.icon;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => {
                          const updated = isSelected
                            ? currentFacilities.filter((id) => id !== item.id)
                            : [...currentFacilities, item.id];
                          updateField("preferredFacilities", updated);
                        }}
                        className={cn(
                          "p-3 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2 text-center select-none hover:shadow-md",
                          isSelected
                            ? "bg-[rgb(34,142,222)]/8 border-[rgb(34,142,222)] text-[rgb(29,93,185)] shadow-[0_4px_20px_rgba(34,142,222,0.15)]"
                            : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
                          isSelected ? "bg-[rgb(34,142,222)]/20" : "bg-slate-50 text-slate-400"
                        )}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-bold leading-tight">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Link
            href="/dashboard"
            className="flex items-center justify-center px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={!isValid() || isSubmitting || image?.isUploading || !isDirty}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[rgb(34,142,222)] hover:bg-[rgb(29,93,185)] text-white font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-55 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <><Loader2 className="animate-spin h-4 w-4" /> Saving...</>
            ) : (
              <><Check className="h-4 w-4" /> Save Profile</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
