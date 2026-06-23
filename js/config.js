/* ============================================================
   HORN HUB — НАСТРОЙКИ
   Контакты, валюты и переводы интерфейса.
   Товары и вкусы живут отдельно — в файле catalog.js
   ============================================================ */

/* Telegram-аккаунт, куда уходит заказ */
const ADMIN_NICK = 'gystds';
const ADMIN_URL  = 'https://t.me/' + ADMIN_NICK;

/* Курсы валют (базовая — PLN = 1) и символы */
const currencyRates   = { PLN:1, EUR:0.24, UAH:12.6 };
const currencySymbols = { PLN:'zł', EUR:'€', UAH:'₴' };

/* Переводы интерфейса (ru / ua / en) */
const i18n={
  ru:{search:"Поиск по вкусам...",sortDefault:"Рекомендуемые",priceAsc:"Цена ↑",priceDesc:"Цена ↓",byName:"А–Я",sortShort:"Сорт",
    inStock:"В наличии",account:"Профиль",orderHistory:"История заказов",noOrders:"Заказов пока нет",reorder:"Повторить",ordersCount:"Заказов",favCount:"В избранном",spent:"Потрачено",connectTg:"Открой магазин в Telegram, чтобы войти в аккаунт",guest:"Гость",buyer:"Покупатель",reorderSome:"Часть товаров недоступна — добавил остальное",allProducts:"Все",disposable:"Одноразки",liquid:"Жидкости",cartridge:"Картриджи",
    add:"В корзину",outNow:"Нет",sale:"−",hit:"Хит",found:"Найдено",items:"шт",favTitle:"Избранное",allTitle:"Все товары",
    cart:"Корзина",total:"Итого",checkout:"Оформить заказ",emptyCart:"Корзина пуста",emptyCartSub:"Добавь что-нибудь вкусное",
    emptyProducts:"Ничего не нашли",emptyProductsSub:"Измени фильтр или запрос",
    added:"Добавлено ✅",removed:"Удалено",favAdd:"В избранном ❤️",favRem:"Убрано из избранного",
    orderTitle:"Ваш заказ",orderNumber:"Заказ",consultant:"Консультант",copySend:"Скопировать и открыть Telegram",close:"Закрыть",copied:"Скопировано ✅",copyErr:"Ошибка копирования",
    ageTitle:"Тебе есть 18?",ageText:"Продажа никотиносодержащей продукции — только для совершеннолетних. Подтверди возраст, чтобы продолжить.",ageYes:"Мне есть 18 лет",ageNo:"Мне нет 18",ageDeny:"Доступ только для совершеннолетних.",
    ticker:["−42% на Chaser LUX","Одноразки 40k в наличии","Заказ в Telegram за 30 секунд","Новые вкусы каждую неделю","Оплата при получении"]},
  ua:{search:"Пошук за смаками...",sortDefault:"Рекомендовані",priceAsc:"Ціна ↑",priceDesc:"Ціна ↓",byName:"А–Я",sortShort:"Сорт",
    inStock:"В наявності",account:"Профіль",orderHistory:"Історія замовлень",noOrders:"Замовлень поки немає",reorder:"Повторити",ordersCount:"Замовлень",favCount:"В обраному",spent:"Витрачено",connectTg:"Відкрий магазин у Telegram, щоб увійти в акаунт",guest:"Гість",buyer:"Покупець",reorderSome:"Частина товарів недоступна — додав решту",allProducts:"Всі",disposable:"Одноразки",liquid:"Рідини",cartridge:"Картриджі",
    add:"До кошика",outNow:"Немає",sale:"−",hit:"Хіт",found:"Знайдено",items:"шт",favTitle:"Обране",allTitle:"Всі товари",
    cart:"Кошик",total:"Разом",checkout:"Оформити замовлення",emptyCart:"Кошик порожній",emptyCartSub:"Додай щось смачне",
    emptyProducts:"Нічого не знайшли",emptyProductsSub:"Зміни фільтр або запит",
    added:"Додано ✅",removed:"Видалено",favAdd:"В обраному ❤️",favRem:"Прибрано з обраного",
    orderTitle:"Ваше замовлення",orderNumber:"Замовлення",consultant:"Консультант",copySend:"Скопіювати і відкрити Telegram",close:"Закрити",copied:"Скопійовано ✅",copyErr:"Помилка копіювання",
    ageTitle:"Тобі є 18?",ageText:"Продаж нікотиновмісної продукції — лише для повнолітніх. Підтверди вік, щоб продовжити.",ageYes:"Мені є 18 років",ageNo:"Мені немає 18",ageDeny:"Доступ лише для повнолітніх.",
    ticker:["−42% на Chaser LUX","Одноразки 40k в наявності","Замовлення в Telegram за 30 секунд","Нові смаки щотижня","Оплата при отриманні"]},
  en:{search:"Search flavors...",sortDefault:"Recommended",priceAsc:"Price ↑",priceDesc:"Price ↓",byName:"A–Z",sortShort:"Sort",
    inStock:"In stock",account:"Profile",orderHistory:"Order history",noOrders:"No orders yet",reorder:"Reorder",ordersCount:"Orders",favCount:"Favorites",spent:"Spent",connectTg:"Open the shop in Telegram to sign in",guest:"Guest",buyer:"Buyer",reorderSome:"Some items unavailable — added the rest",allProducts:"All",disposable:"Disposables",liquid:"Liquids",cartridge:"Cartridges",
    add:"Add",outNow:"Out",sale:"−",hit:"Hit",found:"Found",items:"items",favTitle:"Favorites",allTitle:"All products",
    cart:"Cart",total:"Total",checkout:"Checkout",emptyCart:"Your cart is empty",emptyCartSub:"Add something tasty",
    emptyProducts:"No results",emptyProductsSub:"Try a different filter or search",
    added:"Added ✅",removed:"Removed",favAdd:"Saved ❤️",favRem:"Removed from favorites",
    orderTitle:"Your order",orderNumber:"Order",consultant:"Consultant",copySend:"Copy & open Telegram",close:"Close",copied:"Copied ✅",copyErr:"Couldn't copy",
    ageTitle:"Are you 18?",ageText:"Nicotine products are sold to adults only. Confirm your age to continue.",ageYes:"I'm 18 or older",ageNo:"I'm under 18",ageDeny:"Adults only.",
    ticker:["−42% on Chaser LUX","40k disposables in stock","Order via Telegram in 30s","New flavors every week","Pay on delivery"]},
};

