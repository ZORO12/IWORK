import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../services/api";

function Auth() {
  const navigate = useNavigate();
  const [register, setRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "CANDIDAT",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    if (!formData.email.includes("@")) {
      alert("Veuillez entrer un email valide.");
      return false;
    }
    if (formData.password.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères.");
      return false;
    }
    if (register && formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return false;
    }
    return true;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setLoading(true);

  // 1. Préparation des données (Séparation Login vs Inscription)
  const { confirmPassword, ...registerData } = formData;
  const loginData = { email: formData.email, password: formData.password };
  
  // Si c'est register, on envoie tout (sauf confirmPassword), sinon juste email/password
  const dataToSend = register ? registerData : loginData;
  const endpoint = register ? "/api/users/register" : "/api/users/login";

  try {
    const response = await api.post(endpoint, dataToSend);
    console.log("Réponse du serveur :", response.data);

    if (!register) {
      // --- LOGIQUE LOGIN ---
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);

        // Gestion sécurisée du nom : on vérifie si l'objet 'user' existe dans la réponse
        // Si ton backend ne renvoie pas 'user', cela évitera les erreurs "undefined"
        const fullName = response.data.user 
          ? `${response.data.user.firstName} ${response.data.user.lastName}` 
          : "Utilisateur";
        localStorage.setItem("userName", fullName);
        
        alert("Connexion réussie !");
      }

      // Redirection par rôle
      const role = response.data.role;
      if (role === 'ADMIN' || role === 'RH') {
        navigate('/dashboard');
      } else {
        navigate('/feed');
      }
    } else {
      // --- LOGIQUE INSCRIPTION ---
      alert("Inscription réussie !");
      setRegister(false); // On revient à la vue connexion
    }
  } catch (error) {
    // Gestion des erreurs plus explicite
    console.error("Erreur complète :", error);
    alert(error.response?.data?.message || "Une erreur est survenue lors de la connexion.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={styles.outerContainer}>
      <form onSubmit={handleSubmit} style={styles.box}>
        <h2 style={styles.title}>{register ? "Créer un compte" : "Connexion"}</h2>

        {register && (
          <>
            <input type="text" placeholder="Prénom" style={styles.input} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
            <input type="text" placeholder="Nom" style={styles.input} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
          </>
        )}

        <input type="email" placeholder="Email" style={styles.input} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          {register && (
          <select style={styles.input} value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
              <option value="CANDIDAT">Candidat</option>
              <option value="ADMIN">Administrateur</option>
            </select>
            )}
            

        <div style={{ position: "relative" }}>
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Mot de passe" 
            style={styles.input} 
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
            required 
          />
          <span style={styles.eye} onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {register && (
          <input 
            type="password" 
            placeholder="Confirmer le mot de passe" 
            style={styles.input} 
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} 
            required 
          />
        )}

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Chargement..." : (register ? "S'inscrire" : "Se connecter")}
        </button>

        <p style={styles.link} onClick={() => setRegister(!register)}>
          {register ? "Déjà un compte ? Connectez-vous" : "Pas de compte ? Inscrivez-vous"}
        </p>
      </form>
    </div>
  );
}

const styles = {
  outerContainer: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f0f2f5" },
  box: { background: "#ffffff", padding: "40px", borderRadius: "12px", width: "350px", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
  title: { marginBottom: "25px", color: "#333" },
  input: { width: "100%", padding: "12px", margin: "10px 0", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" },
  button: { width: "100%", padding: "12px", background: "#007bff", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", marginTop: "10px" },
  eye: { position: "absolute", right: "10px", top: "20px", cursor: "pointer", color: "#888" },
  link: { cursor: "pointer", color: "#007bff", marginTop: "20px", fontSize: "0.9em" }
};

export default Auth;