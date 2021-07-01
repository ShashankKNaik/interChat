var head=$('#head').innerHeight();
var container=$('#container').height();
$('#body').height(container-head);

var user,friend;
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
        $.post('/signup',{
            email: profile.getEmail(),
            name: profile.getName(),
            fname: profile.getGivenName(),
            img: profile.getImageUrl()
        });
        location.reload();
}
function onLogIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    this.user=profile.getEmail();
    document.cookie = "from=" + this.user + ";path=/"; 
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out.');
    });
    $.get("/logout",(data)=>{
        location.reload();
    });
}

function setCookie(x,y,z) {
    document.cookie = "img=" + x + ";path=/";
    document.cookie = "name=" + y + ";path=/";
    document.cookie = "to=" + z + ";path=/";   
}
$(window).resize(()=>{
    head=$('#head').innerHeight();
    container=$('#container').height();
    $('#body').height(container-head);
})

function dis(){
    $('.alert').fadeOut();
}
Online();
setInterval(Online,10000);
function Online(){
    if(window.navigator.onLine){
        $('.alert').css('display','none');
    }else{
        $('.alert>span').html('make sure your internet is on');
        $('.alert').css('display','block');
    }
}
