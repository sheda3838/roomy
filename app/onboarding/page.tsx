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
  DollarSign,
  X,
  Plus,
  Wine,
  Cigarette,
  Home,
  CheckSquare,
} from "lucide-react";
import { completeOnboarding } from "@/server/actions/completeOnboarding";
import { type OnboardingInput } from "@/server/validations/onboarding";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, update } = useSession();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Location input temporary text
  const [locInput, setLocInput] = useState("");

  const [formData, setFormData] = useState<OnboardingInput>({
    gender: "male",
    roleType: "student",
    cleanlinessLevel: "medium",
    sleepType: "early",
    smoker: false,
    drinker: false,
    guestPolicy: "often",
    isActiveSeeker: false,
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

  // Tag manager functions
  const addLocation = () => {
    const trimmed = locInput.trim();
    if (trimmed && !formData.preferredLocations.includes(trimmed)) {
      updateField("preferredLocations", [...formData.preferredLocations, trimmed]);
      setLocInput("");
    }
  };

  const removeLocation = (loc: string) => {
    updateField(
      "preferredLocations",
      formData.preferredLocations.filter((l) => l !== loc)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addLocation();
    }
  };

  // Validations per step
  const isStepValid = () => {
    if (step === 1) {
      return !!formData.gender && !!formData.roleType;
    }
    if (step === 2) {
      return (
        !!formData.cleanlinessLevel &&
        !!formData.sleepType &&
        !!formData.guestPolicy &&
        formData.smoker !== undefined &&
        formData.drinker !== undefined
      );
    }
    if (step === 3) {
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
        // Trigger NextAuth update session trigger to load state changes
        await update();
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to complete onboarding.");
      setIsSubmitting(false);
    }
  };

  // Card classes
  const getCardClass = (active: boolean) =>
    `relative flex flex-col items-center justify-center p-6 rounded-xl border text-center transition-all cursor-pointer select-none ${
      active
        ? "bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]"
        : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
    }`;

  const getSelectTileClass = (active: boolean) =>
    `px-4 py-3 rounded-lg border text-sm font-medium transition-all cursor-pointer text-center select-none ${
      active
        ? "bg-indigo-600 border-indigo-500 text-white shadow-lg"
        : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
    }`;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 text-zinc-100 p-4 relative overflow-hidden">
      {/* Premium background decorations */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-600 rounded-full filter blur-[128px] opacity-15 animate-pulse"></div>
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-indigo-600 rounded-full filter blur-[128px] opacity-15 animate-pulse"></div>

      <div className="w-full max-w-2xl bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-6 md:p-10 shadow-2xl relative z-10 flex flex-col min-h-[550px]">
        {/* Header and Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-indigo-400 animate-spin-slow" />
                Customize Roomy
              </h1>
              <p className="text-sm text-zinc-400 mt-1">
                Help us find roommate and home listings that match your style.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-indigo-400">
              Step {step} of 3
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600"
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form area */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
          <div className="flex-1">
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-950/40 border border-red-800/50 rounded-xl text-red-200 text-sm">
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
                    <label className="block text-sm font-semibold text-zinc-200 mb-3">
                      Identify Your Gender
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        onClick={() => updateField("gender", "male")}
                        className={getCardClass(formData.gender === "male")}
                      >
                        <div className="p-3 bg-zinc-800/80 rounded-full mb-3 text-indigo-400">
                          <User className="h-6 w-6" />
                        </div>
                        <span className="font-semibold text-sm">Male</span>
                      </div>
                      <div
                        onClick={() => updateField("gender", "female")}
                        className={getCardClass(formData.gender === "female")}
                      >
                        <div className="p-3 bg-zinc-800/80 rounded-full mb-3 text-purple-400">
                          <User className="h-6 w-6" />
                        </div>
                        <span className="font-semibold text-sm">Female</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-200 mb-3">
                      Current Occupation / Status
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        onClick={() => updateField("roleType", "student")}
                        className={getCardClass(formData.roleType === "student")}
                      >
                        <div className="p-3 bg-zinc-800/80 rounded-full mb-3 text-yellow-500">
                          <GraduationCap className="h-6 w-6" />
                        </div>
                        <span className="font-semibold text-sm">Student</span>
                        <p className="text-xs text-zinc-500 mt-1">Pursuing academics</p>
                      </div>
                      <div
                        onClick={() => updateField("roleType", "worker")}
                        className={getCardClass(formData.roleType === "worker")}
                      >
                        <div className="p-3 bg-zinc-800/80 rounded-full mb-3 text-emerald-400">
                          <Briefcase className="h-6 w-6" />
                        </div>
                        <span className="font-semibold text-sm">Professional / Worker</span>
                        <p className="text-xs text-zinc-500 mt-1">Full/part-time employment</p>
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
                    <label className="block text-sm font-semibold text-zinc-200 mb-3">
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
                    <label className="block text-sm font-semibold text-zinc-200 mb-3">
                      Sleep Pattern
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        onClick={() => updateField("sleepType", "early")}
                        className={getCardClass(formData.sleepType === "early")}
                      >
                        <Sun className="h-5 w-5 mb-2 text-amber-400" />
                        <span className="font-medium text-sm">Early Bird</span>
                      </div>
                      <div
                        onClick={() => updateField("sleepType", "night_owl")}
                        className={getCardClass(formData.sleepType === "night_owl")}
                      >
                        <Moon className="h-5 w-5 mb-2 text-indigo-400" />
                        <span className="font-medium text-sm">Night Owl</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-zinc-200 mb-2">
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
                      <label className="block text-sm font-semibold text-zinc-200 mb-2">
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
                    <label className="block text-sm font-semibold text-zinc-200 mb-3">
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
                    <label className="block text-sm font-semibold text-zinc-200 mb-3">
                      Are you actively searching for a room or roommate?
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        onClick={() => updateField("isActiveSeeker", true)}
                        className={getCardClass(formData.isActiveSeeker === true)}
                      >
                        <Home className="h-5 w-5 mb-2 text-indigo-400" />
                        <span className="font-semibold text-sm">Yes, actively looking</span>
                        <p className="text-xs text-zinc-500 mt-1">Specify budget/locations</p>
                      </div>
                      <div
                        onClick={() => updateField("isActiveSeeker", false)}
                        className={getCardClass(formData.isActiveSeeker === false)}
                      >
                        <CheckSquare className="h-5 w-5 mb-2 text-zinc-500" />
                        <span className="font-semibold text-sm">No / Already have a place</span>
                        <p className="text-xs text-zinc-500 mt-1">Just browsing matches</p>
                      </div>
                    </div>
                  </div>

                  {formData.isActiveSeeker && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-6 overflow-hidden pt-2"
                    >
                      {/* Budget inputs */}
                      <div>
                        <label className="block text-sm font-semibold text-zinc-200 mb-2">
                          Monthly Budget Range (USD)
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                              <DollarSign className="h-4 w-4" />
                            </span>
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
                              className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                              required
                            />
                          </div>

                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                              <DollarSign className="h-4 w-4" />
                            </span>
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
                              className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                              required
                            />
                          </div>
                        </div>
                        {formData.budgetMin !== undefined &&
                          formData.budgetMax !== undefined &&
                          formData.budgetMax < formData.budgetMin && (
                            <p className="text-xs text-red-400 mt-1">
                              Max budget must be greater than or equal to Min budget.
                            </p>
                          )}
                      </div>

                      {/* Locations selector tag box */}
                      <div>
                        <label className="block text-sm font-semibold text-zinc-200 mb-2">
                          Preferred Locations
                        </label>
                        <div className="flex gap-2 mb-3">
                          <div className="relative flex-1">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                              <MapPin className="h-4 w-4" />
                            </span>
                            <input
                              type="text"
                              placeholder="Type a location (e.g. Brooklyn, Manhattan)..."
                              value={locInput}
                              onChange={(e) => setLocInput(e.target.value)}
                              onKeyDown={handleKeyDown}
                              className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={addLocation}
                            className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 rounded-lg text-sm transition-all flex items-center gap-1.5"
                          >
                            <Plus className="h-4 w-4" /> Add
                          </button>
                        </div>

                        {/* Location tags list */}
                        {formData.preferredLocations.length > 0 ? (
                          <div className="flex flex-wrap gap-2 p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl">
                            {formData.preferredLocations.map((loc) => (
                              <span
                                key={loc}
                                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-indigo-950/40 border border-indigo-800/50 rounded-full text-indigo-300"
                              >
                                {loc}
                                <button
                                  type="button"
                                  onClick={() => removeLocation(loc)}
                                  className="text-indigo-400 hover:text-white transition-colors"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-zinc-500 italic">
                            No locations added yet. Please specify at least one location.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action buttons footer */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-zinc-800/60">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:bg-zinc-900 hover:text-white transition-all disabled:opacity-50"
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
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isStepValid() || isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
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
