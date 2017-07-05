// Include the axios package for performing HTTP requests (promise based alternative to request)
import axios from "axios";

const helpers = {
	sendToken: (token) => {
		console.log("We are in helper class and have our token! " + token);
		axios.post("/api/messaging", {
			token: token
	});
	}
};

export default helpers;
