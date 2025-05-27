document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/fichas")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("fichas-container");
      if (!data.length) {
        container.innerHTML = "<li>Nenhuma ficha encontrada.</li>";
        return;
      }

      data.forEach(ficha => {
        const item = document.createElement("li");
        item.innerHTML = `
          <strong>${ficha.nome}</strong> - ${ficha.classe} (Nível ${ficha.nivel})
          <button onclick="excluirFicha(${ficha.id})">Excluir</button>
        `;
        container.appendChild(item);
      });
    });
});

function excluirFicha(id) {
  fetch(`/api/fichas/${id}`, { method: "DELETE" })
    .then(() => location.reload())
    .catch(err => console.error("Erro ao excluir ficha:", err));
}
