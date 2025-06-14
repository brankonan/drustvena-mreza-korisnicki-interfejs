let members = [];
let allUsers = [];

function getAllUsers(){
    fetch('http://localhost:18407/api/korisnici')
        .then(res => {
             if(!res.ok){
                throw new Error('Request failed. Status: ' + res.status)
            }
            return res.json()
        })
        .then(data => {
            allUsers = data;
            getAllMembers(); 
        })
        .catch(error => {
            console.error('Error: ', error.message);

            let table = document.querySelector('table');
            if(table){
                table.style.display = 'none'
            }

            alert('An error occurred while loading the data. Please try again.')
        })
    }

function getAllMembers(){
    const urlParams = new URLSearchParams(window.location.search);
    const groupId = urlParams.get('groupId');

    fetch(`http://localhost:18407/api/grupe/${groupId}/korisnici`, {method: 'GET'})
     .then(response => {
            if(!response.ok){
                throw new Error('Request failed. Status: ' + response.status)
            }
            return response.json()
        })
        .then(response => {
            members = response
            renderData(members)
            renderNonMembers()
        })
        .catch(error => {
            console.error('Error: ', error.message);

            let table = document.querySelector('table');
            if(table){
                table.style.display = 'none'
            }

            alert('An error occurred while loading the data. Please try again.')
        })
}

function renderNonMembers() {
    const table = document.querySelector('#nonmembers-tbody');
    table.innerHTML = ''

    const membersId = members.map(m => m.id);
    const nonMembers = allUsers.filter(u => !membersId.includes(u.id));

    let tableHeader =document.querySelector('#nonmembers-thead')
    let noDataMessage = document.querySelector('#no-nonmembers-message')

    if (nonMembers.length === 0) {
        tableHeader.classList.add('hidden');
        noDataMessage.classList.remove('hidden');
        return; 
    } else {
        noDataMessage.classList.add('hidden');
        tableHeader.classList.remove('hidden');
    }

    nonMembers.forEach(user => {
        const tr = document.createElement('tr')
        
        tr.innerHTML = `
            <td>${user.korisnickoIme}</td>
            <td>${user.ime}</td>
            <td>${user.prezime}</td>
            <td>${user.datum ? user.datum.substring(0, 10) : ''}</td>
            <td><button onclick="addUserToGroup(${user.id})">Dodaj</button></td>
        `

        table.appendChild(tr);
    })
}

    function addUserToGroup(userId) {
    const urlParams = new URLSearchParams(window.location.search);
    const groupId = urlParams.get('groupId');

    fetch(`http://localhost:18407/api/grupe/${groupId}/korisnici/${userId}`, {
        method: 'PUT'
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Korisnik ili grupa nisu pronađeni.');
            } else {
                throw new Error('Greška prilikom dodavanja korisnika u grupu.');
            }
        }
    })
    .then(() => {
        alert(`Korisnik ${userId} je uspešno dodat u grupu ${groupId}.`);
        getAllMembers(); 
    })
    .catch(error => {
        console.error('Greška:', error.message);
        alert(error.message);
    });
}


function renderData(data) {
    let table = document.querySelector('table tbody')
    table.innerHTML = ''

    let tableHeader =document.querySelector('table thead')
    let noDataMessage = document.querySelector('#no-data-message')

    if (data.length === 0) {
        tableHeader.classList.add('hidden')
        noDataMessage.classList.remove('hidden')
    } else {
        noDataMessage.classList.add('hidden')
        tableHeader.classList.remove('hidden')

        data.forEach(user => {
            let newRow = document.createElement('tr')

            let cell1 = document.createElement('td')
            cell1.textContent = user.korisnickoIme
            newRow.appendChild(cell1)

            let cell2 = document.createElement('td')
            cell2.textContent = user.ime
            newRow.appendChild(cell2)

            let cell3 = document.createElement('td')
            cell3.textContent = user.prezime
            newRow.appendChild(cell3)

            let cell4 = document.createElement('td')
            cell4.textContent = user.datum ? user.datum.substring(0, 10) : ""
            newRow.appendChild(cell4)

            let cell5 = document.createElement('td');
            let deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', function() {
                const urlParams = new URLSearchParams(window.location.search);
                const groupId = urlParams.get('groupId');

                fetch(`http://localhost:18407/api/grupe/${groupId}/korisnici/${user.id}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (!response.ok) {
                        if (response.status === 404) {
                            throw new Error('Korisnik ili grupa nisu pronađeni.');
                        } else {
                            throw new Error('Greška prilikom uklanjanja korisnika iz grupe.');
                        }
                    }
                })
                .then(() => {
                    alert(`Korisnik ${user.korisnickoIme} je uspešno uklonjen iz grupe ${groupId}.`);
                    getAllMembers(); 
                })
                .catch(error => {
                    console.error('Greška:', error.message);
                    alert(error.message);
                });
            });
            cell5.appendChild(deleteBtn);
            newRow.appendChild(cell5);

            table.appendChild(newRow);
        })
    }
}

document.addEventListener('DOMContentLoaded', getAllUsers)