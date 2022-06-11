const mongoose =require ("mongoose")
const { Schema } = mongoose;
// mongoose.set("autoIndex", false)
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const morgan = require("morgan")

const app = express()
const port = 8080

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(morgan("combined"))

app.listen(port, () => {
  console.log("express running")
})

//MongoDB
async function main() {
  await mongoose.connect("mongodb://localhost:27017/test")
  console.log("connected to mongoDB successfull")
}
try {
  main()  
} catch (error) {
  (err) => console.log(err)
}

//a reference to schema
const blogSchema = new Schema({
  title: String,
  author: String,
  body: String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs: Number
  }
}, {autoIndex: false});
/* Data Types: String, Number, Date, Buffer, Boolean, Mixed, ObjectId, Array, Decimal128, Map */
/* Schemas also define instance methods, static model methods, compoud indexes & middlewares */
//compile schema into a model
//new Schema().path("_id") to get value of the ID
//create model instance & save
//don't attach after creating the model. Get done with the schemas then move on to the model otherwise an error is returned
blogSchema.method({
  findSameAuthor: function() {
    return "method successfull"
  },
  shout: function() {
    console.log ("bruuuuuuuuuuuh")
  }
})
//Schema().static("name", function(){}) have the same syntax as Schema().method()
//However, static functions can be called on the model itself while methods have to be called from the model instance

//Query helpers
blogSchema.query.byAuthor = function(name) {
  return this.where({author: new RegExp(name, "i")})
}

blogSchema.add({"name": {"first": String, "last": String}})

//virtuals
//Do not get persisted to MongoDB
//Getters are useful for formatting or combining fields while setters for de-composing a single value into multiple values for storage
//Do not work with toJSON or toObject unless you pass {virtuals: true}
blogSchema.virtual("fullName").get(function(){
  return this.name.first + " " + this.name.last;
})
  .set(function(v) {
    this.name.first = v.substr(0, v.indexOf(' '))
    this.name.last = v.substr(v.indexOf(' ') + 1)
  })

//Aliases
// getter & setter seamlessly get & set another property
// comes in handy for saving network bandwith
// include the nested path if the alias is nested
blogSchema.add({"cr": {
  type: String,
  alias: "career"
}})

//Options
/*
autoIndex
autoCreate
bufferCommands
bufferTimeoutMS
capped
collection
discriminatorKey
id
_id
minimize
read
writeConcern
shardKey
strict
strictQuery
toJSON
toObject
typeKey
validateBeforeSave
versionKey
optimisticConcurrency
collation
timeSeries
selectPopulatedPaths
skipVersioning
timestamps
storeSubdocValidationError
*/

//USING ES6 CLASSES
//class methods become Mongoose methods
// class statics become Mongoose statics
// ES6 getters & setters become Mongoose virtuals
class MyClass {
  myMethod(){return " is a " + this.career}
  static myStats() {return "My name is "}
  get myVirtual() {return 42;}
}
blogSchema.loadClass(MyClass)

const Blog = mongoose.model("Blog", blogSchema)
async function EricBlog(){
  const ericBlog = new Blog({author: "Bazuu", cr: "Cracker", name: {first: "by", last: "pie"}})
  // ericBlog.fullName = "Miki Ross"
  await ericBlog.save()
  // Blog.find().byAuthor("chizi").exec((err, blogs)=>{
  //   console.log(blogs)
  // })
  // console.log(ericBlog.fullName)
  // ericBlog.shout()
  // console.log(ericBlog.toObject({virtuals: true}))
  console.log (ericBlog.fullName, ericBlog.myMethod())
  console.log (Blog.myStats(), ericBlog.fullName)
}
// EricBlog()
