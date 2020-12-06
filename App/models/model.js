const { v5: uuidv5 } = require('uuid');

const MY_NAMESPACE = "d846158b-bf02-40d4-862e-a6fc44baeae3";

var createNode = function (session, word) {
    let query = 'MERGE (n:Word {id: $id, text : $text})'

    let writeTxResultPromise = session.writeTransaction(txc => {

      var result = txc.run(query, 
        {
          id: uuidv5(word, MY_NAMESPACE),
          text: word
      })
      
      return result
    })
  
    writeTxResultPromise
      .then(() => {session.close()})
  
    return writeTxResultPromise;
}


var deleteNode = function (session, word) {
  let query = 'Match (n:Word) where n.id = $id delete n'

  let writeTxResultPromise = session.writeTransaction(txc => {

    var result = txc.run(query, 
      {
        id: uuidv5(word, MY_NAMESPACE),
    })
    
    return result
  })

  writeTxResultPromise
    .then(() => {session.close()})

  return writeTxResultPromise;
}

var deleteRelation = function (session, word1, word2, type) {
  let query = `Match (n:Word) where n.id1 = $id match (b:Word) where b.id = $id2 match (n)-[k:${type}]-(b) delete n`

  let writeTxResultPromise = session.writeTransaction(txc => {

    var result = txc.run(query, 
      {
        id1: uuidv5(word, MY_NAMESPACE),
        id1: uuidv5(word, MY_NAMESPACE)
    })
    
    return result
  })

  writeTxResultPromise
    .then(() => {session.close()})

  return writeTxResultPromise;
}




var findNode = function (session, word) {
  let query = 'match (n:Word) where n.id = $id  return n.text'

  let readTxResultPromise = session.readTransaction(txc => {

    var result = txc.run(query, 
      {id: uuidv5(word, MY_NAMESPACE)
      })

    return result
  })

  readTxResultPromise
    .then(() => {session.close();})

    return readTxResultPromise;

}


var findRelation = function (session,word, type) {
  let query = `match (n:Word) where n.id = $id  match (n)-[:${type}]-(b) return b.text`

  let readTxResultPromise = session.readTransaction(txc => {

    var result = txc.run(query, 
      {
        id: uuidv5(word, MY_NAMESPACE),
      })

    return result
  })


  readTxResultPromise
    .then(() => {session.close()})

    return readTxResultPromise;
}


var createRelation = function (session,word1,word2, type) {
  let query = `match (n:Word) where n.id = $id1 merge (b:Word {id: $id2, text : $text2}) merge (n)-[:${type}]-(b)`

  let writeTxResultPromise = session.writeTransaction(txc => {

    var result = txc.run(query, 
      {
        id1: uuidv5(word1, MY_NAMESPACE),
        id2: uuidv5(word2, MY_NAMESPACE),
        text2: word2
      })

    return result
  })


  writeTxResultPromise
    .then(() => {session.close()})

    return writeTxResultPromise;
}


module.exports = {
    createNode: createNode,
    deleteNode: deleteNode,
    findNode: findNode,
    findRelation: findRelation,
    createRelation: createRelation,
    deleteRelation: deleteRelation
}