const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var _ = require("lodash");
const app = express();

app.set("view engine", "ejs");
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(express.static("public"));

// mongoose connect
mongoose.connect("mongodb://localhost:27017/wikidb", {
	useNewUrlParser: true,
});
const articleSchema = new mongoose.Schema({
	title: String,
	content: String,
});

const Article = new mongoose.model("article", articleSchema);

//////////////////Requests targetting all articles////////////////

app.route("/articles")

	.get(function (req, res) {
		Article.find({}, function (err, results) {
			if (!err) {
				res.send(results);
			} else {
				res.send(err);
			}
		});
	})

	.post(function (req, res) {
		const article1 = new Article({
			title: req.body.title,
			content: req.body.content,
		});
		article1.save(function (err) {
			if (!err) {
				res.send("successfully saved");
			} else {
				res.send(err);
			}
		});
	})

	.delete(function (req, res) {
		Article.deleteMany(function (err) {
			if (!err) {
				res.send("successfully deletd all articles");
			} else {
				res.send(err);
			}
		});
	});

/////////////////////////Requests Targetting a specific article///////////////////

app.route("/articles/:articleTitle")

	.get(function (req, res) {
		Article.findOne(
			{ title: req.params.articleTitle },
			function (err, result) {
				if (!err) {
					res.send(result);
				} else {
					res.send(err);
					res.send("No articles found with that title");
				}
			}
		);
	})

	.put(function (req, res) {
		Article.replaceOne(
			{ title: req.params.articleTitle },
			{ title: req.body.title, content: req.body.content },
			{ overwrite: true },
			function (err) {
				if (!err) {
					res.send("Successfully updated");
				} else {
					res.send(err);
				}
			}
		);
	})

	// .patch(function (req, res) {
	// 	Article.updateOne(
	// 		{ title: req.params.articleTitle },
	// 		req.body,
	// 		function (err) {
	// 			if (!err) {
	// 				res.send("sucessfully patched");
	// 			}
	// 		}
	// 	);
	// });
	.patch(function (req, res) {
		Article.findOneAndUpdate(
			{ title: req.params.articleTitle },

			{ $set: req.body },

			function (err) {
				if (!err) {
					res.send("The article was updated Successfully");
				}
			}
		);
	})
	.delete(function (req, res) {
		Article.deleteOne({ title: req.params.articleTitle }, function (err) {
			if (!err) {
				res.send("deleted successfully");
			}
		});
	});

app.listen(3000, function () {
	console.log("server has started on port 3000");
});
