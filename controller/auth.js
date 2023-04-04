require('dotenv').config()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const Users = require('../models/users');
const config = require('../db/config')
const errorHandler = require('../utils/errorHandler')
const nodemailer = require('nodemailer');

module.exports.login = async function (req, res){
        const candidate = await Users.findOne({email:req.body.email});
        if(candidate){
            res.status(409).json({
                message:'Пользователь с таким email уже существует'
            })
        } else{
            const salt = bcrypt.genSaltSync(10);
            const password = req.body.password;
            const user = new Users({
                email:req.body.email,
                password:bcrypt.hashSync(password, salt),
                name: req.body.name,
                books:[]
            })

            try{
                await user.save()
                res.status(200).json(user)
            }catch(e){
                errorHandler(res, e)
            }
        }


}

module.exports.auth = async function (req, res){
    try{
        const candidate = await Users.findOne({email: req.body.email});
        if(candidate){
            const passwordRes = bcrypt.compareSync(req.body.password, candidate.password)
            if(passwordRes){
                const token= jwt.sign({
                    userId: candidate._id
                }, config.keys, {expiresIn: 60*60*24*365});
                res.status(200).json({
                    token: `Bearer ${token}`
                })
            } else{
                res.status(401).json({
                    message: "Пароль не верный. Попробуйте снова"
                })
            }

        } else{
            res.status(404).json({
                message: "Пользователь с таким email не найден"
            })
        }
    }
    catch(e){
        errorHandler(res, e)
    }
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

module.exports.forget = async (req, res) => {
    try{
        const {email} = req.body;
        const candidate = await Users.findOne({email: req.body.email});
        if(candidate){
            const token= jwt.sign({
                userId: candidate._id
            }, config.keysReset, {expiresIn: '20m'});
            const msg = {
                from: '"RS Book" <rsbook@example.com>',
                to: `${email}`,
                subject: "Сброс пароля на RS Book",
                text: "Long time no see",
                html:`
                <h4>Пожалуйста, перейдите по ссылке для сброса пароля</h4>
                <a href = ${process.env.CLIENT_URL}#token=${token}>${process.env.CLIENT_URL}/#token=${token.slice(0,5)}...</a>
                `
            }

            const info = await transporter.sendMail(msg);
            await candidate.updateOne({resetLink: token});
            
            res.status(200).json({
                message: "Ссылка для сброса пароля отправлена на почту"
            })

        } else{
            res.status(404).json({
                message: "Пользователь с таким email не найден"
            })
        }
    }
    catch(e){
        errorHandler(res, e)
    }
}

module.exports.reset = async (req, res) => {
    try{
      const {resetLink,newPass} = req.body;
      jwt.verify(resetLink, config.keysReset, async function(err, decodedData){
        if(err){
            return res.status(401).json({
                message:"Некорректный токен. Воспользуйтесь формой восстановления пароля еще раз"
            })
        }
        const user = await Users.findOne({resetLink});
        if(!user) return res.status(404).json({
            message: "Пользователь не найден"
        })
        const salt = bcrypt.genSaltSync(10);
        const userUpdate = await user.updateOne({
            resetLink: '',
            password:bcrypt.hashSync(newPass, salt)
        })
        res.status(200).json({
            message: "Ваш пароль изменен"
        });
      })
    }
    catch(e){
        errorHandler(res, e)
    }
}