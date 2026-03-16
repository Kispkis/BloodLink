import { useEffect, useState } from "react";
import { getEducacaoPublica } from "../api/quiz";

const EducacaoPublic = () => {
  const [topicos, setTopicos] = useState([]);

  useEffect(() => {
    getEducacaoPublica().then(setTopicos);
  }, []);

  return (
    <div className="card page-grid">
      <h1>Conteudos educativos</h1>
      <p>Boas praticas para preparar e recuperar da dadiva.</p>
      {topicos.map((seccao) => (
        <section key={seccao.id} style={{ marginBottom: "1.5rem" }}>
          <h2>{seccao.titulo}</h2>
          <ul>
            {seccao.topicos.map((topico, idx) => (
              <li key={idx}>{topico}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

export default EducacaoPublic;
