import parallax from './components/parallax.js';
import activeMenu from './components/selected_menu.js';
import changeLanguage from './helpers/changeLanguage.js';
import updateCurrentYear from './helpers/date_updater.js';
import loader from './helpers/loader.js';
import resetToHome from './helpers/reload_page.js';
import sendEmail from './helpers/send_form.js';

loader();
resetToHome();
updateCurrentYear();
parallax();
activeMenu();
sendEmail();
changeLanguage();
