const toggleDOM = document.getElementById('language-toggle');
const currentlang = window.location.href.includes('english.html');
toggleDOM.checked = currentlang;

function changeLanguage() {
	toggleDOM.addEventListener('change', () => {
		if (toggleDOM.checked) {
			window.location.href = 'english.html';
		} else {
			window.location.href = 'index.html';
		}
	});
}

export default changeLanguage;
