function getAll() {
    fetch('http://localhost:18407/api/korisnici')
    .then(function(response) {
        if(!response.ok) {
            throw new Error('Request failed. Status: ' + response.status)
        }
        return response.json()
    })
    .then(function(korisnici) {
        renderData(korisnici)
    })
    .catch(function(error) {
        console.error('Error:', error.message)
        let table = document.querySelector('table')
        if(table) {
            table.style.display = 'none'
        }
        alert ('An error occured while loading the data. Please try again.')
    })
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

       // console.log(data);

        data.forEach(function(user) {
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

            //EDIT DUGME

            let cell5 = document.createElement('td')
            let editButton = document.createElement('button')
            editButton.textContent = 'Edit'
            editButton.addEventListener('click', function() {
            window.location.href = './userForm/userForm.html?id=' + user.id
            })
            cell5.appendChild(editButton)
            newRow.appendChild(cell5)

            //DELETE DUGME

            let cell6 = document.createElement('td')
            let deleteButtton = document.createElement('button')
            deleteButtton.textContent = 'Delete'
            deleteButtton.addEventListener('click', function () {
                fetch('http://localhost:18407/api/korisnici/' + user.id, {method: 'DELETE'})
                    .then(function(response) {
                        if (!response.ok) {
                            const error = new Error('Request failed. Status: ' + response.status)
                            error.response = response
                            throw error
                        }
                        getAll()
                    })
                    .catch(function(error) {
                        console.error('Error: ', error.message)
                        if (error.response && error.response.status === 404) {
                            alert('User does not exist!')
                        } else {
                            alert('An error occurred while deleting the user. Please try again.')
                        }
                    })      
            })
            cell6.appendChild(deleteButtton)
            newRow.appendChild(cell6)

            table.appendChild(newRow)
        })
    }
}

document.addEventListener('DOMContentLoaded', getAll)

let addBtn = document.querySelector('#addBtn')
addBtn.addEventListener("click", function() {
    window.location.href = './userForm/userForm.html'
})