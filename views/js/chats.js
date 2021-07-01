var socket = io();

var user,friend,id,img,name,topdate;

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
var body = document.getElementById('body');

function size(){
        var head=$('#head').innerHeight();
        var container=$('#container').height();
        var fheight=$('#form').innerHeight();
        // var iheight=$('#emoji').innerHeight();
        $('#body').height(container-head-fheight);
}

$(document).ready(()=>{
    let ca = document.cookie.split(';');
    for(let i = 0,j=0; i < ca.length; i++) {
        let v=ca[i].split('=');
        if(v[0].match(/img/))
        this.img = v[1];
        else if(v[0].match(/name/)) 
        this.name = v[1]; 
        else if(v[0].match(/from/))
        this.user = v[1];
        else if(v[0].match(/to/))
        this.friend = v[1];   
    }

    $.get('/msg/'+this.friend,(data)=>{
        if(data!=''){
            topdate = data[0].sentAt;
            for(i=0;i<data.length;i++){
                var item = document.createElement('span');
                var fordate = document.createElement('p');
                var date = new Date(data[i].sentAt);
                var datetime = date.getDate() + "/"
                        + (date.getMonth()+1)  + "/" 
                        + date.getFullYear() + " @ "  
                        + date.getHours() + ":"  
                        + date.getMinutes();
                if(data[i].from==user){
                    item.style.backgroundColor='#022103';
                    item.style.float='right';
                    fordate.style.textAlign='right';
                }
                item.innerText = data[i].msg;
                fordate.innerText = datetime.toString();
                item.appendChild(fordate)
                messages.appendChild(item);
                body.scrollTo(0, body.scrollHeight);
            }
        }
    })

    if(this.friend <this.user)
        this.id=this.user+this.friend;
    else
        this.id=this.friend+this.user;

    $('#name').html(this.name);
    document.getElementById('img').src=this.img;

    this.size();

    socket.emit('join', {id:this.id});
});
// -------------

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
    socket.emit('chat message', {msg:input.value,from:user,to:friend});
    input.value = '';
    }
});

socket.on('chat message', function(msg) {
    var item = document.createElement('span');
    var fordate = document.createElement('p');
    var date = new Date();
    var datetime = date.getDate() + "/"
            + (date.getMonth()+1)  + "/" 
            + date.getFullYear() + " @ "  
            + date.getHours() + ":"  
            + date.getMinutes();

    if(msg.data.from==user){
        item.style.backgroundColor='#022103';
        item.style.float='right';
        
    }
    if(msg.count==2){
        $('#indi').html('(Online)');
    }else{
        $('#indi').html('(Offline)');
    }
    item.innerText = msg.data.msg;
    fordate.innerText = datetime.toString();
    item.appendChild(fordate)
    messages.appendChild(item);
    body.scrollTo(0, body.scrollHeight);
});

jQuery(document).ready(function($) {
    $(window).on('popstate', function() {
        leave();
    });
});
function leave(){
    socket.emit('leave', {id:this.id});
}
var dis='block'
$(window).resize(()=>{
    size();
    $('#emoji').css('display','none');
    this.dis='block';
})
function showimo(obj){
    var im = obj.innerHTML;
    var value = $('#input').val();
    $('#input').val(value+im);
}
function display(){       
    if(this.dis=='block'){
        $('#emoji').css('display','block');
        var th = $('#body').height();
        var iheight=$('#emoji').innerHeight();
        $('#body').height(th-iheight);
        this.dis='none';
        body.scrollTo(0, body.scrollHeight);    
    }else{
        size();
        $('#emoji').css('display','none');
        this.dis='block';
    }
}
$('#body').scroll(()=>{
    var scrollh = document.getElementById('body').scrollHeight;
    var bheight = $('#body').height();
    var top = $('#body').scrollTop();
    if(scrollh>bheight && top==0){
        $.get('/moremsg/'+friend+'/'+topdate,(data)=>{
            if(data!=''){
                topdate = data[data.length-1].sentAt;
                for(i=0;i<data.length;i++){
                    var item = document.createElement('span');
                    var fordate = document.createElement('p');
                    var date = new Date(data[i].sentAt);
                    var datetime = date.getDate() + "/"
                            + (date.getMonth()+1)  + "/" 
                            + date.getFullYear() + " @ "  
                            + date.getHours() + ":"  
                            + date.getMinutes();
                    if(data[i].from==user){
                        item.style.backgroundColor='#022103';
                        item.style.float='right';
                        fordate.style.textAlign='right';
                    }
                    item.innerText = data[i].msg;
                    fordate.innerText = datetime.toString();
                    item.appendChild(fordate);
                    messages.insertBefore(item,messages.firstChild);
                }
                var newh = document.getElementById('body').scrollHeight;
                $('#body').scrollTop(newh-scrollh);
            }
        })
    }
    if(scrollh-top-bheight>bheight)
        $('.scroll-down').fadeIn();
    else
        $('.scroll-down').fadeOut();

})


$('.scroll-down').click(()=>{
    body.scrollTo(0, body.scrollHeight);
})

function clearchat(){
    if(confirm('This will delete chats from both you and your friend')){
        $.get('/clearchat/'+friend,(data)=>{
            location.reload();
        })
    }
}
function block(){
    if(confirm('This will remove '+friend+' from your contact and delete all chats')){
        $.get('/block/'+friend,(data)=>{
            location.href='/';
        })
    }
}
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