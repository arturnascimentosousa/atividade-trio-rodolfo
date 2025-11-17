document.addEventListener('DOMContentLoaded', () => {
  const voteBtn = document.querySelector('.vote-btn');
  const mainContainer = document.querySelector('.main-content');

  if (voteBtn) {
    voteBtn.addEventListener('click', handleVote);
  }

  function showFeedback(message, type = 'info') {
    const feedback = document.createElement('div');
    feedback.className = `feedback ${type}`;
    feedback.textContent = message;
    
    const existingFeedback = mainContainer.querySelector('.feedback');
    if (existingFeedback) {
      existingFeedback.remove();
    }
    
    mainContainer.insertBefore(feedback, mainContainer.firstChild);
    
    setTimeout(() => {
      feedback.remove();
    }, 3000);
  }

  async function handleVote(e) {
    const btn = e.currentTarget;
    const ideiaId = btn.dataset.ideaId;
    const voteCountEl = btn.querySelector('.vote-count');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        showFeedback('Você precisa estar logado para votar.', 'error');
        return;
      }
      
      const response = await fetch(`/ideia/${ideiaId}/votar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        credentials: 'same-origin'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Erro ao votar');
      }
      
      voteCountEl.textContent = data.votoCount;
      
      btn.classList.toggle('voted', data.userVoted);

      showFeedback(data.userVoted ? 'Voto registrado com sucesso!' : 'Voto removido com sucesso!', 'success');

    } catch (error) {
      showFeedback(error.message, 'error');
      console.error('Erro ao votar:', error);
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const deleteBtn = document.querySelector('.delete-btn');

  const popup = document.getElementById('delete-popup');
  const confirmDeleteBtn = document.getElementById('confirm-delete');
  const cancelDeleteBtn = document.getElementById('cancel-delete');

  let ideiaIdToDelete = null;

  if (deleteBtn) {
    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      ideiaIdToDelete = e.currentTarget.dataset.ideaId;

      popup.classList.remove("hidden");
    });
  }

  cancelDeleteBtn.addEventListener('click', () => {
    popup.classList.add('hidden');
    ideiaIdToDelete = null;
  });

  confirmDeleteBtn.addEventListener('click', async () => {
    if (!ideiaIdToDelete) return;

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`/ideia/${ideiaIdToDelete}/remover`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.erro || "Erro ao remover ideia");

      window.location.href = "/ideia";

    } catch (error) {
      alert("Erro: " + error.message);
      console.error("Erro ao remover:", error);
    }
  });
});

