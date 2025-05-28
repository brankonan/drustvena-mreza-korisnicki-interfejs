function initializeForm(){
    let submitBtn = document.querySelector("#submitBtn")
    submitBtn.addEventListener('click', submit)

    let cancelBtn = document.querySelector("#cancelBtn")
    cancelBtn.addEventListener('click', function(){
        window.location.href = '../groups/group.html'
    })
}

function submit(){
    let form = document.querySelector('#groupForm')
    let formData = new FormData(form)
    let input = Object.fromEntries(formData.entries())

    const reqBody = {
        Ime: input.name,
        DatumOsnivanja: input.date
        }

    let nameErrorMessage = document.querySelector('#nameError')
    nameErrorMessage.textContent = ''

    let dateErrorMessage = document.querySelector('#dateError')
    dateErrorMessage.textContent = ''

    if(input.name.trim() === ''){
        nameErrorMessage.textContent = 'Field is required'
    }
    if(input.date.trim() === ''){
        dateErrorMessage.textContent = 'Field is required'
    }

    
    fetch('http://localhost:18407/api/groups', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(reqBody)
    })
    .then(response =>{
        if(!response.ok){
            const error = new Error('Request failed. Status: ' + response.status)
            error.response = response
            throw error
        }
        return response.json()
    })
    .then(data => {
        window.location.href = '../groups/group.html'
    })
    .catch(error =>{

        console.error('Error:', error.message)
      if(error.response && error.response.status === 400) {
        alert('Data is invalid!')
      }
      else {
        alert('An error occurred while updating the data. Please try again.')
    }
    })
}

document.addEventListener('DOMContentLoaded', initializeForm)