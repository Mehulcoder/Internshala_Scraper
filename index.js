let request = require("request-promise");
const cookieJar = request.jar();
const { Parser } = require("json2csv");
request = request.defaults({
	jar: cookieJar,
});
const fs = require("fs");
var Spinner = require("cli-spinner").Spinner;
var Login_spinner = new Spinner("Logging you in.. %s");
Login_spinner.setSpinnerString("|/-\\");

var fetch_spinner = new Spinner("Fetching your data.. %s");
fetch_spinner.setSpinnerString("|/-\\");
//
// ─── LOGIN ──────────────────────────────────────────────────────────────────────
//

async function login(email, password) {
	try {
		Login_spinner.start();

		const result = await request.get("https://internshala.com/");
		const cookieString = cookieJar.getCookieString("https://internshala.com/");
		const splittedByCsrfCookieName = cookieString.split("csrf_cookie_name=");
		const csrf_test_name = splittedByCsrfCookieName[1].split(";")[0];

		const options = {
			method: "POST",
			uri: "https://internshala.com/login/verify_ajax/user",
			form: {
				csrf_test_name,
				email,
				password,
			},
		};

		await request(options);
		Login_spinner.stop();
		console.log("   ");
		console.log(`Logged in as ${email} successfully`);
		return 1;
	} catch (error) {
		console.log("Could not login");
		Login_spinner.stop();
		console.log("   ");
		return new Error(error);
	}
}

//
// ─── GRAB DETAILS FROM A PAGE ───────────────────────────────────────────────────
//

async function getDetails(page_number) {
	try {
		let result;
		const options = {
			method: "POST",
			uri: "https://internshala.com/student/paginated_applications",
			form: {
				page_number,
			},
		};
		await request(options, (err, res, body) => {
			let data = JSON.parse(body);
			result = {
				applications: data.applications_data,
				total_pages: data.total_pages,
			};
		});

		return result;
	} catch (error) {
		console.log(error);
		return error;
	}
}

//
// ─── MAKE THE CSV AFTER EXTRACTION ──────────────────────────────────────────────
//

async function Login_and_Get_Details(email, password) {
	await login(email, password);

	fetch_spinner.start();
	var application = [];
	// var seen = [];
	// var inTouch = [];
	// var notSelected = [];
	// var applied = [];
	var result = {
		application,
	};

	//Get the page_numbers
	const data = await getDetails(1);
	const total_pages = data.total_pages;

	// Get the data by iteration
	for (let page = 1; page <= total_pages; page++) {
		const data = await getDetails(page);
		const applications = data.applications;

		applications.forEach((application) => {
			const application_status = application.application_status;
			const company_name = application.company_name;
			const company_url = "internshala.com" + application.job_url;
			const profile = application.profile;

			result.application.push({
				application_status,
				company_name,
				company_url,
				profile,
			});
		});
	}

	const json2csvParser = new Parser();
	const result_csv = json2csvParser.parse(result.application);

	fs.writeFile("output.csv", result_csv, (err) => {
		fetch_spinner.stop();
		console.log("   ");
		if (err) throw err;
		console.log("Data written to output.csv!");
	});
}

//
// ─── TAKING INPUT FROM USER ─────────────────────────────────────────────────────
//

var email = process.argv[2];
var password = process.argv[3];

//
// ─── RUNNING THE FUNCTION ───────────────────────────────────────────────────────
//

Login_and_Get_Details(email, password);
