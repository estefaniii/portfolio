const iconsDOM = document.querySelectorAll('.home__layer');
const homeDOM = document.querySelector('.home');

function parallax() {
	homeDOM.addEventListener('mousemove', (event) => {
		iconsDOM.forEach((icon) => {
			const speed = icon.getAttribute('data-speed');
			const x = (window.innerWidth - event.pageX * speed) / 100;
			const y = (window.innerHeight - event.pageY * speed) / 100;
			icon.style.transform = `translate(${x}px, ${y}px)`;
		});
	});
}

export default parallax;
