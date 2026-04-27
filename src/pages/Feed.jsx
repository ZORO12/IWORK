import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Feed() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Utilisateur");
  const [selectedJob, setSelectedJob] = useState(null); // Pour afficher les détails à droite

  // Simulation de données (à remplacer par ton api.get("/api/jobs") plus tard)
  const jobs = [
    { id: 1, title: "Développeur Web", company: "IMPACTOR", city: "Casablanca", type: "CDI", description: "Maitrise de React et Node.js demandée..." },
    { id: 2, title: "Développeur Full Stack", company: "Inkway", city: "Casablanca", type: "CDD", description: "Vous travaillerez sur des projets innovants en utilisant les dernières technologies." },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/api/users/me", { headers: { Authorization: `Bearer ${token}` } });
        setUserName(`${res.data.firstName} ${res.data.lastName}`);
      } catch (err) { console.log(err); }
    };
    fetchProfile();
    if (jobs.length > 0) setSelectedJob(jobs[0]); // Sélectionne le premier job par défaut
  }, []);

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>IWORK</div>
        <div style={styles.navLinks}>
            <span style={styles.navItem} onClick={() => navigate('/profile')}>Profil de {userName}</span>
            <button onClick={() => { localStorage.clear(); navigate("/"); }} style={styles.logoutBtn}>Déconnexion</button>
        </div>
      </nav>

      {/* ZONE DE RECHERCHE (Le bandeau blanc en haut) */}
      <div style={styles.searchSection}>
        <div style={styles.searchBar}>
          <input style={styles.input} placeholder="Poste, mots-clés" />
          <input style={styles.input} placeholder="Ville, département" />
          <button style={styles.searchBtn}>Lancer la recherche</button>
        </div>
      </div>

      {/* CONTENU PRINCIPAL (2 colonnes) */}
      <div style={styles.mainContent}>
        
        {/* LISTE DES OFFRES (Gauche) */}
        <div style={styles.jobList}>
          <p style={{fontSize: '0.9em', color: '#666'}}>Trier par : <b>pertinence</b> - date</p>
          {jobs.map((job) => (
            <div 
              key={job.id} 
              style={{...styles.jobCard, border: selectedJob?.id === job.id ? '2px solid #2557a7' : '1px solid #ddd'}}
              onClick={() => setSelectedJob(job)}
            >
              <span style={styles.badge}>Candidature simplifiée</span>
              <h3 style={styles.jobTitle}>{job.title}</h3>
              <p style={styles.companyName}>{job.company}</p>
              <p style={styles.location}>{job.city}</p>
              <span style={styles.typeBadge}>{job.type}</span>
            </div>
          ))}
        </div>

        {/* DÉTAILS DE L'OFFRE (Droite) */}
        <div style={styles.jobDetails}>
          {selectedJob ? (
            <div style={styles.detailsContent}>
              <h2 style={{fontSize: '1.5rem'}}>{selectedJob.title}</h2>
              <p style={{color: '#2557a7', textDecoration: 'underline'}}>{selectedJob.company} ↗</p>
              <p>{selectedJob.city}</p>
              <button style={styles.applyBtn}>Postuler maintenant</button>
              <hr style={styles.hr} />
              <h3>Détails de l'emploi</h3>
              <p><b>Type de poste :</b> {selectedJob.type}</p>
              <p style={{marginTop: '20px'}}>{selectedJob.description}</p>
            </div>
          ) : (
            <p>Sélectionnez une offre pour voir les détails</p>
          )}
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: { background: "#fff", minHeight: "100vh", fontFamily: "Arial, sans-serif" },
  navbar: { display: "flex", justifyContent: "space-between", padding: "10px 50px", borderBottom: "1px solid #eee", alignItems: "center" },
  logo: { fontSize: "24px", fontWeight: "bold", color: "#2557a7" },
  navLinks: { display: "flex", alignItems: "center", gap: "20px" },
  navItem: { cursor: "pointer", color: "#333", fontSize: "0.9em" },
  logoutBtn: { background: "none", border: "1px solid #ccc", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" },
  
  searchSection: { padding: "30px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "center" },
  searchBar: { display: "flex", gap: "10px", width: "100%", maxWidth: "900px" },
  input: { flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #767676", fontSize: "16px" },
  searchBtn: { padding: "12px 24px", background: "#2557a7", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" },

  mainContent: { display: "flex", maxWidth: "1200px", margin: "0 auto", padding: "20px", gap: "20px" },
  
  jobList: { flex: 1, display: "flex", flexDirection: "column", gap: "15px" },
  jobCard: { padding: "15px", borderRadius: "8px", cursor: "pointer", transition: "0.2s", background: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
  badge: { fontSize: "0.7em", background: "#e8f0fe", color: "#2557a7", padding: "2px 6px", borderRadius: "4px" },
  jobTitle: { margin: "10px 0 5px 0", color: "#2d2d2d" },
  companyName: { color: "#4b4b4b", margin: "0" },
  location: { color: "#6f6f6f", fontSize: "0.9em", margin: "5px 0" },
  typeBadge: { background: "#f3f2f1", padding: "4px 8px", borderRadius: "4px", fontSize: "0.8em" },

  jobDetails: { flex: 1.5, border: "1px solid #ddd", borderRadius: "8px", padding: "25px", position: "sticky", top: "20px", height: "fit-content" },
  applyBtn: { background: "#2557a7", color: "white", border: "none", padding: "12px 25px", borderRadius: "8px", fontWeight: "bold", marginTop: "15px", cursor: "pointer" },
  hr: { margin: "25px 0", border: "none", borderTop: "1px solid #eee" }
};

export default Feed;