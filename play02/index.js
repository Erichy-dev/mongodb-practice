"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
the other time on mongoose I dealt with schema. how to declare them & huse them use them as barebones for models
today I'll be dealing with schemaTypes
*/
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors = require("cors");
const morgan = require("morgan");
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const app = (0, express_1.default)();
const port = 8738;
app.use(cors());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(morgan("combined"));
app.listen(port, () => console.log("express connected on", port));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect("mongodb://localhost:27017/test");
        console.log("mongodb connected successfully");
    });
}
try {
    main();
}
catch (error) {
    console.log(error);
}
//MONGODATABASE
const schema = new mongoose_2.Schema({
    name: String,
    binary: Buffer,
    living: Boolean,
    updated: { type: Date, default: Date.now },
    age: { type: Number, min: 18, max: 65 },
    mixed: mongoose_2.Schema.Types.Mixed,
    _someId: mongoose_2.Schema.Types.ObjectId,
    decimal: mongoose_2.Schema.Types.Decimal128,
    array: [],
    ofString: [String],
    ofNumber: [Number],
    ofDates: [Date],
    ofBuffer: [Buffer],
    ofBoolean: [Boolean],
    ofMixed: [mongoose_2.Schema.Types.Mixed],
    ofObjectId: [mongoose_2.Schema.Types.ObjectId],
    ofArrays: [[]],
    ofArrayofNumbers: [[Number]],
    nested: {
        stuff: { type: String, lowercase: true, trim: true } // now you can also lowercase & trim spaces? 
    },
    map: Map,
    mapOfString: {
        type: Map,
        of: String // little  bit different from [String] for "ofString"
    }
}, { autoIndex: false }); //either autoIndex doesn't work or smthng aint right
schema.add({ "test": { type: { type: String }, "description": String } });
const Thing = mongoose_1.default.model("playWithTypes", schema);
const tt = new Thing; // so dont need parenthesis for the class to be instantiated
tt.name = "Riki the GREAT";
tt.age = 23;
tt.updated = new Date; // interested in what this returns. zit the same as Date.now
tt.binary = Buffer.alloc(0); //returns a buffers of size in bytes
tt.living = false;
tt.mixed = { any: { thing: "I'm super-great" } }; //type Schema.Types.mixed
tt.markModified("mixed");
tt._someId = new mongoose_1.default.Types.ObjectId;
tt.array.push(1);
tt.ofString.push("strings");
tt.ofNumber.unshift(1, 2, 3, 4);
tt.ofDates.addToSet(new Date);
tt.ofBuffer.pop();
tt.ofMixed = [1, [], "three", { four: 1 }];
tt.nested.stuff = "good";
tt.map = new Map([["key", "value"]]);
tt.test.type = "just a test";
tt.test.description = "testing attribute type";
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
