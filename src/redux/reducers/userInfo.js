export function userInfo(state = {},action){
	switch(action.type){
		case 'USER_INFO':
			return {
				...state,
				account: action.payload.account,
				email: action.payload.email,
				name: action.payload.name,
				avatar: action.payload.avatar,
				RegistedDate: action.payload.RegistedDate,
				mobile: action.payload.mobile,
				address: action.payload.address,
				hobby: action.payload.hobby,
				birthday: action.payload.birthday,
				login:true
			}
		case 'LOG_OUT':
			return {
				...state,
				account:'',
				email:'',
				name:'',
				avatar:'',
				RegistedDate: '',
				mobile: '',
				address: '',
				hobby: '',
				birthday: '',
				login:false
			}
		default:
			return state;
	}
}
