// Slider initialization
$(document).ready(function() {
   $('.conferenceroom__slider').slick({
      slidesToShow: 1,
      autoplay: true,
      arrows: false,
      dots: true,
      infiniteLoop: true
   })
   $('.restaurant__slider').slick({
      slidesToShow: 1,
      autoplay: true,
      arrows: false,
      dots: true,
      infiniteLoop: true
   })
   $('.restaurant__slider-nav').slick({
     slidesToShow: 3,
     slidesToScroll: 1,
     asNavFor: '.restaurant__slider',
     dots: true,
     centerMode: true,
     focusOnSelect: true
  });

});

// index.html slider
const slideLeftBtn = document.querySelector(".slider-left");
const slideRightBtn = document.querySelector(".slider-right");
let left = 0;
let right = 0;

function slideRight() {
	 const string = document.querySelector(".string");
	 left -= 100;
	 if (left <= -400) {
		left = 0;
	}
	 string.style.left = left + "%";
}

function slideLeft() {
	 const string = document.querySelector(".string");
	 left += 100;
	 if (left > 0) {
		left = -300;
	}
	 string.style.left = left + "%";
}
if(slideLeftBtn){
   slideLeftBtn.addEventListener('click', slideLeft);
   setInterval(slideRight, 10000);
}
if(slideRightBtn){
   slideRightBtn.addEventListener('click', slideRight);
}

// Search
const searchBtn = document.querySelector(".search-submit");
searchBtn.addEventListener("click", e => {
   e.preventDefault();
})

// Rooms parsing
const href = document.location.href;
const lastPathSegment = href.substr(href.lastIndexOf('/') + 1);
let roomsArray = [];

function showRooms(room) {
      return `
         <div class="room" data-booked="${room.booked}">
            <img class="room__image" src="./img/${room.image}" alt="room" />
            <div class="room__params">
               <div class="room__params-row">
                  <p class="room__name">${room.name}</p>
               </div>
               <div class="room__params-row">
                  <div class="room__params-left">
                     <p>Кількість номерів: </p>
                  </div>
                  <div class="room__params-right">
                     <p>${room.quantity}</p>
                  </div>
               </div>
               <div class="room__params-row">
                  <div class="room__params-left">
                     <img class="params__icon" src="img/square.png" alt="square" />
                  </div>
                  <div class="room__params-right">
                     <p>${room.square} м2</p>
                  </div>
               </div>
               <div class="room__params-row">
                  <div class="room__params-left">
                     <img class="params__icon" src="img/bed.png" alt="bed" />
                  </div>
                  <div class="room__params-right">
                     ${room.beds}
                  </div>
               </div>
               <div class="room__description-wrap">
                  <p class="room__description-title">У номері:</p>
                  <p class="room__description">${room.description}</p>
               </div>
               <div class="room__params-row">
                  <div class="room__params-left">
                     <p>Ціна за ніч: </p>
                  </div>
                  <div class="room__params-right">
                     <p>${room.price} грн</p>
                  </div>
               </div>
            </div>
            <button class="room__book" data-type="${room.name}" data-price="${room.price}">Забронювати</button>
         </div>
      `
}

function parseRooms(arr) {
   type = lastPathSegment;
   if(type !== 'rooms.html'){
      roomsArray = roomsArray.filter(room => {
         return (room.type === `${type.substr(0, type.length - 5)}`)
      })
   }

   document.querySelector(".rooms").innerHTML = `${arr.map(showRooms).join('')}`;

   const bookRoomBtns = document.querySelectorAll(".room__book");
   bookRoomBtns.forEach(btn => btn.addEventListener('click', e => {
      const popupForm = document.querySelector(".booking__popup");
      popupForm.classList.add('popup-active');
      let selectedRoom = document.querySelector(".selected-room");
      selectedRoom.innerHTML = e.target.dataset.type;

      // Datepickers
      const arriveField = $('.arrive-picker');
      const from_$input = arriveField.pickadate({
         format: 'yyyy / mm / dd'
      });
      from_picker = from_$input.pickadate('picker');

      const departureField = $('.departure-picker');
      const to_$input = departureField.pickadate({
            format: 'yyyy / mm / dd'
         }),
         to_picker = to_$input.pickadate('picker');

      // Check if there’s a “from” or “to” date to start with.
      if (from_picker.get('value')) {
         to_picker.set('min', from_picker.get('select'));
      }
      if (to_picker.get('value')) {
         from_picker.set('max', to_picker.get('select'))
      }

      // When something is selected, update the “from” and “to” limits.
      from_picker.on('set', function(event) {
         if (event.select) {
            to_picker.set('min', from_picker.get('select'));
         } else if ('clear' in event) {
            to_picker.set('min', false)
         }
      })
      let diffDays;
      to_picker.on('set', function(event) {
         if (event.select) {
            from_picker.set('max', to_picker.get('select'))
            console.log();
         } else if ('clear' in event) {
            from_picker.set('max', false)
         }
         const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
         let firstDate = new Date(`${arriveField.val()}`);
         let secondDate = new Date(`${departureField.val()}`);

         diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));

         if(!isNaN(diffDays)){
            let priceField = document.querySelector(".final-price");
            if(arriveField.val() === departureField.val()) {
               priceField.innerHTML = e.target.dataset.price + ' грн';
            } else {
               priceField.innerHTML = e.target.dataset.price * diffDays + ' грн';
            }
         }

      })
      //form submitting
      const mainBookingForm = document.querySelector(".main-booking");
      submitMainBookingForm = function(e) {
         console.log(diffDays);
         e.preventDefault();
         let adultsCount = document.querySelector(".adult-count");
         adultsCount = adultsCount.options[adultsCount.selectedIndex].value;
         let childrenCount = document.querySelector(".children-count");
         childrenCount = childrenCount.options[childrenCount.selectedIndex].value;

         const bookingObj = {
            "Номер" : selectedRoom.innerHTML,
            "Дата заїзду": arriveField.val(),
            "Дата виїзду": departureField.val(),
            "Днів проживання": diffDays,
            "Кількість дорослих": adultsCount,
            "Кількість дітей": childrenCount,
            "Сформована ціна": document.querySelector(".final-price").innerHTML
         }

         // Send booking info emulation
         let serializeObj = JSON.stringify(bookingObj);
         localStorage.setItem("Заброньовано:", serializeObj);
         popupForm.classList.remove('popup-active');
       }
      mainBookingForm.addEventListener('submit', submitMainBookingForm);

      const popupCloseBtn = document.querySelector(".booking__popup-close");
      popupCloseBtn.addEventListener('click', () => {
         popupForm.classList.remove('popup-active');
      })
   }))
}

const endpoint = 'http://localhost:3030/api/hotels';
const promise = fetch(endpoint)
    .then(res => {
        if (!res.ok) {
            throw new Error();
        }
        return res.json();
    })
    .then(data => {
      data.forEach(room => {
         roomsArray.push(room);
         parseRooms(roomsArray);
      })
   })
    .catch(error => {
        // console.log(error);
    });

// Sorting
const sortRadios = document.querySelectorAll(".sort-radio");
function sortRooms(e) {
   if(e.target.id === "sort-count") {
      roomsArray.sort(function (a, b) {
         return a.quantity - b.quantity;
      })
   }
   if(e.target.id === "sort-price") {
      roomsArray.sort(function (a, b) {
         return a.price - b.price;
      })
   }
   if(e.target.id == "sort-square") {
      roomsArray.sort(function (a, b) {
         return a.square - b.square;
      })
   }
   if(e.target.id === "sort-name") {
      roomsArray.sort(function (a, b) {
         return a.name > b.name;
      })
   }
   parseRooms(roomsArray);
}
sortRadios.forEach(btn => btn.addEventListener('change', sortRooms));

// Searching rooms
const searchRoomsBtn = document.querySelector(".room-search");
function search(nameKey, myArray){
   nameKey = nameKey.toLowerCase();
   let searchArr = [];
    for (var i=0; i < myArray.length; i++) {
      for(var key in myArray[i]){
         if(String(myArray[i][key]).toLowerCase() === nameKey ){
            searchArr.push(myArray[i])
         }
      }
    }
    return searchArr;
}
if(searchRoomsBtn){
   searchRoomsBtn.addEventListener('keyup', e => {
   let resultObject = search(e.target.value, roomsArray);
   if(resultObject.length !== 0){
      parseRooms(resultObject);
   } else {
      parseRooms(roomsArray);
   }
   });
}
// Gallery initialization
let galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
	item.style.backgroundImage = `url(img/${item.dataset.img})`;
	item.addEventListener('click', e => {
		const galleryPopup = document.querySelector('.gallery__popup');
      const imgContainer = document.querySelector('.popup__img');
      galleryPopup.classList.add('active');
		imgContainer.style.backgroundImage = `url(img/${e.target.dataset.img})`;

      document.querySelector(".gallery__popup-close").addEventListener('click', () => {
         galleryPopup.classList.remove('active');
      })
	})
})
