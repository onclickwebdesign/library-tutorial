require('../css/styles.css');
const $ = require('jquery');
import 'bootstrap/dist/js/bootstrap.bundle';

console.log($);

const removeBook = async elem => {
    const id = elem.getAttribute('data-bookid');

    try {
        const result = await fetch(`/books/deletebook/${id}`, { method: 'DELETE' });
        const jsonResponse = await result.json();
        console.log(jsonResponse.msg);
        $('#removeBookModal').modal('hide');
    } catch (err) {
        console.error('Fetch error: ', err);
    }
};

const setDataAttribute = elem => {
    const id = elem.getAttribute('data-bookid');
    document.getElementById('removeBookConfirm').setAttribute('data-bookid', id);
};

$('#books-table').on('click', '.remove-book', event => {
    setDataAttribute(event.currentTarget);
});

$('#book-cards-list').on('click', '.remove-book', event => {
    setDataAttribute(event.currentTarget);
});

// this event triggered from "removeBookModal" yes button
$('#removeBookConfirm').on('click', event => {
    removeBook(event.currentTarget);
});