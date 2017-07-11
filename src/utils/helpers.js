// Include the axios package for performing HTTP requests (promise based alternative to request)
import axios from "axios";

const helpers = {

	pushToken: (token) => {
		axios.post("/sendMessage",
		{
			token: token
		});
	},

	pushToVillage: (token) => {
		axios.post("/api/sendMessage",
		{
			token: token
		});
	}
}


export default helpers;
