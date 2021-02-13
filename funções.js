oScript = document.createElement("script");
oScript.src = "script.js";
oScript.type = "text/javascript";
document.body.appendChild(oScript);

const WalletModal = {
  open() {
    // Abre o modal se não estiver na "aba" total e modifica o min max do date dependendo do mês para n colocar o mês errado.
    document.querySelector(".js-wallets-overlay").classList.add("is-active");
  },
  close() {
    // Fecha o modal e limpa os valores nele inseridos.
    document.querySelector(".js-wallets-overlay").classList.remove("is-active");
    Form.clearFields();
  },

  closeOut() {
    // Fecha se clicar fora do moda.
    // alert("test");
    let modal = document.querySelector(".js-wallets-overlay");
    modal.addEventListener("click", function (e) {
      if (e.target == this) Wallet.close();
    });
  },
};

const StorageWallet = {
  get() {
    return JSON.parse(localStorage.getItem(`dev.finances:wallets`)) || [];
  },

  set(wallets) {
    localStorage.setItem(`dev.finances:wallets`, JSON.stringify(wallets));
  },
};

const Wallet = {
  all: Storage.get(),
  selected: Storage.get()[0] || Modal.toggle("modal-wallets"),
  index: 0,

  update() {
    Wallet.all[Wallet.index] = Wallet.selected;
    Storage.set(Wallet.all);
  },

  add(wallet) {
    if (!wallet.transactions) wallet.transactions = [];
    Wallet.all.push(wallet);
    Storage.set(Wallet.all);
  },

  remove(index) {
    Wallet.all.splice(index, 1);
    App.reload();
  },

  select(index) {
    Modal.toggle("modal-wallets");

    Wallet.selected = Wallet.all[index];
    Transaction.all = Wallet.selected;
    Wallet.index = index;

    App.reload();
  },
};

const Transaction = {
  all: Wallet.selected || [],

  add(transaction) {
    Transaction.all.transactions.push(transaction);
    App.reload();
  },

  remove(index) {
    Transaction.all.transactions.splice(index, 1);
    App.reload();
  },

  incomes(transactions = Transaction.all.transactions) {
    return transactions?.reduce(
      (total, { amount }) => (amount > 0 ? amount + total : total),
      0
    );
  },

  expenses(transactions = Transaction.all.transactions) {
    return transactions?.reduce(
      (total, { amount }) => (amount < 0 ? amount + total : total),
      0
    );
  },

  total(transactions = Transaction.all.transactions) {
    return transactions?.reduce((total, { amount }) => amount + total, 0);
  },
};

const WalletForm = {
  name: document.querySelector("input#wallet-name"),

  getValues() {
    return { name: WalletForm.name.value };
  },

  validadeFields() {
    const { name } = WalletForm.getValues();
    if (name === "") {
      throw new Error("Por favor, preencha todos os campos.");
    }
  },

  formatValues() {
    let { name } = WalletForm.getValues();
    return {
      name: name.replace(/ +/g, " ").trim(),
    };
  },

  saveWallet(wallet) {
    Wallet.add(wallet);
  },

  clearFields() {
    WalletForm.name.value = "";
  },

  submit(event) {
    event.preventDefault();
    try {
      WalletForm.validadeFields();
      const wallet = WalletForm.formatValues();
      WalletForm.saveWallet(wallet);

      WalletForm.clearFields();

      DOM.clearWallets();

      Wallet.all.forEach(DOM.addWallet);
    } catch (error) {
      alert(error.message);
    }
  },
};
