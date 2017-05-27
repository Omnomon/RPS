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
    var currentPlayerNumber = 0;
    var thisPlayerNumber = 0;
    var playerId_;
    var postKey;
    var playerChoice;
    var postKey = [];
    postKey = database.ref().push().key
    console.log(postKey)
    var wins = 0;
    var losses = 0;
    var picks = [];
    var keys = [];
    var childData;
    var childKey;
    var playerIs

    $(".wins").html(wins)
    $(".losses").html(losses)
        //---------------------------------------------------------------------------
        //
        // everytime a new connection happens, add it to firebase. Limit to 2 connections
        //
        //---------------------------------------------------------------------------


    data = {
        choice: ""
    }



    function pushUserToFirebase() {
        database.ref("/users").on("value", function(snap) {
            if (snap.numChildren() >= 2) {
                return
            } else {
                database.ref("/users/" + postKey).set(data)
                database.ref("/users/" + postKey).onDisconnect().remove()
                var playerNumber = snap.numChildren()
                playerIs = "Player " + (playerNumber + 1)
                $(".playerNumber").html(playerIs)
            }
        })

    }
    pushUserToFirebase()

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
        map[choice][choice] = "tie"
        map[choice][choices[(i + 1) % 3]] = choices[(i + 1) % 3]
        map[choice][choices[(i + 2) % 3]] = choice
    })

    console.log(map)

    function compare(choice1, choice2) {
        if ((map[choice1] || {})[choice2]) {
            return (map[choice1] || {})[choice2]
        } else {
            return "waiting"
        }

    }




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
        if (picks.length === 2) {
            var winner = compare(picks[0].choice, picks[1].choice)
                /*            $(".winnerIs").html(winner)*/
            winLossCounter()
        }

        function winLossCounter() {
            if (winner === "waiting") {
                $(".winnerIs").html("Waiting for the other user to select a choice...")
            } else if (winner === playerChoice) {
                $(".winnerIs").html("You win!")
                wins++
                $(".wins").html(wins)
            } else if (winner === "tie") {
                $(".winnerIs").html("Tie...")
            } else {
                $(".winnerIs").html("You lost!")
                losses++
                $(".losses").html(losses)
            }
            database.ref("/users/" + keys[0]).set({
                choice: ""
            })
            database.ref("/users/" + keys[1]).set({
                choice: ""
            })

        }
    })


    $(document).on("click", "#rock", function(event) {
        event.preventDefault();
        $(".winnerIs").html("")
        database.ref("/users/" + postKey).set({
            choice: "rock"
        })
        playerChoice = "rock"
        $(".playerPicked").html("Rock")
        console.log("rock works")

    }).blur()

    $(document).on("click", "#paper", function(event) {
        event.preventDefault();
        $(".winnerIs").html("")
        database.ref("/users/" + postKey).set({
            choice: "paper"
        })
        playerChoice = "paper"
        $(".playerPicked").html("Paper")


        console.log("paper works")
    }).blur()

    $(document).on("click", "#scissors", function(event) {
        event.preventDefault();
        $(".winnerIs").html("")
        database.ref("/users/" + postKey).set({
            choice: "scissors"
        })
        playerChoice = "scissors"
        $(".playerPicked").html("Scissors")


        console.log("scissors works")
    }).blur()

    //---------------------------------------------------------------------------
    //
    // Chat functionality
    //
    //---------------------------------------------------------------------------
    database.ref("/chat").set({})

    $(".chatSend").click(function() {
        var chatName = $(".chatName").val()
        var chatText = $(".chatText").val()
        database.ref("/chat").push({ chatName, chatText })
        $(".chatText").val("")
    })

    $(document).keyup(function(event) {
        if (event.keyCode === 13) {
            var chatName = $(".chatName").val()
            var chatText = $(".chatText").val()
            database.ref("/chat").push({ chatName, chatText })
            $(".chatText").val("")
        }
    })

    var startListening = function() {
        database.ref("/users").on("child_added", function(snap) {
            playerIs = "Player " + (playerNumber + 1)
        })

        database.ref("/chat").on("child_added", function(snap) {
            var msg = snap.val()
            var msgTextElement = $("<p>").html(msg.chatName + ": " + msg.chatText)
            var msgElement = $("<div>").addClass("post")
            msgElement.append(msgTextElement)
            $(".chatDisplay").append(msgElement)
        })
    }

    startListening()
})
