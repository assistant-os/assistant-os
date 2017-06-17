import EventEmitter from 'events'

/**
 * manage rules and child middlwares
 */
class Middleware extends EventEmitter {

    constructor (opts = {}) {
        super()

        if (typeof opts === 'string') {
          opts = { id: opts }
        }

        const { parser = null, description = '', id = '', enabled = true } = opts

        this.rules = []
        this.parser = parser
        this.description = description
        this.enabled = enabled
        this.id = id
        this.parent = null
        this.config
    }

    /**
     * Add simple rule
     * @param  {[string|array]}   expression [user sentence to check according to a specific parser]
     * @param  {Function} callback   [what to do if the user says the expression ]
     */
    hear (expression, callback) {
        this.rules.push({
            expression: expression,
            callback: callback
        })
    }

    /**
     * Add child middleware
     * @param  {[Middleware]} middleware [child middleware to add]
     */
    use (middleware) {
        this.rules.push(middleware)
        middleware.parent = this
    }

    config () {
        if (this.parent) {
            return this.parent.config()
        } else {
            return {}
        }
    }

    speak (user, text) {
        if (this.parent) {
            this.parent.speak(user, text)
        } else {
            console.log('no parent')
        }
    }

    getNexus () {
        if (this.parent) {
            return this.parent.getNexus()
        } else {
            console.log('no parent')
        }
    }

    log (status, object) {
      if (this.parent) {
        this.parent.log(status, object)
      } else {
        this.emit('log', { status, object })
      }
    }


    parse (text, expression) {
        if (this.parser) {
            return this.parser(text, expression)
        } else if (this.parent) {
            return this.parent.parse(text, expression)
        } else {
            return false
        }
    }

    runRecursively (req, res,  index, callback) {
        if (index >= this.rules.length) {
            callback && callback()
            return
        }

        let next = () => {
            this.runRecursively(req, res, index + 1, callback)
        }

        let rule = this.rules[index]
        if (rule instanceof Middleware) {
            rule.run(req, res, next)
        } else {
            // console.log(req, rule)
            let parserResult = false
            if (typeof rule.expression === 'string') {
                if (rule.expression === '*') {
                    parserResult = true
                } else {
                    parserResult = this.parse(req.text, rule.expression)
                }
            } else if (rule.expression instanceof Array) {
                for (let expression of rule.expression) {
                    parserResult = this.parse(req.text, expression)
                    if (parserResult !== false) {
                        break
                    }
                }
            // } else if (typeof rule.expression === 'function') {
            //     parserResult = rule.expression(req)
            }

            if (parserResult !== false) {
                if ('object' === typeof parserResult) {
                    req.parsed = parserResult
                }
                if (rule.callback) {
                    rule.callback(req, res, next)
                } else {
                    next()
                }
            } else {
                next()
            }
        }
    }

    run (req, res, next) {
      if (this.enabled) {
        this.runRecursively(req, res, 0, next)
      } else {
        next && next(req, next)
      }
    }

}

module.exports = Middleware
