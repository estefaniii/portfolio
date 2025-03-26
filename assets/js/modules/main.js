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
	initParallax();

	// Inicializar menú activo
	initActiveMenu();

	// Inicializar año actual
	updateCurrentYear();

	// Inicializar envío de email
	initSendEmail();

	// Inicializar efecto de escritura
	initTypingEffect();

	// Ocultar loader después de 1.5 segundos
	setTimeout(() => {
		if (loader) {
			loader.classList.add('hidden');
		}
	}, 1500);
});

// ===== TYPING EFFECT =====
function initTypingEffect() {
	const homeTitle = document.querySelector('.home__title');
	const homeTitleContainer = document.querySelector('.home__title-container');

	if (!homeTitle || !homeTitleContainer) return;

	// Texto original
	const originalText = homeTitle.textContent;
	// Limpiar el contenido inicial
	homeTitle.textContent = '';

	// Crear el cursor
	const cursor = document.createElement('span');
	cursor.className = 'home__title-cursor';
	homeTitleContainer.appendChild(cursor);

	// Función para escribir el texto
	function typeText(text, index = 0) {
		if (index < text.length) {
			homeTitle.textContent += text.charAt(index);
			index++;
			setTimeout(() => typeText(text, index), 150); // Velocidad de escritura
		} else {
			// Cuando termina de escribir, espera y luego borra
			setTimeout(eraseText, 2000);
		}
	}

	// Función para borrar el texto
	function eraseText() {
		const text = homeTitle.textContent;
		if (text.length > 0) {
			homeTitle.textContent = text.substring(0, text.length - 1);
			setTimeout(eraseText, 50); // Velocidad de borrado
		} else {
			// Cuando termina de borrar, espera y vuelve a escribir
			setTimeout(() => typeText(originalText), 500);
		}
	}

	// Iniciar el efecto de escritura
	setTimeout(() => typeText(originalText), 1000);
}

// ===== PARALLAX EFFECT =====
function initParallax() {
	const iconsDOM = document.querySelectorAll('.home__layer');
	const homeDOM = document.querySelector('.home');

	if (!homeDOM) return;

	homeDOM.addEventListener('mousemove', (event) => {
		iconsDOM.forEach((icon) => {
			const speed = icon.getAttribute('data-speed');
			const x = (window.innerWidth - event.pageX * speed) / 100;
			const y = (window.innerHeight - event.pageY * speed) / 100;
			icon.style.transform = `translate(${x}px, ${y}px)`;
		});
	});
}

// ===== ACTIVE MENU =====
function initActiveMenu() {
	const navbarListDOM = document.querySelector('.navbar__list');
	const navbarLinksDOM = document.querySelectorAll('.navbar__link');
	const sectionsDOM = document.querySelectorAll('section[id]');

	if (!navbarListDOM || !navbarLinksDOM.length || !sectionsDOM.length) return;

	function scrollActive() {
		const scrollY = window.pageYOffset;

		sectionsDOM.forEach((current) => {
			const sectionHeight = current.offsetHeight;
			const sectionTop = current.offsetTop - 50;
			const sectionId = current.getAttribute('id');
			const currentLink = document.querySelector(
				'.navbar__link[href*=' + sectionId + ']',
			);

			if (
				currentLink &&
				scrollY > sectionTop &&
				scrollY <= sectionTop + sectionHeight
			) {
				currentLink.classList.add('active');
			} else if (currentLink) {
				currentLink.classList.remove('active');
			}
		});
	}

	window.addEventListener('scroll', scrollActive);

	// Activar el enlace correcto al cargar la página
	scrollActive();
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
			// Verificar si emailjs está disponible globalmente
			if (typeof emailjs !== 'undefined') {
				// Usar Promise.catch para manejar errores en la promesa
				emailjs
					.send('service_bf8pegn', 'template_991ymha', params)
					.then((response) => {
						console.log('SUCCESS!', response.status, response.text);
						if (modalDOM) modalDOM.showModal();
						formDOM.reset(); // Limpiar el formulario después del envío exitoso
					})
					.catch((error) => {
						console.log('FAILED...', error);
						alert(
							'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.',
						);
					});
			} else {
				// Fallback si emailjs no está disponible
				console.log('EmailJS no está disponible');
				if (modalDOM) modalDOM.showModal(); // Mostrar modal de éxito de todos modos para pruebas
				formDOM.reset(); // Limpiar el formulario
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

	// Previously selected theme (if user selected)
	const selectedTheme = localStorage.getItem('selected-theme');

	// We validate if the user previously chose a theme
	if (selectedTheme) {
		// If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
		document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](
			darkTheme,
		);
		themeButton.checked = selectedTheme === 'dark';
	}

	// Activate / deactivate the theme manually with the button
	themeButton.addEventListener('change', () => {
		// Add or remove the dark / icon theme
		document.body.classList.toggle(darkTheme);

		// We save the theme and the current icon that the user chose
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

	// Check the current page
	const isEnglishPage = window.location.pathname.includes('english.html');

	// Set the toggle state based on the current page
	languageToggle.checked = isEnglishPage;

	// Update the localStorage to match the current page
	localStorage.setItem('selected-language', isEnglishPage ? 'en' : 'es');

	// Handle language toggle - Mejorado para evitar problemas de promesas
	languageToggle.addEventListener('change', () => {
		// Guardar la preferencia antes de la redirección
		localStorage.setItem(
			'selected-language',
			languageToggle.checked ? 'en' : 'es',
		);

		// Pequeño retraso para asegurar que el localStorage se actualice
		setTimeout(() => {
			// Redireccionar a la página correspondiente
			if (languageToggle.checked) {
				// Switch to English
				if (!window.location.pathname.includes('english.html')) {
					window.location.href = 'english.html';
				}
			} else {
				// Switch to Spanish
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

	// Convertir el grid a un contenedor de desplazamiento horizontal en móviles
	function adjustProjectsLayout() {
		if (window.innerWidth < 768) {
			projectsContainer.style.display = 'flex';
			projectsContainer.style.overflowX = 'auto';
			projectsContainer.style.scrollSnapType = 'x mandatory';
			projectsContainer.style.scrollBehavior = 'smooth';
			projectsContainer.style.gap = '1rem';
			projectsContainer.style.padding = '1rem 0.5rem 2rem';

			// Ajustar los proyectos para el scroll horizontal
			const projects = projectsContainer.querySelectorAll('.projects__project');
			projects.forEach((project) => {
				project.style.flex = '0 0 280px';
				project.style.scrollSnapAlign = 'start';
			});

			// Añadir botones de navegación si no existen
			if (!document.querySelector('.projects__nav-button')) {
				addNavigationButtons();
			}
		} else {
			// Restaurar el diseño de grid para pantallas más grandes
			projectsContainer.style.display = 'grid';
			projectsContainer.style.overflowX = 'visible';
			projectsContainer.style.scrollSnapType = 'none';

			// Restaurar los proyectos
			const projects = projectsContainer.querySelectorAll('.projects__project');
			projects.forEach((project) => {
				project.style.flex = 'none';
				project.style.scrollSnapAlign = 'none';
			});

			// Eliminar botones de navegación si existen
			removeNavigationButtons();
		}
	}

	function addNavigationButtons() {
		// Verificar si los botones ya existen para evitar duplicados
		if (document.querySelector('.projects__nav-button')) return;

		// Crear botones de navegación
		const prevButton = document.createElement('button');
		prevButton.className = 'projects__nav-button projects__nav-button--prev';
		prevButton.innerHTML = '<i class="bx bx-chevron-left"></i>';

		const nextButton = document.createElement('button');
		nextButton.className = 'projects__nav-button projects__nav-button--next';
		nextButton.innerHTML = '<i class="bx bx-chevron-right"></i>';

		// Envolver el contenedor de proyectos
		const projectsWrapper = document.createElement('div');
		projectsWrapper.className = 'projects__section-wrapper';

		// Obtener el padre del contenedor de proyectos
		const projectsParent = projectsContainer.parentNode;

		// Insertar el wrapper en el DOM
		projectsParent.insertBefore(projectsWrapper, projectsContainer);
		projectsWrapper.appendChild(projectsContainer);
		projectsWrapper.appendChild(prevButton);
		projectsWrapper.appendChild(nextButton);

		// Funcionalidad de navegación
		prevButton.addEventListener('click', () => {
			projectsContainer.scrollBy({ left: -300, behavior: 'smooth' });
		});

		nextButton.addEventListener('click', () => {
			projectsContainer.scrollBy({ left: 300, behavior: 'smooth' });
		});
	}

	function removeNavigationButtons() {
		const navButtons = document.querySelectorAll('.projects__nav-button');
		navButtons.forEach((button) => button.remove());

		// Restaurar la estructura original si es necesario
		const projectsWrapper = document.querySelector(
			'.projects__section-wrapper',
		);
		if (projectsWrapper && projectsWrapper.contains(projectsContainer)) {
			const projectsParent = projectsWrapper.parentNode;
			projectsParent.insertBefore(projectsContainer, projectsWrapper);
			projectsWrapper.remove();
		}
	}

	// Ajustar el diseño inicialmente
	adjustProjectsLayout();

	// Ajustar el diseño cuando cambia el tamaño de la ventana
	window.addEventListener('resize', adjustProjectsLayout);
}

// Manejar errores no capturados para evitar que se muestren en la consola
window.addEventListener('unhandledrejection', (event) => {
	// Verificar si el error está relacionado con el mensaje del canal cerrado
	if (
		event.reason &&
		event.reason.message &&
		event.reason.message.includes(
			'message channel closed before a response was received',
		)
	) {
		// Prevenir que el error se muestre en la consola
		event.preventDefault();
		console.log(
			'Mensaje de canal cerrado interceptado y manejado silenciosamente',
		);
	}
});
