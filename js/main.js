'use strict';

let getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

let getMockData = function (lengthArray, mapWidth) {

  let TemplateString = {
    AVATAR_URL: 'img/avatars/user0',
    AVATAR_TYPE: '.png',
    PHOTO_URL: 'http://o0.github.io/assets/images/tokyo/hotel',
    PHOTO_TYPE: '.jpg',
    TYPE: ['palace', 'flat', 'house', 'bungalo'],
    TIME: ['12:00', '13:00', '14:00'],
    FEATURE: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner']
  };

  let data = [];

  let getArrayPhoto = function (lengthArray) {
    let array = [];
    for (let i = 1; i <= lengthArray; i++) {
      array.push(TemplateString.PHOTO_URL + getRandomNumber(1, 3) + TemplateString.PHOTO_TYPE);
    }
    return array;
  };

  let getArrayFeature = function (lengthArray) {
    let array = [];
    for (let i = 0; i < lengthArray; i++) {
      array.push(TemplateString.FEATURE[i]);
    }
    return array;
  };

  for (let i = 1; i <= lengthArray; i++) {
    data.push({
      avatar: TemplateString.AVATAR_URL + i + TemplateString.AVATAR_TYPE,
      offer: {
        title: 'Title #' + i,
        price: getRandomNumber(500, 50000),
        type: TemplateString.TYPE[getRandomNumber(0, TemplateString.TYPE.length - 1)],
        rooms: getRandomNumber(1, 5),
        guests: getRandomNumber(1, 5),
        checkin: TemplateString.TIME[getRandomNumber(0, TemplateString.TIME.length - 1)],
        checkout: TemplateString.TIME[getRandomNumber(0, TemplateString.TIME.length - 1)],
        features: getArrayFeature(getRandomNumber(1, TemplateString.FEATURE.length - 1)),
        description: 'Description #' + i,
        photos: getArrayPhoto(getRandomNumber(1, 8))
      },
      location: {
        x: getRandomNumber(0, mapWidth),
        y: getRandomNumber(130, 630)
      }
    });

    data[data.length - 1].offer.address = data[data.length - 1].location.x + ', ' + data[data.length - 1].location.y;
  };

  return data;
};

let generatePins = function (data) {
  let Pin = {
    TEMPLATE_ID: '#pin',
    ELEMENT_CLASS: '.map__pin',
    WIDTH: 50,
    HEIGHT: 70
  }

  let fragment = document.createDocumentFragment();
  let nodeTemplate = document.querySelector(Pin.TEMPLATE_ID).content;

  for (let i = 0; i < data.length; i++) {
    let node = nodeTemplate.cloneNode(true);
    let pinElement = node.querySelector(Pin.ELEMENT_CLASS);
    pinElement.style.left = data[i].location.x - (Pin.WIDTH / 2) + 'px';
    pinElement.style.top = data[i].location.y - Pin.HEIGHT + 'px';
    let imgElement = pinElement.querySelector('img');
    imgElement.src = data[i].avatar;
    imgElement.alt = data[i].offer.title;
    fragment.appendChild(node);
  }

  return fragment;
};

let generateCard = function (author) {

  let Card = {
    TEMPLATE_ID: '#card',
    ELEMENT_CLASS: '.popup',
    ELEMENT_TITLE_CLASS: '.popup__title',
    ELEMENT_ADDRESS_CLASS: '.popup__text--address',
    ELEMENT_PRICE_CLASS: '.popup__text--price',
    ELEMENT_TYPE_CLASS: '.popup__type',
    ELEMENT_CAPACITY_CLASS: '.popup__text--capacity',
    ELEMENT_TIME_CLASS: '.popup__text--time',
    ELEMENT_FEATURES_CLASS: '.popup__features',
    ELEMENT_FEATURE_CLASS: 'popup__feature',
    ELEMENT_DESCRIPTION_CLASS: '.popup__description',
    ELEMENT_PHOTO_CLASS: '.popup__photos',
    ELEMENT_AVATAR: '.popup__avatar'
  };

  let TemplateString = {
    PRICE: '₽/ночь',
    TYPE: {
      flat: 'Квартира',
      bungalo: 'Бунгало',
      house: 'Дом',
      palace: 'Дворец'
    },
    ROOM: 'комнаты для',
    GUEST: 'гостей',
    CHECKIN: 'Заезд после',
    CHECKOUT: ', выезд до'
  };

  let setFeatures = function (block, list, elementClass) {
    let listElement = block.querySelectorAll('li');

    Array.from(listElement).forEach(item => item.remove());
    
    list.forEach(item => {
      let element = document.createElement('li');
      element.classList.add(elementClass);
      element.classList.add(elementClass + '--' + item);
      block.appendChild(element);
    })
  };

  let setPhotos = function (block, list) {
    let listElement = block.querySelectorAll('img');
    let imgTemplate = listElement[0];

    Array.from(listElement).forEach(item => item.remove());

    list.forEach(item => {
      let element = imgTemplate.cloneNode(true);
      element.src = item;
      block.appendChild(element);
    })
  };

  let fragment = document.createDocumentFragment();
  let nodeTemplate = document.querySelector(Card.TEMPLATE_ID).content;
  let node = nodeTemplate.cloneNode(true);

  node.querySelector(Card.ELEMENT_TITLE_CLASS).textContent = author.offer.title;
  node.querySelector(Card.ELEMENT_ADDRESS_CLASS).textContent = author.offer.address;
  node.querySelector(Card.ELEMENT_PRICE_CLASS).textContent = author.offer.price + ' ' + TemplateString.PRICE;
  node.querySelector(Card.ELEMENT_TYPE_CLASS).textContent = TemplateString.TYPE[author.offer.type];
  node.querySelector(Card.ELEMENT_CAPACITY_CLASS).textContent = author.offer.rooms + ' ' + TemplateString.ROOM + ' ' + author.offer.guests + ' ' + TemplateString.GUEST;
  node.querySelector(Card.ELEMENT_TIME_CLASS).textContent = TemplateString.CHECKIN + ' ' + author.offer.checkin + TemplateString.CHECKOUT + ' ' + author.offer.checkout;
  node.querySelector(Card.ELEMENT_DESCRIPTION_CLASS).textContent = author.offer.description;
  node.querySelector(Card.ELEMENT_AVATAR).src = author.avatar;
  setFeatures(node.querySelector(Card.ELEMENT_FEATURES_CLASS), author.offer.features, Card.ELEMENT_FEATURE_CLASS);
  setPhotos(node.querySelector(Card.ELEMENT_PHOTO_CLASS), author.offer.photos);
  fragment.appendChild(node);

  return fragment;
};

let init = function () {

  const MOCKDATA_LENGTH = 8;
  
  let Element = {
    MAP_CLASS: '.map',
    MAP_CLASS_FADED: 'map--faded',
    MAP_FILTER: '.map__filters-container'
  };

  let mapElement = document.querySelector(Element.MAP_CLASS);
  mapElement.classList.remove(Element.MAP_CLASS_FADED);

  let mapElementWidth = mapElement.offsetWidth;

  let mockData = getMockData(MOCKDATA_LENGTH, mapElementWidth);
  
  mapElement.appendChild(generatePins(mockData)); 
  mapElement.insertBefore(generateCard(mockData[0]), mapElement.querySelector(Element.MAP_FILTER));
};

window.addEventListener('load', init);