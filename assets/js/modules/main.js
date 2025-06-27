// ===== LOADER =====
document.addEventListener('DOMContentLoaded', () => {
	const loader = document.querySelector('.loader');

	// Inicializar tema oscuro
	initDarkMode();

	// Inicializar cambio de idioma
	initLanguageToggle();

	// Inicializar navegación de proyectos
	initProjectsNavigation();

	// Inicializar parallax
	// initParallax();

	// Inicializar menú activo
	initActiveMenu();

	// Inicializar año actual
	updateCurrentYear();

	// Inicializar envío de email
	initSendEmail();

	// Inicializar efecto de escritura
	initTypingLoop();

	// Ocultar loader después de 1.5 segundos
	setTimeout(() => {
		if (loader) {
			loader.classList.add('hidden');
		}
	}, 1500);

	const projectsContainer = document.querySelector('.projects__container');
	const prevButton = document.querySelector('.projects__nav-button--prev');
	const nextButton = document.querySelector('.projects__nav-button--next');
	if (projectsContainer && prevButton && nextButton) {
		function getProjectScrollAmount() {
			const project = projectsContainer.querySelector('.projects__project');
			if (!project) return projectsContainer.offsetWidth;
			const style = window.getComputedStyle(project);
			const gap =
				parseFloat(style.marginRight) ||
				parseFloat(getComputedStyle(projectsContainer).gap) ||
				0;
			return project.offsetWidth + gap;
		}
		prevButton.addEventListener('click', () => {
			const scrollAmount = getProjectScrollAmount();
			projectsContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
		});
		nextButton.addEventListener('click', () => {
			const scrollAmount = getProjectScrollAmount();
			projectsContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
		});
	}
});

// ===== TYPING EFFECT LOOP FOR HOME TITLE =====
function initTypingLoop() {
	const title = document.querySelector('.home__title');
	if (!title) return;
	const text = 'Hola, soy Fani';
	let index = 0;
	let isDeleting = false;

	function type() {
		if (!isDeleting) {
			title.textContent = text.slice(0, index + 1);
			index++;
			if (index === text.length) {
				isDeleting = true;
				setTimeout(type, 1200); // Pausa al final
				return;
			}
		} else {
			title.textContent = text.slice(0, index - 1);
			index--;
			if (index === 0) {
				isDeleting = false;
				setTimeout(type, 600); // Pausa antes de volver a escribir
				return;
			}
		}
		setTimeout(type, isDeleting ? 60 : 100);
	}
	type();
}

// ===== PARALLAX EFFECT (DESACTIVADO) =====
/*
La siguiente función ha sido desactivada para permitir que la animación
de los iconos de fondo sea controlada exclusivamente por CSS.
*/
// function initParallax() {
// 	const iconsDOM = document.querySelectorAll('.home__layer');
// 	const homeDOM = document.querySelector('.home');

// 	if (!homeDOM || !iconsDOM.length) return;

// 	homeDOM.addEventListener('mousemove', (event) => {
// 		iconsDOM.forEach((icon) => {
// 			const speed = icon.getAttribute('data-speed') || 5;
// 			const x = (window.innerWidth - event.pageX * speed) / 100;
// 			const y = (window.innerHeight - event.pageY * speed) / 100;
// 			icon.style.transform = `translate(${x}px, ${y}px)`;
// 		});
// 	});
// }

// ===== ACTIVE MENU =====
function initActiveMenu() {
	const navbarLinksDOM = document.querySelectorAll('.navbar__link');
	const sectionsDOM = document.querySelectorAll('section[id]');
	const navbarMenu = document.getElementById('nav');

	if (!navbarLinksDOM.length || !sectionsDOM.length) return;

	function scrollActive() {
		const scrollY = window.scrollY;
		let currentSection = '';

		sectionsDOM.forEach((section) => {
			const sectionHeight = section.offsetHeight;
			const sectionTop = section.offsetTop - 100;
			const sectionId = section.getAttribute('id');

			if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
				currentSection = sectionId;
			}
		});

		navbarLinksDOM.forEach((link) => {
			link.classList.remove('active');
			if (link.getAttribute('href') === `#${currentSection}`) {
				link.classList.add('active');
			}
		});
	}

	// Activar al cargar la página
	scrollActive();

	// Activar al hacer scroll
	window.addEventListener('scroll', scrollActive);

	// Cerrar menú móvil y activar enlace al hacer clic
	navbarLinksDOM.forEach((link) => {
		link.addEventListener('click', () => {
			if (navbarMenu && navbarMenu.classList.contains('navbar__menu')) {
				navbarMenu.style.right = '-100%';
			}
			setTimeout(scrollActive, 100);
		});
	});

	window.addEventListener('hashchange', scrollActive);
}

// ===== CURRENT YEAR =====
function updateCurrentYear() {
	const currentYearDOM = document.querySelector('#currentyear');
	if (currentYearDOM) {
		currentYearDOM.textContent = `@${new Date().getFullYear()}`;
	}
}

// ===== SEND EMAIL =====
function initSendEmail() {
	const formDOM = document.querySelector('#form');
	const modalDOM = document.querySelector('#modal');
	const buttonCloseDOM = document.querySelector('#btn_close-modal');

	if (!formDOM) return;

	formDOM.addEventListener('submit', (e) => {
		e.preventDefault();
		const params = {
			name: document.getElementById('name')?.value || '',
			email: document.getElementById('email')?.value || '',
			subject: document.getElementById('subject')?.value || '',
			message: document.getElementById('message')?.value || '',
		};

		if (params.name && params.email && params.subject && params.message) {
			if (typeof emailjs !== 'undefined') {
				emailjs
					.send('service_bf8pegn', 'template_991ymha', params)
					.then((response) => {
						console.log('SUCCESS!', response.status, response.text);
						if (modalDOM) modalDOM.showModal();
						formDOM.reset();
					})
					.catch((error) => {
						console.log('FAILED...', error);
						alert(
							'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.',
						);
					});
			} else {
				console.log('EmailJS no está disponible');
				if (modalDOM) modalDOM.showModal();
				formDOM.reset();
			}
		} else {
			alert('Por favor, completa todos los campos del formulario.');
		}
	});

	if (buttonCloseDOM) {
		buttonCloseDOM.addEventListener('click', () => {
			if (modalDOM) modalDOM.close();
		});
	}
}

// ===== DARK THEME =====
function initDarkMode() {
	const themeButton = document.getElementById('darkmode-toggle');
	const darkTheme = 'dark-theme';

	if (!themeButton) return;

	const selectedTheme = localStorage.getItem('selected-theme');
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

	// Aplicar tema según preferencias del usuario o configuración guardada
	if (selectedTheme) {
		document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](
			darkTheme,
		);
		themeButton.checked = selectedTheme === 'dark';
	} else if (prefersDark) {
		document.body.classList.add(darkTheme);
		themeButton.checked = true;
	}

	themeButton.addEventListener('change', () => {
		document.body.classList.toggle(darkTheme);
		localStorage.setItem(
			'selected-theme',
			document.body.classList.contains(darkTheme) ? 'dark' : 'light',
		);
	});
}

// ===== LANGUAGE TOGGLE =====
function initLanguageToggle() {
	const languageToggle = document.getElementById('language-toggle');

	if (!languageToggle) return;

	const isEnglishPage = window.location.pathname.includes('english.html');
	languageToggle.checked = isEnglishPage;
	localStorage.setItem('selected-language', isEnglishPage ? 'en' : 'es');

	languageToggle.addEventListener('change', () => {
		localStorage.setItem(
			'selected-language',
			languageToggle.checked ? 'en' : 'es',
		);

		setTimeout(() => {
			if (languageToggle.checked) {
				if (!window.location.pathname.includes('english.html')) {
					window.location.href = 'english.html';
				}
			} else {
				if (window.location.pathname.includes('english.html')) {
					window.location.href = 'index.html';
				}
			}
		}, 50);
	});
}

// ===== PROJECTS NAVIGATION =====
function initProjectsNavigation() {
	const projectsContainer = document.querySelector('.projects__container');
	if (!projectsContainer) return;

	// Usar solo las flechas del HTML
	const prevButton = document.querySelector('.projects__nav-button--prev');
	const nextButton = document.querySelector('.projects__nav-button--next');

	function getProjectScrollAmount() {
		const project = projectsContainer.querySelector('.projects__project');
		if (!project) return projectsContainer.offsetWidth;
		const style = window.getComputedStyle(project);
		const gap =
			parseFloat(style.marginRight) ||
			parseFloat(getComputedStyle(projectsContainer).gap) ||
			0;
		return project.offsetWidth + gap;
	}

	if (prevButton && nextButton) {
		prevButton.addEventListener('click', () => {
			const scrollAmount = getProjectScrollAmount();
			projectsContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
		});
		nextButton.addEventListener('click', () => {
			const scrollAmount = getProjectScrollAmount();
			projectsContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
		});
	}
}

// Manejar errores no capturados
window.addEventListener('error', (event) => {
	console.error('Error no capturado:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
	console.error('Promesa rechazada no capturada:', event.reason);
});

// ===== RESTAURAR TITULO HOME SIN EFECTO DE MAQUINA DE ESCRIBIR =====
document.addEventListener('DOMContentLoaded', function () {
	const title = document.querySelector('.home__title');
	if (title) title.textContent = 'Hola, soy Fani';

	// Asegura el cursor animado en el título
	const homeTitleContainer = document.querySelector('.home__title-container');
	if (
		homeTitle &&
		homeTitleContainer &&
		!homeTitleContainer.querySelector('.home__title-cursor')
	) {
		const cursor = document.createElement('span');
		cursor.className = 'home__title-cursor';
		title.after(cursor);
	}
});
