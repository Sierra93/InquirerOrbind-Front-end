var redirects = new Vue({
	el: '#app',
	data: {
		firstName: localStorage['firstName'],
		lastName: localStorage['lastName'],
		email: localStorage['email'],
		points: localStorage['points'],
		questions: JSON.parse(localStorage["questions"]),
		numberField: 2
	},
	methods: {
		directIndex: function(event) {
			window.location.href = 'https://dev1myprojects24.xyz/';
		},
		directCreateQu: function(event) {
			window.location.href = 'https://dev1myprojects24.xyz/createQuestion.html';
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
			var password = $('#passwordFieldLogin').val();;
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
			$('#field' + this.numberField).after('<input class="mt-3" id="field' + nextField + '" type="text" placeholder="Вариант ответа ' + nextField + '">');
			this.numberField += 1;
		},
		saveQuestion: function(event) {
			
		}
	}
})


