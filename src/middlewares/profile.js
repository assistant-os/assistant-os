import Middleware from '../os/middleware'
import { User, Email } from '../models/user'

let profile = new Middleware('profile')

profile.hear('add email {{email:email}}', (req, res) => {
  Email.create({
    email: req.parsed.email
  }).then((email) => {
    if (email) {
      email.setUser(req.user)
      email.save().then(() => {
        Email.findOne({
          where: {
            id: email.id
          },
          include: [ User ]
        }).then((email) => {
          res.reply(`Ok`)
        }).catch(() => {
          res.reply('Sorry, impossible to add this email.')
        })
      })
    } else {
      res.reply('Sorry, impossible to add this email.')
    }
  }).catch(() => {
    res.reply('Sorry, impossible to add this email.')
  })
})

profile.hear([
  'remove email {{email:email}}',
  'delete email {{email:email}}'
], (req, res) => {
  Email.destroy({
      where: {
          email: req.parsed.email,
          userId: req.user.id
      },
      truncate: true
  }).then((affectedRows) => {
      if (affectedRows > 0) {
          res.reply(`Ok I have removed email ${req.parsed.email}.`)
      } else {
          res.reply(`Sorry I didn't find your email ${req.parsed.email}.`)
      }
  })
})

profile.hear('list emails', (req, res) => {
  Email.findAll({
    attributes: [ 'id', 'email' ],
    where: {
      userId: req.user.id
    }
  }).then((emails) => {
    if (emails.length === 0) {
      res.reply('I don\'t find any email')
    } else {
      let s = ''
      emails.forEach((email) => {
        s += email.email + '\n'
      })
      res.reply(`I found the following emails: \n ${s }`)
    }

  })
})

export default profile
