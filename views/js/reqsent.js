
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

    $(window).resize(()=>{
        head=$('#head').innerHeight();
        container=$('#container').height();
        $('#body').height(container-head);
    })

    function keypress(){
        var val = $('#input').val();
        if(val != ''){
            $.get("/autos/"+val,(data)=>{
                if(data != ''){
                    var e= data[0].email;
                    $('#item').html(e);
                }  
            });
        }
    }
    function dis(){
        $('#item').html('');
        $('.alert').fadeOut();
    }
    function remove(id){
        $.get("/remove/"+id);
        location.reload();
    }

    var form = document.getElementById('form');
    var input = document.getElementById('input');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (input.value) {
            $.post('/req',{
                email:input.value
            },(data)=>{
                // alert(data);
                if(data == 'true')
                    location.reload();
                else{
                    $('.alert>span').html(data);
                    $('.alert').css('display','block');
                }
            })
        }
        input.value = ''
    });
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