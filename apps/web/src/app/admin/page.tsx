"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
import { TOKEN_KEY } from "@/lib/auth";
import {
  getMe,
  getAdminData,
  updateAdminWorkspace,
  createAdminProject,
  updateAdminProject,
  deleteAdminProject,
  createAdminService,
  updateAdminService,
  deleteAdminService,
  createAdminSkill,
  updateAdminSkill,
  deleteAdminSkill,
  createAdminBlog,
  updateAdminBlog,
  deleteAdminBlog,
  createAdminTechnology,
  updateAdminTechnology,
  deleteAdminTechnology,
  uploadAdminMedia,
  type SafeUser,
  type AdminPayload,
} from "@/lib/api";

type TabType = "general" | "projects" | "services" | "skills" | "blogs" | "technologies";

interface DeleteConfirm {
  id: string;
  type: TabType;
  name: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<SafeUser | null>(null);
  const [adminData, setAdminData] = useState<AdminPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Delete confirmation modal state
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirm | null>(null);

  // Modal / Editing state
  const [editingItem, setEditingItem] = useState<{ type: TabType; data: any } | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [settingsForm, setSettingsForm] = useState({
    name: "",
    tagline: "",
    description: "",
    logo: "",
    aboutExpertise: "",
    aboutWhyChooseMe: "",
  });

  // Entity form states — default status is "draft" (unlisted)
  const [projectForm, setProjectForm] = useState({
    title: "",
    shortDescription: "",
    description: "",
    content: "",
    thumbnail: "",
    liveUrl: "",
    githubUrl: "",
    isFeatured: false,
    status: "draft",
  });

  const [serviceForm, setServiceForm] = useState({
    title: "",
    description: "",
    shortDescription: "",
    price: "",
    status: "draft",
    icon: "",
  });

  const [skillForm, setSkillForm] = useState({
    name: "",
    category: "",
    proficiency: 80,
    status: "draft",
    icon: "",
  });

  const [blogForm, setBlogForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    readTimeMinutes: 5,
    status: "draft",
    coverImage: "",
  });

  const [technologyForm, setTechnologyForm] = useState({
    name: "",
    category: "",
    icon: "",
    website: "",
    status: "draft",
  });

  useEffect(() => {
    const activeToken = localStorage.getItem(TOKEN_KEY);
    if (!activeToken) {
      router.replace("/admin/login");
      return;
    }
    setToken(activeToken);

    getMe(activeToken)
      .then((me) => {
        setUser(me);
        return getAdminData(activeToken);
      })
      .then((data) => {
        setAdminData(data);
        setSettingsForm({
          name: data.workspace?.name || "",
          tagline: data.site?.tagline || "",
          description: data.workspace?.description || "",
          logo: data.site?.logo || data.workspace?.logo || "",
          aboutExpertise: data.site?.aboutExpertise || "",
          aboutWhyChooseMe: data.site?.aboutWhyChooseMe || "",
        });
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        router.replace("/admin/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    router.push("/admin/login");
  }

  function showMessage(text: string, type: "success" | "error") {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  }

  const reloadData = async () => {
    if (!token) return;
    try {
      const data = await getAdminData(token);
      setAdminData(data);
    } catch (err: any) {
      showMessage(err.message || "Failed to reload data", "error");
    }
  };

  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onUploadSuccess: (url: string) => void,
    fieldName: string
  ) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    try {
      setUploadingField(fieldName);
      const res = await uploadAdminMedia(token, file);
      onUploadSuccess(res.url);
      showMessage("Image uploaded successfully!", "success");
    } catch (err: any) {
      showMessage(err.message || "Failed to upload image", "error");
    } finally {
      setUploadingField(null);
    }
  };

  // Toggle list/unlist for an item
  const handleToggleListing = async (item: any, type: TabType) => {
    if (!token) return;
    const newStatus = item.status === "published" ? "draft" : "published";
    try {
      setLoading(true);
      if (type === "projects") {
        await updateAdminProject(token, item._id, { ...item, status: newStatus });
      } else if (type === "services") {
        await updateAdminService(token, item._id, { ...item, status: newStatus });
      } else if (type === "skills") {
        await updateAdminSkill(token, item._id, { ...item, status: newStatus });
      } else if (type === "blogs") {
        await updateAdminBlog(token, item._id, { ...item, status: newStatus });
      } else if (type === "technologies") {
        await updateAdminTechnology(token, item._id, { ...item, status: newStatus });
      }
      showMessage(newStatus === "published" ? "Item listed successfully!" : "Item unlisted successfully!", "success");
      await reloadData();
    } catch (err: any) {
      showMessage(err.message || "Failed to update listing status", "error");
    } finally {
      setLoading(false);
    }
  };

  // Workspace Settings submit handler
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      setLoading(true);
      await updateAdminWorkspace(token, settingsForm);
      await reloadData();
      showMessage("General settings updated successfully!", "success");
    } catch (err: any) {
      showMessage(err.message || "Update settings failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // Generic Create / Update handler
  const handleEntitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      setLoading(true);
      if (activeTab === "projects") {
        if (isAddingNew) {
          await createAdminProject(token, projectForm);
          showMessage("Project created successfully!", "success");
        } else if (editingItem) {
          await updateAdminProject(token, editingItem.data._id, projectForm);
          showMessage("Project updated successfully!", "success");
        }
      } else if (activeTab === "services") {
        if (isAddingNew) {
          await createAdminService(token, serviceForm);
          showMessage("Service created successfully!", "success");
        } else if (editingItem) {
          await updateAdminService(token, editingItem.data._id, serviceForm);
          showMessage("Service updated successfully!", "success");
        }
      } else if (activeTab === "skills") {
        if (isAddingNew) {
          await createAdminSkill(token, skillForm);
          showMessage("Skill created successfully!", "success");
        } else if (editingItem) {
          await updateAdminSkill(token, editingItem.data._id, skillForm);
          showMessage("Skill updated successfully!", "success");
        }
      } else if (activeTab === "blogs") {
        if (isAddingNew) {
          await createAdminBlog(token, blogForm);
          showMessage("Blog post created successfully!", "success");
        } else if (editingItem) {
          await updateAdminBlog(token, editingItem.data._id, blogForm);
          showMessage("Blog post updated successfully!", "success");
        }
      } else if (activeTab === "technologies") {
        if (isAddingNew) {
          await createAdminTechnology(token, technologyForm);
          showMessage("Technology/Tool created successfully!", "success");
        } else if (editingItem) {
          await updateAdminTechnology(token, editingItem.data._id, technologyForm);
          showMessage("Technology/Tool updated successfully!", "success");
        }
      }

      await reloadData();
      closeModal();
    } catch (err: any) {
      showMessage(err.message || "Action failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // Show delete confirmation modal
  const confirmDelete = (id: string, type: TabType, name: string) => {
    setDeleteConfirm({ id, type, name });
  };

  // Execute deletion after confirmation
  const handleDelete = async () => {
    if (!token || !deleteConfirm) return;
    const { id, type } = deleteConfirm;

    try {
      setLoading(true);
      setDeleteConfirm(null);
      if (type === "projects") {
        await deleteAdminProject(token, id);
      } else if (type === "services") {
        await deleteAdminService(token, id);
      } else if (type === "skills") {
        await deleteAdminSkill(token, id);
      } else if (type === "blogs") {
        await deleteAdminBlog(token, id);
      } else if (type === "technologies") {
        await deleteAdminTechnology(token, id);
      }
      showMessage("Item deleted successfully!", "success");
      await reloadData();
    } catch (err: any) {
      showMessage(err.message || "Failed to delete item", "error");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (item: any, type: TabType) => {
    setEditingItem({ type, data: item });
    setIsAddingNew(false);

    if (type === "projects") {
      setProjectForm({
        title: item.title || "",
        shortDescription: item.shortDescription || "",
        description: item.description || "",
        content: item.content || "",
        thumbnail: item.thumbnail || "",
        liveUrl: item.liveUrl || "",
        githubUrl: item.githubUrl || "",
        isFeatured: !!item.isFeatured,
        status: item.status || "draft",
      });
    } else if (type === "services") {
      setServiceForm({
        title: item.title || "",
        description: item.description || "",
        shortDescription: item.shortDescription || "",
        price: item.price || "",
        status: item.status || "draft",
        icon: item.icon || "",
      });
    } else if (type === "skills") {
      setSkillForm({
        name: item.name || "",
        category: item.category || "",
        proficiency: item.proficiency || 80,
        status: item.status || "draft",
        icon: item.icon || "",
      });
    } else if (type === "blogs") {
      setBlogForm({
        title: item.title || "",
        excerpt: item.excerpt || "",
        content: item.content || "",
        readTimeMinutes: item.readTimeMinutes || 5,
        status: item.status || "draft",
        coverImage: item.coverImage || "",
      });
    } else if (type === "technologies") {
      setTechnologyForm({
        name: item.name || "",
        category: item.category || "",
        icon: item.icon || "",
        website: item.website || "",
        status: item.status || "draft",
      });
    }
  };

  const openAddNewModal = () => {
    setIsAddingNew(true);
    setEditingItem(null);

    // Reset forms — default to draft (unlisted)
    setProjectForm({
      title: "",
      shortDescription: "",
      description: "",
      content: "",
      thumbnail: "",
      liveUrl: "",
      githubUrl: "",
      isFeatured: false,
      status: "draft",
    });
    setServiceForm({
      title: "",
      description: "",
      shortDescription: "",
      price: "",
      status: "draft",
      icon: "",
    });
    setSkillForm({
      name: "",
      category: "",
      proficiency: 80,
      status: "draft",
      icon: "",
    });
    setBlogForm({
      title: "",
      excerpt: "",
      content: "",
      readTimeMinutes: 5,
      status: "draft",
      coverImage: "",
    });
    setTechnologyForm({
      name: "",
      category: "",
      icon: "",
      website: "",
      status: "draft",
    });
  };

  const closeModal = () => {
    setEditingItem(null);
    setIsAddingNew(false);
  };

  if (loading && !adminData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2563eb] border-t-transparent" />
          <p className="text-sm font-semibold tracking-wider">Loading CMS Admin...</p>
        </div>
      </div>
    );
  }

  if (!user || !adminData) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      
      {/* Toast Alert */}
      {statusMessage && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl border shadow-xl flex items-center gap-2 max-w-sm transition-all duration-300 animate-slide-in ${
          statusMessage.type === "success" 
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
            : "bg-red-500/10 border-red-500/30 text-red-400"
        }`}>
          <span>{statusMessage.type === "success" ? "✓" : "⚠"}</span>
          <p className="text-sm font-medium">{statusMessage.text}</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[28px] p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-red-950/30 border border-red-900/50 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-red-400">
                  <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Delete Item</h3>
                <p className="text-zinc-400 text-sm mt-0.5">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed mb-8">
              Are you sure you want to delete <span className="text-white font-bold">"{deleteConfirm.name}"</span>? This will permanently remove it from your portfolio.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-5 py-3 text-sm font-bold bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-2xl text-zinc-300 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-5 py-3 text-sm font-bold bg-red-600 hover:bg-red-500 rounded-2xl text-white transition-all shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563eb] text-white font-bold text-sm">
              {"</>"}
            </span>
            <div>
              <p className="text-[10px] font-bold text-[#2563eb] tracking-widest uppercase">Admin Dashboard</p>
              <h1 className="text-base font-bold text-white leading-tight">Pradeep Sahoo Studio CMS</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="text-xs font-semibold text-zinc-400 hover:text-white transition">
              View Website →
            </Link>
            <button onClick={logout} className="rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800 px-4 py-2 text-xs font-bold text-zinc-300 hover:text-white transition-all">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Sidebar */}
          <div className="col-span-1 lg:col-span-3 flex flex-col gap-2">
            {[
              { id: "general", label: "General Settings" },
              { id: "projects", label: "Manage Projects" },
              { id: "services", label: "Manage Services" },
              { id: "skills", label: "Manage Skills" },
              { id: "blogs", label: "Manage Blog Posts" },
              { id: "technologies", label: "Manage Premium Tools" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as TabType);
                  closeModal();
                }}
                className={`w-full text-left px-5 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-[#2563eb] text-white shadow-lg shadow-blue-600/20"
                    : "bg-zinc-900/40 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-900"
                }`}
              >
                {tab.label}
              </button>
            ))}

            <div className="mt-8 p-5 rounded-2xl bg-zinc-900/30 border border-zinc-900 text-center">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">CMS System Info</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-zinc-400 font-semibold">Connected to API</span>
              </div>
              <p className="text-[10px] text-zinc-600 mt-1">http://localhost:5001</p>
            </div>
          </div>

          {/* Edit Screen Content Area */}
          <div className="col-span-1 lg:col-span-9 bg-zinc-900/25 border border-zinc-900 rounded-[28px] p-6 sm:p-8 min-h-[500px]">
            
            {/* GENERAL SETTINGS TAB */}
            {activeTab === "general" && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">General & About Info</h2>
                  <p className="text-zinc-500 text-sm mt-1">Update the profile card details, tagline, and homepage descriptions.</p>
                </div>
                <form onSubmit={handleSettingsSubmit} className="flex flex-col gap-6">
                  <div>
                    <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2.5 block">Display Name</label>
                    <input
                      type="text"
                      value={settingsForm.name}
                      onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                      className="w-full bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2.5 block">Tagline / Headline</label>
                    <input
                      type="text"
                      value={settingsForm.tagline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                      className="w-full bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2.5 block">About Description (Left Column Profile Card)</label>
                    <textarea
                      rows={5}
                      value={settingsForm.description}
                      onChange={(e) => setSettingsForm({ ...settingsForm, description: e.target.value })}
                      className="w-full bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition duration-300 resize-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2.5 block">Expertise & Work (About Page)</label>
                    <textarea
                      rows={4}
                      value={settingsForm.aboutExpertise}
                      onChange={(e) => setSettingsForm({ ...settingsForm, aboutExpertise: e.target.value })}
                      className="w-full bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition duration-300"
                      placeholder="e.g. With over 3+ years of experience, I specialize in crafting clean interfaces..."
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2.5 block">Why Choose Me (About Page)</label>
                    <textarea
                      rows={4}
                      value={settingsForm.aboutWhyChooseMe}
                      onChange={(e) => setSettingsForm({ ...settingsForm, aboutWhyChooseMe: e.target.value })}
                      className="w-full bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition duration-300"
                      placeholder="e.g. I focus on creating digital experiences that load fast..."
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2.5 block">Profile Photo (via Cloudinary)</label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {settingsForm.logo && (
                        <div className="h-20 w-20 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 flex-shrink-0">
                          <img src={settingsForm.logo} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                      )}
                      <div className="flex-grow w-full">
                        <input
                          type="text"
                          value={settingsForm.logo}
                          onChange={(e) => setSettingsForm({ ...settingsForm, logo: e.target.value })}
                          placeholder="Image URL or upload file..."
                          className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition mb-2"
                        />
                        <div className="relative flex items-center justify-center border border-dashed border-zinc-800 hover:border-[#2563eb] rounded-2xl p-4 cursor-pointer text-zinc-400 hover:text-zinc-200 transition duration-300">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, (url) => setSettingsForm({ ...settingsForm, logo: url }), "profilePhoto")}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <span className="text-xs font-bold uppercase tracking-wider">
                            {uploadingField === "profilePhoto" ? "Uploading to Cloudinary..." : "Choose Image to Upload"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="bg-[#2563eb] hover:bg-blue-600 text-white font-extrabold px-8 py-4 rounded-2xl text-sm transition-all duration-300 hover:scale-103 shadow-md hover:shadow-lg self-start cursor-pointer">
                    Save General Settings
                  </button>
                </form>
              </div>
            )}

            {/* PROJECTS MANAGEMENT TAB */}
            {activeTab === "projects" && !isAddingNew && !editingItem && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Projects</h2>
                    <p className="text-zinc-500 text-sm mt-1">Manage project records and showcase templates.</p>
                  </div>
                  <button onClick={openAddNewModal} className="bg-[#2563eb] hover:bg-blue-600 text-white font-extrabold px-5 py-3 rounded-2xl text-xs uppercase tracking-wider transition-all duration-300 hover:scale-103 cursor-pointer">
                    Add Project
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  {adminData.projects.map((proj) => (
                    <div key={proj._id} className="flex items-center justify-between p-5 rounded-2xl border border-zinc-900 bg-zinc-950/20 hover:border-zinc-800 transition duration-300">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex-shrink-0">
                          <img src={proj.thumbnail || "/placeholder.png"} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-white flex items-center gap-2">
                            {proj.title}
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${proj.status === "published" ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/60" : "bg-zinc-900 text-zinc-500 border border-zinc-800"}`}>
                              {proj.status === "published" ? "Listed" : "Unlisted"}
                            </span>
                          </h4>
                          <p className="text-xs text-zinc-500 mt-0.5">{proj.shortDescription || "No short description"}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleListing(proj, "projects")}
                          className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition ${
                            proj.status === "published"
                              ? "bg-amber-950/20 hover:bg-amber-950/40 border-amber-900/40 text-amber-400 hover:border-amber-700"
                              : "bg-emerald-950/20 hover:bg-emerald-950/40 border-emerald-900/40 text-emerald-400 hover:border-emerald-700"
                          }`}
                        >
                          {proj.status === "published" ? "Unlist" : "List"}
                        </button>
                        <button onClick={() => openEditModal(proj, "projects")} className="px-3.5 py-2 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-300 hover:text-white transition">
                          Edit
                        </button>
                        <button onClick={() => confirmDelete(proj._id, "projects", proj.title)} className="px-3.5 py-2 text-xs font-bold bg-red-950/20 hover:bg-red-950/40 border border-red-950/30 hover:border-red-900 rounded-xl text-red-400 transition">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {adminData.projects.length === 0 && <p className="text-zinc-500 text-center py-10">No projects found. Add your first project!</p>}
                </div>
              </div>
            )}

            {/* SERVICES MANAGEMENT TAB */}
            {activeTab === "services" && !isAddingNew && !editingItem && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Services</h2>
                    <p className="text-zinc-500 text-sm mt-1">Manage standard offerings and pricing slots.</p>
                  </div>
                  <button onClick={openAddNewModal} className="bg-[#2563eb] hover:bg-blue-600 text-white font-extrabold px-5 py-3 rounded-2xl text-xs uppercase tracking-wider transition-all duration-300 hover:scale-103 cursor-pointer">
                    Add Service
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  {adminData.services.map((serv) => (
                    <div key={serv._id} className="flex items-center justify-between p-5 rounded-2xl border border-zinc-900 bg-zinc-950/20 hover:border-zinc-800 transition duration-300">
                      <div>
                        <h4 className="font-extrabold text-white flex items-center gap-2">
                          {serv.title}
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${serv.status === "published" ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/60" : "bg-zinc-900 text-zinc-500 border border-zinc-800"}`}>
                            {serv.status === "published" ? "Listed" : "Unlisted"}
                          </span>
                        </h4>
                        <p className="text-xs text-zinc-500 mt-0.5">{serv.shortDescription || serv.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleListing(serv, "services")}
                          className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition ${
                            serv.status === "published"
                              ? "bg-amber-950/20 hover:bg-amber-950/40 border-amber-900/40 text-amber-400 hover:border-amber-700"
                              : "bg-emerald-950/20 hover:bg-emerald-950/40 border-emerald-900/40 text-emerald-400 hover:border-emerald-700"
                          }`}
                        >
                          {serv.status === "published" ? "Unlist" : "List"}
                        </button>
                        <button onClick={() => openEditModal(serv, "services")} className="px-3.5 py-2 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-300 hover:text-white transition">
                          Edit
                        </button>
                        <button onClick={() => confirmDelete(serv._id, "services", serv.title)} className="px-3.5 py-2 text-xs font-bold bg-red-950/20 hover:bg-red-950/40 border border-red-950/30 hover:border-red-900 rounded-xl text-red-400 transition">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {adminData.services.length === 0 && <p className="text-zinc-500 text-center py-10">No services found. Add your first service!</p>}
                </div>
              </div>
            )}

            {/* SKILLS MANAGEMENT TAB */}
            {activeTab === "skills" && !isAddingNew && !editingItem && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Skills</h2>
                    <p className="text-zinc-500 text-sm mt-1">Manage tech stack proficiencies and categories.</p>
                  </div>
                  <button onClick={openAddNewModal} className="bg-[#2563eb] hover:bg-blue-600 text-white font-extrabold px-5 py-3 rounded-2xl text-xs uppercase tracking-wider transition-all duration-300 hover:scale-103 cursor-pointer">
                    Add Skill
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {adminData.skills.map((skill) => (
                    <div key={skill._id} className="flex items-center justify-between p-5 rounded-2xl border border-zinc-900 bg-zinc-950/20 hover:border-zinc-800 transition duration-300">
                      <div>
                        <h4 className="font-extrabold text-white flex items-center gap-2">
                          {skill.name}
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${skill.status === "published" ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/60" : "bg-zinc-900 text-zinc-500 border border-zinc-800"}`}>
                            {skill.status === "published" ? "Listed" : "Unlisted"}
                          </span>
                        </h4>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold px-2 py-0.5 rounded-full uppercase">{skill.category}</span>
                          <span className="text-[10px] text-[#2563eb] font-bold">{skill.proficiency}%</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-col">
                        <button
                          onClick={() => handleToggleListing(skill, "skills")}
                          className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition ${
                            skill.status === "published"
                              ? "bg-amber-950/20 hover:bg-amber-950/40 border-amber-900/40 text-amber-400 hover:border-amber-700"
                              : "bg-emerald-950/20 hover:bg-emerald-950/40 border-emerald-900/40 text-emerald-400 hover:border-emerald-700"
                          }`}
                        >
                          {skill.status === "published" ? "Unlist" : "List"}
                        </button>
                        <button onClick={() => openEditModal(skill, "skills")} className="px-3.5 py-2 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-300 hover:text-white transition">
                          Edit
                        </button>
                        <button onClick={() => confirmDelete(skill._id, "skills", skill.name)} className="px-3.5 py-2 text-xs font-bold bg-red-950/20 hover:bg-red-950/40 border border-red-950/30 hover:border-red-900 rounded-xl text-red-400 transition">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {adminData.skills.length === 0 && <p className="text-zinc-500 text-center py-10 col-span-2">No skills found. Add your first skill!</p>}
                </div>
              </div>
            )}

            {/* BLOGS MANAGEMENT TAB */}
            {activeTab === "blogs" && !isAddingNew && !editingItem && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Blog Posts</h2>
                    <p className="text-zinc-500 text-sm mt-1">Manage articles and publication guides.</p>
                  </div>
                  <button onClick={openAddNewModal} className="bg-[#2563eb] hover:bg-blue-600 text-white font-extrabold px-5 py-3 rounded-2xl text-xs uppercase tracking-wider transition-all duration-300 hover:scale-103 cursor-pointer">
                    Add Post
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  {adminData.blogs.map((blog) => (
                    <div key={blog._id} className="flex items-center justify-between p-5 rounded-2xl border border-zinc-900 bg-zinc-950/20 hover:border-zinc-800 transition duration-300">
                      <div>
                        <h4 className="font-extrabold text-white flex items-center gap-2">
                          {blog.title}
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${blog.status === "published" ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/60" : "bg-zinc-900 text-zinc-500 border border-zinc-800"}`}>
                            {blog.status === "published" ? "Listed" : "Unlisted"}
                          </span>
                        </h4>
                        <p className="text-xs text-zinc-500 mt-0.5">{blog.excerpt || "No excerpt provided"}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleListing(blog, "blogs")}
                          className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition ${
                            blog.status === "published"
                              ? "bg-amber-950/20 hover:bg-amber-950/40 border-amber-900/40 text-amber-400 hover:border-amber-700"
                              : "bg-emerald-950/20 hover:bg-emerald-950/40 border-emerald-900/40 text-emerald-400 hover:border-emerald-700"
                          }`}
                        >
                          {blog.status === "published" ? "Unlist" : "List"}
                        </button>
                        <button onClick={() => openEditModal(blog, "blogs")} className="px-3.5 py-2 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-300 hover:text-white transition">
                          Edit
                        </button>
                        <button onClick={() => confirmDelete(blog._id, "blogs", blog.title)} className="px-3.5 py-2 text-xs font-bold bg-red-950/20 hover:bg-red-950/40 border border-red-950/30 hover:border-red-900 rounded-xl text-red-400 transition">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {adminData.blogs.length === 0 && <p className="text-zinc-500 text-center py-10">No blog posts found. Write your first post!</p>}
                </div>
              </div>
            )}

            {/* TECHNOLOGIES MANAGEMENT TAB */}
            {activeTab === "technologies" && !isAddingNew && !editingItem && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Premium Tools & Stack</h2>
                    <p className="text-zinc-500 text-sm mt-1">Manage the tools shown on your About and Homepage stacks.</p>
                  </div>
                  <button onClick={openAddNewModal} className="bg-[#2563eb] hover:bg-blue-600 text-white font-extrabold px-5 py-3 rounded-2xl text-xs uppercase tracking-wider transition-all duration-300 hover:scale-103 cursor-pointer">
                    Add Tool
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {(adminData.technologies ?? []).map((tech) => (
                    <div key={tech._id} className="flex items-center justify-between p-5 rounded-2xl border border-zinc-900 bg-zinc-950/20 hover:border-zinc-800 transition duration-300">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center p-1.5 flex-shrink-0 shadow-md">
                          {tech.icon ? (
                            <img src={tech.icon} alt="" className="h-full w-full object-contain" />
                          ) : (
                            <span className="text-zinc-600 font-bold">🛠</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-white flex items-center gap-2">
                            {tech.name}
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${tech.status === "published" ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/60" : "bg-zinc-900 text-zinc-500 border border-zinc-800"}`}>
                              {tech.status === "published" ? "Listed" : "Unlisted"}
                            </span>
                          </h4>
                          <p className="text-xs text-zinc-500 mt-0.5">{tech.category || "Tool"}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-col">
                        <button
                          onClick={() => handleToggleListing(tech, "technologies")}
                          className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition ${
                            tech.status === "published"
                              ? "bg-amber-950/20 hover:bg-amber-950/40 border-amber-900/40 text-amber-400 hover:border-amber-700"
                              : "bg-emerald-950/20 hover:bg-emerald-950/40 border-emerald-900/40 text-emerald-400 hover:border-emerald-700"
                          }`}
                        >
                          {tech.status === "published" ? "Unlist" : "List"}
                        </button>
                        <button onClick={() => openEditModal(tech, "technologies")} className="px-3.5 py-2 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-300 hover:text-white transition">
                          Edit
                        </button>
                        <button onClick={() => confirmDelete(tech._id, "technologies", tech.name)} className="px-3.5 py-2 text-xs font-bold bg-red-950/20 hover:bg-red-950/40 border border-red-950/30 hover:border-red-900 rounded-xl text-red-400 transition">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {(adminData.technologies ?? []).length === 0 && <p className="text-zinc-500 text-center py-10 col-span-2">No tools found. Add your first tool!</p>}
                </div>
              </div>
            )}

            {/* CREATE / EDIT ENTITY MODAL FORMS */}
            {(isAddingNew || editingItem) && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    {/* Back Button */}
                    <button
                      onClick={closeModal}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                      Back
                    </button>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">
                      {isAddingNew ? "Add New Record" : "Edit Record"}
                    </h3>
                  </div>
                </div>

                <form onSubmit={handleEntitySubmit} className="flex flex-col gap-6">
                  
                  {/* Project specific inputs */}
                  {activeTab === "projects" && (
                    <>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">Project Title</label>
                        <input
                          type="text"
                          value={projectForm.title}
                          onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                          className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">Short Description</label>
                        <input
                          type="text"
                          value={projectForm.shortDescription}
                          onChange={(e) => setProjectForm({ ...projectForm, shortDescription: e.target.value })}
                          className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">Thumbnail / Cover Image (via Cloudinary)</label>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          {projectForm.thumbnail && (
                            <div className="h-20 w-20 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 flex-shrink-0">
                              <img src={projectForm.thumbnail} alt="Preview" className="h-full w-full object-cover" />
                            </div>
                          )}
                          <div className="flex-grow w-full">
                            <input
                              type="text"
                              value={projectForm.thumbnail}
                              onChange={(e) => setProjectForm({ ...projectForm, thumbnail: e.target.value })}
                              placeholder="Image URL or upload file..."
                              className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition mb-2"
                            />
                            <div className="relative flex items-center justify-center border border-dashed border-zinc-800 hover:border-[#2563eb] rounded-2xl p-4 cursor-pointer text-zinc-400 hover:text-zinc-200 transition duration-300">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, (url) => setProjectForm({ ...projectForm, thumbnail: url }), "projectThumbnail")}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              />
                              <span className="text-xs font-bold uppercase tracking-wider">
                                {uploadingField === "projectThumbnail" ? "Uploading..." : "Choose Image to Upload"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">Live URL</label>
                        <input
                          type="text"
                          value={projectForm.liveUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                          className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">GitHub Code URL</label>
                        <input
                          type="text"
                          value={projectForm.githubUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                          className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">Main Description</label>
                        <textarea
                          rows={4}
                          value={projectForm.description}
                          onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                          className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition resize-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">Project Details Content (HTML/Rich-Text)</label>
                        <textarea
                          rows={6}
                          value={projectForm.content}
                          onChange={(e) => setProjectForm({ ...projectForm, content: e.target.value })}
                          className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition resize-none"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={projectForm.isFeatured}
                          onChange={(e) => setProjectForm({ ...projectForm, isFeatured: e.target.checked })}
                          className="h-4.5 w-4.5 accent-[#2563eb] cursor-pointer"
                        />
                        <label htmlFor="featured" className="text-sm font-bold text-zinc-300 cursor-pointer">Featured Project</label>
                      </div>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">Status (Visibility)</label>
                        <select
                          value={projectForm.status}
                          onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                          className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition cursor-pointer"
                        >
                          <option value="published" className="bg-zinc-950 text-white">Listed (Public)</option>
                          <option value="draft" className="bg-zinc-950 text-white">Unlisted (Draft)</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* Service specific inputs */}
                  {activeTab === "services" && (
                    <>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">Service Title</label>
                        <input
                          type="text"
                          value={serviceForm.title}
                          onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                          className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">Short Description</label>
                        <input
                          type="text"
                          value={serviceForm.shortDescription}
                          onChange={(e) => setServiceForm({ ...serviceForm, shortDescription: e.target.value })}
                          className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">Price (e.g. $49/hr or $2500)</label>
                        <input
                          type="text"
                          value={serviceForm.price}
                          onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                          className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">Service Icon / Image (via Cloudinary)</label>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          {serviceForm.icon && (
                            <div className="h-14 w-14 rounded-xl overflow-hidden bg-white border border-zinc-200 flex items-center justify-center p-2 flex-shrink-0">
                              <img src={serviceForm.icon} alt="Preview" className="h-full w-full object-contain" />
                            </div>
                          )}
                          <div className="flex-grow w-full">
                            <input
                              type="text"
                              value={serviceForm.icon}
                              onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                              placeholder="Image URL or upload file..."
                              className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition mb-2"
                            />
                            <div className="relative flex items-center justify-center border border-dashed border-zinc-800 hover:border-[#2563eb] rounded-2xl p-4 cursor-pointer text-zinc-400 hover:text-zinc-200 transition duration-300">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, (url) => setServiceForm({ ...serviceForm, icon: url }), "serviceIcon")}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              />
                              <span className="text-xs font-bold uppercase tracking-wider">
                                {uploadingField === "serviceIcon" ? "Uploading..." : "Choose Icon/Image to Upload"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">Service Description</label>
                        <textarea
                          rows={5}
                          value={serviceForm.description}
                          onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                          className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition resize-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">Status (Visibility)</label>
                        <select
                          value={serviceForm.status}
                          onChange={(e) => setServiceForm({ ...serviceForm, status: e.target.value })}
                          className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition cursor-pointer"
                        >
                          <option value="published" className="bg-zinc-950 text-white">Listed (Public)</option>
                          <option value="draft" className="bg-zinc-950 text-white">Unlisted (Draft)</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* Skill specific inputs */}
                  {activeTab === "skills" && (
                    <>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">Skill Name</label>
                        <input
                          type="text"
                          value={skillForm.name}
                          onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                          className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">Category (e.g. frontend, backend, tools)</label>
                        <input
                          type="text"
                          value={skillForm.category}
                          onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                          className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">Skill Icon / Badge URL (via Cloudinary)</label>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          {skillForm.icon && (
                            <div className="h-14 w-14 rounded-xl overflow-hidden bg-white border border-zinc-200 flex items-center justify-center p-2 flex-shrink-0">
                              <img src={skillForm.icon} alt="Preview" className="h-full w-full object-contain" />
                            </div>
                          )}
                          <div className="flex-grow w-full">
                            <input
                              type="text"
                              value={skillForm.icon}
                              onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
                              placeholder="Image URL or upload file..."
                              className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition mb-2"
                            />
                            <div className="relative flex items-center justify-center border border-dashed border-zinc-800 hover:border-[#2563eb] rounded-2xl p-4 cursor-pointer text-zinc-400 hover:text-zinc-200 transition duration-300">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, (url) => setSkillForm({ ...skillForm, icon: url }), "skillIcon")}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              />
                              <span className="text-xs font-bold uppercase tracking-wider">
                                {uploadingField === "skillIcon" ? "Uploading..." : "Choose Icon/Image to Upload"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">Proficiency Percentage (0 - 100)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={skillForm.proficiency}
                          onChange={(e) => setSkillForm({ ...skillForm, proficiency: parseInt(e.target.value) || 80 })}
                          className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">Status (Visibility)</label>
                        <select
                          value={skillForm.status}
                          onChange={(e) => setSkillForm({ ...skillForm, status: e.target.value })}
                          className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition cursor-pointer"
                        >
                          <option value="published" className="bg-zinc-950 text-white">Listed (Public)</option>
                          <option value="draft" className="bg-zinc-950 text-white">Unlisted (Draft)</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* Blog specific inputs */}
                  {activeTab === "blogs" && (
                    <>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">Post Title</label>
                        <input
                          type="text"
                          value={blogForm.title}
                          onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                          className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">Read Time (minutes)</label>
                        <input
                          type="number"
                          value={blogForm.readTimeMinutes}
                          onChange={(e) => setBlogForm({ ...blogForm, readTimeMinutes: parseInt(e.target.value) || 5 })}
                          className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">Excerpt / Summary</label>
                        <input
                          type="text"
                          value={blogForm.excerpt}
                          onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                          className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">Cover Image (via Cloudinary)</label>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          {blogForm.coverImage && (
                            <div className="h-20 w-20 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 flex-shrink-0">
                              <img src={blogForm.coverImage} alt="Preview" className="h-full w-full object-cover" />
                            </div>
                          )}
                          <div className="flex-grow w-full">
                            <input
                              type="text"
                              value={blogForm.coverImage}
                              onChange={(e) => setBlogForm({ ...blogForm, coverImage: e.target.value })}
                              placeholder="Image URL or upload file..."
                              className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition mb-2"
                            />
                            <div className="relative flex items-center justify-center border border-dashed border-zinc-800 hover:border-[#2563eb] rounded-2xl p-4 cursor-pointer text-zinc-400 hover:text-zinc-200 transition duration-300">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, (url) => setBlogForm({ ...blogForm, coverImage: url }), "blogCover")}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              />
                              <span className="text-xs font-bold uppercase tracking-wider">
                                {uploadingField === "blogCover" ? "Uploading..." : "Choose Image to Upload"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">Post Content (Markdown or Text)</label>
                        <div data-color-mode="dark" className="border border-zinc-900 focus-within:border-[#2563eb] rounded-2xl overflow-hidden transition mt-2">
                          <MDEditor
                            value={blogForm.content}
                            onChange={(val) => setBlogForm({ ...blogForm, content: val || "" })}
                            height={400}
                            style={{ backgroundColor: 'rgba(24, 24, 27, 0.4)' }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">Status (Visibility)</label>
                        <select
                          value={blogForm.status}
                          onChange={(e) => setBlogForm({ ...blogForm, status: e.target.value })}
                          className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition cursor-pointer"
                        >
                          <option value="published" className="bg-zinc-950 text-white">Listed (Public)</option>
                          <option value="draft" className="bg-zinc-950 text-white">Unlisted (Draft)</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* Technology/Tool specific inputs */}
                  {activeTab === "technologies" && (
                    <>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">Tool Name</label>
                        <input
                          type="text"
                          value={technologyForm.name}
                          onChange={(e) => setTechnologyForm({ ...technologyForm, name: e.target.value })}
                          className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">Role / Category (e.g. Website Builder, Design Tool)</label>
                        <input
                          type="text"
                          value={technologyForm.category}
                          onChange={(e) => setTechnologyForm({ ...technologyForm, category: e.target.value })}
                          className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">SimpleIcon CDN or Image URL (via Cloudinary)</label>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          {technologyForm.icon && (
                            <div className="h-14 w-14 rounded-xl overflow-hidden bg-white border border-zinc-200 flex items-center justify-center p-2 flex-shrink-0">
                              <img src={technologyForm.icon} alt="Preview" className="h-full w-full object-contain" />
                            </div>
                          )}
                          <div className="flex-grow w-full">
                            <input
                              type="text"
                              placeholder="e.g. https://cdn.simpleicons.org/framer"
                              value={technologyForm.icon}
                              onChange={(e) => setTechnologyForm({ ...technologyForm, icon: e.target.value })}
                              className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition mb-2"
                            />
                            <div className="relative flex items-center justify-center border border-dashed border-zinc-800 hover:border-[#2563eb] rounded-2xl p-4 cursor-pointer text-zinc-400 hover:text-zinc-200 transition duration-300">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, (url) => setTechnologyForm({ ...technologyForm, icon: url }), "technologyIcon")}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              />
                              <span className="text-xs font-bold uppercase tracking-wider">
                                {uploadingField === "technologyIcon" ? "Uploading..." : "Choose Icon/Image to Upload"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">Tool Website Link</label>
                        <input
                          type="text"
                          value={technologyForm.website}
                          onChange={(e) => setTechnologyForm({ ...technologyForm, website: e.target.value })}
                          className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-2 block">Status (Visibility)</label>
                        <select
                          value={technologyForm.status}
                          onChange={(e) => setTechnologyForm({ ...technologyForm, status: e.target.value })}
                          className="w-full bg-zinc-950/40 border border-zinc-900 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition cursor-pointer"
                        >
                          <option value="published" className="bg-zinc-950 text-white">Listed (Public)</option>
                          <option value="draft" className="bg-zinc-950 text-white">Unlisted (Draft)</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div className="flex items-center gap-4 pt-2">
                    <button type="submit" className="bg-[#2563eb] hover:bg-blue-600 text-white font-extrabold px-8 py-4 rounded-2xl text-sm uppercase tracking-wider transition-all duration-300 hover:scale-103 shadow-md hover:shadow-lg cursor-pointer">
                      {isAddingNew ? "Add Record" : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-8 py-4 text-sm font-bold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
