"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Sparkles,
  Briefcase,
  GraduationCap,
  Sun,
  Moon,
  ChevronRight,
  ChevronLeft,
  Check,
  MapPin,
  X,
  Plus,
  Wine,
  Cigarette,
  Home,
  CheckSquare,
  Loader2,
} from "lucide-react";
import { completeOnboarding } from "@/server/actions/completeOnboarding";
import { type OnboardingInput } from "@/server/validations/onboarding";
import LocationSelect from "@/components/shared/LocationSelect";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, update } = useSession();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState<OnboardingInput>({
    gender: undefined as any,
    roleType: undefined as any,
    cleanlinessLevel: undefined as any,
    sleepType: undefined as any,
    smoker: undefined as any,
    drinker: undefined as any,
    guestPolicy: undefined as any,
    isActiveSeeker: undefined as any,
    preferredLocations: [],
    budgetMin: undefined,
    budgetMax: undefined,
  });

  const updateField = (key: keyof OnboardingInput, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Validations per step
  const isStepValid = () => {
    if (step === 1) {
      return formData.gender !== undefined && formData.roleType !== undefined;
    }
    if (step === 2) {
      return (
        formData.cleanlinessLevel !== undefined &&
        formData.sleepType !== undefined &&
        formData.guestPolicy !== undefined &&
        formData.smoker !== undefined &&
        formData.drinker !== undefined
      );
    }
    if (step === 3) {
      if (formData.isActiveSeeker === undefined) return false;

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
    }
    return false;
  };

  const handleNext = () => {
    if (isStepValid() && step < 3) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStepValid()) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const payload = { ...formData };

      // Clean budget variables if not a seeker
      if (!payload.isActiveSeeker) {
        payload.budgetMin = undefined;
        payload.budgetMax = undefined;
        payload.preferredLocations = [];
      }

      const result = await completeOnboarding(payload);

      if (result.error) {
        setErrorMsg(result.error);
        setIsSubmitting(false);
      } else {
        await update({ isOnboardingComplete: true });
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to complete onboarding.");
      setIsSubmitting(false);
    }
  };

  // Premium interactive card classes
  const getCardClass = (active: boolean) =>
    `relative flex flex-col items-center justify-center p-6 rounded-3xl border text-center transition-all duration-300 cursor-pointer select-none ${
      active
        ? "bg-[rgb(34,142,222)]/8 border-[rgb(34,142,222)] text-[rgb(29,93,185)] shadow-[0_4px_20px_rgba(34,142,222,0.15)] scale-[1.02]"
        : "bg-white border-slate-200/80 text-slate-400 hover:border-slate-300 hover:text-slate-600 hover:-translate-y-0.5"
    }`;

  const getSelectTileClass = (active: boolean) =>
    `px-4 py-3 rounded-2xl border text-sm font-semibold transition-all duration-300 cursor-pointer text-center select-none ${
      active
        ? "bg-[rgb(34,142,222)]/8 border-[rgb(34,142,222)] text-[rgb(29,93,185)] shadow-md"
        : "bg-white border-slate-200/80 text-slate-400 hover:border-slate-300 hover:text-slate-600"
    }`;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f7f9ff] text-slate-900 p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-[rgb(46,219,244)]/10 rounded-full filter blur-[128px] opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-[rgb(248,150,60)]/8 rounded-full filter blur-[128px] opacity-30 animate-pulse"></div>

      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-3xl p-6 md:p-10 shadow-2xl relative z-10 flex flex-col min-h-[550px]">
        {/* Header and Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-[rgb(34,142,222)] animate-pulse" />
                Customize Roomy
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Help us find roommate and home listings that match your style.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-full text-[rgb(29,93,185)]">
              Step {step} of 3
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[rgb(46,219,244)] via-[rgb(34,142,222)] to-[rgb(29,93,185)]"
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form area */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
          <div className="flex-1">
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm">
                {errorMsg}
              </div>
            )}

            <AnimatePresence mode="wait">
              {/* STEP 1: DEMOGRAPHICS */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Identify Your Gender
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        onClick={() => updateField("gender", "male")}
                        className={getCardClass(formData.gender === "male")}
                      >
                        <div className="p-3 bg-slate-50 rounded-2xl mb-3 text-[rgb(29,93,185)]">
                          <User className="h-6 w-6" />
                        </div>
                        <span className="font-bold text-sm text-slate-800">Male</span>
                      </div>
                      <div
                        onClick={() => updateField("gender", "female")}
                        className={getCardClass(formData.gender === "female")}
                      >
                        <div className="p-3 bg-slate-50 rounded-2xl mb-3 text-[rgb(248,150,60)]">
                          <User className="h-6 w-6" />
                        </div>
                        <span className="font-bold text-sm text-slate-800">Female</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Current Occupation / Status
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        onClick={() => updateField("roleType", "student")}
                        className={getCardClass(formData.roleType === "student")}
                      >
                        <div className="p-3 bg-slate-50 rounded-2xl mb-3 text-[rgb(248,150,60)]">
                          <GraduationCap className="h-6 w-6" />
                        </div>
                        <span className="font-bold text-sm text-slate-800">Student</span>
                        <p className="text-xs text-slate-400 mt-1">Pursuing academics</p>
                      </div>
                      <div
                        onClick={() => updateField("roleType", "worker")}
                        className={getCardClass(formData.roleType === "worker")}
                      >
                        <div className="p-3 bg-slate-50 rounded-2xl mb-3 text-emerald-500">
                          <Briefcase className="h-6 w-6" />
                        </div>
                        <span className="font-bold text-sm text-slate-800">Professional / Worker</span>
                        <p className="text-xs text-slate-400 mt-1">Full/part-time employment</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: LIFESTYLE */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Cleanliness Level
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["low", "medium", "high"] as const).map((level) => (
                        <div
                          key={level}
                          onClick={() => updateField("cleanlinessLevel", level)}
                          className={getSelectTileClass(formData.cleanlinessLevel === level)}
                        >
                          <span className="capitalize">{level}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Sleep Pattern
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        onClick={() => updateField("sleepType", "early")}
                        className={getCardClass(formData.sleepType === "early")}
                      >
                        <Sun className="h-5 w-5 mb-2 text-amber-500" />
                        <span className="font-bold text-sm text-slate-800">Early Bird</span>
                      </div>
                      <div
                        onClick={() => updateField("sleepType", "night_owl")}
                        className={getCardClass(formData.sleepType === "night_owl")}
                      >
                        <Moon className="h-5 w-5 mb-2 text-[rgb(29,93,185)]" />
                        <span className="font-bold text-sm text-slate-800">Night Owl</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Do you smoke?
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <div
                          onClick={() => updateField("smoker", true)}
                          className={getSelectTileClass(formData.smoker === true)}
                        >
                          Yes
                        </div>
                        <div
                          onClick={() => updateField("smoker", false)}
                          className={getSelectTileClass(formData.smoker === false)}
                        >
                          No
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Do you drink alcohol?
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <div
                          onClick={() => updateField("drinker", true)}
                          className={getSelectTileClass(formData.drinker === true)}
                        >
                          Yes
                        </div>
                        <div
                          onClick={() => updateField("drinker", false)}
                          className={getSelectTileClass(formData.drinker === false)}
                        >
                          No
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Guest Policy (How often do you host guests?)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div
                        onClick={() => updateField("guestPolicy", "no")}
                        className={getSelectTileClass(formData.guestPolicy === "no")}
                      >
                        No Guests
                      </div>
                      <div
                        onClick={() => updateField("guestPolicy", "often")}
                        className={getSelectTileClass(formData.guestPolicy === "often")}
                      >
                        Sometimes
                      </div>
                      <div
                        onClick={() => updateField("guestPolicy", "regular")}
                        className={getSelectTileClass(formData.guestPolicy === "regular")}
                      >
                        Frequently
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: PREFERENCES */}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Are you actively searching for a room or roommate?
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        onClick={() => updateField("isActiveSeeker", true)}
                        className={getCardClass(formData.isActiveSeeker === true)}
                      >
                        <Home className="h-5 w-5 mb-2 text-[rgb(34,142,222)]" />
                        <span className="font-bold text-sm text-slate-800">Yes, actively looking</span>
                        <p className="text-xs text-slate-400 mt-1">Specify budget/locations</p>
                      </div>
                      <div
                        onClick={() => updateField("isActiveSeeker", false)}
                        className={getCardClass(formData.isActiveSeeker === false)}
                      >
                        <CheckSquare className="h-5 w-5 mb-2 text-slate-400" />
                        <span className="font-bold text-sm text-slate-800">No / Already have a place</span>
                        <p className="text-xs text-slate-400 mt-1">Just browsing matches</p>
                      </div>
                    </div>
                  </div>

                  {formData.isActiveSeeker && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6 pt-2"
                    >
                      {/* Budget inputs */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Monthly Budget Range (Rs.)
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="relative group">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm pointer-events-none">Rs.</span>
                            <input
                              type="number"
                              placeholder="Min Budget"
                              value={formData.budgetMin !== undefined ? formData.budgetMin : ""}
                              onChange={(e) =>
                                updateField(
                                  "budgetMin",
                                  e.target.value ? Number(e.target.value) : undefined
                                )
                              }
                              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[rgb(34,142,222)] focus:ring-4 focus:ring-[rgb(34,142,222)]/10 transition-all font-semibold"
                              required
                            />
                          </div>

                          <div className="relative group">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm pointer-events-none">Rs.</span>
                            <input
                              type="number"
                              placeholder="Max Budget"
                              value={formData.budgetMax !== undefined ? formData.budgetMax : ""}
                              onChange={(e) =>
                                updateField(
                                  "budgetMax",
                                  e.target.value ? Number(e.target.value) : undefined
                                )
                              }
                              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[rgb(34,142,222)] focus:ring-4 focus:ring-[rgb(34,142,222)]/10 transition-all font-semibold"
                              required
                            />
                          </div>
                        </div>
                        {formData.budgetMin !== undefined &&
                          formData.budgetMax !== undefined &&
                          formData.budgetMax < formData.budgetMin && (
                            <p className="text-xs text-red-500 mt-1.5 ml-1">
                              Max budget must be greater than or equal to Min budget.
                            </p>
                          )}
                      </div>

                      {/* Locations selector dropdown */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Preferred Locations <span className="text-red-500">*</span>
                        </label>
                        <LocationSelect
                          value={formData.preferredLocations}
                          onChange={(val) => updateField("preferredLocations", val)}
                          multiple={true}
                          placeholder="Select preferred locations..."
                          theme="light"
                        />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action buttons footer */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
            ) : (
              <div /> // spacing placeholder
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[rgb(34,142,222)] hover:bg-[rgb(29,93,185)] text-white font-bold shadow-md hover:shadow-[rgb(34,142,222)]/20 transition-all disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer"
              >
                Continue <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isStepValid() || isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[rgb(34,142,222)] to-[rgb(29,93,185)] hover:from-[rgb(29,93,185)] hover:to-[rgb(29,93,185)] text-white font-bold shadow-lg hover:shadow-[rgb(29,93,185)]/20 transition-all disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 text-white" />
                    Finalizing...
                  </>
                ) : (
                  <>
                    Complete Onboarding <Check className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
