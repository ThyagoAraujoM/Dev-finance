const Modal = {
  // Abre e fecha o modal para adicionar uma nova transação
  open() {
    // Abre o modal se não estiver na "aba" total e modifica o min max do date dependendo do mês para n colocar o mês errado.
    let date = document.getElementById("js-date");
    let month = document.getElementById("js-month");
    switch (month.value) {
      case "jan":
        date.min = "2021-01-01";
        date.max = "2021-01-31";
        break;
      case "fev":
        date.min = "2021-02-01";
        date.max = "2021-02-28";
        break;
      case "mar":
        date.min = "2021-03-01";
        date.max = "2021-03-31";
        break;
      case "abr":
        date.min = "2021-04-01";
        date.max = "2021-04-30";
        break;
      case "mai":
        date.min = "2021-05-01";
        date.max = "2021-05-31";
        break;
      case "jun":
        date.min = "2021-06-01";
        date.max = "2021-06-30";
        break;
      case "jul":
        date.min = "2021-07-01";
        date.max = "2021-07-31";
        break;
      case "ago":
        date.min = "2021-08-01";
        date.max = "2021-08-28";
        break;
      case "set":
        date.min = "2021-09-01";
        date.max = "2021-09-30";
        break;
      case "out":
        date.min = "2021-10-01";
        date.max = "2021-10-31";
        break;
      case "nov":
        date.min = "2021-11-01";
        date.max = "2021-11-30";
        break;
      case "dez":
        date.min = "2021-12-01";
        date.max = "2021-12-31";
        break;
    }
    if (month.value != "total") {
      document.querySelector(".js-modal-overlay").classList.add("is-active");
    }
  },
  close() {
    // Fecha o modal e limpa os valores nele inseridos.
    document.querySelector(".js-modal-overlay").classList.remove("is-active");
    document.querySelector("#js-checkbox").checked = false;
    Form.clearFields();
  },

  closeOut() {
    // Fecha se clicar fora do modal.
    let modal = document.querySelector(".js-modal-overlay");
    modal.addEventListener("click", function (e) {
      if (e.target == this) Modal.close();
    });
  },
};

const WalletModal = {
  // Abre e fecha o modal para adicionar e escolher as carteiras
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

    let modal = document.querySelector(".js-wallets-overlay");
    modal.addEventListener("click", function (e) {
      if (e.target == this) WalletModal.close();
    });
  },
};

const helpModal = {
  open() {
    document.querySelector(".js-help-overlay").classList.add("is-active");
  },
  close() {
    document.querySelector(".js-help-overlay").classList.remove("is-active");
  },
  closeOut() {
    let modal = document.querySelectorAll(".js-help-overlay");

    for (let n = 0; n < modal.length; n++) {
      modal[n].addEventListener("click", function (e) {
        if (e.target == this) helpModal.close();
      });
    }
  },
};

let walletName;
const Storage = {
  // Sistema de Storage

  get(wallet) {
    // pega o mês atual que está selecionado (padrão é janeiro) e assim pega o localStorage desse mês.
    let inputMonths = document.getElementById("js-month");

    let walletverification = Storage.getWallet();
    if (wallet != undefined) {
      walletName = wallet;
    } else if (walletName != undefined) {
      walletName = walletName;
    } else if (walletverification[0] != "") {
      walletName = walletverification[0];
    } else {
      walletName = "Padrão";
    }

    /*Se for o total selecionado ele cria um loop baseado em um array com os 12 meses do ano. E em cada loop verifica se tem um LocalStorage desse mês, se houver ele cria um loop para
     adicionar todos os valores desse mês no total. E faz isso em cada mês para no final retornar para a tabela uma lista com todos os valores dos meses para uma visão mais geral.
     Se não for o total ele simplesmente vai pegar o LocalStorage do mês selecionado e entregar para a lista. 
     */

    if (inputMonths.value == "total") {
      return Utils.calcTotal(walletName);
    } else {
      return (
        JSON.parse(
          localStorage.getItem(
            `dev.finances:transactions-${walletName}-${inputMonths.value}`
          )
        ) || []
      );
    }
  },
  getWallet() {
    let test = JSON.parse(
      localStorage.getItem(`dev.finances:transactions-wallets`)
    ) || ["Padrão"];
    return test;
  },
  getFixed(wallet) {
    let name = walletName;
    if (wallet != undefined) {
      name = wallet;
    }
    return (
      JSON.parse(
        localStorage.getItem(`dev.finances:${name}-fixedTransactions`)
      ) || []
    );
  },
  set(transaction) {
    // Cria um LocalStorage ou reescreve um existente com os valores do mês em questão.

    let inputMonths = document.getElementById("js-month");
    localStorage.setItem(
      `dev.finances:transactions-${walletName}-${inputMonths.value}`,
      JSON.stringify(transaction)
    );
  },
  setWallet(transaction) {
    localStorage.setItem(
      `dev.finances:transactions-wallets`,
      JSON.stringify(transaction)
    );
  },
  setFixed(transaction) {
    localStorage.setItem(
      `dev.finances:${walletName}-fixedTransactions`,
      JSON.stringify(transaction)
    );
  },
};

const Wallet = {
  all: Storage.getWallet(),
  selected: Storage.get(),
  index: 0,

  add(wallet) {
    if (!wallet == "") {
      Wallet.all.push(wallet);
      Storage.setWallet(Wallet.all);
    }
  },

  remove(index) {
    Wallet.all.splice(index, 1);
    App.reload();
  },

  select(index) {
    document.querySelector("#js-month").value = "jan";
    walletName = Wallet.all[index];
    document.querySelector("#wallet-selected-name").innerHTML = walletName;
    Wallet.selected = Wallet.all[index];
    Transaction.all = Storage.get(Wallet.selected);
    Transaction.fixed = Storage.getFixed(Wallet.selected);
    Wallet.index = index;

    WalletModal.close();
    App.reload();
  },
  total(wallet) {
    return wallet.reduce((total, { amount }) => amount + total, 0);
  },
};

const Transaction = {
  // Sistema das transações ( add, remove, incomes, expenses, total)
  // pega o LocalStorage do mês selecionado e deposita no objeto para depois colocar na tabela no HTML.
  all: Wallet.selected,
  fixed: Storage.getFixed(),
  add(transaction) {
    //Adiciona a transação no objeto e depois recarrega a tabela com os novos valores.
    Transaction.all.push(transaction);
    App.reload();
  },
  addFixed(transaction) {
    Transaction.fixed.push(transaction);
    App.reload();
  },

  remove(index) {
    //função de remover os valores ao clicar no botam de - na tabela pelo usuário. E reinicia a aplicação.
    Transaction.all.splice(index, 1);
    App.reload();
  },
  removeFixed(index) {
    Transaction.fixed.splice(index, 1);
    App.reload();
  },

  incomes(lastMonth) {
    //Soma as entradas
    let income = 0;

    if (lastMonth != undefined) {
      lastMonth.forEach((transaction) => {
        if (transaction.amount > 0) {
          income += transaction.amount;
        }
      });
      Transaction.fixed.forEach((transaction) => {
        if (transaction.amount > 0) {
          income += transaction.amount;
        }
      });
      return income;
    }
    Transaction.all.forEach((transaction) => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      }
    });
    Transaction.fixed.forEach((transaction) => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      }
    });
    return income;
  },

  expenses(lastMonth) {
    //Soma as despesas, devolve o valor total de despesas do mês.
    let expenses = 0;

    if (lastMonth != undefined) {
      lastMonth.forEach((transaction) => {
        if (transaction.amount < 0) {
          expenses += transaction.amount;
        }
      });

      return expenses;
    }
    Transaction.all.forEach((transaction) => {
      if (transaction.amount < 0) {
        expenses += transaction.amount;
      }
    });
    return expenses;
  },

  total(lastMonth) {
    //Soma o total das duas

    if (lastMonth != undefined) {
      let total =
        Transaction.incomes(lastMonth) + Transaction.expenses(lastMonth);
      let container = document.querySelectorAll(".js-past-month");
      if (total < 0) {
        container[2].style.backgroundColor = "#e92929";
      } else {
        container[2].style.backgroundColor = "#49aa26";
      }
      return total;
    }

    // Retorna a soma dos incomes e expenses e devolve o valor desse mês. Dependendo do valor positivo ou negativo o bg muda de cor.
    let total = Transaction.incomes() + Transaction.expenses();
    if (total < 0) {
      document.getElementById("js-container__total").style.backgroundColor =
        "#e92929";
    } else {
      document.getElementById("js-container__total").style.backgroundColor =
        "#49aa26";
    }
    //entradas -  saídas
    return total;
  },
};

let fixed = false;
const DOM = {
  //Substituir os dados do html com os dados do js
  transactionsContainer: document.querySelector(
    ".js-transaction__data-table tbody"
  ),
  fixedContainer: document.querySelector(".js-fixed__data-table tbody"),

  //Função para adicionar uma transação a tabela.
  addTransaction(transaction, index) {
    const tr = document.createElement("tr");
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;

    DOM.transactionsContainer.appendChild(tr);
  },
  addFixed(transaction, index) {
    fixed = true;
    const tr = document.createElement("tr");
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;

    DOM.fixedContainer.appendChild(tr);
  },

  //criação da transação
  innerHTMLTransaction(transaction, index) {
    const CSSClass =
      transaction.amount > 0 ? "table__income" : "table__expense";

    const amount = Utils.formatCurrency(transaction.amount);

    let html;
    if (fixed == true) {
      html = `
   
      <td class="table__description">${transaction.description}</td>
      <td class="${CSSClass}"> ${amount}</td>
      <td class="table__date">${transaction.date}</td>
      <td>
         <img onclick="Transaction.removeFixed(${index})" src="./assets/minus.svg" alt="Remove transação" />
      </td>`;
      fixed = false;
    } else {
      html = `
   
      <td class="table__description">${transaction.description}</td>
      <td class="${CSSClass}"> ${amount}</td>
      <td class="table__date">${transaction.date}</td>
      <td>
         <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remove transação" />
      </td>`;
    }

    return html;
  },

  //Atualiza as caixas de entrada, saída e total
  updateBalance() {
    document.getElementById(
      "js-incomeDisplay"
    ).innerHTML = Utils.formatCurrency(Transaction.incomes());
    document.getElementById(
      "js-expensesDisplay"
    ).innerHTML = Utils.formatCurrency(Transaction.expenses());
    document.getElementById("js-totalDisplay").innerHTML = Utils.formatCurrency(
      Transaction.total()
    );
  },

  //limpa  a tabela
  clearTransactions() {
    DOM.transactionsContainer.innerHTML = "";
    DOM.fixedContainer.innerHTML = "";
  },

  // WALLET AREA
  walletsContainer: document.querySelector("#js-wallets-table tbody"),
  addWallet(wallet, index) {
    const tr = document.createElement("tr");

    tr.innerHTML = DOM.innerHTMLWallet(wallet, index);
    tr.dataset.index = index;

    DOM.walletsContainer.appendChild(tr);
  },

  innerHTMLWallet(wallet, index) {
    const name = wallet;

    let amount = Utils.calcTotal(wallet);
    amount = Wallet.total(amount) + Wallet.total(Storage.getFixed(wallet));
    const CSSClass = amount > 0 ? "table__income" : "table__expense";
    const newAmount = Utils.formatCurrency(amount);

    const html = `
    <td onclick="Wallet.select(${index})" class="name button">${name}</td>
    <td onclick="Wallet.select(${index})" class="${CSSClass} button">${newAmount}</td>
    <td>
      <img class="button" onclick="Wallet.remove(${index})" src="./assets/minus.svg" alt="Remover carteira">
    </td>
    `;
    return html;
  },
  clearWallets() {
    DOM.walletsContainer.innerHTML = "";
  },
};

const Utils = {
  //Formatação dos valores dos inputs
  formatAmount(value) {
    value = value * 100;
    return Math.round(value);
  },

  formatDate(date) {
    const splittedDate = date.split("-");
    return ` ${splittedDate[2]} / ${splittedDate[1]} / ${splittedDate[0]}`;
  },
  formatSortedDate(date) {
    const splittedDate = date.split("/");
    return `${splittedDate[2]}${splittedDate[1]}${splittedDate[0]}`;
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : "";

    value = String(value).replace(/\D/g, "");

    value = Number(value) / 100;

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return signal + value;
  },
  unFormartCurrency(value) {
    value = String(value);
    const prefix = /^-/gi.test(value) ? "-" : "";
    return Number(`${prefix}${Number(value.replace(/\D/g, "")) / 100}`);
  },

  calcTotal(wallet) {
    if (wallet != " ") {
      const months = [
        "jan",
        "fev",
        "mar",
        "abr",
        "mai",
        "jun",
        "jul",
        "ago",
        "set",
        "out",
        "nov",
        "dez",
      ];
      let total = [];
      for (let i = 0; i < months.length - 1; i++) {
        let month =
          JSON.parse(
            localStorage.getItem(
              `dev.finances:transactions-${wallet}-${months[i]}`
            )
          ) || [];

        if (month[0] != "") {
          for (let n = 0; n < month.length; n++) {
            total.push(month[n]);
          }
        }
      }

      return total;
    }
  },
};

const Form = {
  //Formatação, salvamento e limpeza das transações enviadas pelo modal.
  description: document.querySelector("input#js-description"),
  amount: document.querySelector("input#js-amount"),
  date: document.querySelector("input#js-date"),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    };
  },

  validateField() {
    const { description, amount, date } = Form.getValues();

    if (
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === ""
    ) {
      throw new Error("Por favor, preencha todos os campos");
    }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues();

    amount = Utils.formatAmount(amount);

    date = Utils.formatDate(date);

    return {
      description,
      amount,
      date,
    };
  },

  saveTransaction(transaction) {
    Transaction.add(transaction);
  },
  saveFixedTransactions(transaction) {
    Transaction.addFixed(transaction);
  },

  clearFields() {
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },
  submit(event) {
    event.preventDefault();

    try {
      if (document.querySelector("#js-checkbox").checked == true) {
        Form.validateField();

        const transaction = Form.formatValues();

        Form.saveFixedTransactions(transaction);

        Form.clearFields();
        document.querySelector("#js-checkbox").checked = false;
        Modal.close();
      } else {
        // Verificar se todas as informações foram preenchidas.
        Form.validateField();
        // formatar os dados para salvar
        const transaction = Form.formatValues();
        // salvar
        Form.saveTransaction(transaction);
        // apagar os dados do Formulário
        Form.clearFields();
        // modal feche
        Modal.close();
        // Atualizar a aplicação
        // App.reload(); //Não precisa pq no add ja tem um reload.
      }
    } catch (error) {
      alert(error.message);
    }
  },
};

const WalletForm = {
  name: document.querySelector("input#wallet-name"),

  getValues() {
    return WalletForm.name.value;
  },

  validadeFields() {
    const { name } = WalletForm.getValues();
    if (name === "") {
      throw new Error("Por favor, preencha todos os campos.");
    }
  },

  formatValues() {
    let name = WalletForm.getValues();
    return name.replace(/ +/g, " ").trim();
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
      Ordination.organizeName();
    } catch (error) {
      alert(error.message);
    }
  },
};

const Ordination = {
  // Sistema de sort(ordenar) as tablas pelo valores.
  /*
   * Sorts a HTML table.
   *
   * @param {HTMLTableElement} table The table to sort
   * @param {number} column The index of the column to sort
   * @param {boolean} asc Determines if the sorting will be in ascending
   */

  // Ordena as tabelas em ordem decrescente ou crescente
  sortTableByColumn(table, column, asc = true) {
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll("tr"));

    // Sort each row
    const sortedRows = rows.sort((a, b) => {
      let aColText = a
        .querySelector(`td:nth-child(${column + 1})`)
        .textContent.trim();
      let bColText = b
        .querySelector(`td:nth-child(${column + 1})`)
        .textContent.trim();

      // Se for a coluna dos valores
      if (column == 1) {
        aColText = Utils.unFormartCurrency(aColText);
        bColText = Utils.unFormartCurrency(bColText);
      }

      // Se for a coluna das datas
      if (column == 2) {
        aColText = Utils.formatSortedDate(aColText).replace(/\s/g, "");
        bColText = Utils.formatSortedDate(bColText).replace(/\s/g, "");
      }

      return aColText > bColText ? 1 * dirModifier : -1 * dirModifier;
    });

    // Remove all existing TRs from the table
    while (tBody.firstChild) {
      tBody.removeChild(tBody.firstChild);
    }

    // Re-add the newly sorted rows
    tBody.append(...sortedRows);

    // Remember how the column is currently sorted
    table
      .querySelectorAll("th")
      .forEach((th) => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table
      .querySelector(`th:nth-child(${column + 1})`)
      .classList.toggle("th-sort-asc", asc);
    table
      .querySelector(`th:nth-child(${column + 1})`)
      .classList.toggle("th-sort-desc", !asc);
  },

  // Organiza as datas em específico. Chamado ao carregar o site
  organizeDate() {
    // Organiza a data automaticamente ao implementar algo ou atualizar a página
    var date = document.querySelector(".js-date");

    const tableElement = date.parentElement.parentElement.parentElement;
    const headerIndex = Array.prototype.indexOf.call(
      date.parentElement.children,
      date
    );
    // const currentIsAscending = date.classList.contains("th-sort-asc");
    const currentIsAscending = false;

    Ordination.sortTableByColumn(
      tableElement,
      headerIndex,
      !currentIsAscending
    );
  },

  // Organiza os nomes em específico.
  organizeName() {
    // Organiza a data automaticamente ao implementar algo ou atualizar a página
    var date = document.querySelector(".js-Name");

    const tableElement = date.parentElement.parentElement.parentElement;
    const headerIndex = Array.prototype.indexOf.call(
      date.parentElement.children,
      date
    );
    // const currentIsAscending = date.classList.contains("th-sort-asc");
    const currentIsAscending = false;

    Ordination.sortTableByColumn(
      tableElement,
      headerIndex,
      !currentIsAscending
    );
  },
};

// Sistema do gráfico
google.charts.load("current", { packages: ["corechart"] });
function drawChart() {
  let total = Storage.get();
  const months = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ];
  let graphicData = [["Meses", "Total"]];
  for (let n = 0; n <= months.length - 1; n++) {
    let amount =
      JSON.parse(
        localStorage.getItem(
          `dev.finances:transactions-${walletName}-${months[n]}`
        )
      ) || [];
    let amountFixed = Utils.unFormartCurrency(Wallet.total(Storage.getFixed()));

    let data = [months[n], 0];
    if (amount[0] != undefined) {
      amount = Utils.unFormartCurrency(Wallet.total(amount)) + amountFixed;
      data = [months[n], amount];
    }

    graphicData.push(data);
  }

  const container = document.querySelector(".c-graphic");
  const data = new google.visualization.arrayToDataTable(graphicData);
  const options = {
    title: "Gráfico Total dos meses",
    height: 400,
    width: 720,
    legend: "right",
    pointSize: 5,
  };

  // const chart = new google.visualization.ColumnChart(container)
  // const chart = new google.visualization.BarChart(container)
  const chart = new google.visualization.LineChart(container);
  // const chart = new google.visualization.ColumnChart(container);
  chart.draw(data, options);
}
const Graphic = {
  open() {
    google.charts.setOnLoadCallback(drawChart);
    document.querySelector(".js-graphic-overlay").classList.add("is-active");
  },
  close() {
    document.querySelector(".js-graphic-overlay").classList.remove("is-active");
  },
  closeOut() {
    // Fecha se clicar fora do moda.

    let modal = document.querySelector(".js-graphic-overlay");
    modal.addEventListener("click", function (e) {
      if (e.target == this) Graphic.close();
    });
  },
};

// Sistema mês anterior.
let actualMonth = "jan";
const lastMonth = {
  updateLastMonth() {
    const months = [
      "jan",
      "fev",
      "mar",
      "abr",
      "mai",
      "jun",
      "jul",
      "ago",
      "set",
      "out",
      "nov",
      "dez",
    ];

    let month;
    for (let n = 0; n < months.length - 1; n++) {
      if (actualMonth == months[n]) {
        let name = walletName;
        document.querySelector(".js-past-month-text").innerHTML = months[n - 1];
        month =
          JSON.parse(
            localStorage.getItem(
              `dev.finances:transactions-${name}-${months[n - 1]}`
            )
          ) || [];
      }
    }

    document.getElementById("js-lastIncome").innerHTML = Utils.formatCurrency(
      Transaction.incomes(month)
    );
    document.getElementById("js-lastExpense").innerHTML = Utils.formatCurrency(
      Transaction.expenses(month)
    );
    document.getElementById("js-lastTotal").innerHTML = Utils.formatCurrency(
      Transaction.total(month)
    );
  },
  active() {
    if (actualMonth != "jan" && actualMonth != "total") {
      let pastMonth = document.querySelectorAll(".js-past-month");
      // document.querySelector(".c-container-arrow").classList.remove("u-up");
      // document.querySelector(".c-container-arrow").classList.add("u-down");
      document.querySelector(".js-up-arrow").classList.add("u-sr-only");
      document.querySelector(".js-down-arrow").classList.remove("u-sr-only");
      let container = document.querySelectorAll(".js-container__card");

      for (let n = 0; n < 3; n++) {
        container[n].classList.add("is-active");
        pastMonth[n].classList.remove("u-sr-only");
      }
    }
  },
  desactive() {
    let pastMonth = document.querySelectorAll(".js-past-month");
    // document.querySelector(".c-container-arrow").classList.add("u-up");
    // document.querySelector(".c-container-arrow").classList.remove("u-down");
    document.querySelector(".js-up-arrow").classList.remove("u-sr-only");
    document.querySelector(".js-down-arrow").classList.add("u-sr-only");
    let container = document.querySelectorAll(".js-container__card");

    for (let n = 0; n < 3; n++) {
      container[n].classList.remove("is-active");
      pastMonth[n].classList.add("u-sr-only");
    }
  },
};

const App = {
  //Inicia, recarrega, atualiza e ativa ou desativa o dark-mode da aplicação.
  //Inicia o app
  init() {
    // Transaction.all.forEach((transaction, index) => {
    //    DOM.addTransaction(transaction, index);
    // });

    Storage.set(Transaction.all);
    Storage.setWallet(Wallet.all);
    Storage.setFixed(Transaction.fixed);

    Transaction.all.forEach(DOM.addTransaction);
    Transaction.fixed.forEach(DOM.addFixed);
    Wallet.all.forEach(DOM.addWallet);
    // Resumo pq a função esta recebendo os mesmos parâmetros e não está acontecendo mais nada
    // pode se resumir assim. Passando a função como um atalho ( pesquisar se quiser entender mais).

    Ordination.organizeDate();
    Ordination.organizeName();
    DOM.updateBalance();
  },

  //recarrega apagando a tabela antiga e carregando com a nova
  reload() {
    DOM.clearTransactions();
    DOM.clearWallets();
    App.init();
    // Wallet.all.forEach(DOM.addWallet);
  },

  // Atualiza a tabela com o mês selecionado.
  update() {
    DOM.clearTransactions();
    Transaction.all = Storage.get();
    Transaction.all.forEach(DOM.addTransaction);
    Transaction.fixed = Storage.getFixed();
    Transaction.fixed.forEach(DOM.addFixed);
    DOM.updateBalance();
    actualMonth = document.getElementById("js-month").value;
    if (
      document.getElementById("js-month").value == "jan" ||
      document.getElementById("js-month").value == "total"
    ) {
      lastMonth.desactive();
    } else {
      lastMonth.updateLastMonth();
    }
  },

  // Ativa ou desativa o dark-mode
  darkMode() {
    let $html = document.querySelector("html");
    $html.classList.toggle("dark-mode");
    document.querySelector(".js-lightMode").classList.toggle("on");
    document.querySelector(".js-darkMode").classList.toggle("on");
  },
};

document.querySelectorAll(".js-table-sortable th").forEach((headerCell) => {
  // Ativa a Ordenação da tabela que for clicada
  headerCell.addEventListener("click", () => {
    const tableElement = headerCell.parentElement.parentElement.parentElement;
    const headerIndex = Array.prototype.indexOf.call(
      headerCell.parentElement.children,
      headerCell
    );
    const currentIsAscending = headerCell.classList.contains("th-sort-asc");

    Ordination.sortTableByColumn(
      tableElement,
      headerIndex,
      !currentIsAscending
    );
  });
});
document.querySelector("#wallet-selected-name").innerHTML = Wallet.all[0];
App.init();

// Comentários avulsos.
/*
   Transaction.add({
      id: 39,
      description: "Alo",
      amount: 200,
      date: "23/01/2021",
 });

 Transaction.remove(0); */

/*Tirar o R$ para o sort conseguir ordenar corretamente
 aColText = aColText.replace(/(R\$|\ +)/gi, "");
 bColText = bColText.replace(/(R\$|\ +)/gi, "");
*/
