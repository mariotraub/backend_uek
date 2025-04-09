import express from "express";
import { randomUUID } from "crypto";

const router = express.Router();

let tasks = [
  {
    id: "39f8c61b-6d17-4885-baa3-21d0ba104c39",
    title: "Einkaufen gehen",
    description: "Milch, Brot, Eier und Käse kaufen",
    done: false,
    dueDate: "2025-04-10"
  },
  {
    id: "fa973555-04e7-4d38-9d29-86c6b550733c",
    title: "Projektbericht schreiben",
    description: "Zusammenfassung und Fazit noch ergänzen",
    done: true,
    dueDate: "2025-04-08"
  },
  {
    id: "419d1119-ac41-4e1e-b293-58fa92ec0daf",
    title: "Arzttermin",
    description: "Routineuntersuchung beim Hausarzt",
    done: false,
    dueDate: "2025-04-12"
  }
];


function validateId (req, res, next) {
	const id = req.params.id;
	if (!tasks.some(t => t.id === id)) {
		res.sendStatus(404);
		return;
	}
	next();
}

router.get("/", (_, res) => {
	res.send(tasks);
});

router.post("/", (req, res) => {
	const task = {
		...req.body,
		id: randomUUID(),
	};

	tasks.push(task);
	res.status(201).send(task)
});

router.get("/:id", (req, res) => {
	const id = req.params.id;
	const task = tasks.filter(t => t.id === id);
	res.send(task);
});

router.put("/:id", validateId, (req, res) => {
	const id = req.params.id;
	const task = req.body;
	
	tasks = tasks.map(t => {
		if (t.id === id) {
			res.send(task);
			return {
				...task,
				id: id
			};
		}
		return t;
	});
});

router.patch("/:id", validateId, (req, res) => {
	const id = req.params.id;
	tasks = tasks.map(t => {
		if (t.id === id) {
			const task = {
				...t,
				...req.body,
			};	
			res.send(task);
			return task;
		}
		return t;
	});
});

router.delete("/:id", validateId, (req, res) => {
	const id = req.params.id;
	tasks = tasks.filter(t => t.id !== id);
	res.sendStatus(204);
});

export default router;
