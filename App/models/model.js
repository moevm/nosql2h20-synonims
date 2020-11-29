const { v5: uuidv5 } = require('uuid');

const MY_NAMESPACE = "d846158b-bf02-40d4-862e-a6fc44baeae3";

var create = function (session, word) {
    let query = 'MERGE (a:Word {id: $id, text : $text})'
    session
        .run(query, {
            id: uuidv5(word, MY_NAMESPACE),
            text: word
        })
        .then()
        .catch(error => {
            console.log(error)
        })
        .then(() => session.close())

}

/*
var createRelation = function (session, word1, word2, type) {


    let query = 'MERGE (a:Word{id: $id1, text: $text1})\
    MERGE (b:Word{id: $id2, text: $text2})\
    MERGE (a)-[:Synonym]-(b)';



    session
        .run(query, {
            id1: uuidv5(word1, MY_NAMESPACE),
            text1: word1,
            id2: uuidv5(word2, MY_NAMESPACE),
            text2: word2,
        })
        .then()
          .catch(error => {
            console.log(error)
          })
          .then(() => session.close())

}
*/
var createRelation = function (session, word1, word2, type) {

    let query = 'MERGE (a:Word{id: $id1, text: $text1})-[:Synonym]-(b:Word{id: $id2, text: $text2})';

    var writeTxResultPromise = session.writeTransaction(async txc => {
        await txc.run(query, {
                id1: uuidv5(word1, MY_NAMESPACE),
                text1: word1,
                id2: uuidv5(word2, MY_NAMESPACE),
                text2: word2
        })
      })
       
      writeTxResultPromise
        .then(session.close(),
        console.log("!!!")
        )
        .catch(error => {
          console.log(error)
        })

}



module.exports = {
    create: create,
    createRelation: createRelation
}