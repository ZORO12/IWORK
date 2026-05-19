import React, { useState } from "react";
import { Box, TextField, Button, Typography, Card } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function CreateCompanyForm() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    website: "",
  });

  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setLogo(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("location", form.location);
      formData.append("website", form.website);

      if (logo) {
        formData.append("logo", logo);
      }

      await api.post("/api/company", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error creating company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F9FAFB",
        p: 2,
      }}
    >
      <Card
        sx={{
          width: 450,
          p: 4,
          borderRadius: 3,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={2}>
          Create Your Company
        </Typography>

        <Typography fontSize={13} color="gray" mb={3}>
          You need a company profile to access your dashboard.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Company Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Website"
            name="website"
            value={form.website}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
          />

          {/* LOGO UPLOAD */}
          <Box mt={2}>
            <Typography fontSize={13} mb={1}>
              Company Logo
            </Typography>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />

            {preview && (
              <Box mt={1}>
                <img
                  src={preview}
                  alt="logo preview"
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              </Box>
            )}
          </Box>

          {error && (
            <Typography color="error" fontSize={13} mt={1}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, py: 1.2 }}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Company"}
          </Button>
        </form>
      </Card>
    </Box>
  );
}