import React, { useState, useEffect } from "react";
import api from "./services/api";

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api
      .get("repositories")
      .then((repositoriesResponse) =>
        setRepositories(repositoriesResponse.data)
      );
  }, []);

  async function handleAddRepository() {
    const { data } = await api.post("repositories", {
      title: `Novo repositório ${Date.now()}`,
      url: "http://localhost",
      techs: ["sla"],
    });

    setRepositories([...repositories, data]);
  }

  async function handleRemoveRepository(id) {
    const { status } = await api.delete(`repositories/${id}`);

    if (status < 200 || status >= 300) return;

    const newRepositories = [...repositories];
    const removeIndex = newRepositories.findIndex(
      (repository) => repository.id === id
    );
    newRepositories.splice(removeIndex, 1);

    setRepositories([...newRepositories]);
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map((repository) => (
          <li key={repository.id}>
            {repository.title}
            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>
          </li>
        ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
