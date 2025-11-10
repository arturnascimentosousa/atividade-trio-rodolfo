document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".edit-form");
  
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const ideaId = form.dataset.ideaId;
    
    const formData = {
      titulo: form.querySelector('#titulo').value,
      detalhes: form.querySelector('#detalhes').value,
      fk_categoria: form.querySelector('#fk_categoria').value
    };

    try {
      const response = await fetch(`/ideia/atualizar/${ideaId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Resposta do servidor não é JSON. Por favor, tente novamente.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || data.detalhes || 'Erro ao atualizar ideia');
      }

      alert('Ideia atualizada com sucesso!');
      window.location.href = `/ideia/${ideaId}`;
    } catch (error) {
      console.error('Erro ao atualizar ideia:', error);
      alert('Erro ao atualizar ideia: ' + error.message);
    }
  });
});
