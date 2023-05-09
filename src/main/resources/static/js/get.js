import { setReturnMovieBtns, setRentMovieBtns, movieIdAndCost } from './buttonHanders.js';
import { postRent } from './post.js';

// MOVIE GET
export const getMovie = () => {
    const conteiner = document.querySelector('.section_rent__data');
    conteiner.innerHTML = '';

    fetch('http://127.0.0.1:8080/movies')
        .then(res => res.json())
        .then(data => {
            data.forEach(element => {
                const html = `<div class="data_rent__record">
                    <span class="data_rent__text">Tytuł:</span> ${element.title} <br>
                    <span class="data_rent__text">Kategoria:</span> ${element.category} <br>
                    <span class="data_rent__text">Reżyser:</span> ${element.director} <br>
                    <span class="data_rent__text">Rok wydania:</span> ${element.publicationDate} <br>  
                    <span class="data_rent__text">Ocena:</span> ${element.rating} <br>
                    <span class="data_rent__text">Cena wypożyczenia:</span> ${element.rentalCost.toFixed(2)} zł <br>
                    <span class="data_rent__text">Opis:</span> ${element.description} <br>
                    ${element.availability ? `<button class="data_rent__btn btn" id="${element.id}-${element.rentalCost.toFixed(2)}">Wypożycz</button>` : ''}
                </div >
                <div class="data_rent__img">
                    <img src="../images/${element.id}.jpg"
                </div>`;
                conteiner.insertAdjacentHTML('beforeEnd', html);
            });
        })
        .then(() => setRentMovieBtns())
        .catch(error => console.log(error));
}

// RENT GET
export const getRent = () => {
    const conteiner = document.querySelector('.section_return__data');
    conteiner.innerHTML = '';

    fetch('http://127.0.0.1:8080/rents/notReturned')
        .then(res => res.json())
        .then(data => {
            data.forEach(element => {
                const html = `<div class="data_return__record">
                    <span class="data_return__text">Użytkownik:</span> ${element.customerId.name} ${element.customerId.lastName} <br>
                    <span class="data_return__text">Nr. telefonu:</span> ${element.customerId.phoneNumber} <br>
                    <span class="data_return__text">Wypożyczony film:</span> ${element.movieId.title} <br>
                    <span class="data_return__text">Data wypożyczenia: </span> ${element.rentDate} 
                </div>
                <button class="data_return__btn btn">Zwróć</button>`;
                conteiner.insertAdjacentHTML('beforeEnd', html);
            })
        })
        .then(() => setReturnMovieBtns())
        .catch(error => console.log(error));
}

// RENT GET BY PHONE NUMBER 
export const getRentByPhoneNumber = e => {
    e.preventDefault();
    const display = document.querySelector('.section_rent__popup .form__display');
    const phoneNumber = document.getElementById('phone-num').value;
    let customerId;
    let check = true;

    fetch(`http://127.0.0.1:8080/customer/phoneNumber/${phoneNumber}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.status === 404) {
                display.textContent = 'Podany numer telefonu nie znajduje się w bazie danych!';
                display.classList.add('form__display--red');
                check = false;
            }
            if (check) customerId = data.id;
        })
        .then(() => {
            // ADDING NEW RENT
            if (check) {
                postRent(customerId, movieIdAndCost, display);
            }
        })
        .catch(error => {
            display.textContent = 'Podany numer telefonu nie znajduje się w bazie danych!';
            display.classList.remove('form__display--green');
            display.classList.add('form__display--red');
            console.log(error);
        });
}