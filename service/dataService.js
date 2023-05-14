const jwt = require("jsonwebtoken")
const db = require("./db")




register = (acno, uname, psw) => {
  //store the resolved output of findOne in a variable user
  return db.User.findOne({ acno }).then(user => {
    //if acno present in db then get the object of that user else null response
    if (user) {
      return {
        status: false,
        message: "user already exist",
        statusCode: 404
      }
    } else {
      newUser = new db.User({
        username: uname,
        acno,
        password: psw,
        balance: 0,
        transaction: []
      })
      newUser.save()
      return {
        status: true,
        message: "registered",
        statusCode: 200
      }

    }
  })
}


login = (acno, psw) => {

  return db.User.findOne({ acno }).then(user => {
    if (user) {
      if (psw == user.password) {
        currentUser = user["username"]
        currentAcno = acno

        const token = jwt.sign({ acno }, "superkey123")
        return {
          status: true,
          message: "login success",
          statusCode: 200,
          currentUser,
          currentAcno,
          token
        }
      } else {
        return {
          status: false,
          message: "incorrect password",
          statusCode: 404

        }
      }
    } else {
      return {
        status: false,
        message: "incorrect account number",
        statusCode: 404

      }
    }
  })
}





deposit = (acno, psw, amnt) => {
  var amount = parseInt(amnt)
  return db.User.findOne({ acno }).then(user => {
    if (user) {
      if (psw == user.password) {
        user.balance += amount
        user.transaction.push(
          {
            Type: "CREDIT",
            Amount: amount
          }
        )
        user.save()
        return {
          status: true,
          message: `your account has been credited with amount ${amount} and balance is ${user["balance"]}`,
          statusCode: 200
        }
      }
      else {
        return {
          status: false,
          message: "incorrect password",
          statusCode: 404

        }
      }
    } else {
      return {
        status: false,
        message: "incorrect account number",
        statusCode: 404

      }
    }
  })
}


withdraw = (acno, psw, amnt) => {
  var amount = parseInt(amnt)
  return db.User.findOne({ acno, password: psw }).then(user => {
    if (user) {
      if (amount <= user.balance) {
        user.balance -= amount
        user.transaction.push({
          Type: "DEBIT",
          Amount: amount
        })
        user.save()
        return {
          status: true,
          message: `your account has been debited  amount ${amount} and available balance is ${user["balance"]}`,
          statusCode: 200

        }
      } else {
        return {
          status: false,
          message: "insufficient balance",
          statusCode: 400

        }
      }
    } else {
      return {
        status: false,
        message: "incorect account no. or password",
        statusCode: 404

      }
    }
  })
}


getTransaction = (acno) => {
  return db.User.findOne({ acno }).then(user => {
    if (user) {
      return{
        status: true,
          transaction: user.transaction,
            statusCode: 200
      }
    }

  })
}


deleteAcc=(acno)=>{
 return db.User.deleteOne({acno}).then(user=>{
    if(user){
      return{
        status: true,
          message: "account deleted",
            statusCode: 200
      }
    }else{
     return {
      status: false,
          message: "account no. not present",
            statusCode: 401}
    }
  })
}

module.exports = {
  register, login, deposit, withdraw, getTransaction,deleteAcc
}