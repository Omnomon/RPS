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
    var wins = 0;
    var losses = 0;
    var picks = [];
    var keys = [];
    var childData;
    var childKey;
    var playerIs
    postKey = database.ref().push().key
    console.log(postKey)
    $(".wins").html(wins)
    $(".losses").html(losses)
        //---------------------------------------------------------------------------
        //
        // everytime a new connection happens, add it to firebase. Limit to 2 connections
        //
        //---------------------------------------------------------------------------




    $(".winnerIs").html("")
    database.ref("/users").on("value", function(snap) {

        if (snap.numChildren() >= 2) {
            return
        } else {
            database.ref("/users/" + postKey).set({ choice: "waiting" })
            var playerNumber = snap.numChildren()
            playerIs = "Player " + (playerNumber + 1)
            $(".playerNumber").html(playerIs)
        }

        database.ref("/users").off()
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
        map[choice][choice] = "tie"
        map[choice][choices[(i + 1) % 3]] = choices[(i + 1) % 3]
        map[choice][choices[(i + 2) % 3]] = choice
    })

    console.log(map)

    function compare(choice1, choice2) {
        if ((map[choice1] || {})[choice2]) {
            return (map[choice1] || {})[choice2]
        }
    }

    //---------------------------------------------------------------------------
    //
    // set value changes on click, run comparision on child_changed
    //
    //---------------------------------------------------------------------------



    $(document).on("click", "#rock", function(event) {
        var winner;
        database.ref("/users/" + postKey).set({
            choice: "rock"
        });
        playerChoice = "rock";
        $(".playerPicked").html("Rock");
        console.log("player choice is" + playerChoice)

        $(this).blur();
    })

    $(document).on("click", "#paper", function(event) {
        var winner
        database.ref("/users/" + postKey).set({
            choice: "paper"
        });
        playerChoice = "paper";
        $(".playerPicked").html("Paper");
        $(this).blur();

        console.log("player choice is" + playerChoice)
    })

    $(document).on("click", "#scissors", function(event) {
        var winner;
        database.ref("/users/" + postKey).set({
            choice: "scissors"
        });
        playerChoice = "scissors";
        $(".playerPicked").html("Scissors");
        $(this).blur();

        console.log("player choice is" + playerChoice)
    })

    function findKey() {
        return postKey
    }


    /*    database.ref("/users").on("value", function(snap) {


            database.ref("/users/" + postKey).onDisconnect().remove();
            console.log(snap.val());
            var temp = snap.val();
            keys = Object.keys(snap.val());
            var ownKey = keys.find(findKey);
            var ownKeyIndex = keys.indexOf(ownKey);
            var otherKey = keys.splice(ownKeyIndex, 1);
            var opponentChoice = temp[otherKey].choice;
            console.log(playerChoice)
            console.log(opponentChoice)
              if ((playerChoice == "rock") && (opponentChoice == "scissors")){
                wins++
                console.log("runs")
                $(".wins").html(wins)
                $(".winnerIs").html("You win!")
              } else if ((playerChoice == "rock") && (opponentChoice == "paper")){
                losses++
                $(".losses").html(losses)
                $(".winnerIs").html("You lost!")
              } else if ((playerChoice == "paper") && (opponentChoice == "rock")){
                wins++
                $(".wins").html(wins)
                $(".winnerIs").html("You win!")
              }else if ((playerChoice == "paper") && (opponentChoice == "scissors")){
                losses++
                $(".losses").html(losses)
                $(".winnerIs").html("You lost!")
              } else if ((playerChoice == "scissors") && (opponentChoice == "rock")){
                losses++
                $(".losses").html(losses)
                $(".winnerIs").html("You lost!")
              } else if ((playerChoice == "scissors") && (opponentChoice == "paper")){
                wins++
                $(".wins").html(wins)
                $(".winnerIs").html("You won!")
              }  else if (playerChoice == opponentChoice) {
                $(".winnerIs").html("Tie game..")
              }
        })*/


    database.ref("/users").on("value", function(snap) {
        database.ref("/users/" + postKey).onDisconnect().remove()
        console.log(snap.val())
            /*        console.log(Object.keys(snap.val())) */
        temp = snap.val()
        grabValues()



        /*
                    var winner = compare(playerPick, oppPick)
                    $("winnerIs").html(winner)*/
        /*        console.log("player choice is" + playerChoice)
                console.log(" winner is " + winner)

                if (winner === playerChoice) {
                    $(".winnerIs").html("You Win!")
                    wins++
                    $(".wins").html(wins)
                } else if (winner === "tie") {
                    $(".winnerIs").html("Tie...")
                } else {
                    $(".winnerIs").html("You lost!")
                    losses++
                    $(".losses").html(losses)

                }*/

    })
    function grabValues() {
        for (var propName in temp) {
            if (temp.hasOwnProperty(propName)) {
                var propValue = temp[propName];
                console.log(propValue)
                
            }
        }

    }







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
