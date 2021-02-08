// Abre e fecha o modal para adicionar uma nova transação
const Modal = {
   open() {
      // Abre o modal se não estiver na "aba" total e modifica o min max do date dependendo do mês para n colocar o mês errado.
      let date = document.getElementById("date");
      let month = document.getElementById("mes");
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
         document.querySelector(".modal-overlay").classList.add("active");
      }
   },
   close() {
      // Fecha o modal e limpa os valores nele inseridos.
      document.querySelector(".modal-overlay").classList.remove("active");
      Form.clearFields();
   },

   closeOut() {
      // Fecha se clicar fora do moda.
      let modal = document.getElementById("modal-overlay");
      modal.addEventListener("click", function (e) {
         if (e.target == this) Modal.close();
      });
   },
};

// Sistema de Storage
const Storage = {
   get() {
      // pega o mês atual que está selecionado (padrão é janeiro) e assim pega o localStorage desse mês.
      let inputMonths = document.getElementById("mes");

      // Se for o total selecionado ele cria um loop baseado em um array com os 12 meses do ano. E em cada loop verifica se tem um LocalStorage desse mês, se houver ele cria um loop para
      // adicionar todos os valores desse mês no total. E faz isso em cada mês para no final retornar para a tabela uma lista com todos os valores dos meses para uma visão mais geral.
      // Se não for o total ele simplesmente vai pegar o LocalStorage do mês selecionado e entregar para a lista.
      if (inputMonths.value == "total") {
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
                  localStorage.getItem(`dev.finances:transactions-${months[i]}`)
               ) || [];

            if (month[0] != "") {
               // alert("Funcionando");
               for (let n = 0; n < month.length; n++) {
                  total.push(month[n]);
               }
            }
         }
         // console.log(total);
         return total;
      } else {
         return (
            JSON.parse(
               localStorage.getItem(
                  `dev.finances:transactions-${inputMonths.value}`
               )
            ) || []
         );
      }
   },
   set(transaction) {
      // Cria um LocalStorage ou reescreve um existente com os valores do mês em questão.
      let inputMonths = document.getElementById("mes");
      localStorage.setItem(
         `dev.finances:transactions-${inputMonths.value}`,
         JSON.stringify(transaction)
      );
   },
};

// Sistema das transações ( add, remove, incomes, expenses, total)
const Transaction = {
   // pega o LocalStorage do mês selecionado e deposita no objeto para depois colocar na tabela no HTML.
   all: Storage.get(),

   add(transaction) {
      //Adiciona a transação no objeto e depois recarrega a tabela com os novos valores.
      Transaction.all.push(transaction);
      App.reload();
   },

   remove(index) {
      //função de remover os valores ao clicar no botam de - na tabela pelo usuário. E reinicia a aplicação.
      Transaction.all.splice(index, 1);
      App.reload();
   },

   incomes() {
      //Soma as entradas
      // Devolvem o total de income que tem a partir de um loop que verifica todos as transações com saldo positivo e soma para dentro de income
      let income = 0;

      // Para cara transação se ela for maior que zero, somar ao valor atual de income.
      Transaction.all.forEach((transaction) => {
         if (transaction.amount > 0) {
            income += transaction.amount;
         }
      });
      return income;
   },

   expenses() {
      //Soma as despesas, devolve o valor total de despesas do mês.
      let expenses = 0;

      // Para cara transação se ela for menor que zero, somar ao valor atual de expenses.
      Transaction.all.forEach((transaction) => {
         if (transaction.amount < 0) {
            expenses += transaction.amount;
         }
      });
      return expenses;
   },

   total() {
      //Soma o total das duas
      // Retorna a soma dos incomes e expenses e devolve o valor desse mês. Dependendo do valor positivo ou negativo o bg muda de cor.
      if (Transaction.incomes() + Transaction.expenses() < 0) {
         document.getElementById("container__total").style.backgroundColor =
            "#e92929";
      } else {
         document.getElementById("container__total").style.backgroundColor =
            "#49aa26";
      }
      //entradas -  saídas
      return Transaction.incomes() + Transaction.expenses();
   },
};

//Substituir os dados do html com os dados do js
const DOM = {
   transactionsContainer: document.querySelector(
      ".transaction__data-table tbody"
   ),

   //Função para adicionar um elemento a tabela.
   addTransaction(transaction, index) {
      // console.log("Funcionando até aqui");
      const tr = document.createElement("tr");
      tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
      tr.dataset.index = index;

      DOM.transactionsContainer.appendChild(tr);
   },

   //criação da transação
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

   //Atualiza as caixas de entrada, saída e total
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

   //limpa  a tabela
   clearTransactions() {
      DOM.transactionsContainer.innerHTML = "";
   },
};

//Formatação dos valores dos inputs
const Utils = {
   formatAmount(value) {
      value = value * 100;

      return Math.round(value);
   },

   formatDate(date) {
      const splittedDate = date.split("-");
      return ` ${splittedDate[2]} / ${splittedDate[1]} / ${splittedDate[0]}`;
   },
   formatDate2(date) {
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
};

//Formatação, criação e limpeza das transações da tabela
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
      Transaction.add(transaction);
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

// Sistema de sort(ordenar) as tablas pelo valores.

/*
 * Sorts a HTML table.
 *
 * @param {HTMLTableElement} table The table to sort
 * @param {number} column The index of the column to sort
 * @param {boolean} asc Determines if the sorting will be in ascending
 */

function sortTableByColumn(table, column, asc = true) {
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
      if (column == 1) {
         aColText = unFormartCurrency(aColText);
         bColText = unFormartCurrency(bColText);
         // console.log(aColText);
      }

      if (column == 2) {
         aColText = Utils.formatDate2(aColText).replace(/\s/g, "");
         bColText = Utils.formatDate2(bColText).replace(/\s/g, "");
         console.log(aColText);
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
}

document.querySelectorAll(".table-sortable th").forEach((headerCell) => {
   headerCell.addEventListener("click", () => {
      const tableElement = headerCell.parentElement.parentElement.parentElement;
      const headerIndex = Array.prototype.indexOf.call(
         headerCell.parentElement.children,
         headerCell
      );
      const currentIsAscending = headerCell.classList.contains("th-sort-asc");

      sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
   });
});

// Organiza a data automaticamente ao implementar algo ou atualizar a página
function organize() {
   var date = document.querySelector(".date");

   const tableElement = date.parentElement.parentElement.parentElement;
   const headerIndex = Array.prototype.indexOf.call(
      date.parentElement.children,
      date
   );
   // const currentIsAscending = date.classList.contains("th-sort-asc");
   const currentIsAscending = false;

   sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
}

function unFormartCurrency(value) {
   value = String(value);
   const prefix = /^-/gi.test(value) ? "-" : "";
   return Number(`${prefix}${Number(value.replace(/\D/g, "")) / 100}`);
}

//Inicialização da aplicação
const App = {
   //Inicia o app
   init() {
      // Transaction.all.forEach((transaction, index) => {
      //    DOM.addTransaction(transaction, index);
      // });

      Transaction.all.forEach(DOM.addTransaction);
      // Resumo pq a função esta recebendo os mesmos parâmetros e não está acontecendo mais nada
      // pode se resumir assim. Passando a função como um atalho ( pesquisar se quiser entender mais).
      organize();
      DOM.updateBalance();

      Storage.set(Transaction.all);
   },
   //recarrega apagando a tabela antiga e carregando com a nova
   reload() {
      DOM.clearTransactions();
      App.init();
   },

   update() {
      DOM.clearTransactions();
      Transaction.all = Storage.get();
      Transaction.all.forEach(DOM.addTransaction);
      DOM.updateBalance();
   },

   darkMode() {
      // alert("test");
      let $html = document.querySelector("html");
      $html.classList.toggle("dark-mode");
   },
};

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

// Sort each row. (Para resolver problema dos números de uma lista pq podem ser vistas como string)
/*
 const sortedRows = rows.sort((a, b) => {
   let aColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
   let bColText = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim();

   if (!isNaN(parseFloat(aColText)) && !isNaN(parseFloat(bColText))) {
       aColText = parseFloat(aColText)
       bColText = parseFloat(bColText)
   }

   return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
}
 */

// //Tirar o R$ para o sort conseguir ordenar corretamente
// aColText = aColText.replace(/(R\$|\ +)/gi, "");
// bColText = bColText.replace(/(R\$|\ +)/gi, "");
//
