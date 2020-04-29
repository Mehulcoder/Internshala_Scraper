# internshala_scraper

Tired of looking up for your internship application status in **Insternshala** by scrolling and switching to different pages again and again?

So, this one's for you. A simple webscraping tool which will extract the required data for you and put it into a csv file, in a structured and sorted format.

> Open to suggestions for upcoming versions

## Getting Started

### Prerequisites

You should have the following installed on your local machine:

```
NodeJs
npm
Terminal
```

Below are the download links for the same:

- [NodeJs and npm](https://nodejs.org/en/download/)

Install them and then move to the next step.

### Installing

- Download and extract the repository.

- Start terminal and change working directory to the extracted repository.

- Make sure your current working directory contains the file named `index.js`

- To install the required dependencies, inside the terminal, run command `npm install`

## Running

- Say your **email address** is `abc@gmail.com` and **password** is `password`. (You'll be having something different, use yours only)
- Using the terminal run command `node index.js abc@gmail.com password`

> Basically you have to provide credentials as the arguments while running the application.

- Wait for a few seconds till you see a `output.csv` file in your directory.
- DONE !!! Just open the `output.csv` file and you have all your required data. You can sort it in MS Excel or any other application

## Built With

- NodeJs

- npm dependencies used:

      	* "request-promise": "^4.2.5" : To send requests.
      	* "ora": "^4.0.4", : For loading animation.

  - "json2csv": "^5.0.1": For creating _.csv_ file

## Authors

- **[Mehul Chaturvedi](https://github.com/Mehulcoder)**

## Acknowledgments

This was something which I had in my mind from a very long time. I didn't now stuff back then so wasn't able to come up with anything. This was really a fun project, got to learn a lot, about cookies and stuff and so much more.

I tried to make this README as detailed as possible. If you have any queries or suggestions you can E-mail me at `mehul170104047@iitg.ac.in` or `mehul355180@gmail.com`.
