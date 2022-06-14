/*
the other time on mongoose I dealt with schema. how to declare them & huse them use them as barebones for models
today I'll be dealing with schemaTypes
*/
import express from "express"
import bodyParser from "body-parser"
const cors = require("cors")
const morgan = require("morgan")

import mongoose from "mongoose"
import { Schema } from "mongoose"

const app = express()
const port = 8738

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(morgan("combined"))

app.listen(port, () => console.log("express connected on", port))

async function main(){
  await mongoose.connect("mongodb://localhost:27017/test")
  console.log("mongodb connected successfully")
}
try {
  main()
} catch (error) {
  console.log(error)
}

//MONGODATABASE
const schema = new Schema({
  name: String,
  binary: Buffer,
  living: Boolean,
  updated: { type: Date, default: Date.now },//cool way to provide default values. no need for now()
  age: { type: Number, min: 18, max: 65 },//incredible way to provide default min & max
  mixed: Schema.Types.Mixed,
  _someId: Schema.Types.ObjectId,//thought was using ObjectId
  decimal: Schema.Types.Decimal128,// criasly though I could just use Decimal128
  array: [],
  ofString: [String],//not sure what this of prepend means
  ofNumber: [Number],
  ofDates: [Date],
  ofBuffer: [Buffer],
  ofBoolean: [Boolean],
  ofMixed: [Schema.Types.Mixed],
  ofObjectId: [Schema.Types.ObjectId],
  ofArrays: [[]],
  ofArrayofNumbers: [[Number]],
  nested: {
    stuff: { type: String, lowercase: true, trim: true}// now you can also lowercase & trim spaces? 
  },
  map: Map,
  mapOfString: {
    type: Map,
    of: String// little  bit different from [String] for "ofString"
  }
}, {autoIndex: false}) //either autoIndex doesn't work or smthng aint right
schema.add({"test": {type: {type: String}, "description": String }})
const Thing = mongoose.model("playWithTypes", schema);

const tt = new Thing; // so dont need parenthesis for the class to be instantiated
tt.name = "Riki the GREAT";
tt.age = 23;
tt.updated = new Date;// interested in what this returns. zit the same as Date.now
tt.binary = Buffer.alloc(0); //returns a buffers of size in bytes
tt.living = false;
tt.mixed = { any: {thing: "I'm super-great"}};//type Schema.Types.mixed
tt.markModified("mixed");
tt._someId = new mongoose.Types.ObjectId;
tt.array.push(1);
tt.ofString.push("strings");
tt.ofNumber.unshift(1, 2, 3, 4);
tt.ofDates.addToSet(new Date);
tt.ofBuffer.pop();
tt.ofMixed = [1, [], "three", {four: 1}];
tt.nested.stuff = "good";
tt.map = new Map([["key", "value"]]);
tt.test.type = "just a test";
tt.test.description = "testing attribute type"
tt.save();

/*
AI SCHEMA TYPES
required
default
select
get: function defines custom getter for this property
set
alias
immutable: mongoose prevents you from changing immutable paths
transform: mongoose calls this function when you call Document#toJSON() including when you JSON.stringify() a document. //I've got to use this method
*/
/*
INDEXES
index
unique: unique index
sparse: sparse index
*/
/*
STRING
lowercase
uppercase
trim
match: RegExp, creates a validator
enum: Array, creates a validator that checks if the value is in the given array
minLength
maxLength
populate: Object, sets default populate options
*/
/*
NUMBERS
min
max
enum
populate
*/
/*
DATE
min
max

OBJECTID
populate
*/

//end of prac
