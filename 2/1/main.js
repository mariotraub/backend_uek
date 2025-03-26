function verdoppeln(zahl, callback) {
	callback(2 * zahl);
}

verdoppeln(5, (ergebnis) => {
	console.log("Das Ergebnis ist: " + ergebnis);
});
