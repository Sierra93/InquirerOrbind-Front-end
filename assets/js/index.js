$('#header').show();
$('#headerAuth').show();

console.log(localStorage['logined']);

if(localStorage['logined'] == "false") {
	$('#headerAuth').hide();
	$('#header').show();
} else {
	$('#header').hide();
	$('#headerAuth').show();
}

var redirects = new Vue({
	el: '#app',
	data: {
		firstName: localStorage['firstName'],
		lastName: localStorage['lastName'],
		email: localStorage['email'],
		points: localStorage['points'],
		questions: JSON.parse(localStorage["questions"]),
		questionsAll: JSON.parse(localStorage["questionsAll"]),
		answers: [],
		answer_1: localStorage['answer1'],
		answer_2: localStorage['answer2'],
		answer_3: localStorage['answer3'],
		answer_4: localStorage['answer4'],
		answer_5: localStorage['answer5'],
		numberField: 2
	},
	methods: {
		directIndex: function(event) {
			window.location.href = 'https://dev1myprojects24.xyz/';
		},
		directCreateQu: function(event) {
			window.location.href = 'https://dev1myprojects24.xyz/createQuestion.html';
		},
		directShop: function(event) {
			window.location.href = 'https://dev1myprojects24.xyz/gifts.html';
		},
		directAllQu: function(event) {
			var sUrl = "https://dev2myprojects24.xyz/api/data/question/get-all-question";

			axios.post(sUrl)
			.then((response) => {
				console.log("Опросы были выведены успешно", response);

				localStorage["questionsAll"] = JSON.stringify(response.data);
				this.questionsAll = JSON.parse(localStorage["questionsAll"]);
				window.location.href = 'https://dev1myprojects24.xyz/allQuestions.html';				
			})
			.catch((XMLHttpRequest) => {
				console.log("request send error", XMLHttpRequest.response.data);
			});
		},
		directProfile: function(event) {
			var sUrlProfile = "https://dev2myprojects24.xyz/api/data/front-office/get-details";
			var id = +localStorage['user_id'];
			var login = localStorage['login'];
			const oUser = {
				Id: id,
				LoginOrEmail: login
			};
			axios.post(sUrlProfile, oUser)
				.then((response) => {
					console.log("Заход в профиль выполнен успешно", response);
					console.log(response.data);
					localStorage['firstName'] = response.data.firstName;
					localStorage['lastName'] = response.data.lastName;
					localStorage['login'] = response.data.login;
					localStorage['email'] = response.data.email;
					localStorage['points'] = response.data.points;

					var pUrlProfile = "https://dev2myprojects24.xyz/api/data/question/get-question";
					const pUser = {
						UserId: id,
					};

					axios.post(pUrlProfile, pUser)
					.then((response) => {

						console.log("Данные о опросах пришли успешно", response);
						console.log(response.data);
						localStorage["questions"] = JSON.stringify(response.data)

						window.location.href = 'https://dev1myprojects24.xyz/profile.html';
						this.questions = JSON.parse(localStorage["questions"]);
					})
					.catch((XMLHttpRequest) => {
						console.log("request send error", XMLHttpRequest.response.data);
					})

				.catch((XMLHttpRequest) => {
					console.log("request send error", XMLHttpRequest.response.data);
			});
				});
		},
		loginValidation: function(event) {
			var login = $('#loginFieldLogin').val();
			var password = $('#passwordFieldLogin').val();
			var error = false;
			var sUrlCheckIn = "https://dev2myprojects24.xyz/api/data/auth/signin";

			if(login.length < 1) {
				$('#loginFieldReg').after('<span class="error">Поле обязательно к заполнению</span>');
				$('#loginFieldReg').css('border-color', '#F32020');
				error = true;
			}
			if (password.length < 8) {
				$('#passwordFieldLogin').after('<span class="error">Слишком короткий пароль</span>');
				$('#passwordFieldLogin').css('border-color', '#F32020');
				error = true;
			}
			if(!error) {
				const oUser = {
					LoginOrEmail: login,
					Password: password
				};

				axios.post(sUrlCheckIn, oUser)
				.then((response) => {
					console.log("Авторизация пользователя прошла успешно.", response);

					localStorage['key'] = response.data.access_token;
					localStorage['user_id'] = response.data.user_data.id;
					localStorage['login'] = response.data.user_data.login;
					localStorage['logined'] = true;
				})
				.catch((XMLHttpRequest) => {
					console.log("request send error", XMLHttpRequest.response.data);
				});
			}
		},
		regValidation: function(event) {
			var login = $('#loginFieldReg').val();
			var email = $('#emailFieldReg').val(); 
			var number = $('#numberFieldReg').val();
			var password = $('#passwordFieldReg').val();;

			var error = false;
			var sUrlCheckIn = "https://dev2myprojects24.xyz/api/data/auth/checkin";

			if(login.length < 1) {
				$('#loginFieldReg').after('<span class="error">Поле обязательно к заполнению</span>');
				$('#loginFieldReg').css('border-color', '#F32020');
				error = true;
			}
			if (email.length< 1) {
		    	$('#emailFieldReg').after('<span class="error">Поле обязательно к заполнению</span>');
		    	$('#emailFieldReg').css('border-color', '#F32020');
				error = true;
		    } else {
		    	var regEx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		    	var validEmail = regEx.test(email);
		    	if (!validEmail) {
		        	$('#emailFieldReg').after('<span class="error">Введите корректную почту</span>');
		        	$('#emailFieldReg').css('border-color', '#F32020');
					error = true;
		      	}
		    }
		    if(number.length < 1) {
				$('#numberFieldReg').after('<span class="error">Поле обязательно к заполнению</span>');
				$('#numberFieldReg').css('border-color', '#F32020');
				error = true;
			}
			if (password.length < 8) {
				$('#passwordFieldReg').after('<span class="error">Слишком короткий пароль</span>');
				$('#passwordFieldReg').css('border-color', '#F32020');
				error = true;
			}
			if(!error) {
				const oUser = {
					Login: login,
					Email: email,
					Password: password,
					Number: number
				};

				axios.post(sUrlCheckIn, oUser)
				.then((response) => {
					console.log("Регистрация пользователя прошла успешно.", response);
				})
				.catch((XMLHttpRequest) => {
					console.log("request send error", XMLHttpRequest.response.data);
				});
			}
		},
		addAnswer: function(event) {
			var nextField = this.numberField + 1;
			if(nextField !== 6) {
				$('#field' + this.numberField).after('<input class="mt-3" id="field' + nextField + '" type="text" placeholder="Вариант ответа ' + nextField + '">');
				this.numberField += 1;
			} else {
				alert('Нельзя создать опрос с более чем 5 ответами');
			}
		},
		saveQuestion: function(event) {
			var body = $('#questionBody').val();
			var category = $('#questionCategory').val(); 
			var title = $('#questionTitle').val();
			var answer1 = $('#field1').val();
			var answer2 = $('#field2').val();
			var answer3 = $('#field3').val();
			var answer4 = $('#field4').val();
			var answer5 = $('#field5').val();

			var id = +localStorage['user_id'];

			var lUrlCheckIn = "https://dev2myprojects24.xyz/api/data/question/create";

			const oUser = {
				UserId: id,
				Category: category,
				Title: title,
				Details: body,
				Answer_1: answer1,
				Answer_2: answer2,
				Answer_3: answer3,
				Answer_4: answer4,
				Answer_5: answer5,
			};

			axios.post(lUrlCheckIn, oUser)
			.then((response) => {
				console.log("Отправка опроса прошла успешно", response);
			})
			.catch((XMLHttpRequest) => {
				console.log("request send error", XMLHttpRequest.response.data);
			});
		},
		passQuestion: function(event) {
			console.log('Кнопка нажалась)');
			$(event.target).parent().parent().parent().parent()[0].innerText.split("\n")[1]
			var findTitle = $(event.target).parent().parent().parent().parent()[0].innerText.split("\n")[1];
			var arr = this.questionsAll.filter(el => el.title == findTitle);
			var concreteId = arr[0].id;
			var lUrlCheckIn = "https://dev2myprojects24.xyz/api/data/question/get-concrete-question";

			const oUser = {
				Id: concreteId
			};

			axios.post(lUrlCheckIn, oUser)
			.then((response) => {
				console.log("Отправка опроса прошла успешно", response);

				localStorage['answer1'] = response.data.answer_1;
				localStorage['answer2'] = response.data.answer_2;
				localStorage['answer3'] = response.data.answer_3;
				localStorage['answer4'] = response.data.answer_4;
				localStorage['answer5'] = response.data.answer_5;
				localStorage['questionId'] = response.data.id;

				if(localStorage['answer1'] == "null" || localStorage['answer1'] == "undefined" || localStorage['answer1'] == undefined || localStorage['answer1'] == null) {
					localStorage['answer1'] = "";
				}
				if(localStorage['answer2'] == "null" || localStorage['answer2'] == "undefined" || localStorage['answer2'] == undefined || localStorage['answer2'] == null) {
					localStorage['answer2'] = "";
				}

				if(localStorage['answer3'] == "null" || localStorage['answer3'] == "undefined" || localStorage['answer3'] == undefined || localStorage['answer3'] == null) {
					localStorage['answer3'] = "";
				}

				if(localStorage['answer4'] == "null" || localStorage['answer4'] == "undefined" || localStorage['answer4'] == undefined || localStorage['answer4'] == null) {
					localStorage['answer4'] = "";
				}

				if(localStorage['answer5'] == "null" || localStorage['answer5'] == "undefined" || localStorage['answer5'] == undefined || localStorage['answer5'] == null) {
					localStorage['answer5'] = "";
				}

				this.answer_1 = localStorage['answer1'];
				this.answer_2 = localStorage['answer2'];
				this.answer_3 = localStorage['answer3'];
				this.answer_4 = localStorage['answer4'];
				this.answer_5 = localStorage['answer5'];
				window.location.href = 'https://dev1myprojects24.xyz/passQuestion.html';

				
			})
			.catch((XMLHttpRequest) => {
				console.log("request send error", XMLHttpRequest.response.data);
			});
		},
		logout: function() {
			localStorage['logined'] = false;
			window.location.href = 'https://dev1myprojects24.xyz/index.html';
		},
		endQuestion: function() {
			var errorAns = false;
			if($("#rb1").prop('checked') == true) {
				localStorage['checkedAnswer'] = $('#lb1').text();
			}
			else if($("#rb2").prop('checked') == true) {
				localStorage['checkedAnswer'] = $('#lb2').text();
			}
			else if($("#rb3").prop('checked') == true) {
				localStorage['checkedAnswer'] = $('#lb3').text();
			}
			else if($("#rb4").prop('checked') == true) {
				localStorage['checkedAnswer'] = $('#lb4').text();
			}
			else if($("#rb5").prop('checked') == true) {
				localStorage['checkedAnswer'] = $('#lb5').text();
			}
			else {
				alert('Вы не выбрали ответ');
				var errorAns = true;
			}
			console.log(localStorage['checkedAnswer']);
			var qUrlCheckIn = "https://dev2myprojects24.xyz/api/data/question/add-answer";
			var id = +localStorage['questionId'];

			var AcceptAnswer = localStorage['checkedAnswer'];

			const qUser = {
				QuestionId: id,
				AcceptAnswer: AcceptAnswer	
			};
			if(!errorAns) {
				axios.post(qUrlCheckIn, qUser)
				.then((response) => {
					console.log("Отправка опроса прошла успешно", response);
				})
				.catch((XMLHttpRequest) => {
					console.log("request send error", XMLHttpRequest.response.data);
				});
			}
		}
	}
})


