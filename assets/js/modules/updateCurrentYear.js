const currentYearDOM = document.querySelector('#currentyear');

function updateCurrentYear() {
	const currentYear = new Date().getFullYear();
	currentYearDOM.textContent = `@${currentYear}`;
}

export default updateCurrentYear;
