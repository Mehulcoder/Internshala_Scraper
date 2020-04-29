let request = require("request-promise");
const cookieJar = request.jar();
const { Parser } = require("json2csv");
request = request.defaults({
	jar: cookieJar,
});
const fs = require("fs");
const ora = require("ora");

//
// ─── LOGIN ──────────────────────────────────────────────────────────────────────
//

async function login(email, password) {
	const spinner = ora("Logging you in...").start();
	try {
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

		let out = await request(options);
		out = JSON.parse(out);
		if (out.success !== true) {
			spinner.fail("Invalid login!");
			return new Error("Could not login credentials!");
		} else {
			spinner.succeed("Logged in successfully!");
			return 1;
		}
	} catch (error) {
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
		spinner.fail("Could not fetch data!");
		return error;
	}
}

//
// ─── MAKE THE CSV AFTER EXTRACTION ──────────────────────────────────────────────
//

async function Login_and_Get_Details(email, password) {
	const check = await login(email, password);
	if (check !== 1) {
		return Error("Could not login");
	}
	var application = [];
	var result = {
		application,
	};

	const spinner = ora("Fetching your data!").start();

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
			const company_url = "https://internshala.com" + application.job_url + "/";
			const profile = application.profile;

			result.application.push({
				application_status,
				company_name,
				company_url,
				profile,
			});
		});
	}
	spinner.succeed("Fetched data successfully!");

	spinner.start("Writing your data!");

	const json2csvParser = new Parser();
	const result_csv = json2csvParser.parse(result.application);

	fs.writeFile("output.csv", result_csv, (err) => {
		if (err) {
			spinner.fail("Could not write data!");
			throw err;
		}
		spinner.succeed("Data written successfully!");
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
