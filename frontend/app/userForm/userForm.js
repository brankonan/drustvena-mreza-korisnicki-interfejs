function initializeForm() {
    let submitBtn = document.querySelector('#submitBtn')
    submitBtn.addEventListener('click', submit)

    let cancelBtn = document.querySelector('#cancelBtn')
    cancelBtn.addEventListener('click', function() {
        window.location.href = '../index.html'
    })
}


function get() {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    if (!id) {return}

    fetch('http://localhost:18407/api/korisnici/' + id)
        .then(function(response) {
            if(!response.ok) {
                const error = new Error('Request failed. Statius: ' + response.status)
                error.response = response
                throw error
            }
            return response.json()
        })
        .then(function(user) {
            document.querySelector('#korisnickoIme').value = user.korisnickoIme
            document.querySelector('#ime').value = user.ime
            document.querySelector('#prezime').value = user.prezime
            document.querySelector('#datumRodjenja').value = user.datum
        })
        .catch(function(error) {
            console.error('Error: ', error.message)
            if (error.response && error.response.status === 404) {
                alert('User does not exist!')
            } else {
                alert('An error occurred while loading the data. Please try again.')
            }
        })
}
function submit() {
    const form =document.querySelector('#form')
    const formData = new FormData(form)

    const reqBody = {
        korisnickoIme: formData.get('korisnickoIme'),
        ime: formData.get('ime'),
        prezime: formData.get('prezime'),
        datum: formData.get('datum')
    }

    const usernameErrorMessage = document.querySelector('#korisnickoImeError').textContent = '';
    const nameErrorMessage =  document.querySelector('#imeError').textContent = '';
    const lastnameErrorMessage = document.querySelector('#prezimeError').textContent = '';
    const dateErrorMessage = document.querySelector('#datumError').textContent = '';


    if(reqBody.korisnickoIme.trim() === ''){ // validacija da uneti podaci nisu prazni
        usernameErrorMessage.textContent = 'Username field is required'
        return
    }
    if(reqBody.ime.trim() === ''){
        nameErrorMessage.textContent = 'Name field is required'
        return
    }
    if(reqBody.prezime.trim() === ''){
        lastnameErrorMessage.textContent = 'Surename field is required'
        return
    }
    if(reqBody.datum.trim() === ''){
        dateErrorMessage.textContent = 'Date field is required'
        return
    }

    let method = 'POST'
    let url = 'http://localhost:18407/api/korisnici'

    //ovde odlucujem da li POST ili PUT spram id-ja

    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    if(id) {
        method = 'PUT'
        url = 'http://localhost:18407/api/korisnici/' + id
    }

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody)
    })
    .then(response => {
        if(!response.ok) {
            //ako statusni kod nije iz 200 serije, kreiramo gresku
            const error = new Error('Request failed. Status: ' + response.status)
            error.response = response
            throw error
        }
        return response.json()
    })
    .then(data => {
        window.location.href = '../index.html'
    })
    .catch(error => {
        console.error('Error: ', error.message)
        //ovde proveravam ako je u pitanju azuriranje knjige(PUT)
        if(error.response && error.response.status === 400) {
            alert('Data is invalid')
        } else {
            alert('An error occurred while updating the data. Please try again.')
        }
    })

}
document.addEventListener('DOMContentLoaded', initializeForm)