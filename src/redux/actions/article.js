
export const addArticle = (payload) => {
		return ({
	   type: 'ADD_ARTICLE',
     _id: payload._id,
     title: payload.title,
     content: payload.content,
     author: payload.author,
     avatar: payload.avatar,
     PostDate: payload.date,
		 lastModify: payload.date,
		 comments: payload.comments,
		 tag: payload.tag
   })
 };
export const editArticle = (payload) => {
    return ({
      type: 'EDIT_ARTICLE',
      _id: payload.id,
      content: payload.content,
			lastModify: new Date().toISOString()
    })
  };

export const searchArticle = (payload) => {
    return ({
      type: 'SEARCH_ARTICLE',
      payload: payload,
    })
  };