fetch("http://localhost:3001/data")
  .then((data) => data.json())
  .then((data) => {
    data = JSON.parse(data);
    data.forEach((item) => {
      renderRow(item);
    });
  });

const deleteButtons = document.querySelectorAll(".delete-btn");
const deleteSubmit = document.querySelector(".piska");
const addForm = document.querySelector(".hui");
const addFormButton = document.querySelector(".add-button");
const addSubmitFormButton = document.querySelector(".add-form-btn");
const closeButtons = document.querySelectorAll(".close");
const table = document.querySelector("table > tbody");
const changeForm = document.querySelector(".change-form");
const showChangeFormBtns = document.querySelectorAll(".change-btn");
const submitChangeBtn = document.querySelector(".sbm-chng-btn");

deleteButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const row = e.target.parentElement.parentElement;
    deleteSubmit.style.display = "block";
    deleteItem(row);
  });
});

addFormButton.addEventListener("click", (e) => {
  e.preventDefault();
  addForm.style.display = "block";
});

addSubmitFormButton.addEventListener("click", (e) => {
  e.preventDefault();
  let data = {
    name: addForm.querySelector(".name").value,
    group: addForm.querySelector(".group").value,
    phone: addForm.querySelector(".phone").value,
  };
  renderRow(data);
  fetch(`http://localhost:3001/data/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify({ data: data }),
  }).then((res) => {
    console.log(res);
  });

  addForm.style.display = "none";
});
closeButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    console.log(e.target.parentElement);
    e.target.parentElement.parentElement.style.display = "none";
  });
});

let currentRow;
showChangeFormBtns.forEach((item) => {
  item.addEventListener("click", (e) => {
    changeHandler(e);
  });
});

submitChangeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let allInputs = [...changeForm.querySelectorAll("input")];
  allInputs.pop();
  let data = {
    name: changeForm.querySelector(".name").value,
    group: changeForm.querySelector(".group").value,
    phone: changeForm.querySelector(".phone").value,
  };
  let number;
  [...table.children].forEach((item, i) => {
    if (currentRow === item) number = i;
  });
  allInputs.forEach((item, i) => {
    currentRow.children[i].textContent = allInputs[i].value;
  });
  fetch(`http://localhost:3001/data/change`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify({
      data: data,
      number: number,
    }),
  }).then((res) => {
    console.log(res);
  });

  changeForm.style.display = "none";
});

function deleteItem(row) {
  const yesBtn = deleteSubmit.querySelector(".yes-btn");
  yesBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let number;
    [...table.children].forEach((item, i) => {
      console.log(item, row);
      if (item === row) number = i;
    });
    row.remove();
    deleteSubmit.style.display = "none";

    console.log(number);
    fetch(`http://localhost:3001/data/delete/${number}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  });
}

function renderRow(data) {
  let row = `
    <td>${data.name}</td>
    <td>${data.group}</td>
    <td>${data.phone}</td>
    `;
  const deleteBtn = document.createElement("a");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.textContent = "Удалить";
  deleteBtn.href = "подтверждение.html";
  deleteBtn.addEventListener("click", (ev) => {
    ev.preventDefault();
    deleteSubmit.style.display = "block";
    deleteItem(ev.target.parentElement.parentElement);
  });
  const changeBtn = document.createElement("a");
  changeBtn.classList.add("change-btn");
  changeBtn.textContent = "Изменить";
  changeBtn.href = "#";
  changeBtn.addEventListener("click", (ev) => {
    changeHandler(ev);
  });
  const deleteTh = document.createElement("th");
  deleteTh.append(deleteBtn, changeBtn);
  let tr = document.createElement("tr");
  tr.innerHTML = row;
  tr.append(deleteTh);
  table.append(tr);
}

function changeHandler(e) {
  e.preventDefault();
  changeForm.style.display = "block";
  currentRow = e.target.parentElement.parentElement;
  let allInputs = [...changeForm.querySelectorAll("input")];
  allInputs.pop();
  allInputs.forEach((item, i) => {
    item.value = currentRow.children[i].textContent;
  });
}
