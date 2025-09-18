// All this code will be used when the website is fully functional.

// let bibleVerses = [];

/*fetch('verses.json')
    .then(response => response.json()) 
        .then(data => {
        bibleVerses = data;
        console.log(bibleVerses.length);
        console.log(bibleVerses[0].text); 
    })
    .catch(error => console.error('Error loading verses:', error));
*/

// Temp. array of obj. bible verses
let tempArray = [
    { book: "John", chapter: 3, verse: 13, text: "No one has ascended into heaven, but He who descended from heaven: the Son of Man."},
    { book: "John", chapter: 3, verse: 14, text: "As Moses lifted up the serpent in the wilderness, even so must the Son of Man be lifted up;"},
    { book: "John", chapter: 3, verse: 15, text: "so that whoever believes will in Him have eternal life."},
    { book: "John", chapter: 3, verse: 16, text: "For God so loved the world, that He gave His only begotten Son, that whoever believes in Him shall not perish, but have eternal life."},
    { book: "John", chapter: 3, verse: 17, text: "For God did not send the Son into the world to judge the world, but that the world might be saved through Him."},
    { book: "John", chapter: 3, verse: 18, text: "He who believes in Him is not judged; he who does not believe has been judged already, because he has not believed in the name of the only begotten Son of God."}
]

// Array length of array, scales as the array increases in size.
const verseLength = tempArray.length;

if ("Notification" in window) {
    if (Notification.permission === "granted") {
        // Permission already granted
        showNotification();
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                showNotification();
            }
        });
    }
}


function sendNewBibleVerse() {
    if (Notification.permission === "granted") {
        showNotification;
    } else {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                showNotification();
            }
        })
    }
}

setInterval(runEveryFiveMinutes,  30 * 1000); 

function showNotification() {
    new Notification(getRandVerse());
}

function getRandVerse() {
    let rand = Math.floor(Math.random() * verseLength);
    return tempArray[rand].text;
}







