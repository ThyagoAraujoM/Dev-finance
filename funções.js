oScript = document.createElement("script");
oScript.src = "script.js";
oScript.type = "text/javascript";
document.body.appendChild(oScript);

// alert("test")

const Wallet = {
  open() {
    // Abre o modal se não estiver na "aba" total e modifica o min max do date dependendo do mês para n colocar o mês errado.

    document.querySelector(".wallet-overlay").classList.add("active");
  },
  close() {
    // Fecha o modal e limpa os valores nele inseridos.
    document.querySelector(".wallet-overlay").classList.remove("active");
    Form.clearFields();
  },

  closeOut() {
    // Fecha se clicar fora do moda.
    let modal = document.getElementById("wallet-overlay");
    modal.addEventListener("click", function (e) {
      if (e.target == this) Wallet.close();
    });
  },
};
