var profile = new Vue({
	el: '#appProfile',
	created() {
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
				this.firstName = response.data.firstName;
				this.lastName = response.data.lastName;
				this.email = response.data.email;
				this.points = response.data.points;
			})
			.catch((XMLHttpRequest) => {
				console.log("request send error", XMLHttpRequest.response.data);
		});
	},
	data: {
		firstName: '',
		lastName: '',
		email: '',
		points: 0
	}
})


