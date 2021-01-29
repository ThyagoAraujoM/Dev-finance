// Objeto Construtor ?
// control a +  control k +  control 1 ( deixa todas as abas no nível minimizado 1)
// [
//    {
//       description: "Luz",
//       amount: -50000,
//       date: "23/01/2021",
//    },
//    {
//       description: "Website",
//       amount: 500000,
//       date: "23/01/2021",
//    },
//    {
//       description: "Internet",
//       amount: -20000,
//       date: "23/01/2021",
//    },
// ],

const Modal = {
   open() {
      document.querySelector(".modal-overlay").classList.add("active");
   },
   close() {
      document.querySelector(".modal-overlay").classList.remove("active");
   },
};

const Storage = {
   get() {
      return (
         JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
      );
   },
   set(transaction) {
      localStorage.setItem(
         "dev.finances:transactions",
         JSON.stringify(transaction)
      );
   },
};

const transactions = [];

const Transaction = {
   all: Storage.get(),
   add(transaction) {
      Transaction.all.push(transaction);

      App.reload();
   },

   remove(index) {
      Transaction.all.splice(index, 1);

      App.reload();
   },

   incomes() {
      // somar as entradas
      let income = 0;
      //pegar todas as transações
      // para cada transação,

      Transaction.all.forEach((transaction) => {
         // se ela for maior que zero
         if (transaction.amount > 0) {
            // somar a uma variável e retornar a variável
            income += transaction.amount;
         }
      });
      return income;
   },

   expenses() {
      //somar as saídas
      let expenses = 0;

      Transaction.all.forEach((transaction) => {
         if (transaction.amount < 0) {
            expenses += transaction.amount;
         }
      });
      return expenses;
   },

   total() {
      //entradas -  saídas
      return Transaction.incomes() + Transaction.expenses();
   },
};

//Substituir os dados do html com os dados do js

const DOM = {
   transactionsContainer: document.querySelector(
      ".transaction__data-table tbody"
   ),

   addTransaction(transaction, index) {
      // console.log("Funcionando até aqui");
      const tr = document.createElement("tr");
      tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
      tr.dataset.index = index;

      DOM.transactionsContainer.appendChild(tr);
   },

   innerHTMLTransaction(transaction, index) {
      const CSSClass =
         transaction.amount > 0 ? "table__income" : "table__expense";

      const amount = Utils.formatCurrency(transaction.amount);
      const html = `
   
      <td class="table__description">${transaction.description}</td>
      <td class="${CSSClass}"> ${amount}</td>
      <td class="table__date">${transaction.date}</td>
      <td>
         <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remove transação" />
      </td>`;

      return html;
   },

   updateBalance() {
      document.getElementById("incomeDisplay").innerHTML = Utils.formatCurrency(
         Transaction.incomes()
      );
      document.getElementById(
         "expensesDisplay"
      ).innerHTML = Utils.formatCurrency(Transaction.expenses());
      document.getElementById("totalDisplay").innerHTML = Utils.formatCurrency(
         Transaction.total()
      );
   },

   clearTransactions() {
      DOM.transactionsContainer.innerHTML = "";
   },
};

const Utils = {
   formatAmount(value) {
      // value = Number(value) * 100;
      value = Number(value.replace(/\,\./g, "")) * 100;

      return value;
   },

   formatDate(date) {
      const splittedDate = date.split("-");
      return ` ${splittedDate[2]} / ${splittedDate[1]}/ ${splittedDate[0]}`;
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
};

const Form = {
   description: document.querySelector("input#description"),
   amount: document.querySelector("input#amount"),
   date: document.querySelector("input#date"),

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
      transaction.add(transaction);
   },

   clearFields() {
      Form.description.value = "";
      Form.amount.value = "";
      Form.date.value = "";
   },
   submit(event) {
      event.preventDefault();

      try {
         // Verificar se todas as informações foram preenchidas.
         Form.validateField();
         // formatar os dados para salvar
         const transaction = Form.formatValues();
         // salvar
         Transaction.add(transaction);
         // apagar os dados do Formulário
         Form.clearFields();
         // modal feche
         Modal.close();
         // Atualizar a aplicação
         // App.reload(); //Não precisa pq no add ja tem um reload.
      } catch (error) {
         alert(error.message);
      }
   },
};

Storage.get();

const App = {
   init() {
      // Transaction.all.forEach((transaction, index) => {
      //    DOM.addTransaction(transaction, index);
      // });

      Transaction.all.forEach(DOM.addTransaction);
      // Resumo pq a função esta recebendo os mesmos parâmetros e não está acontecendo mais nada
      // pode se resumir assim. Passando a função como um atalho ( pesquisar se quiser entender mais).

      DOM.updateBalance();

      Storage.set(Transaction.all);
   },
   reload() {
      DOM.clearTransactions();
      App.init();
   },
};

App.init();

// Transaction.add({
//    id: 39,
//    description: "Alo",
//    amount: 200,
//    date: "23/01/2021",
// });

// Transaction.remove(0);
