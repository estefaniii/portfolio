// ===== LOADER =====
document.addEventListener('DOMContentLoaded', () => {
	const loader = document.querySelector('.loader');

	// Inicializar tema oscuro
	initDarkMode();

	// Inicializar cambio de idioma
	initLanguageToggle();

	// Inicializar carrusel de proyectos
	initAutoCarousel({
		track: document.querySelector('.projects__container'),
		prevButton: document.querySelector('.projects__nav-button--prev'),
		nextButton: document.querySelector('.projects__nav-button--next'),
		speed: 18,
	});

	// Inicializar carrusel de herramientas
	initAutoCarousel({
		track: document.querySelector('.skills__tech'),
		prevButton: document.querySelector('.skills__nav-button--prev'),
		nextButton: document.querySelector('.skills__nav-button--next'),
		speed: 22,
		keepColors: true,
	});

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
	const text = window.location.pathname.includes('english.html')
		? "Hello, I'm Fani"
		: 'Hola, soy Fani';
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

// ===== NAVBAR SLIDER ANIMATION =====
function initNavbarSlider() {
	const navbarList = document.querySelector('.navbar__list');
	const navbarLinks = document.querySelectorAll('.navbar__link');
	if (!navbarList || !navbarLinks.length) return;

	// Crear el slider si no existe
	let slider = navbarList.querySelector('.navbar__slider');
	if (!slider) {
		slider = document.createElement('div');
		slider.className = 'navbar__slider';
		navbarList.appendChild(slider);
	}

	function moveSliderToActive() {
		const activeLink = navbarList.querySelector('.navbar__link.active');
		if (activeLink) {
			const linkRect = activeLink.getBoundingClientRect();
			const listRect = navbarList.getBoundingClientRect();
			slider.style.left = linkRect.left - listRect.left + 'px';
			slider.style.width = linkRect.width + 'px';
			slider.style.opacity = 1;
		} else {
			slider.style.width = '0';
			slider.style.opacity = 0;
		}
	}

	// Mover el slider al cargar y al cambiar de sección
	moveSliderToActive();
	window.addEventListener('resize', moveSliderToActive);
	document.addEventListener('scroll', moveSliderToActive, true);
	window.addEventListener('hashchange', moveSliderToActive);

	// Solo mover el slider cuando se hace clic en un enlace
	navbarLinks.forEach((link) => {
		link.addEventListener('click', () => {
			setTimeout(moveSliderToActive, 100); // Espera a que se actualice la clase active
		});
	});
}

// Llamar a la función al cargar
initNavbarSlider();

// ===== CURRENT YEAR =====
function updateCurrentYear() {
	const currentYearDOM = document.querySelector('#currentyear');
	if (currentYearDOM) {
		currentYearDOM.textContent = `© ${new Date().getFullYear()} Estéfani Torres.`;
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

// ===== CARRUSEL CONTINUO (herramientas y proyectos) =====
// speed: píxeles por segundo, para un movimiento suave y lento
function initAutoCarousel({ track, prevButton, nextButton, speed, keepColors = false }) {
	if (!track || !prevButton || !nextButton) return;

	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const originals = [...track.children];
	let paused = false;
	let resumeTimer = null;

	// segunda copia de las tarjetas para que el final empalme con el inicio
	const clones = originals.map((card) => {
		const clone = card.cloneNode(true);
		clone.setAttribute('aria-hidden', 'true');
		clone.querySelectorAll('summary, a, button').forEach((el) => el.setAttribute('tabindex', '-1'));
		track.appendChild(clone);
		return clone;
	});

	// las copias quedan fuera de las reglas :nth-child, así que heredan el color de su original
	function copyColors() {
		clones.forEach((clone, i) => {
			const original = originals[i];
			clone.style.borderColor = getComputedStyle(original).borderTopColor;
			const title = original.querySelector('.skills__cards-title');
			clone.querySelector('.skills__cards-title').style.color = getComputedStyle(title).color;
		});
	}
	if (keepColors) {
		copyColors();
		document.getElementById('darkmode-toggle')?.addEventListener('change', () => setTimeout(copyColors, 50));
	}

	const half = () => track.scrollWidth / 2;
	let position = 0;

	function wrap() {
		if (position >= half()) position -= half();
		if (position < 0) position += half();
		track.scrollLeft = position;
	}

	let last = performance.now();
	function tick(now) {
		// el avance depende del tiempo, no de los cuadros: igual en pantallas de 60 o 120 Hz
		const dt = Math.min((now - last) / 1000, 0.1);
		last = now;
		if (!paused && !document.hidden && !track.querySelector('details[open]')) {
			position += speed * dt;
			wrap();
		}
		requestAnimationFrame(tick);
	}

	function step() {
		const card = originals[0];
		const gap = parseFloat(getComputedStyle(track).gap) || 0;
		return card.offsetWidth + gap;
	}

	// las flechas mueven una tarjeta con una pequeña animación y luego sigue el movimiento
	function nudge(direction) {
		paused = true;
		const from = position;
		const to = position + direction * step();
		const start = performance.now();
		function animate(now) {
			const t = Math.min((now - start) / 350, 1);
			position = from + (to - from) * (1 - Math.pow(1 - t, 3));
			wrap();
			if (t < 1) requestAnimationFrame(animate);
			else pauseFor(1500);
		}
		requestAnimationFrame(animate);
	}

	function pauseFor(ms) {
		clearTimeout(resumeTimer);
		resumeTimer = setTimeout(() => (paused = false), ms);
	}

	prevButton.addEventListener('click', () => nudge(-1));
	nextButton.addEventListener('click', () => nudge(1));

	// si la persona desliza con el dedo, seguir desde donde lo dejó
	track.addEventListener('scroll', () => {
		if (paused) position = track.scrollLeft;
	}, { passive: true });

	const carousel = track.parentElement || track;
	carousel.addEventListener('mouseenter', () => {
		clearTimeout(resumeTimer);
		paused = true;
	});
	carousel.addEventListener('mouseleave', () => pauseFor(300));
	track.addEventListener('touchstart', () => {
		clearTimeout(resumeTimer);
		paused = true;
	}, { passive: true });
	track.addEventListener('touchend', () => pauseFor(2500), { passive: true });

	if (!reduceMotion) requestAnimationFrame(tick);
}

// Manejar errores no capturados
window.addEventListener('error', (event) => {
	console.error('Error no capturado:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
	console.error('Promesa rechazada no capturada:', event.reason);
});

// ===== RESTAURAR TITULO HOME SEGÚN IDIOMA =====
document.addEventListener('DOMContentLoaded', function () {
	const title = document.querySelector('.home__title');
	if (title) {
		if (window.location.pathname.includes('english.html')) {
			title.textContent = "Hello, I'm Fani";
		} else {
			title.textContent = 'Hola, soy Fani';
		}
	}

	// Asegura el cursor animado en el título
	const homeTitleContainer = document.querySelector('.home__title-container');
	if (
		title &&
		homeTitleContainer &&
		!homeTitleContainer.querySelector('.home__title-cursor')
	) {
		const cursor = document.createElement('span');
		cursor.className = 'home__title-cursor';
		title.after(cursor);
	}
});
