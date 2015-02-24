"use strict";

var PgTriggers = require("./PgTriggers");

var CONN_STR = "postgres://meteor:meteor@127.0.0.1/meteor";
var CHANNEL = "ben_test";

var triggers = new PgTriggers(CONN_STR, CHANNEL);

var mySelect = triggers.select("\n\tSELECT\n\t\tstudents.name  AS student_name,\n\t\tstudents.id    AS student_id,\n\t\tassignments.id AS assignment_id,\n\t\tscores.id      AS score_id,\n\t\tassignments.name,\n\t\tassignments.value,\n\t\tscores.score\n\tFROM\n\t\tscores\n\tINNER JOIN assignments ON\n\t\t(assignments.id = scores.assignment_id)\n\tINNER JOIN students ON\n\t\t(students.id = scores.student_id)\n\tWHERE\n\t\tassignments.class_id = $1\n", [1]);

mySelect.on("update", function (diff) {
	console.log(diff);
});


process.on("SIGINT", function () {
	// Ctrl+C
	triggers.cleanup().then(process.exit);
});