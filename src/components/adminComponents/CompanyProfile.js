import React, { useEffect, useState } from "react";
import api from "../../services/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  .cp-root {
    font-family: 'DM Sans', sans-serif;
    background: #f5f5f7;
    min-height: 100vh;
    color: #111;
  }

  .cp-banner {
    height: 200px;
    background: linear-gradient(135deg, #2a2a2a 0%, #363636 40%, #1f4a4a 75%, #2abfbf 100%);
    position: relative;
    overflow: visible;
    margin: 0;
  }
  .cp-banner::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(45deg, transparent, transparent 24px, rgba(255,255,255,0.02) 24px, rgba(255,255,255,0.02) 25px);
    pointer-events: none;
  }
  .cp-banner-inner {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: 0;
  }
  .cp-banner-accent {
    position: absolute;
    right: -40px; top: -60px;
    width: 280px; height: 280px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(42,191,191,0.45) 0%, transparent 70%);
  }

  .cp-main {
    max-width: 860px;
    margin: 0 auto;
    padding: 0 28px 48px;
  }

  .cp-identity {
    display: flex;
    align-items: flex-end;
    gap: 20px;
    margin-top: -52px;
    margin-bottom: 28px;
    position: relative;
    z-index: 10;
  }

  .cp-logo {
    width: 92px; height: 92px;
    border-radius: 18px;
    border: 3px solid #fff;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Instrument Serif', serif;
    font-size: 34px;
    color: #2aafaf;
    box-shadow: 0 4px 20px rgba(0,0,0,0.12);
    overflow: hidden;
    flex-shrink: 0;
  }
  .cp-logo img { width: 100%; height: 100%; object-fit: cover; }

  .cp-identity-info { padding-bottom: 4px; flex: 1; }

  .cp-name-row { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
  .cp-name {
    font-family: 'Instrument Serif', serif;
    font-size: 28px;
    font-weight: 400;
    line-height: 1.1;
  }
  .cp-verified {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 9px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 500;
    background: #e0f7f7;
    color: #1f7a7a;
  }

  .cp-meta {
    display: flex; align-items: center; gap: 18px;
    margin-top: 7px; flex-wrap: wrap;
  }
  .cp-meta-item {
    display: flex; align-items: center; gap: 5px;
    font-size: 13px; color: #666;
  }

  .cp-actions { display: flex; gap: 8px; align-items: center; padding-bottom: 4px; }

  .btn-outline {
    display: flex; align-items: center; gap: 7px;
    padding: 9px 18px;
    border-radius: 10px;
    border: 1px solid #e0e0e0;
    background: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500;
    color: #111; cursor: pointer;
    transition: background 0.15s;
  }
  .btn-outline:hover { background: #f5f5f7; }

  .btn-primary {
    display: flex; align-items: center; gap: 7px;
    padding: 9px 20px;
    border-radius: 10px; border: none;
    background: #2aafaf; color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500;
    cursor: pointer; transition: background 0.15s;
  }
  .btn-primary:hover { background: #1f9090; }

  .cp-stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px; margin-bottom: 16px;
  }
  .cp-stat {
    background: #fff;
    border: 1px solid #ececec;
    border-radius: 12px;
    padding: 16px 18px;
    text-align: center;
  }
  .cp-stat-num {
    font-family: 'Instrument Serif', serif;
    font-size: 24px; color: #111;
  }
  .cp-stat-label { font-size: 12px; color: #888; margin-top: 2px; }

  .cp-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .cp-card-full { grid-column: 1 / -1; }

  .cp-card {
    background: #fff;
    border-radius: 14px;
    border: 1px solid #ececec;
    padding: 22px 24px;
  }

  .cp-field-label {
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: #aaa; margin-bottom: 4px;
  }
  .cp-field-value { font-size: 15px; color: #111; line-height: 1.5; }
  .cp-field-value a { color: #2aafaf; text-decoration: none; }
  .cp-field-value a:hover { text-decoration: underline; }

  .cp-divider { height: 1px; background: #f0f0f0; margin: 16px 0; }

  .cp-tag {
    display: inline-flex; align-items: center;
    padding: 4px 10px; border-radius: 6px;
    font-size: 12px; font-weight: 500;
    background: #f5f5f7; color: #555;
    margin: 3px 3px 3px 0;
  }

  .cp-socials { display: flex; gap: 8px; margin-top: 6px; }
  .cp-social-btn {
    width: 34px; height: 34px; border-radius: 8px;
    border: 1px solid #e8e8e8; background: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #666; font-size: 16px;
    text-decoration: none; transition: border-color 0.15s, color 0.15s;
  }
  .cp-social-btn:hover { border-color: #2aafaf; color: #2aafaf; }

  .cp-progress-bar {
    height: 5px; border-radius: 3px;
    background: #f0f0f0; overflow: hidden; margin-top: 6px;
  }
  .cp-progress-fill {
    height: 100%; border-radius: 3px; background: #2aafaf;
  }

  /* MODAL */
  .cp-modal-backdrop {
    display: none; position: fixed; inset: 0;
    background: rgba(0,0,0,0.45); z-index: 1000;
    align-items: center; justify-content: center; padding: 20px;
  }
  .cp-modal-backdrop.open { display: flex; }

  .cp-modal {
    background: #fff;
    border-radius: 18px; width: 100%; max-width: 520px;
    max-height: 88vh; overflow-y: auto;
    border: 1px solid #e0e0e0;
  }
  .cp-modal-header {
    padding: 22px 24px 16px;
    border-bottom: 1px solid #f0f0f0;
    display: flex; justify-content: space-between; align-items: flex-start;
  }
  .cp-modal-title { font-family: 'Instrument Serif', serif; font-size: 20px; }
  .cp-modal-subtitle { font-size: 12px; color: #888; margin-top: 3px; }
  .cp-modal-close {
    width: 30px; height: 30px; border-radius: 8px;
    border: 1px solid #e8e8e8; background: #f5f5f7;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: #666; font-size: 18px; line-height: 1; flex-shrink: 0;
  }
  .cp-modal-close:hover { color: #111; }
  .cp-modal-body { padding: 20px 24px; }
  .cp-modal-footer {
    padding: 16px 24px; border-top: 1px solid #f0f0f0;
    display: flex; gap: 8px; justify-content: flex-end;
  }

  .cp-avatar-section {
    display: flex; align-items: center; gap: 18px;
    padding: 16px; background: #f5f5f7; border-radius: 12px; margin-bottom: 20px;
  }
  .cp-avatar-edit { position: relative; cursor: pointer; }
  .cp-avatar-lg {
    width: 72px; height: 72px; border-radius: 14px;
    background: #e0f7f7; display: flex; align-items: center; justify-content: center;
    font-family: 'Instrument Serif', serif; font-size: 26px; color: #2aafaf; overflow: hidden;
  }
  .cp-avatar-lg img { width: 100%; height: 100%; object-fit: cover; }
  .cp-avatar-overlay {
    position: absolute; inset: 0; border-radius: 14px;
    background: rgba(0,0,0,0.42); display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.15s; color: #fff; font-size: 20px;
  }
  .cp-avatar-edit:hover .cp-avatar-overlay { opacity: 1; }

  .cp-field-group { margin-bottom: 14px; }
  .cp-field-input-label {
    display: block; font-size: 11px; font-weight: 500;
    letter-spacing: 0.05em; text-transform: uppercase;
    color: #888; margin-bottom: 6px;
  }
  .cp-input {
    width: 100%; padding: 9px 12px; border-radius: 9px;
    border: 1px solid #e0e0e0; background: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: #111;
    outline: none; transition: border-color 0.15s; box-sizing: border-box;
  }
  .cp-input:focus { border-color: #2aafaf; box-shadow: 0 0 0 3px rgba(42,175,175,0.1); }
  .cp-textarea { min-height: 90px; resize: vertical; }

  .cp-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  .cp-section-title {
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.06em; text-transform: uppercase;
    color: #999; margin: 20px 0 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f0f0;
  }

  @media (max-width: 600px) {
    .cp-two-col { grid-template-columns: 1fr; }
    .cp-grid { grid-template-columns: 1fr; }
    .cp-stats-row { grid-template-columns: repeat(3, 1fr); }
    .cp-identity { flex-wrap: wrap; }
  }
`;

// ─── helpers ────────────────────────────────────────────────────────────────

/** Calculate profile completion % based on filled fields */
function calcCompletion(c) {
  const fields = [
    c.name, c.description, c.location, c.website,
    c.logo, c.foundedYear, c.size,
    c.linkedin || c.twitter || c.github,
    c.tags?.length,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

// ────────────────────────────────────────────────────────────────────────────

export default function CompanyProfile() {
  const [company, setCompany] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);

  const role = localStorage.getItem("role");

  const fetchCompany = async () => {
  try {
    const res = await api.get("/api/company/my-company", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = res.data;

    // Normalize tags: API returns a string, convert to array
    const normalizedTags = data.tags
      ? data.tags.split(",").map((t) => t.trim())
      : [];

    setCompany({ ...data, tags: normalizedTags });
    setForm({ ...data, tags: normalizedTags });
    if (data.logo) setPreview(`http://localhost:3000${data.logo}`);
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    fetchCompany();
    const styleEl = document.createElement("style");
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleTagsChange = (e) => {
    const raw = e.target.value;
    setForm({
      ...form,
      // keep raw string for input display, split on save
      _tagsRaw: raw,
      tags: raw.split(",").map((t) => t.trim()).filter(Boolean),
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogo(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", form.name || "");
      formData.append("description", form.description || "");
      formData.append("location", form.location || "");
      formData.append("website", form.website || "");
      formData.append("foundedYear", form.foundedYear || "");
      formData.append("size", form.size || "");
      formData.append("linkedin", form.linkedin || "");
      formData.append("twitter", form.twitter || "");
      formData.append("github", form.github || "");
      formData.append("tags", JSON.stringify(form.tags || []));
      if (logo) formData.append("logo", logo);

      await api.put("/api/company", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setOpen(false);
      setLogo(null);
      fetchCompany();
    } catch (err) {
      console.error(err);
    }
  };

  if (!company)
    return (
      <div style={{ padding: 40, fontFamily: "'DM Sans', sans-serif", color: "#888" }}>
        Loading...
      </div>
    );

  const logoUrl = preview || (company.logo ? `http://localhost:3000${company.logo}` : null);
  const initial = (company.name || "C")[0].toUpperCase();
  const completion = calcCompletion(company);
  const tags = Array.isArray(company.tags)
  ? company.tags
  : company.tags
  ? company.tags.split(",").map((t) => t.trim())
  : [];

  return (
    <div className="cp-root">
      {/* BANNER */}
      <div className="cp-banner">
        <div className="cp-banner-inner">
          <div className="cp-banner-accent" />
        </div>
      </div>

      <div className="cp-main">
        {/* IDENTITY ROW */}
        <div className="cp-identity">
          <div className="cp-logo">
            {logoUrl ? (
              <img src={logoUrl} alt={`${company.name} logo`} />
            ) : (
              initial
            )}
          </div>

          <div className="cp-identity-info">
            <div className="cp-name-row">
              <span className="cp-name">{company.name}</span>
              <span className="cp-verified">✓ Verified</span>
            </div>
            <div className="cp-meta">
              <span className="cp-meta-item">📍 {company.location || "Location not set"}</span>
              <span className="cp-meta-item">
                🌐{" "}

                <a href={`https://${company.website}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#666", textDecoration: "none" }}
>
                {company.website || "No website"}
              </a>
              </span>
            </div>
          </div>

          {role === "ADMIN" && (
            <div className="cp-actions">
              <button className="btn-outline" onClick={() => setOpen(true)}>
                ✏️ Edit profile
              </button>
            </div>
          )}
        </div>

        {/* STATS ROW */}
        <div className="cp-stats-row">
          <div className="cp-stat">
            <div className="cp-stat-num">{company.size ?? "—"}</div>
            <div className="cp-stat-label">Employees</div>
          </div>
          <div className="cp-stat">
            <div className="cp-stat-num">{company.jobs?.length ?? 0}</div>
            <div className="cp-stat-label">Open roles</div>
          </div>
          <div className="cp-stat">
            <div className="cp-stat-num">{company.foundedYear ?? "—"}</div>
            <div className="cp-stat-label">Founded</div>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="cp-grid">

          {/* About card */}
          <div className="cp-card cp-card-full">
            <div className="cp-field-label">About</div>
            <div className="cp-field-value" style={{ marginTop: 6, color: "#555", fontSize: 14, lineHeight: 1.7 }}>
              {company.description || "No description provided."}
            </div>
            {tags.length > 0 && (
              <>
                <div className="cp-divider" />
                <div className="cp-field-label">Tags</div>
                <div style={{ marginTop: 6 }}>
                  {tags.map((tag) => (
                    <span key={tag} className="cp-tag">{tag}</span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Contact card */}
          <div className="cp-card">
            <div className="cp-field-label">Contact & Location</div>
            <div className="cp-divider" />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div className="cp-field-label">Headquarters</div>
                <div className="cp-field-value">{company.location || "Not set"}</div>
              </div>
              <div>
                <div className="cp-field-label">Website</div>
                <div className="cp-field-value">
                  <a href={`https://${company.website}`} target="_blank" rel="noreferrer">
                    {company.website || "Not set"}
                  </a>
                </div>
              </div>
              {company.foundedYear && (
                <div>
                  <div className="cp-field-label">Founded</div>
                  <div className="cp-field-value">{company.foundedYear}</div>
                </div>
              )}
            </div>
          </div>

          {/* Social + completion card */}
          <div className="cp-card">
            <div className="cp-field-label">Social presence</div>
            <div className="cp-divider" />
            <div className="cp-socials">
              {company.linkedin ? (
                <a href={company.linkedin} target="_blank" rel="noreferrer" className="cp-social-btn" title="LinkedIn">in</a>
              ) : null}
              {company.twitter ? (
                <a href={company.twitter} target="_blank" rel="noreferrer" className="cp-social-btn" title="Twitter / X">𝕏</a>
              ) : null}
              {company.github ? (
                <a href={company.github} target="_blank" rel="noreferrer" className="cp-social-btn" title="GitHub">GH</a>
              ) : null}
              {!company.linkedin && !company.twitter && !company.github && (
                <span style={{ fontSize: 13, color: "#bbb" }}>No social links added</span>
              )}
            </div>

            <div style={{ marginTop: 20 }}>
              <div className="cp-field-label">Profile completion</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: "#888" }}>{completion}% complete</span>
                {role === "ADMIN" && completion < 100 && (
                  <span
                    style={{ fontSize: 12, color: "#2aafaf", cursor: "pointer" }}
                    onClick={() => setOpen(true)}
                  >
                    Add missing info
                  </span>
                )}
              </div>
              <div className="cp-progress-bar">
                <div className="cp-progress-fill" style={{ width: `${completion}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── EDIT MODAL ─────────────────────────────────────────────────────── */}
      {open && (
        <div
          className="cp-modal-backdrop open"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="cp-modal" role="dialog" aria-modal="true">
            <div className="cp-modal-header">
              <div>
                <div className="cp-modal-title">Edit company profile</div>
                <div className="cp-modal-subtitle">Keep your details accurate and up to date.</div>
              </div>
              <button className="cp-modal-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
            </div>

            <div className="cp-modal-body">

              {/* Logo upload */}
              <div className="cp-avatar-section">
                <label className="cp-avatar-edit" style={{ cursor: "pointer" }}>
                  <div className="cp-avatar-lg">
                    {preview ? <img src={preview} alt="Logo preview" /> : initial}
                  </div>
                  <div className="cp-avatar-overlay">📷</div>
                  <input hidden type="file" accept="image/*" onChange={handleLogoChange} />
                </label>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>Company logo</div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 3, lineHeight: 1.5 }}>
                    Upload a square image in JPEG or PNG.<br />Min 200×200px recommended.
                  </div>
                </div>
              </div>

              {/* ── Basic info ── */}
              <div className="cp-section-title">Basic info</div>

              <div className="cp-two-col">
                <div className="cp-field-group">
                  <label className="cp-field-input-label" htmlFor="fname">Company name</label>
                  <input className="cp-input" id="fname" name="name"
                    value={form.name || ""} onChange={handleChange} />
                </div>
                <div className="cp-field-group">
                  <label className="cp-field-input-label" htmlFor="flocation">Location</label>
                  <input className="cp-input" id="flocation" name="location"
                    value={form.location || ""} onChange={handleChange} />
                </div>
              </div>

              <div className="cp-two-col">
                <div className="cp-field-group">
                  <label className="cp-field-input-label" htmlFor="ffounded">Founded year</label>
                  <input className="cp-input" id="ffounded" name="foundedYear" type="number"
                    placeholder="e.g. 2019"
                    value={form.foundedYear || ""} onChange={handleChange} />
                </div>
                <div className="cp-field-group">
                  <label className="cp-field-input-label" htmlFor="fsize">Company size</label>
                  <input className="cp-input" id="fsize" name="size" type="number"
                    placeholder="e.g. 142"
                    value={form.size || ""} onChange={handleChange} />
                </div>
              </div>

              <div className="cp-field-group">
                <label className="cp-field-input-label" htmlFor="fwebsite">Website</label>
                <input className="cp-input" id="fwebsite" name="website"
                  placeholder="example.com"
                  value={form.website || ""} onChange={handleChange} />
              </div>

              <div className="cp-field-group">
                <label className="cp-field-input-label" htmlFor="fdesc">Bio / Description</label>
                <textarea className="cp-input cp-textarea" id="fdesc" name="description"
                  value={form.description || ""} onChange={handleChange} />
              </div>

              <div className="cp-field-group">
                <label className="cp-field-input-label" htmlFor="ftags">
                  Tags <span style={{ textTransform: "none", fontWeight: 400 }}>(comma separated)</span>
                </label>
                <input className="cp-input" id="ftags"
                  placeholder="Technology, SaaS, B2B"
                  value={form._tagsRaw ?? (Array.isArray(form.tags) ? form.tags.join(", ") : form.tags || "")}
                  onChange={handleTagsChange} />
              </div>

              {/* ── Social links ── */}
              <div className="cp-section-title">Social links</div>

              <div className="cp-field-group">
                <label className="cp-field-input-label" htmlFor="flinkedin">LinkedIn URL</label>
                <input className="cp-input" id="flinkedin" name="linkedin"
                  placeholder="https://linkedin.com/company/..."
                  value={form.linkedin || ""} onChange={handleChange} />
              </div>

              <div className="cp-two-col">
                <div className="cp-field-group">
                  <label className="cp-field-input-label" htmlFor="ftwitter">Twitter / X URL</label>
                  <input className="cp-input" id="ftwitter" name="twitter"
                    placeholder="https://x.com/..."
                    value={form.twitter || ""} onChange={handleChange} />
                </div>
                <div className="cp-field-group">
                  <label className="cp-field-input-label" htmlFor="fgithub">GitHub URL</label>
                  <input className="cp-input" id="fgithub" name="github"
                    placeholder="https://github.com/..."
                    value={form.github || ""} onChange={handleChange} />
                </div>
              </div>

            </div>

            <div className="cp-modal-footer">
              <button className="btn-outline" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>Save changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}