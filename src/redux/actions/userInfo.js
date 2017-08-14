const actions = {
	userInfo:(payload) => {
		return ({
	   type:'USER_INFO',
     payload:payload})
  },
	logOut:(payload) => {
		return ({
		 type:'LOG_OUT',
		 payload:payload})
	},
}


export default actions
