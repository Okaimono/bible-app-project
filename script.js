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
];

const verseLength = tempArray.length;

// Request notification permission on page load
if ("Notification" in window) {
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
    }
}

// Function to show a notification
function showNotification() {
    new Notification(getRandVerse());
}

// Function to get a random verse
function getRandVerse() {
    const rand = Math.floor(Math.random() * verseLength);
    return tempArray[rand].text;
}

// Function to send a new verse
function sendNewBibleVerse() {
    if (Notification.permission === "granted") {
        showNotification(); // ✅ call the function
    } else {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                showNotification();
            }
        });
    }
}

// Run immediately
sendNewBibleVerse();

// Run every 5 minutes (for testing, can be shorter)
setInterval(sendNewBibleVerse, 5 * 60 * 1000); 

