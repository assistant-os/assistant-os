import EventEmitter from 'events'

class Middleware extends EventEmitter {

    constructor (parser = null) {
        super()
        this.rules = []
        this.parser = parser
    }

    hear (expression, callback) {
        this.rules.push({
            expression: expression,
            callback: callback
        })
    }

    use (middleware) {
        this.rules.push(middleware)
        if (middleware.parser === null) {
            middleware.parser = this.parser
        }
    }

    run (req, res) {
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
                        parserResult = this.parser(req.text, rule.expression)
                    }
                } else if (rule.expression instanceof Array) {
                    for (let j in rule.expression) {
                        parserResult = this.parser(req.text, rule.expression[j])
                        if (parserResult !== false) {
                            break
                        }
                    }
                }

                if (parserResult !== false) {
                    // console.log('stop', req.text)
                    if ('object' === typeof parserResult) {
                        req.parsed = parserResult
                    }
                    rule.callback && rule.callback (req, res)
                    return false
                }
            }
        }
        return true
    }

}

module.exports = Middleware
