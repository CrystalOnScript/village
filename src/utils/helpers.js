// Include the axios package for performing HTTP requests (promise based alternative to request)
import axios from "axios";

const helpers = {
	sendToken: (token) => {
		console.log("We are in helper class and have our token! " + token);
		return axios.post("/api/messaging", {
			messagetoken: token
		});
	}
};

export default helpers;
