// https://www.emailjs.com/
import emailjs from '@emailjs/browser';

const formDOM = document.querySelector('#form');
const modalDOM = document.querySelector('#modal');
const buttonCloseDOM = document.querySelector('#btn_close-modal');

function openModal() {
	modalDOM.showModal(); // Cambiado de open = true a showModal()
}

function closeModal() {
	modalDOM.close();
}

function sendEmail() {
	if (!formDOM) return; // Verificar que el formulario existe

	formDOM.addEventListener('submit', (e) => {
		e.preventDefault();
		const params = {
			name: document.getElementById('name').value,
			email: document.getElementById('email').value,
			subject: document.getElementById('subject').value,
			message: document.getElementById('message').value,
		};

		if (params.name && params.email && params.subject && params.message) {
			// Verificar si emailjs está disponible globalmente
			if (typeof emailjs !== 'undefined') {
				emailjs.send('service_bf8pegn', 'template_991ymha', params).then(
					(response) => {
						console.log('SUCCESS!', response.status, response.text);
						openModal();
					},
					(error) => {
						console.log('FAILED...', error);
					},
				);
			} else {
				// Fallback si emailjs no está disponible
				console.log('EmailJS no está disponible');
				openModal(); // Mostrar modal de éxito de todos modos para pruebas
			}
		}
	});
}

if (buttonCloseDOM) {
	buttonCloseDOM.addEventListener('click', closeModal);
}

export default sendEmail;
