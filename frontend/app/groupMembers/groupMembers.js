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
        .then(response => renderData(response))
        .catch(error => {
            console.error('Error: ', error.message);

            let table = document.querySelector('table');
            if(table){
                table.style.display = 'none'
            }

            alert('An error occurred while loading the data. Please try again.')
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


        //  tr.addEventListener('click', function(){
        //         const groupId = group['id']
        //         window.location.href = '../groupMembers/groupMembers.html?groupId=${groupId}'
        //     })

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

            table.appendChild(newRow)
        })
    }
}

document.addEventListener('DOMContentLoaded', getAllMembers)