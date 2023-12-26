document.addEventListener("DOMContentLoaded", function (event) {

	function testWebP(callback) {
		let webP = new Image();
		webP.onload = webP.onerror = function () {
			callback(webP.height == 2);
		};
		webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
	}
	testWebP(function (support) {
		let className = support === true ? 'webp' : 'no-webp';
		document.documentElement.classList.add(className);
	});


	let burger = document.querySelector(".burger-menu");
	let menu = document.querySelector(".menu");
	let body = document.querySelector("body");

	burger.addEventListener("click", function () {
		burger.classList.toggle("active");
		menu.classList.toggle("active");
		body.classList.toggle("lock");
	});

	function initSliders() {

		if (document.querySelector('.roadmap__slider')) {

			new Swiper('.roadmap__slider', {
				observer: true,
				observeParents: true,
				slidesPerView: 3,
						spaceBetween: 38,
				speed: 500,
				navigation: {
					prevEl: '.roadmap__prev',
					nextEl: '.roadmap__next',
				},

				breakpoints: {
					320: {
						slidesPerView: 1,
						spaceBetween: 30,
					},
					768: {
						slidesPerView: 2,
						spaceBetween: 35,
					},
					1100: {
						slidesPerView: 3,
						spaceBetween: 35,
					},
					1440: {
						slidesPerView: 3,
						spaceBetween: 45,
					},
				},
			});
		}

		if (document.querySelector('.community__slider')) {

			new Swiper('.community__slider', {
				observer: true,
				observeParents: true,
				slidesPerView: 1,
				spaceBetween: 0,
				speed: 500,

				navigation: {
					prevEl: '.community__prev',
					nextEl: '.community__next',
				},

				breakpoints: {
					320: {
						slidesPerView: 1.5,
						spaceBetween: 15,
					},
					480: {
						slidesPerView: 2,
						spaceBetween: 40,
					},
					768: {
						slidesPerView: 3,
						spaceBetween: 40,
					},
					992: {
						slidesPerView: 4,
						spaceBetween: 40,
					},
					1440: {
						slidesPerView: 5,
						spaceBetween: 40,
					},
				},
			});
		}
	}

	window.addEventListener("load", function (e) {
		initSliders();
	});

	// Получение хеша в адресе сайта
	function getHash() {
		if (location.hash) { return location.hash.replace('#', ''); }
	}

	// Модуль плавной проктутки к блоку
	let gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
		const targetBlockElement = document.querySelector(targetBlock);
		if (targetBlockElement) {
			let headerItem = '';
			let headerItemHeight = 0;
			if (noHeader) {
				headerItem = 'header.header';
				headerItemHeight = document.querySelector(headerItem).offsetHeight;
			}
			let options = {
				speedAsDuration: true,
				speed: speed,
				header: headerItem,
				offset: offsetTop,
				easing: 'easeOutQuad',
			};
			// Закрываем меню, если оно открыто
			document.documentElement.classList.contains("menu-open") ? menuClose() : null;

			if (typeof SmoothScroll !== 'undefined') {
				// Прокрутка с использованием дополнения
				new SmoothScroll().animateScroll(targetBlockElement, '', options);
			} else {
				// Прокрутка стандартными средствами
				let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
				targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
				targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
				window.scrollTo({
					top: targetBlockElementPosition,
					behavior: "smooth"
				});
			}
		}
	};
	// Плавная навигация по странице
	function pageNavigation() {
		// data-goto - указать ID блока
		// data-goto-header - учитывать header
		// data-goto-top - недокрутить на указанный размер
		// data-goto-speed - скорость (только если используется доп плагин)
		// Работаем при клике на пункт
		document.addEventListener("click", pageNavigationAction);
		// Если подключен scrollWatcher, подсвечиваем текущий пукт меню
		document.addEventListener("watcherCallback", pageNavigationAction);
		// Основная функция
		function pageNavigationAction(e) {
			if (e.type === "click") {
				const targetElement = e.target;
				if (targetElement.closest('[data-goto]')) {
					burger.classList.remove("active");
					menu.classList.remove("active");
					body.classList.remove("lock");
					const gotoLink = targetElement.closest('[data-goto]');
					const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : '';
					const noHeader = gotoLink.hasAttribute('data-goto-header') ? true : false;
					const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
					const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
					gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
					e.preventDefault();
				}
			} else if (e.type === "watcherCallback" && e.detail) {
				const entry = e.detail.entry;
				const targetElement = entry.target;
				// Обработка пунктов навигации, если указано значение navigator подсвечиваем текущий пукт меню
				if (targetElement.dataset.watch === 'navigator') {
					const navigatorActiveItem = document.querySelector(`[data-goto]._navigator-active`);
					let navigatorCurrentItem;
					if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) {
						navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`);
					} else if (targetElement.classList.length) {
						for (let index = 0; index < targetElement.classList.length; index++) {
							const element = targetElement.classList[index];
							if (document.querySelector(`[data-goto=".${element}"]`)) {
								navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
								break;
							}
						}
					}
					if (entry.isIntersecting) {
						// Видим объект
						// navigatorActiveItem ? navigatorActiveItem.classList.remove('_navigator-active') : null;
						navigatorCurrentItem ? navigatorCurrentItem.classList.add('_navigator-active') : null;
					} else {
						// Не видим объект
						navigatorCurrentItem ? navigatorCurrentItem.classList.remove('_navigator-active') : null;
					}
				}
			}
		}
		// Прокрутка по хешу
		if (getHash()) {
			let goToHash;
			if (document.querySelector(`#${getHash()}`)) {
				goToHash = `#${getHash()}`;
			} else if (document.querySelector(`.${getHash()}`)) {
				goToHash = `.${getHash()}`;
			}
			goToHash ? gotoBlock(goToHash, true, 500, 20) : null;
		}
	}
	pageNavigation();


	function uniqArray(array) {
		return array.filter(function (item, index, self) {
			return self.indexOf(item) === index;
		});
	}

	let isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };

	class ScrollWatcher {
		constructor(props) {
			let defaultConfig = {
				logging: true,
			}
			this.config = Object.assign(defaultConfig, props);
			this.observer;
			!document.documentElement.classList.contains('watcher') ? this.scrollWatcherRun() : null;
		}
		// Обновляем конструктор
		scrollWatcherUpdate() {
			this.scrollWatcherRun();
		}
		// Запускаем конструктор
		scrollWatcherRun() {
			document.documentElement.classList.add('watcher');
			this.scrollWatcherConstructor(document.querySelectorAll('[data-watch]'));
		}
		// Конструктор наблюдателей
		scrollWatcherConstructor(items) {
			if (items.length) {
				// Уникализируем параметры
				let uniqParams = uniqArray(Array.from(items).map(function (item) {
					return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : '0px'}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
				}));
				// Получаем группы объектов с одинаковыми параметрами,
				// создаем настройки, инициализируем наблюдатель
				uniqParams.forEach(uniqParam => {
					let uniqParamArray = uniqParam.split('|');
					let paramsWatch = {
						root: uniqParamArray[0],
						margin: uniqParamArray[1],
						threshold: uniqParamArray[2]
					}
					let groupItems = Array.from(items).filter(function (item) {
						let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
						let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : '0px';
						let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
						if (
							String(watchRoot) === paramsWatch.root &&
							String(watchMargin) === paramsWatch.margin &&
							String(watchThreshold) === paramsWatch.threshold
						) {
							return item;
						}
					});

					let configWatcher = this.getScrollWatcherConfig(paramsWatch);

					// Инициализация наблюдателя со своими настройками
					this.scrollWatcherInit(groupItems, configWatcher);
				});
			}
		}
		// Функция создания настроек
		getScrollWatcherConfig(paramsWatch) {
			// Создаем настройки
			let configWatcher = {}
			// Родитель, внутри которого ведется наблюдение
			if (document.querySelector(paramsWatch.root)) {
				configWatcher.root = document.querySelector(paramsWatch.root);
			}
			// Отступ срабатывания
			configWatcher.rootMargin = paramsWatch.margin;
			// Точки срабатывания
			if (paramsWatch.threshold === 'prx') {
				// Режим параллакса
				paramsWatch.threshold = [];
				for (let i = 0; i <= 1.0; i += 0.005) {
					paramsWatch.threshold.push(i);
				}
			} else {
				paramsWatch.threshold = paramsWatch.threshold.split(',');
			}
			configWatcher.threshold = paramsWatch.threshold;

			return configWatcher;
		}
		// Функция создания нового наблюдателя со своими настройками
		scrollWatcherCreate(configWatcher) {
			this.observer = new IntersectionObserver((entries, observer) => {
				entries.forEach(entry => {
					this.scrollWatcherCallback(entry, observer);
				});
			}, configWatcher);
		}
		// Функция инициализации наблюдателя со своими настройками
		scrollWatcherInit(items, configWatcher) {
			// Создание нового наблюдателя со своими настройками
			this.scrollWatcherCreate(configWatcher);
			// Передача наблюдателю элементов
			items.forEach(item => this.observer.observe(item));
		}
		// Функция обработки базовых действий точек срабатываения
		scrollWatcherIntersecting(entry, targetElement) {
			if (entry.isIntersecting) {
				// Видим объект
				// Добавляем класс
				!targetElement.classList.contains('_watcher-view') ? targetElement.classList.add('_watcher-view') : null;
			} else {
				// Не видим объект
				// Убираем класс
				targetElement.classList.contains('_watcher-view') ? targetElement.classList.remove('_watcher-view') : null;
			}
		}
		// Функция отключения слежения за объектом
		scrollWatcherOff(targetElement, observer) {
			observer.unobserve(targetElement);
		}

		// Функция обработки наблюдения
		scrollWatcherCallback(entry, observer) {
			const targetElement = entry.target;
			// Обработка базовых действий точек срабатываения
			this.scrollWatcherIntersecting(entry, targetElement);
			// Если есть атрибут data-watch-once убираем слежку
			targetElement.hasAttribute('data-watch-once') && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
			// Создаем свое событие отбратной связи
			document.dispatchEvent(new CustomEvent("watcherCallback", {
				detail: {
					entry: entry
				}
			}));

			/*
			// Выбираем нужные объекты
			if (targetElement.dataset.watch === 'some value') {
				// пишем уникальную специфику
			}
			if (entry.isIntersecting) {
				// Видим объект
			} else {
				// Не видим объект
			}
			*/
		}
	}
	// Запускаем и добавляем в переменную
	let scrollWatcher = new ScrollWatcher({});


});



