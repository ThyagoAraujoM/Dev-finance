oScript = document.createElement("script");
oScript.src = "script.js";
oScript.type = "text/javascript";
document.body.appendChild(oScript);

// alert("test")

const Wallet = {
  open() {
    // Abre o modal se não estiver na "aba" total e modifica o min max do date dependendo do mês para n colocar o mês errado.

    document.querySelector(".c-wallet-overlay").classList.add("is-active");
  },
  close() {
    // Fecha o modal e limpa os valores nele inseridos.
    document.querySelector(".c-wallet-overlay").classList.remove("is-active");
    Form.clearFields();
  },

  closeOut() {
    // Fecha se clicar fora do moda.
    let modal = document.getElementById("c-wallet-overlay");
    modal.addEventListener("click", function (e) {
      if (e.target == this) Wallet.close();
    });
  },
};
