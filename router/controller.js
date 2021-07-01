const friends = require('../models/friends.schema')
const user = require('../models/user.schema')
const request = require('../models/requests.schema')
const message = require('../models/message.schema')
//#2f1110  #6b2e1d
exports.msg=(req,res)=>{
    message.find({$or: [{ $and: [{ from: req.session.email }, { to: req.params.email }] },
        { $and: [{ from: req.params.email }, { to: req.session.email }] }]},{_id:0,to:0,__v:0}).sort({_id:-1}).limit(30).exec((err,data)=>{
            if (err) throw err;
            data.reverse();
            res.send(data)
    })
}

exports.block=(req,res)=>{
    user.findOne({email:req.params.email}).exec((err,data)=>{
        friends.deleteOne({$or: [{ $and: [{ a: req.session.userId }, { b: data._id }] },
            { $and: [{ a: data._id }, { b: req.session.userId }] }]}).exec((err,friend)=>{
                if(err) throw err;
                message.deleteMany({$or: [{ $and: [{ from: req.session.email }, { to: req.params.email }] },
                    { $and: [{ from: req.params.email }, { to: req.session.email }] }]}).exec((err,data)=>{
                        if (err) throw err;
                        res.send('blocked')
                    })
            })
    })
}

exports.clearchat=(req,res)=>{
    message.deleteMany({$or: [{ $and: [{ from: req.session.email }, { to: req.params.email }] },
        { $and: [{ from: req.params.email }, { to: req.session.email }] }]}).exec((err,data)=>{
            if (err) throw err;
            res.send('chat deleted')
        })
}

exports.moremsg=(req,res)=>{
    message.find({$or: [{ $and: [{ from: req.session.email }, { to: req.params.email }] },
        { $and: [{ from: req.params.email }, { to: req.session.email }] }]},{_id:0,to:0,__v:0}).
        where('sentAt').lt(req.params.time).sort({_id:-1}).limit(30).exec((err,data)=>{
            if (err) throw err;
            res.send(data)
        })
}

exports.reqsent=(req,res)=>{
    request.find().populate('to').where('from').equals(req.session.userId).exec((err,data)=>{
        let result=[];
            for(x of data){
                result.push(x.to)
            }
        details=JSON.stringify(result)
        res.render('reqsent',{details:details})
    })
}

exports.remove=(req,res)=>{
    var id = req.params.id
    request.deleteOne({ $and: [{ from: req.session.userId }, { to: id }] }).exec((err,data)=>{
        if(err) throw err;
        res.send('removed')
    })
}

exports.approve=(req,res)=>{
    var id = req.params.id
    let newfriend = new friends({
        a:req.session.userId,
        b:id
    })
    request.deleteOne({ $and: [{ from: id}, { to: req.session.userId  }] }).exec((err,data)=>{
        if(err) throw err;
    })
    newfriend.save((err,b)=>{
        if(err) throw err;
    })
    res.send('approved')
}

exports.decline=(req,res)=>{
    var id = req.params.id
    request.deleteOne({ $and: [{ from: id}, { to: req.session.userId  }] }).exec((err,data)=>{
        if(err) throw err;
        res.send('declined');
    })
}

exports.friendreq=(req,res)=>{
    request.find().populate('from').where('to').equals(req.session.userId).exec((err,data)=>{
        let result=[];
            for(x of data){
                result.push(x.from)
            }
        details=JSON.stringify(result)
        res.render('friendreq',{details:details})
    })
}

exports.req=(req,res)=>{
    if(req.session.userId!=undefined){
        if(req.body.email != req.session.email){
            user.findOne({email:req.body.email}).exec((err,data)=>{               
                if(data){
                    friends.find({$or: [{ $and: [{ a: req.session.userId }, { b: data._id }] },
                        { $and: [{ a: data._id }, { b: req.session.userId }] }]}).exec((err,friend)=>{
                        if(friend.length==0){
                            request.find({$or: [{ $and: [{ from: req.session.userId }, { to: data._id }] },
                                { $and: [{ from: data._id }, { to: req.session.userId }] }]}).exec((err,t)=>{
                                if(err) throw err
                                if(t.length==0){
                                    let info = new request({
                                        from:req.session.userId,
                                        to:data._id
                                    })
                                    info.save((err,b)=>{
                                        if(err) throw err
                                    })
                                    res.send('true')
                                }else{
                                    res.send('ur req is pending or u have follow req form this email')
                                }
                            })
                        }else{
                            res.send('already friend')
                        }
                    })
    
                }else{
                    res.send('your friend dont have acc')
                }
            })
        }else{
            res.send('cant send req to ur self')
        }
    }else{
        res.send('Sorry, you should login first')
    }
}

exports.autos=(req,res)=>{
    n = req.params.name
    pattern = new RegExp(n,'i')
    
    user.aggregate().match({email:pattern}).limit(1).exec((err,data)=>{	
        res.send(data)
    })
}

exports.main=(req,res)=>{ 
    if(req.session.userId!=undefined){
        friends.find({},{a:0,_id:0,__v:0}).populate('b').where("a").equals(req.session.userId).exec((err,data1)=>{
            friends.find({},{b:0,_id:0,__v:0}).populate('a').where("b").equals(req.session.userId).exec((err,data2)=>{			
                let result=[];
                for(x of data1){
                    result.push(x.b)
                }
                for(x of data2){
                    result.push(x.a)
                }
                details=JSON.stringify(result)
                res.render('index',{details:details})
            })
        })  
    }else{
        res.render('index',{details:null})
    }
}

exports.signup=(req,res)=>{
    let User = {
        email:req.body.email,
        name:req.body.name,
        fname:req.body.fname,
        img:req.body.img
    }
    user.findOne({email:req.body.email}).exec((err,data)=>{               
        if(data){
            if(data.name != User.name || data.img != User.img){
                user.updateOne(User).where('email').equals(User.email).exec((err,d)=>{ 
                    if(err) throw err
                })
            }
            req.session.userId=data._id 
            req.session.email=data.email
            res.redirect('/')
        }else{
            let newUser = new user(User)
            newUser.save((err,b)=>{
                if(err) throw err
                else{
                    req.session.userId=b._id 
                    req.session.email=b.email     
                    res.redirect('/')
                }
            })
        }
    })
}

exports.logout=(req,res)=>{
    if(req.session){
        req.session.destroy((err)=>{
            if (err) {
                res.send('error')
            } else {
                res.send('Logged out')
            }
        })
    }
}