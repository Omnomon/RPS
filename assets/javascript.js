$(document).ready(function() {
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


    //---------------------------------------------------------------------------
    //
    // list of all the stupid global variables 
    //
    //---------------------------------------------------------------------------

    var database = firebase.database()
        /*  var connectionsRef = database.ref("/connections")
          var connectedRef = database.ref(".info/connected")
          var stage = database.ref("/stage")*/
    var currentPlayerNumber = 0;
    var thisPlayerNumber = 0;
    var playerId_;
    var postKey;
    var player1Choice;
    var player2Choice;
    var postKey = [];
    postKey = database.ref().push().key
    console.log(postKey)

    //---------------------------------------------------------------------------
    //
    // everytime a new connection happens, add it to firebase
    //
    //---------------------------------------------------------------------------


    data = {
        choice: ""
    }

    function pushUserToFirebase() {
        database.ref("/users/" + postKey).set(data)
        database.ref("/users/" + postKey).onDisconnect().remove()
    }


    pushUserToFirebase()


    //---------------------------------------------------------------------------
    //
    // use this function to determine currentPlayerNumber...too lazy to clean it right now 
    //
    //---------------------------------------------------------------------------


    database.ref("/users").on("value", function(snap) {

        var temp = snap.val()
        if (snap.numChildren() >= 3) {
            /*          console.log("more than 2 players")*/
            $("#connected-users").html("more than 2 players")
        } else {
            currentPlayerNumber = snap.numChildren()
            $("#connected-users").html(currentPlayerNumber)

        }
    })

    //---------------------------------------------------------------------------
    //
    // RPS logic 
    //
    //---------------------------------------------------------------------------


    var testChoice1 = "rock"
    var testChoice2 = "paper"
    var testChoice3 = "scissors"
    var choices = ["rock", "paper", "scissors"]
    var map = {};


    choices.forEach(function(choice, i) {
        map[choice] = {};
        map[choice][choice] = "Was a tie"
        map[choice][choices[(i + 1) % 3]] = choices[(i + 1) % 3] + " wins!"
        map[choice][choices[(i + 2) % 3]] = choice + " wins!"
    })

    function compare(choice1, choice2) {
        if ((map[choice1] || {})[choice2]) {
          database.ref("/users/" + keys[0]).set({
            choice: ""
          })
           database.ref("/users/" + keys[1]).set({
            choice: ""
          })
           return (map[choice1] || {})[choice2]
        } else {
          return "Waiting for the other user to select a choice..."
        }

/*        return (map[choice1] || {})[choice2] || "Waiting for the other user to select a choice...";*/
    }

    var picks = [];
    var keys = [];
    var childData;
    var childKey;


    //---------------------------------------------------------------------------
    //
    // set value changes on click, run comparision on child_changed
    //
    //---------------------------------------------------------------------------


      database.ref("/users").on("value", function(snap) {
          console.log(snap.val())
          var temp = snap.val()
          picks = Object.values(snap.val())
          keys = Object.keys(snap.val())
          console.log(picks)
          console.log(keys[0])
          if (picks.length === 2 ) {
            var winner = compare(picks[0].choice, picks[1].choice)
            $(".winnerIs").html(winner)
          }



                
      })


    $(document).on("click", "#rock", function(event) {
        console.log("rock works")
        event.preventDefault();
        database.ref("/users/" + postKey).set({
            choice: "rock"
        })
    }).blur()

    $(document).on("click", "#paper", function(event) {
        event.preventDefault();
        database.ref("/users/" + postKey).set({
            choice: "paper"
        })
        console.log("paper works")
    }).blur()

    $(document).on("click", "#scissors", function(event) {
        event.preventDefault();
        database.ref("/users/" + postKey).set({
            choice: "scissors"
        })
        console.log("scissors works")
    }).blur()

})
