import translate from 'google-translate-api'
import bodyParser from 'body-parser'

const translateApi =  (req, res) => {
  const bodyParserMiddleware = bodyParser.urlencoded({ extended: true });
  bodyParserMiddleware(req, res, async () => {
    const langs = JSON.parse(req.body.langs)
    const text = req.body.text
    const output = []
    for (const item of langs) {
      output.push(
        await new Promise((resolve) => {
          translate(text, {to: item}).then(result => {
            resolve({
              code: item,
              text: result.text
            })
          })
        })
      )
    }
    res.json({
      code: 200,
      data: output
    })
  })
}


export default {
  translateApi
}