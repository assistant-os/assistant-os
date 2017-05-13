import EventEmitter from 'events'

class Middleware extends EventEmitter {

    constructor (opts) {
        super()
        this.rules = []
        this.parser = null
        this.description = ''
        if (opts) {
            if (opts.parser) {
                this.parser = opts.parser
            }

            if (opts.description) {
                this.description = opts.description
            }
        }
        this.parent = null
    }

    hear (expression, callback) {
        this.rules.push({
            expression: expression,
            callback: callback
        })
    }

    use (middleware) {
        this.rules.push(middleware)
        middleware.parent = this
    }

    config () {
        if (this.parent) {
            return this.parent.config()
        } else {
            console.log('no parent')
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
            // let next =
            // if (next === false) {
            //     return false
            // }
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
                // console.log('stop', req.text)
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

        this.runRecursively(req, res, 0, next)

        /*
        for (let i in this.rules) {
            let rule = this.rules[i]

            if (rule instanceof Middleware) {
                let next = rule.run(req, res)
                if (next === false) {
                    return false
                }
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
                } else if (typeof rule.expression === 'function') {
                    parserResult = rule.expression(req)
                }

                if (parserResult !== false) {
                    // console.log('stop', req.text)
                    if ('object' === typeof parserResult) {
                        req.parsed = parserResult
                    }
                    if (rule.callback) {
                        return rule.callback(req, res)
                    } else {
                        return false
                    }
                }
            }
        }
        return true*/
    }

}

module.exports = Middleware
