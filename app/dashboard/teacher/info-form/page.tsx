"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaInstagram, FaYoutube, FaTiktok, FaFacebook } from "react-icons/fa";

export default function TeacherInfoForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: session?.user?.email || "",
    sessionFee: "",
    instrument: "",
    contact: "",
    bio: "",
    social: { instagram: "", youtube: "", tiktok: "", facebook: "" },
    preferredContact: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!session?.user?.email) return;

    fetch(`/api/teacher-info?userId=${encodeURIComponent(session?.user?.email || "")}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.exists) {
          setFormData({
            name: data.info.name || "",
            email: data.info.email || session?.user?.email || "",
            sessionFee: data.info.sessionFee || "",
            instrument: data.info.instrument || "",
            contact: data.info.contact || "",
            bio: data.info.bio || "",
            social: {
              instagram: data.info.social?.instagram || "",
              youtube: data.info.social?.youtube || "",
              tiktok: data.info.social?.tiktok || "",
              facebook: data.info.social?.facebook || "",
            },
            preferredContact: data.info.preferredContact || "",
          });
        }
      })
      .catch(() => {});
  }, [session?.user?.email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("social.")) {
      const key = name.split(".")[1];
      setFormData({ ...formData, social: { ...formData.social, [key]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.preferredContact) {
      setFormError("Please select your preferred contact method.");
      return;
    }
    if (!formData.sessionFee || Number(formData.sessionFee) <= 0) {
      setFormError("Please enter a valid per-session fee.");
      return;
    }
    setFormError("");
    setSubmitting(true);
    await fetch("/api/teacher-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, userId: session?.user?.email }),
    });
    setSubmitting(false);
    router.push("/dashboard/teacher");
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans p-8">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-semibold mb-4">Teacher Profile</h1>
        <p className="text-slate-400 mb-8">Fill in your information so students can contact you.</p>

        {/* Full Name */}
        <div className="relative">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Full Name"
            className="peer w-full border-b border-slate-600 bg-transparent p-2 text-white placeholder-transparent focus:outline-none focus:border-[#ff5a00] transition-all"
          />
          <label className="absolute left-2 -top-3 text-slate-400 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 transition-all">
            Full Name
          </label>
        </div>

        {/* Email */}
        <div className="relative">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Email"
            className="peer w-full border-b border-slate-600 bg-transparent p-2 text-white placeholder-transparent focus:outline-none focus:border-[#ff5a00] transition-all"
          />
          <label className="absolute left-2 -top-3 text-slate-400 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 transition-all">
            Email
          </label>
        </div>

        {/* Instrument */}
        <div className="relative">
          <input
            type="text"
            name="instrument"
            value={formData.instrument}
            onChange={handleChange}
            required
            placeholder="Instrument(s)"
            className="peer w-full border-b border-slate-600 bg-transparent p-2 text-white placeholder-transparent focus:outline-none focus:border-[#ff5a00] transition-all"
          />
          <label className="absolute left-2 -top-3 text-slate-400 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 transition-all">
            Instrument(s)
          </label>
        </div>

        {/* Session Fee */}
        <div className="relative">
          <input
            type="number"
            name="sessionFee"
            value={formData.sessionFee as any}
            onChange={handleChange}
            placeholder="Per-session fee (Rs.)"
            className="peer w-full border-b border-slate-600 bg-transparent p-2 text-white placeholder-transparent focus:outline-none focus:border-[#ff5a00] transition-all"
            min={0}
            step={1}
            required
          />
          <label className="absolute left-2 -top-3 text-slate-400 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 transition-all">
            Per-session Fee (Rs.)
          </label>
        </div>

        {/* Contact */}
        <div className="relative">
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
            placeholder="Contact (Phone/Website)"
            className="peer w-full border-b border-slate-600 bg-transparent p-2 text-white placeholder-transparent focus:outline-none focus:border-[#ff5a00] transition-all"
          />
          <label className="absolute left-2 -top-3 text-slate-400 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 transition-all">
            Contact (Phone/Website)
          </label>
        </div>

        {/* Bio */}
        <div className="relative">
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            required
            placeholder="Short Bio"
            className="peer w-full border-b border-slate-600 bg-transparent p-2 text-white placeholder-transparent focus:outline-none focus:border-[#ff5a00] resize-none h-24 transition-all"
          />
          <label className="absolute left-2 -top-3 text-slate-400 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 transition-all">
            Short Bio
          </label>
        </div>

        {/* Social Media */}
        <div>
          <p className="text-white font-medium mb-2">Social Media (Optional)</p>
          <div className="flex flex-wrap gap-4">
            <div className="relative flex items-center flex-1 min-w-[120px]">
              <FaInstagram className="absolute left-2 text-pink-500" />
              <input
                type="text"
                name="social.instagram"
                value={formData.social.instagram}
                onChange={handleChange}
                placeholder="Instagram"
                className="pl-8 w-full border-b border-slate-600 bg-transparent p-2 text-white placeholder-slate-400 focus:outline-none focus:border-[#ff5a00] transition-all"
              />
            </div>
            <div className="relative flex items-center flex-1 min-w-[120px]">
              <FaYoutube className="absolute left-2 text-red-600" />
              <input
                type="text"
                name="social.youtube"
                value={formData.social.youtube}
                onChange={handleChange}
                placeholder="YouTube"
                className="pl-8 w-full border-b border-slate-600 bg-transparent p-2 text-white placeholder-slate-400 focus:outline-none focus:border-[#ff5a00] transition-all"
              />
            </div>
            <div className="relative flex items-center flex-1 min-w-[120px]">
              <FaTiktok className="absolute left-2 text-white" />
              <input
                type="text"
                name="social.tiktok"
                value={formData.social.tiktok}
                onChange={handleChange}
                placeholder="TikTok"
                className="pl-8 w-full border-b border-slate-600 bg-transparent p-2 text-white placeholder-slate-400 focus:outline-none focus:border-[#ff5a00] transition-all"
              />
            </div>
            <div className="relative flex items-center flex-1 min-w-[120px]">
              <FaFacebook className="absolute left-2 text-blue-600" />
              <input
                type="text"
                name="social.facebook"
                value={formData.social.facebook}
                onChange={handleChange}
                placeholder="Facebook"
                className="pl-8 w-full border-b border-slate-600 bg-transparent p-2 text-white placeholder-slate-400 focus:outline-none focus:border-[#ff5a00] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Preferred Contact */}
        <div className="relative">
          <label className="block mb-2 text-white font-medium">Preferred Contact Method</label>
          <div className="flex gap-4">
            <button
              type="button"
              className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-lg border transition-all ${formData.preferredContact === "email" ? "border-[#ff5a00] bg-[#181818]" : "border-slate-700 bg-transparent"}`}
              onClick={() => setFormData({ ...formData, preferredContact: "email" })}
            >
              <span className="material-icons">mail</span>
              Email
            </button>
            <button
              type="button"
              className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-lg border transition-all ${formData.preferredContact === "phone" ? "border-[#ff5a00] bg-[#181818]" : "border-slate-700 bg-transparent"}`}
              onClick={() => setFormData({ ...formData, preferredContact: "phone" })}
            >
              <span className="material-icons">phone</span>
              Phone
            </button>
            <button
              type="button"
              className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-lg border transition-all ${formData.preferredContact === "social" ? "border-[#ff5a00] bg-[#181818]" : "border-slate-700 bg-transparent"}`}
              onClick={() => setFormData({ ...formData, preferredContact: "social" })}
            >
              <span className="material-icons">share</span>
              Social Media
            </button>
          </div>
          {/* Hidden select for form validation */}
          <div className="mt-3 text-sm text-red-400 min-h-[1.25rem]">
            {formError}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-[#1f1f1f] text-white rounded-xl hover:bg-[#ff5a00] hover:text-black font-semibold transition-all"
        >
          {submitting ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}