  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDCVDH2-nZ4FqIz729OtIeUbW4kiLlRchU",
    authDomain: "pokemon-514c2.firebaseapp.com",
    databaseURL: "https://pokemon-514c2.firebaseio.com",
    projectId: "pokemon-514c2",
    storageBucket: "pokemon-514c2.appspot.com",
    messagingSenderId: "946348086330"
  };
  firebase.initializeApp(config);

  var database = firebase.database()
  var connectionsRef = database.ref("/connections")
  var connectedRef = database.ref(".info/connected")
  var stage = database.ref("/stage")
  var currentPlayerNumber = 0;
  var playerId_;
  var player_1;
  var player_2;

  database.ref("/stage").set({
  "player_1": "scissors",
  "player_2": "paper"
  })
  stage.on("value", function(snap) {
    console.log(snap.key)
    console.log(snap.child("/player_1").key)
    console.log(snap.child("/player_1").val())
  })





  //---------------------------------------------------------------------------
  //
  // the player counter 
  //
  //---------------------------------------------------------------------------

  connectedRef.on("value", function(snap){
    console.log(snap.val())
    if (snap.val()) {
      var con = connectionsRef.push(true)
      con.onDisconnect().remove()
    } 
  })

  connectionsRef.on("value", function(snap){
    if (currentPlayerNumber < 3) {
      currentPlayerNumber = snap.numChildren()
      $("#connected-users").html(currentPlayerNumber) 
    } else {
      console.log("more than 2 players")
    }

  })

  //---------------------------------------------------------------------------


  //---------------------------------------------------------------------------
  //
  // stage counter 
  //
  //---------------------------------------------------------------------------



  database.ref("/stage").on("value", function(snapshot){
    console.log(snapshot.val().player_1)
    console.log(snapshot.val().player_2)
  })

  var testChoice1 = "rock"
  var testChoice2 = "paper"
  var testChoice3 = "scissors"
  var choices = ["rock", "paper", "scissors"]
  var map = {};


choices.forEach(function(choice, i) {
    map[choice] = {};
    map[choice][choice] = "Was a tie"
    map[choice][choices[(i+1)%3]] = choices[(i+1)%3] + " wins"
    map[choice][choices[(i+2)%3]] = choice + " wins"
})

function compare(choice1, choice2) {
    return (map[choice1] || {})[choice2] || "Invalid choice";
}

console.log(map)
console.log(compare(testChoice1, testChoice3))

$("#rock").attr("value", map.rock).click(function(){
    database.ref("/stage").set({
      player_1: "rock", 
      player_2: "rock"
    })
  })
$("#paper")
  .attr("value", map.paper)
$("scissors")
  .attr("value", map.scissors)

