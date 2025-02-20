const currentYearDOM = document.querySelector('#currentyear');

function updateCurrentYear() {
	const currentYear = new Date().getFullYear(); // 2025

	currentYearDOM.textContent = `@${currentYear}`;
}

export default updateCurrentYear;
