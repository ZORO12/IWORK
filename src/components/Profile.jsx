import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Erreur chargement profil", error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate('/feed')}>← Retour</button>
      
      <div style={styles.card}>
        <div style={styles.avatar}>
          {userData?.firstName?.charAt(0)}{userData?.lastName?.charAt(0)}
        </div>
        
        {userData ? (
          <>
            <h1 style={styles.name}>{userData.firstName} {userData.lastName}</h1>
            <p style={styles.role}>{userData.role}</p>
            <div style={styles.infoGroup}>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Date d'inscription:</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </>
        ) : (
          <p>Chargement du profil...</p>
        )}
      </div>
    </div>
  );
}

// Design CSS-in-JS (Tout est ici !)
const styles = {
  container: { padding: "40px", maxWidth: "600px", margin: "0 auto", fontFamily: "Arial" },
  backBtn: { marginBottom: "20px", padding: "10px 15px", cursor: "pointer", background: "#f0f0f0", border: "none", borderRadius: "5px" },
  card: { background: "#fff", padding: "40px", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", textAlign: "center" },
  avatar: { width: "100px", height: "100px", background: "#007bff", color: "white", fontSize: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", margin: "0 auto 20px" },
  name: { margin: "0 0 10px 0" },
  role: { color: "#666", fontWeight: "bold", textTransform: "uppercase" },
  infoGroup: { marginTop: "30px", textAlign: "left", borderTop: "1px solid #eee", paddingTop: "20px" }
};

export default Profile;