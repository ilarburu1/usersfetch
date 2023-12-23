let updateUser = (id, currentAvatar) => {
  let row = document.getElementById(id);
  let avatarInput = row.querySelector('#avatar').files[0];
  let izena = row.children[2].children[0].value;
  let abizena = row.children[3].children[0].value;
  let email = row.children[4].children[0].value;

  let avatarFileName = avatarInput ? avatarInput : (currentAvatar || '');
  
  let formData = new FormData();
  formData.append('id', id);
  formData.append('izena', izena);
  formData.append('abizena', abizena);
  formData.append('email', email);
  formData.append('avatar', avatarFileName);
  
    fetch(`/users/update/${id}`, {
      method: 'PUT',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);  


        row.innerHTML = `
          <th scope="row">${id}</th>
          <td><img src="/uploads/${data[0].avatar}" alt="Avatar" style="width: 50px; height: 50px;"></td>
          <td>${izena}</td>
          <td>${abizena}</td>
          <td>${email}</td>
          <td> <a onclick="deleteUser('${id}')">[x]</a> <a onclick="editUser('${id}')">[e]</a>  </td>
        `;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
};



let editUser = (id) => {
  let row = document.getElementById(id);
  let izena = row.children[2].innerHTML;
  let abizena = row.children[3].innerHTML;
  let email = row.children[4].innerHTML;

  let currentAvatar = row.querySelector('img').getAttribute('src').split('/').pop();

  row.innerHTML = `
  <th scope="row">${id}</th>
  <td><input type="file" id="avatar" name="avatar"</td>
  <td><input type="text" id="izena" value="${izena}"></td>
  <td><input type="text" id="abizena" value="${abizena}"></td>
  <td><input type="text" id="email" value="${email}"></td>
  <td> <input type="button" onclick="updateUser('${id}', '${currentAvatar}')" value="Save"> </td>
  `;
}

let insertUser = (user) => {
var tableBody = document.getElementById("userTableBody");

// Loop through each user in the JSON array


const avatarSrc = `/uploads/${user.avatar || 'avatar-1703351104274-910967901.png'}`;

var newRow = tableBody.insertRow();
newRow.setAttribute("id", user._id);

const imgElement = document.createElement('img');
imgElement.src = avatarSrc;
imgElement.alt = 'Avatar';
imgElement.style.width = '100px';
imgElement.style.height = '100px';

const tdElement = document.createElement('td');
tdElement.appendChild(imgElement);

// Now you can use tdElement wherever you need it in your code.

newRow.innerHTML = `
              <th scope="row">${user._id}</th>
              <td><img src="${avatarSrc}" alt="Avatar" style="width: 50px; height: 50px;"></td>
              <td>${user.izena}</td>
              <td>${user.abizena}</td>
              <td>${user.email}</td>
              <td><a onclick="deleteUser('${user._id}')">[x]</a> <a onclick="editUser('${user._id}')">[e]</a>  </td>
          `;
};

let deleteUser = (id) => {

console.log(id);


  fetch(`/users/delete/${id}`, {
      method: 'DELETE'
  })
  .then(response => response.json())
  .then(data => {
      console.log(data);  // handle the response data or action
  })
  .catch((error) => {
      console.error('Error:', error);
  });

  let row = document.getElementById(id);
  row.parentNode.removeChild(row);
}

document.addEventListener("DOMContentLoaded", function () {
document.getElementById("formularioa").addEventListener("submit", (e) => {
  e.preventDefault();
  
  let formData = new FormData(e.target);


  fetch("/users/new", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      insertUser(data);
      console.log(data); // handle the response data or action
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

// Sample JSON array of users

fetch("/users/list")
  .then((r) => r.json())
  .then((users) => {
    console.log(users);
    // Select the table body where new rows will be appended

    users.forEach((user) => {
      insertUser(user);
    });
  });
});