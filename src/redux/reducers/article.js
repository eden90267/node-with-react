//沒把新增留言寫入reducer原因為留言只有一個頁面用到，所以在該頁面willMount時
//再用ajax去撈留言資料即可

export function article(state = [], action){
	switch(action.type){
		case 'ADD_ARTICLE':
			return [{
				_id: action._id,
				title: action.title,
        content: action.content,
				author: action.author,
				PostDate: action.PostDate,
				avatar: action.avatar,
				lastModify: action.lastModify,
				comments: action.comments,
				tag: action.tag
			}, ...state];

		case 'EDIT_ARTICLE':
			[...state].map((i) => {
				if (i._id === action._id) {
					return Object.assign(i, {
						content: action.content,
						lastModify: action.lastModify
					})
				} else {
					return i
				}
			})
		default:
			return state;
	}
}
