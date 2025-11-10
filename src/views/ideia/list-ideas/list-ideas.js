document.addEventListener('DOMContentLoaded', () => {
  // Adicionar listeners para todos os botões de voto
  document.querySelectorAll('.vote-btn').forEach(btn => {
    btn.addEventListener('click', handleVote);
  });
});

async function handleVote(e) {
  const btn = e.currentTarget;
  const ideiaId = btn.dataset.ideaId;
  const voteCountEl = btn.querySelector('.vote-count');
  
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`/ideia/${ideiaId}/votar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      credentials: 'same-origin'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.erro || 'Erro ao votar');
    }

    const data = await response.json();
    
    // Atualizar o contador de votos
    voteCountEl.textContent = data.votoCount;
    
    // Alternar classe voted
    btn.classList.toggle('voted', data.userVoted);

  } catch (error) {
    alert(error.message);
    console.error('Erro ao votar:', error);
  }
}
