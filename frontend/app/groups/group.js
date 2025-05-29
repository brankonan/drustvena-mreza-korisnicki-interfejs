
function getAll(){
    fetch('http://localhost:18407/api/groups')
        .then(response => {
            if(!response.ok){
                throw new Error('Request failed. Status: ' + response.status)
            }
            return response.json()
        })
        .then(groups => renderData(groups))
        .catch(error => {
            console.error('Error: ', error.message);

            let table = document.querySelector('table');
            if(table){
                table.style.display = 'none'
            }

            alert('An error occurred while loading the data. Please try again.')
        })
}

function renderData(data){
    let table = document.querySelector('#groups-table-body')
    table.innerHTML = ''

    let tHeader = document.querySelector('table thead')
    let noDataMess = document.querySelector('#no-data-message')

    let addBtn = document.querySelector('#addBtn')
    addBtn.addEventListener('click', function(){
        window.location.href = '../groupsForm/groupsForm.html'
    })

    if(data.length === 0){
        tHeader.classList.add('hidden')
        noDataMess.classList.remove('hidden')
    }
    else{
        tHeader.classList.remove('hidden')
        noDataMess.classList.add('hidden')

        data.forEach(group => {
            let tr = document.createElement('tr')

            // tr.addEventListener('click', function(){
            //     const groupId = group['id']
            //     window.location.href = '../groupMembers/groupMembers.html?groupId=' + groupId
            // })

            let tdDetails = document.createElement('td')
            let detailsBtn = document.createElement('button')
            detailsBtn.textContent = 'Detalji'
            detailsBtn.addEventListener('click', function() {
                //otvara se stranica clanova te grupe i prosledi se gruopId kao query parametar
                window.location.href = '../groupMembers/groupMembers.html?groupId=' + group['id']
            })
            tdDetails.appendChild(detailsBtn)

            let groupName = document.createElement('td')
            groupName.textContent = group['ime']

            let groupDate = document.createElement('td')
            groupDate.textContent = new Date(group['datumOsnivanja']).toLocaleDateString()

            let tdDel = document.createElement('td')
            let deleteBtn = document.createElement('button')
            deleteBtn.textContent = 'Delete'

            deleteBtn.addEventListener('click', function(){
                fetch('http://localhost:18407/api/groups/' + group['id'], {method: 'DELETE'})
                    .then(response => {
                        if(!response.ok){
                            const error = new Error('Request failed. Status: ' + response.status)
                            error.response = response
                            throw error
                        }
                        getAll()
                    })
                    .catch(error => {
                        console.error('Error: ' + error.message)
                        if(error.response && error.response.status === 404){
                            alert('Group does not exist!')
                        }else{
                            alert('An error occurred while deleting the book. Please try again.')
                        }
                    })
            })
            tdDel.appendChild(deleteBtn)
            

            tr.appendChild(groupName)
            tr.appendChild(groupDate)
            tr.appendChild(tdDetails)
            tr.appendChild(tdDel)
            table.appendChild(tr)

        });
    }
}

document.addEventListener('DOMContentLoaded', getAll)