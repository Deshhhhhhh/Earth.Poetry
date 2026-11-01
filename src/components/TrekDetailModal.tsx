import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Mountain,
  Calendar,
  MapPin,
  Thermometer,
  Route,
  Users,
  Clock,
  Phone,
  Download,
  ChevronDown,
  ChevronUp,
  Check,
  AlertTriangle,
  Shield,
  Backpack,
  Info,
  Star,
  Sun,
  Snowflake,
  Leaf,
} from "lucide-react";
import { Trek } from "../types";
import jsPDF from "jspdf";

interface TrekDetailModalProps {
  isDarkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  trek: Trek | null;
}

export default function TrekDetailModal({
  isDarkMode,
  isOpen,
  onClose,
  trek,
}: TrekDetailModalProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "itinerary" | "inclusions" | "safety" | "packing"
  >("itinerary");
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const [allDaysExpanded, setAllDaysExpanded] = useState<boolean>(true);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setIsScrolled(false);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
  }, [isOpen]);

  if (!trek) return null;

  const allImages = [trek.imageUrl, ...trek.galleryImages];

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty.toLowerCase().includes("easy") && !difficulty.toLowerCase().includes("moderate")) {
      return "text-emerald-400 bg-emerald-500/20 border-emerald-400/30";
    } else if (difficulty.toLowerCase().includes("moderate")) {
      return "text-sky-400 bg-sky-500/20 border-sky-400/30";
    }
    return "text-amber-400 bg-amber-500/20 border-amber-400/30";
  };

  const downloadItineraryPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(trek.name, pageWidth / 2, yPos, { align: "center" });
    yPos += 8;

    doc.setFontSize(12);
    doc.setFont("helvetica", "italic");
    doc.text(trek.tagline, pageWidth / 2, yPos, { align: "center" });
    yPos += 15;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Trek Snapshot", 14, yPos);
    yPos += 8;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const snapshotItems = [
      ["Duration:", trek.duration],
      ["Difficulty:", trek.difficulty],
      ["Max Altitude:", trek.maxAltitude],
      ["Trek Distance:", trek.trekDistance],
      ["Best Season:", trek.bestSeason],
      ["Location:", trek.location],
      ["Start/End:", trek.startEnd],
      ["Reach By:", trek.reachBy],
      ["Stay:", trek.stay],
      ["Ideal For:", trek.idealFor],
    ];

    snapshotItems.forEach(([label, value]) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.text(label, 14, yPos);
      doc.setFont("helvetica", "normal");
      const valLines = doc.splitTextToSize(value, pageWidth - 60);
      doc.text(valLines, 45, yPos);
      yPos += 5 * valLines.length + 1;
    });

    yPos += 8;
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Highlights", 14, yPos);
    yPos += 7;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    trek.highlights.forEach((h) => {
      if (yPos > 275) {
        doc.addPage();
        yPos = 20;
      }
      const lines = doc.splitTextToSize(`• ${h}`, pageWidth - 28);
      doc.text(lines, 14, yPos);
      yPos += 4.5 * lines.length;
    });

    yPos += 8;
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Day-wise Itinerary", 14, yPos);
    yPos += 8;

    trek.itinerary.forEach((day) => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`Day ${day.day}: ${day.title}`, 14, yPos);
      yPos += 5;

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      const meta = [
        `Altitude: ${day.altitude}`,
        `Trek/Drive: ${day.trekDrive}`,
        `Meals: ${day.meals}`,
        `Stay: ${day.stay || "N/A"}`,
      ];
      meta.forEach((m) => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(m, 18, yPos);
        yPos += 4;
      });

      yPos += 2;
      day.activities.forEach((a) => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        const lines = doc.splitTextToSize(`- ${a}`, pageWidth - 36);
        doc.text(lines, 20, yPos);
        yPos += 4 * lines.length;
      });
      yPos += 4;
    });

    yPos += 4;
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Pricing & Contact", 14, yPos);
    yPos += 7;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Starting Price: Rs. 10,000 (Negotiable over call)", 14, yPos);
    yPos += 5;
    doc.text("Contact: +91 91402 80943 (Call or WhatsApp for custom pricing)", 14, yPos);
    yPos += 8;

    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Inclusions", 14, yPos);
    yPos += 7;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    trek.inclusions.forEach((inc) => {
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      const lines = doc.splitTextToSize(`+ ${inc}`, pageWidth - 28);
      doc.text(lines, 14, yPos);
      yPos += 4 * lines.length;
    });

    doc.save(`${trek.name.replace(/\s+/g, "_")}_Itinerary_Earth_Poetry.pdf`);
  };

  const TABS = [
    { id: "overview", label: "Overview", icon: Mountain },
    { id: "itinerary", label: "Day Plan", icon: Calendar },
    { id: "inclusions", label: "In/Exclusions", icon: Check },
    { id: "safety", label: "Safety", icon: Shield },
    { id: "packing", label: "Packing", icon: Backpack },
  ] as const;

  const toggleAllDays = () => {
    if (allDaysExpanded) {
      setExpandedDay(null);
      setAllDaysExpanded(false);
    } else {
      setExpandedDay(0);
      setAllDaysExpanded(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`fixed inset-0 z-50 ${isDarkMode ? "bg-slate-950/85" : "bg-gray-900/75"} backdrop-blur-sm`}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed inset-0 z-50 sm:inset-x-2 sm:inset-y-2 lg:inset-x-16 lg:inset-y-4 flex items-stretch justify-center p-0 sm:p-0 pointer-events-none`}
          >
            <div
              className={`w-full h-full sm:h-full sm:max-h-full sm:rounded-3xl overflow-hidden pointer-events-auto flex flex-col ${
                isDarkMode
                  ? "bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-white/10"
                  : "bg-gradient-to-br from-white via-gray-50 to-white border border-gray-200"
              } shadow-2xl backdrop-blur-3xl`}
            >

              {/* ============= REGION 1: HERO HEADER (Collapses on scroll) ============= */}
              <div
                className={`relative overflow-hidden transition-all duration-500 ease-out ${
                  isScrolled ? "h-0 shrink-0 opacity-0" : "h-40 sm:h-52 md:h-60 shrink-0 opacity-100"
                }`}
              >
                <img
                  src={allImages[galleryIndex]}
                  alt={trek.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className={`absolute inset-0 ${isDarkMode ? "bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/30" : "bg-gradient-to-t from-gray-900/85 via-gray-900/40 to-gray-900/20"}`} />

                {/* Close */}
                <button
                  onClick={onClose}
                  className={`absolute top-3 right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isDarkMode
                      ? "bg-slate-900/70 border border-white/10 text-white hover:bg-slate-800 hover:border-emerald-400/50"
                      : "bg-white/85 border border-gray-200 text-gray-800 hover:bg-white hover:border-emerald-500/50"
                  } backdrop-blur-md`}
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Gallery thumbnails */}
                <div className="absolute bottom-3 left-3 right-16 z-10 flex gap-2 overflow-x-auto pb-0.5">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setGalleryIndex(idx)}
                      className={`w-14 h-10 sm:w-20 sm:h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        galleryIndex === idx
                          ? "border-emerald-400 scale-105 shadow-lg"
                          : isDarkMode ? "border-white/10 opacity-60 hover:opacity-100" : "border-white/30 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        referrerPolicy="no-referrer"
                        alt=""
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    </button>
                  ))}
                </div>

                {/* Title overlay */}
                <div className="absolute top-3 left-3 right-16 sm:left-4 sm:right-20 z-10">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider border ${getDifficultyColor(trek.difficulty)} backdrop-blur-md`}>
                      {trek.difficulty}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider border backdrop-blur-md ${isDarkMode ? "text-sky-300 bg-sky-500/20 border-sky-400/30" : "text-sky-700 bg-sky-100 border-sky-300"}`}>
                      {trek.duration}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider border backdrop-blur-md ${isDarkMode ? "text-violet-300 bg-violet-500/20 border-violet-400/30" : "text-violet-700 bg-violet-100 border-violet-300"}`}>
                      Max {trek.maxAltitude.split(" ")[0]}m
                    </span>
                  </div>
                  <h2 className={`font-serif text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight ${isDarkMode ? "text-white" : "text-white"} drop-shadow-lg`}>
                    {trek.name}
                  </h2>
                  <p className={`font-sans text-[11px] sm:text-xs italic mt-0.5 ${isDarkMode ? "text-gray-200" : "text-gray-100"} drop-shadow`}>
                    {trek.tagline} • {trek.location}
                  </p>
                </div>
              </div>

              {/* ============= REGION 2: TABS + SCROLLABLE CONTENT ============= */}
              <div className="flex-1 flex flex-col min-h-0">

                {/* Tabs bar (sticky top of scroll area) */}
                <div className={`shrink-0 px-4 sm:px-6 py-3 border-b ${isDarkMode ? "border-white/5 bg-slate-950/60" : "border-gray-200 bg-white/70"} backdrop-blur-md sticky`}>
                  <div className="flex gap-1 sm:gap-2 overflow-x-auto">
                    {TABS.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                            isActive
                              ? isDarkMode
                                ? "bg-gradient-to-r from-emerald-500/25 to-sky-500/25 text-emerald-300 border border-emerald-400/30 shadow-lg shadow-emerald-500/5"
                                : "bg-gradient-to-r from-emerald-50 to-sky-50 text-emerald-700 border border-emerald-300"
                              : isDarkMode
                              ? "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Scrollable body */}
                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
                  {activeTab === "overview" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className={`font-serif text-lg font-bold mb-3 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          <Star className={`w-4 h-4 ${isDarkMode ? "text-amber-400" : "text-amber-500"}`} />
                          Trek Highlights
                        </h3>
                        <div className="grid gap-2">
                          {trek.highlights.map((h, i) => (
                            <div
                              key={i}
                              className={`p-3 rounded-xl flex items-start gap-3 ${isDarkMode ? "bg-white/[0.03] border border-white/5" : "bg-gray-50 border border-gray-100"}`}
                            >
                              <Leaf className={`w-4 h-4 mt-0.5 shrink-0 ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`} />
                              <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{h}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className={`font-serif text-lg font-bold mb-3 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          <Info className={`w-4 h-4 ${isDarkMode ? "text-sky-400" : "text-sky-600"}`} />
                          Complete Trek Details
                        </h3>
                        <div className={`rounded-2xl overflow-hidden border ${isDarkMode ? "border-white/10" : "border-gray-200"}`}>
                          {[
                            { icon: MapPin, label: "Location", value: trek.location },
                            { icon: Calendar, label: "Total Duration", value: trek.duration },
                            { icon: Thermometer, label: "Maximum Altitude", value: trek.maxAltitude },
                            { icon: Route, label: "Trek Distance", value: trek.trekDistance },
                            { icon: Sun, label: "Best Season", value: trek.bestSeason },
                            { icon: MapPin, label: "Start / End Point", value: trek.startEnd },
                            { icon: Route, label: "How To Reach", value: trek.reachBy },
                            { icon: Users, label: "Ideal For", value: trek.idealFor },
                            { icon: Snowflake, label: "Stay Arrangements", value: trek.stay },
                          ].map((row, i) => {
                            const Icon = row.icon;
                            return (
                              <div
                                key={i}
                                className={`flex items-start gap-3 p-3 sm:p-4 ${
                                  i !== 8 ? (isDarkMode ? "border-b border-white/5" : "border-b border-gray-100") : ""
                                } ${isDarkMode ? "hover:bg-white/[0.02]" : "hover:bg-gray-50"} transition-colors`}
                              >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? "bg-white/5" : "bg-gray-100"}`}>
                                  <Icon className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`font-mono text-[9px] uppercase tracking-wider ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                                    {row.label}
                                  </p>
                                  <p className={`text-xs sm:text-sm font-semibold mt-0.5 leading-relaxed ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{row.value}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "itinerary" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-serif text-lg font-bold flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          <Calendar className={`w-4 h-4 ${isDarkMode ? "text-violet-400" : "text-violet-600"}`} />
                          Day-by-Day Journey
                        </h3>
                        <button
                          onClick={toggleAllDays}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                            isDarkMode
                              ? "bg-white/5 text-gray-300 border-white/10 hover:border-emerald-400/40 hover:text-emerald-300"
                              : "bg-gray-50 text-gray-700 border-gray-200 hover:border-emerald-400 hover:text-emerald-700"
                          }`}
                        >
                          {allDaysExpanded ? "Collapse All" : "Expand All"}
                        </button>
                      </div>

                      {trek.itinerary.map((day, idx) => {
                        const isExpanded = allDaysExpanded || expandedDay === idx;
                        return (
                          <div
                            key={idx}
                            className={`rounded-2xl overflow-hidden border transition-all ${
                              isDarkMode
                                ? isExpanded
                                  ? "border-emerald-400/30 bg-white/[0.03]"
                                  : "border-white/10 hover:border-white/20"
                                : isExpanded
                                ? "border-emerald-300 bg-emerald-50/30"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <button
                              onClick={() => {
                                if (allDaysExpanded) {
                                  setAllDaysExpanded(false);
                                  setExpandedDay(idx === 0 ? 1 : 0);
                                } else {
                                  setExpandedDay(isExpanded ? null : idx);
                                }
                              }}
                              className="w-full p-4 flex items-center justify-between text-left"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-serif font-extrabold text-lg ${
                                  isDarkMode
                                    ? "bg-gradient-to-br from-emerald-500/25 to-sky-500/25 border border-emerald-400/30 text-emerald-300"
                                    : "bg-gradient-to-br from-emerald-100 to-sky-100 border border-emerald-300 text-emerald-700"
                                }`}>
                                  {day.day}
                                </div>
                                <div className="min-w-0">
                                  <h4 className={`font-sans font-bold text-sm sm:text-base ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                    {day.title}
                                  </h4>
                                  <p className={`font-mono text-[10px] sm:text-[11px] mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${isDarkMode ? "bg-violet-500/10 text-violet-300 border border-violet-400/20" : "bg-violet-50 text-violet-700 border border-violet-200"}`}>
                                      <Mountain className="w-3 h-3" /> {day.altitude}
                                    </span>
                                    <span>🍽 {day.meals}</span>
                                    {day.stay && <span>🏨 {day.stay}</span>}
                                  </p>
                                </div>
                              </div>
                              {isExpanded ? (
                                <ChevronUp className={`w-5 h-5 shrink-0 ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`} />
                              ) : (
                                <ChevronDown className={`w-5 h-5 shrink-0 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                              )}
                            </button>

                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.div
                                  initial={false}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="overflow-hidden"
                                >
                                  <div className={`px-4 pb-5 space-y-3 ${isDarkMode ? "border-t border-white/5" : "border-t border-gray-100"} pt-4`}>
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-medium ${isDarkMode ? "bg-sky-500/10 text-sky-300 border border-sky-400/20" : "bg-sky-50 text-sky-700 border border-sky-200"}`}>
                                      <Route className="w-3.5 h-3.5" />
                                      {day.trekDrive}
                                    </div>

                                    <div className="space-y-2">
                                      {day.activities.map((act, ai) => (
                                        <div
                                          key={ai}
                                          className={`flex items-start gap-2.5 p-3 rounded-lg ${isDarkMode ? "bg-white/[0.03]" : "bg-gray-50"}`}
                                        >
                                          <div className={`w-5 h-5 rounded-full mt-0.5 shrink-0 flex items-center justify-center text-[10px] font-bold font-serif ${isDarkMode ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30" : "bg-emerald-100 text-emerald-700 border border-emerald-200"}`}>
                                            {ai + 1}
                                          </div>
                                          <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{act}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}

                  {activeTab === "inclusions" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid md:grid-cols-2 gap-4"
                    >
                      <div className={`rounded-2xl p-5 border ${isDarkMode ? "bg-emerald-500/[0.05] border-emerald-400/20" : "bg-emerald-50/60 border-emerald-200"}`}>
                        <h3 className={`font-serif text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-emerald-500/20" : "bg-emerald-100"}`}>
                            <Check className={`w-4 h-4 ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`} />
                          </div>
                          Inclusions
                        </h3>
                        <div className="space-y-2.5">
                          {trek.inclusions.map((inc, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <Check className={`w-4 h-4 mt-0.5 shrink-0 ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`} />
                              <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{inc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className={`rounded-2xl p-5 border ${isDarkMode ? "bg-rose-500/[0.05] border-rose-400/20" : "bg-rose-50/60 border-rose-200"}`}>
                        <h3 className={`font-serif text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-rose-500/20" : "bg-rose-100"}`}>
                            <AlertTriangle className={`w-4 h-4 ${isDarkMode ? "text-rose-400" : "text-rose-600"}`} />
                          </div>
                          Exclusions
                        </h3>
                        <div className="space-y-2.5">
                          {trek.exclusions.map((exc, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${isDarkMode ? "text-rose-400" : "text-rose-600"}`} />
                              <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{exc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className={`md:col-span-2 rounded-2xl p-5 border ${isDarkMode ? "bg-amber-500/[0.05] border-amber-400/20" : "bg-amber-50/60 border-amber-200"}`}>
                        <h3 className={`font-serif text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-amber-500/20" : "bg-amber-100"}`}>
                            <Info className={`w-4 h-4 ${isDarkMode ? "text-amber-400" : "text-amber-600"}`} />
                          </div>
                          Important Notes
                        </h3>
                        <div className="space-y-2.5">
                          {trek.importantNotes.map((note, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <Info className={`w-4 h-4 mt-0.5 shrink-0 ${isDarkMode ? "text-amber-400" : "text-amber-600"}`} />
                              <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{note}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "safety" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className={`rounded-2xl p-5 sm:p-6 border ${isDarkMode ? "bg-sky-500/[0.05] border-sky-400/20" : "bg-sky-50/60 border-sky-200"}`}>
                        <h3 className={`font-serif text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-sky-500/20" : "bg-sky-100"}`}>
                            <Shield className={`w-4 h-4 ${isDarkMode ? "text-sky-400" : "text-sky-600"}`} />
                          </div>
                          Safety & Security Standards
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {trek.safetyStandards.map((std, i) => (
                            <div
                              key={i}
                              className={`p-3 sm:p-4 rounded-xl flex items-start gap-2.5 ${isDarkMode ? "bg-white/[0.03] border border-white/5" : "bg-white border border-gray-100"}`}
                            >
                              <Shield className={`w-4 h-4 mt-0.5 shrink-0 ${isDarkMode ? "text-sky-400" : "text-sky-600"}`} />
                              <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{std}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "packing" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className={`rounded-2xl p-5 sm:p-6 border ${isDarkMode ? "bg-violet-500/[0.05] border-violet-400/20" : "bg-violet-50/60 border-violet-200"}`}>
                        <h3 className={`font-serif text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-violet-500/20" : "bg-violet-100"}`}>
                            <Backpack className={`w-4 h-4 ${isDarkMode ? "text-violet-400" : "text-violet-600"}`} />
                          </div>
                          What to Carry
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-2.5">
                          {trek.whatToCarry.map((item, i) => (
                            <div
                              key={i}
                              className={`p-3 rounded-xl flex items-center gap-3 ${isDarkMode ? "bg-white/[0.03] border border-white/5" : "bg-white border border-gray-100"}`}
                            >
                              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isDarkMode ? "bg-violet-400" : "bg-violet-500"}`} />
                              <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="h-2" />
                </div>
              </div>

              {/* ============= REGION 3: PRICING + CTA FOOTER (FIXED, OUTSIDE SCROLL) ============= */}
              <div className={`shrink-0 px-4 sm:px-6 py-3.5 sm:py-4 border-t ${
                isDarkMode
                  ? "bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-white/10"
                  : "bg-gradient-to-r from-white via-gray-50 to-white border-gray-200"
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 border-2 ${
                      isDarkMode
                        ? "bg-gradient-to-br from-emerald-500/20 to-sky-500/20 border-emerald-400/40"
                        : "bg-gradient-to-br from-emerald-50 to-sky-50 border-emerald-300"
                    }`}>
                      <span className={`font-mono text-[8px] uppercase tracking-widest leading-none ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        From
                      </span>
                      <span className={`font-serif text-xl sm:text-2xl font-extrabold leading-none mt-0.5 ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                        ₹10K
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className={`font-serif text-lg sm:text-xl font-extrabold leading-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        ₹10,000 <span className={`font-mono text-[10px] sm:text-xs font-semibold ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>/person</span>
                      </p>
                      <p className={`text-[11px] sm:text-xs mt-0.5 flex items-center gap-1.5 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        <Phone className="w-3 h-3 shrink-0" />
                        <span>Price negotiable over a personal call</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={downloadItineraryPDF}
                      className={`flex-1 sm:flex-none px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl font-sans text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                        isDarkMode
                          ? "bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:border-emerald-400/40 hover:text-emerald-300"
                          : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-emerald-400 hover:text-emerald-700"
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Download PDF</span>
                      <span className="sm:hidden">PDF</span>
                    </button>

                    <a
                      href="tel:+919140280943"
                      className="flex-[2] sm:flex-none px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl font-sans text-[11px] sm:text-xs font-extrabold tracking-wider uppercase text-white gloss-btn-blue flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg hover:shadow-xl transition-all"
                    >
                      <Phone className="w-4 h-4" />
                      Call Now
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
