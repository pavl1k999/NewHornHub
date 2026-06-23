/* ============================================================
   HORN HUB — КАТАЛОГ ТОВАРОВ
   Здесь и только здесь меняешь товары, вкусы и наличие.
   ============================================================

   ── КАК ДОБАВИТЬ ВКУС ───────────────────────────────────────
   Допиши его в массив "flavors" нужного бренда:
        flavors: ['Grape Mint', 'Новый Вкус'],
   Картинка подтянется сама из папки бренда по имени вкуса:
        'Grape Mint'  ->  images/<папка>/Grape_Mint.png
   (пробелы и символы заменяются на "_"). Просто положи файл с
   таким именем в нужную папку.

   ── КАК УБРАТЬ ВКУС ИЗ НАЛИЧИЯ ──────────────────────────────
   Впиши точное имя вкуса в массив "soldOut" этого бренда:
        soldOut: ['Grape Mint'],
   Он останется на витрине, но будет помечен «Нет» и уйдёт вниз.
   Вернуть в наличие — просто убери его из "soldOut".

   ── КАК ДОБАВИТЬ НОВЫЙ БРЕНД / ЛИНЕЙКУ ──────────────────────
   Скопируй любой блок { ... } и поменяй поля:
        key         — короткий латинский id (уникальный)
        label       — как показывать название бренда
        category    — 'disposable' | 'liquid' | 'cartridge'
        price       — обычная цена (показывается зачёркнутой)
        salePrice   — цена со скидкой (крупная зелёная)
        imageFolder — папка внутри images/
        flavors     — список вкусов
        soldOut     — какие вкусы сейчас не в наличии

   Скидка в процентах считается сама из price/salePrice.
   Цены — в PLN (базовая валюта). Перевод в EUR/UAH автоматический.
   ============================================================ */

const CATALOG = [

  /* ─── ЖИДКОСТИ ─── */
  {
    key: 'chaser',
    label: 'Chaser LUX',
    category: 'liquid',
    price: 60,
    salePrice: 35,
    imageFolder: 'chaser',
    flavors: [
      'Grape Mint', 'Berry Lemonade', 'Blackberry Lemonade', 'Sour Apple',
      'Vitamin', 'Coconut Melon', 'Energetic', 'Strawberry Cream',
      'Watermelon Raspberry', 'Kiwi Passion Guava',
    ],
    soldOut: [
      'Grape Mint', 'Berry Lemonade', 'Blackberry Lemonade', 'Sour Apple',
      'Vitamin', 'Coconut Melon', 'Energetic', 'Strawberry Cream',
      'Watermelon Raspberry', 'Kiwi Passion Guava',
    ],
  },
  {
    key: 'elf',
    label: 'Elf Liq',
    category: 'liquid',
    price: 50,
    salePrice: 35,
    imageFolder: 'elf',
    flavors: [
      'Blackcurrant Aniseed', 'Pineapple Colada', 'Strawberry Snoow',
      'Blue Razz Lemonade', 'Green Grape Rose', 'Sour Watermelon Gummy',
      'Strawberry Banana', 'Blueberry Raspberry Pomegranate', 'P&B Cloud',
    ],
    soldOut: ['Blackcurrant Aniseed'],
  },
  {
    key: 'vozol',
    label: 'Vozol',
    category: 'liquid',
    price: 50,
    salePrice: 35,
    imageFolder: 'vazool', // ВНИМАНИЕ: папка называется "vazool" (так на сервере)
    flavors: [
      'Dragon Fruit Banana Cherry', 'Purple Candy', 'Pineapple Passion Fruit Lime',
      'Strawberry Kiwi', 'Love 777', 'Grape Ice', 'Watermelon Bubblegum',
      'Pomegranate Lemonade', 'Mint Ice',
    ],
    soldOut: [
      'Dragon Fruit Banana Cherry', 'Purple Candy', 'Pineapple Passion Fruit Lime',
      'Strawberry Kiwi', 'Love 777', 'Grape Ice', 'Watermelon Bubblegum',
      'Pomegranate Lemonade', 'Mint Ice',
    ],
  },

  /* ─── ОДНОРАЗКИ 40K ─── */
  {
    key: 'elfking',
    label: 'Elf King 40k',
    category: 'disposable',
    price: 110,
    salePrice: 80,
    imageFolder: 'elfking',
    flavors: [
      'Milki Oolong', 'Blue Razz Ice', 'Sour Apple Ice',
      'Sour Pineapple Ice', 'Sour Strawberry Dragonfruit',
    ],
    soldOut: [],
  },
  {
    key: 'bcpro',
    label: 'BC Pro 40k',
    category: 'disposable',
    price: 110,
    salePrice: 80,
    imageFolder: 'bcpro',
    flavors: [
      'Pineapple Rom', 'Grape Twist', 'Strawberry Raspberry Frost',
      'Strawberry Kiwi', 'Aurora Berries',
    ],
    soldOut: [],
  },
  {
    key: 'vozolreve',
    label: 'Vozol Reve 40k',
    category: 'disposable',
    price: 110,
    salePrice: 80,
    imageFolder: 'vozolreve',
    flavors: [
      'Watermelon Bubblegum', 'Strawberry Mango', 'Kiwi Passion Fruit',
      'Mango Ice', 'Grape Ice',
    ],
    soldOut: [],
  },

  /* ─── КАРТРИДЖИ ─── */
  {
    key: 'cartridge',
    label: 'Cartridge',
    category: 'cartridge',
    price: 35,
    salePrice: 30,
    imageFolder: 'cart',
    // У одиночного товара можно задать полное имя, короткий вкус и своё имя картинки.
    flavors: [
      { name: 'Xros Cartridge 0.6Ω', flavor: 'Xros 0.6Ω', image: 'xros' },
    ],
    soldOut: [],
  },

];
