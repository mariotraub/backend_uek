import express from "express";

const app = express();
const port = 8080;
const url = "https://app-prod-ws.meteoswiss-app.ch/v1/plzDetail"

app.get("/temp/:plz", async (req, res) => {
	const temp = await getTemperature(req.params.plz);
	res.send(temp.toString());
});

app.listen(port, () => {
	console.log(`App listening on port: ${port}`)
});

async function getTemperature(plz) {
	const res = await (await fetch(`${url}?plz=${plz}00`)).json();
	return res.currentWeather.temperature;
}
