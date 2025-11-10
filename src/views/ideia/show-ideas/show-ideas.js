document.addEventListener("DOMContentLoaded", () => {
  const voteButton = document.querySelector("form button");
  if (voteButton) {
    voteButton.addEventListener("click", () => {
      console.log("Votando na ideia...");
    });
  }
});
