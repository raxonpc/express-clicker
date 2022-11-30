import express from "express"
import { engine } from "express-handlebars"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"
import { TypePredicateKind } from "typescript";

dotenv.config();

const PORT = process.env.PORT ?? 8080;
const URI = process.env.MONGODB_URI;

const app = express();
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "views");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const client = new MongoClient(URI);

const database = client.db('main').collection('clicks');

app.get("/", async (req, res) => {
    try {
        const record = await database.findOne();
        console.log(record);

        res.render("home", {
            click_count: record.click_count
        });
    } catch(error) {
        console.log(error);
        res.render("error");
    }
});

app.post("/", async (req, res) => {
    try {
        const record = await database.findOneAndUpdate(
            {},
            {
                $inc: { click_count : 1 },
            },
            {
                returnDocument: "after"
            }
        );
        console.log(record, "post");

        res.render("home", { 
            click_count: record.value.click_count
        });
    } catch(error) {
        console.log(error);
        res.render("error");
    }
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});