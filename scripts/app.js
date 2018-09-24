const app = {};

// a variable that selected all the colored bars with the class of animation
const animatedClass = $('.animations');

// a counter to track active loop tracks and activate//deactivate animations when necessary
let counter = 0;

// a function that highlights the button when pressed
app.highlight = function(sound) {
    $(`.${sound}`).toggleClass("highlight");
};

// animates the soundbars, trigger by keydown events
app.triggerAllAnimations = function () {
    $(animatedClass).css({ opacity: '1' })
}

// removes the soundbar animations
app.removeAllAnimations = function () {
    $(animatedClass).css({ opacity: '0' })
}

// a function that checks to see if a sound clip is looping or not, and triggers the appropriate sounds/animations based on the conditions set
app.checkLoop = function(selectedAudio, instrumentDiv) {

    // a variable that stores the attributes of an element with the data-attribute data-hasLoop
    const hasLoop = $(selectedAudio).attr('data-hasLoop');
    const noLoop = $(selectedAudio).attr('data-noLoop');
    const endOfTrack = selectedAudio.duration

    // looping butons that are not yet playing
    if (hasLoop && selectedAudio.loop === false) {
        counter++;
        selectedAudio.loop = true;
        app.highlight(`${instrumentDiv}`);
        if ($(window).width() >= 830) {
            app.triggerAllAnimations();
        }
    }
    // looping buttons that are already playing
    else if (hasLoop && selectedAudio.loop === true) {
        counter--;
        selectedAudio.loop = false;
        selectedAudio.pause();
        selectedAudio.currentTime = endOfTrack;
        setTimeout(() => {
            app.highlight(`${instrumentDiv}`);
        }, 0)
        if ($(window).width() >= 830 && counter === 0) {
            app.removeAllAnimations();
        }
    }
    // non-looping buttons (that are not playing because they stop after playing once)
    else if (noLoop) {
        app.highlight(`${instrumentDiv}`);
        // setting a timeout on the highlight function
        setTimeout(function () {
            app.highlight(`${instrumentDiv}`);
        }, 150)
    }
    // if a non-looping key is pressed while a looping key is playing, this animation will trigger the box shadow
    if (noLoop && selectedAudio.loop === false) {
        $(animatedClass).addClass('highlightBars')
        setTimeout(() => {
            $(animatedClass).removeClass('highlightBars')
        }, 150)
    }
    
}

// a function that listens for each keypress, plays the associated sound, adds the CSS class of 'highlight', and triggers the sound bars animation
app.keydownListener = function () {

    $(document).on('keydown', function (e) {

        // a variable that gets the [audio] element associated with the corresponding data-key
        const selectedAudio = document.querySelector(`audio[data-key="${e.which}"]`);
        
        // a variable that gets the div of the corresponding [audio] element based on its data-instrument
        const instrumentDiv = $(selectedAudio).data('instrument');
        // console.log(instrument)

        // if button is clicked with no associated sound, do nothing.
        if (!selectedAudio) return;

        // rewinds each track as soon as it starts so it can be replayed immediately
        selectedAudio.pause();
        selectedAudio.currentTime = 0;

        // call the checkloop function, passing it the appropriate variables
        app.checkLoop(selectedAudio, instrumentDiv);
        return selectedAudio.play();
    })
};

// function that enables to trigger a sound by clicking on it
// done for smaller screen sizes
app.mobileClickListener = function() {

    // a variable that selects every div-block
    const phoneSelectedAudio = document.querySelectorAll('.button');
    
    $(phoneSelectedAudio).on('click', function () {
        
        // gets the name of the sound associated with each div
        const divSound = this.classList[3];

        // finds the audio clip associated with each div, based on the data-instrument of each div
        const selectedAudio = document.querySelector(`audio[data-instrument="${divSound}"]`);

        app.checkLoop(selectedAudio, divSound);
        selectedAudio.play();
    })
} 

app.init = function() {
    // if window size is greater than 830px, call keydown event listener function
    if ($(window).width() >= 830 ) {
        app.keydownListener();
    }
    // if window size is smaller than 830, call click event listener function
    else if ($(window).width() < 830 ) {
        app.mobileClickListener();
    }
}

// Document Ready
$(function () {
    app.init();
});
