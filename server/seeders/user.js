
const User = require("../models/User")
const {faker} = require("@faker-js/faker")

const createUser=async(numUser)=>{
    try{
        const userPromise=[]

        for(let i=0;i<numUser;i++){
            const tempUser = User.create({
                fullName: faker.person.fullName(),
                userName:faker.internet.userName(),
                email:faker.internet.email(),
                password:"password",
                profile:faker.image.avatar()

            })
            userPromise.push(tempUser)
        }
        await Promise.all(userPromise)
        console.log('user created')
        process.exit(1)
    }
    catch(error){
        console.log("error",error)
        process.exit(1)
    }
}
module.exports = {createUser}